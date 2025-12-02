import { shopifyFetch } from "../shopify";
import { TAGS, HIDDEN_PRODUCT_TAG } from "./constants";
import { ensureStartsWith } from "../utils";
import {
  getProductQuery,
  getProductRecommendationsQuery,
  getAllProductsQuery,
  getCollectionProductsQuery,
} from "./queries/product";
import { getCartQuery } from "./queries/cart";
import {
  addToCartMutation,
  removeFromCartMutation,
  editCartItemsMutation,
  createCartMutation,
} from "./mutation/cart";
import { getMenuQuery } from "./queries/menu";
import { getCollectionsQuery } from "./queries/collection";
import { getPageQuery, getPagesQuery } from "./queries/page";
import type {
  CartFragment,
  ProductFragment,
  ImageFragment,
  PageFragment,
  GetCartQuery,
  GetMenuQuery,
  GetPageQuery,
  GetPagesQuery,
  GetCollectionsQuery,
  AddToCartMutation,
  RemoveFromCartMutation,
  EditCartItemsMutation,
  CreateCartMutation,
  CartLineInput,
  CartLineUpdateInput,
  ProductSortKeys,
  ProductCollectionSortKeys,
  CountryCode,
  CurrencyCode,
} from "@/gql/graphql";

// -----------------------------------------------------------------------------
// 1. CONFIG & ENV
// -----------------------------------------------------------------------------

const domain = process.env.SHOPIFY_STORE_URL
  ? ensureStartsWith(process.env.SHOPIFY_STORE_URL, "https://")
  : "";

const endpoint = `${domain}/api/2025-07/graphql.json`;

export const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? ensureStartsWith(process.env.NEXT_PUBLIC_SITE_URL, "https://")
  : process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

// -----------------------------------------------------------------------------
// 2. HELPERS
// -----------------------------------------------------------------------------

type EdgeNodeArray<T> = {
  edges: Array<{ node: T | null }>;
};

const removeEdgesAndNodes = <T>(
  array: EdgeNodeArray<T> | undefined | null
): Array<T> => {
  if (!array?.edges) return [];
  return array.edges
    .map((edge) => edge?.node)
    .filter((node): node is T => node !== null && node !== undefined);
};

// -----------------------------------------------------------------------------
// 3. TRANSFORMERS (Reshapers)
// -----------------------------------------------------------------------------

export type ReshapedImage = {
  url: string;
  altText: string;
  width?: number | null;
  height?: number | null;
};

