import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getProduct } from "@/lib/shopify/index";
import ProductMain from "@/sections/product-main";
import { ProductProvider } from "@/context/product-context";
import RecommendedProducts from "@/sections/product-recommended";
import RecommendedProductsSkeleton from "@/sections/product-recommended-skeleton";
import { cookies } from "next/headers";
import settings from "../../../../settings.json";
import type { PageProps } from "@/types/page";
import { CountryCode, SeoFragment } from "@/gql/graphql";

interface ProductPageParams extends Record<string, string> {
  readonly handle: string;
}

interface ProductPageSearchParams {
  readonly [key: string]: string | string[] | undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ProductPageParams>;
}): Promise<Metadata> {
  const t = await getTranslations(
    "Product" as unknown as Parameters<typeof getTranslations>[0]
  );

  const { handle } = await params;
  const currency =
    (await cookies()).get("currency")?.value || settings.defaultCurrency;
  const product = await getProduct(handle, currency as CountryCode);

  if (!product) {
    return {
      title: t("metadata.notFound"),
    };
  }

  const productImage = product.images?.[0]?.url;
  const description =
    product.description ||
    `${product.title} - ${t("metadata.availableNow")}`;
  const seo = product.seo as SeoFragment | null | undefined;
  const seoTitle = seo?.title || product.title;
  const seoDescription = seo?.description || description;

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      type: "website",
      title: seoTitle,
      description: seoDescription,
      images: productImage
        ? [
          {
            url: productImage,
            alt: product.images[0]?.altText || product.title,
            width: product.images[0]?.width || 1200,
            height: product.images[0]?.height || 630,
          },
        ]
        : [],
      siteName: t("metadata.siteName"),
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: productImage ? [productImage] : [],
    },
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: PageProps<ProductPageParams, ProductPageSearchParams>) {
  const { handle } = await params;

  if (!handle || typeof handle !== "string") {
    notFound();
  }

  const currency =
    (await cookies()).get("currency")?.value || settings.defaultCurrency;
  const product = await getProduct(handle, currency as CountryCode);
  const searchparamsResolved = await searchParams;
  const initialOptions: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(searchparamsResolved)) {
    initialOptions[key] = Array.isArray(value) ? value[0] : value;
  }

  if (!product) {
    notFound();
  }
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images[0]?.url,
    offers: {
      "@type": "Offer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      price: product.priceRange.minVariantPrice.amount,
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
    },
  };

  return (
    <ProductProvider product={product} initialOptions={initialOptions}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      <ProductMain />
      <Suspense fallback={<RecommendedProductsSkeleton />}>
        <RecommendedProducts
          id={product.id}
          currency={currency as CountryCode}
        />
      </Suspense>
    </ProductProvider>
  );
}