const reshapeImages = (
  images: EdgeNodeArray<{
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  }>,
  productTitle: string
): Array<ReshapedImage> => {
  return removeEdgesAndNodes(images).map((image) => {
    let filename = "";
    try {
      const urlObj = new URL(image.url);
      filename = urlObj.pathname.split("/").pop()?.split(".")[0] ?? "";
    } catch {
      filename = "";
    }
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`,
    };
  });
};

export type ReshapedProduct = Omit<ProductFragment, "images" | "variants"> & {
  images: Array<ReshapedImage>;
  variants: Array<
    NonNullable<ProductFragment["variants"]["edges"][number]["node"]>
  >;
};

export const reshapeProduct = (
  product: ProductFragment | null | undefined,
  filterHiddenProducts: boolean = true
): ReshapedProduct | undefined => {
  if (
    !product ||
    (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
  ) {
    return undefined;
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(
      images as EdgeNodeArray<ImageFragment>,
      product.title
    ),
    variants: removeEdgesAndNodes(variants),
  };
};

const reshapeProducts = (
  products: Array<ProductFragment | null | undefined>
) => {
  return products
    .map((p) => reshapeProduct(p))
    .filter((p): p is ReshapedProduct => p !== undefined);
};

export type ReshapedCart = Omit<CartFragment, "lines" | "cost"> & {
  cost: {
    subtotalAmount: { amount: string; currencyCode: CurrencyCode };
    totalAmount: { amount: string; currencyCode: CurrencyCode };
    totalTaxAmount: { amount: string; currencyCode: CurrencyCode };
  };
  lines: Array<{
    id: string;
    quantity: number;
    cost: { totalAmount: { amount: string; currencyCode: CurrencyCode } };
    merchandise: {
      quantityAvailable?: number | null;
      id: string;
      title: string;
      selectedOptions: Array<{ name: string; value: string }>;
      product: ReshapedProduct;
    };
  }>;
};

const reshapeCart = (cart: CartFragment): ReshapedCart => {
  const lines = removeEdgesAndNodes(cart.lines);

  return {
    ...cart,
    cost: {
      ...cart.cost,
      totalTaxAmount: cart.cost.totalTaxAmount ?? {
        amount: "0.0",
        currencyCode: cart.cost.totalAmount.currencyCode,
      },
    },
    lines: lines.map((line) => ({
      ...line,
      cost: {
        ...line.cost,
        totalAmount: {
          ...line.cost.totalAmount,
          currencyCode: line.cost.totalAmount.currencyCode,
        },
      },
      merchandise: {
        ...line.merchandise,
        product: reshapeProduct(line.merchandise.product as ProductFragment)!,
      },
    })),
  };
};

// -----------------------------------------------------------------------------
// 4. API FUNCTIONS
// -----------------------------------------------------------------------------

// --- MENUS ---
export interface MenuItem {
  title: string;
  url: string;
  items: MenuItem[];
}

export type Menu = {
  title: string;
  items: MenuItem[];
};

interface GraphQLMenuItem {
  title: string;
  url?: string | null;
  items?: GraphQLMenuItem[];
}

export async function getMenu(handle: string): Promise<Menu> {
  const res = await shopifyFetch<GetMenuQuery>({
    query: getMenuQuery,
    variables: { handle },
  });

  const recursiveMap = (items: GraphQLMenuItem[]): MenuItem[] =>
    items.map((item) => ({
      title: item.title,
      url: item.url ? item.url.replace(domain, "").replace("/pages", "") : "",
      items: item.items ? recursiveMap(item.items) : [],
    }));

  return {
    title: res.body?.data?.menu?.title ?? "",
    items: res.body?.data?.menu?.items
      ? recursiveMap(res.body.data.menu.items as GraphQLMenuItem[])
      : [],
  };
}

export async function getMenus(menus: Array<string>): Promise<Array<Menu>> {
  return Promise.all(menus.map((handle) => getMenu(handle)));
}

// --- PRODUCTS ---

export async function getProduct(
  handle: string,
  currency: CountryCode
): Promise<ReshapedProduct | undefined> {
  const res = await shopifyFetch<{ product: ProductFragment | null }>({
    query: getProductQuery,
    tags: [TAGS.products],
    variables: { handle, country: currency },
  });
  return reshapeProduct(res.body.data?.product, false);
}

export async function getProducts(
  handles: Array<string>,
  currency: CountryCode
): Promise<Array<ReshapedProduct | undefined>> {
  return Promise.all(handles.map((handle) => getProduct(handle, currency)));
}

export async function getProductRecommendations(
  productId: string,
  currency: CountryCode
): Promise<Array<ReshapedProduct>> {
  const res = await shopifyFetch<{
    productRecommendations: Array<ProductFragment | null> | null;
  }>({
    query: getProductRecommendationsQuery,
    tags: [TAGS.products],
    variables: { productId, country: currency },
  });

  const recommendations = res.body.data?.productRecommendations;
  return recommendations ? reshapeProducts(recommendations) : [];
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
  currency,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: ProductSortKeys | ProductCollectionSortKeys;
  currency: CountryCode;
}): Promise<Array<ReshapedProduct>> {
  const normalizedSortKey = sortKey === "CREATED_AT" ? "CREATED" : sortKey;

  if (collection === "all") {
    const res = await shopifyFetch<{
      products: EdgeNodeArray<ProductFragment>;
    }>({
      query: getAllProductsQuery,
      variables: {
        reverse,
        sortKey: normalizedSortKey as ProductSortKeys,
        country: currency,
      },
    });
    return reshapeProducts(removeEdgesAndNodes(res.body.data?.products));
  } else {
    const res = await shopifyFetch<{
      collection: { products: EdgeNodeArray<ProductFragment> } | null;
    }>({
      query: getCollectionProductsQuery,
      variables: {
        handle: collection,
        reverse,
        sortKey: normalizedSortKey as ProductCollectionSortKeys,
        country: currency,
      },
    });
    return reshapeProducts(
      removeEdgesAndNodes(res.body.data?.collection?.products)
    );
  }
}

// --- CART ---

export async function getCart(
  cartId: string | null | undefined,
  currency: CountryCode
): Promise<ReshapedCart | undefined> {
  if (!cartId) return undefined;

  const res = await shopifyFetch<GetCartQuery>({
    query: getCartQuery,
    variables: { cartId, country: currency },
    cache: "no-store",
    tags: [TAGS.cart],
  });

  return res.body.data?.cart
    ? reshapeCart(res.body.data.cart as CartFragment)
    : undefined;
}

export async function addToCart(
  cartId: string,
  lines: Array<CartLineInput>
): Promise<ReshapedCart> {
  const res = await shopifyFetch<AddToCartMutation>({
    query: addToCartMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });
  if (!res.body.data?.cartLinesAdd?.cart)
    throw new Error("Failed to add items");
  return reshapeCart(res.body.data.cartLinesAdd.cart as CartFragment);
}

export async function removeFromCart(
  cartId: string,
  lineIds: Array<string>
): Promise<ReshapedCart> {
  const res = await shopifyFetch<RemoveFromCartMutation>({
    query: removeFromCartMutation,
    variables: { cartId, lineIds },
    cache: "no-store",
  });
  if (!res.body.data?.cartLinesRemove?.cart)
    throw new Error("Failed to remove items");
  return reshapeCart(res.body.data.cartLinesRemove.cart as CartFragment);
}

export async function updateCart(
  cartId: string,
  lines: Array<CartLineUpdateInput>
): Promise<ReshapedCart> {
  const res = await shopifyFetch<EditCartItemsMutation>({
    query: editCartItemsMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });
  if (!res.body.data?.cartLinesUpdate?.cart)
    throw new Error("Failed to update cart");
  return reshapeCart(res.body.data.cartLinesUpdate.cart as CartFragment);
}

export async function createCart(
  lineItems?: Array<CartLineInput>
): Promise<ReshapedCart> {
  const res = await shopifyFetch<CreateCartMutation>({
    query: createCartMutation,
    variables: lineItems ? { lineItems } : undefined,
    cache: "no-store",
  });
  if (!res.body.data?.cartCreate?.cart)
    throw new Error("Failed to create cart");
  return reshapeCart(res.body.data.cartCreate.cart as CartFragment);
}

// --- COLLECTIONS & PAGES ---

export async function getCollections(): Promise<
  Array<{
    handle: string;
    title: string;
    description: string;
    seo: { title: string; description: string };
    path: string;
    updatedAt: string;
    image?: { url: string; altText: string | null } | null;
  }>
> {
  const res = await shopifyFetch<GetCollectionsQuery>({
    query: getCollectionsQuery,
  });
  const collections = removeEdgesAndNodes(res.body?.data?.collections);

  return [
    {
      handle: "",
      title: "All",
      description: "All products",
      seo: { title: "All", description: "All products" },
      path: "/collections/all",
      updatedAt: new Date().toISOString(),
    },
    ...collections
      .filter((c) => !c.handle.startsWith("hidden"))
      .map((c) => ({
        handle: c.handle,
        title: c.title,
        description: c.description,
        seo: { title: c.title, description: c.description },
        updatedAt: new Date().toISOString(),
        path: `/collections/${c.handle}`,
        image: c.image
          ? {
              url: String(c.image.url),
              altText: c.image.altText ?? null,
            }
          : null,
      })),
  ];
}

export async function getPage(handle: string): Promise<PageFragment | null> {
  const res = await shopifyFetch<GetPageQuery>({
    query: getPageQuery,
    variables: { handle },
  });
  return (
    (res.body.data?.pageByHandle as unknown as PageFragment | null) ?? null
  );
}

export async function getPages(): Promise<Array<PageFragment>> {
  const res = await shopifyFetch<GetPagesQuery>({ query: getPagesQuery });
  return removeEdgesAndNodes(
    res.body.data?.pages
  ) as unknown as Array<PageFragment>;
}
