import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { sorting, defaultSort } from "@/lib/shopify/constants";
import { getCollectionProducts, getCollections } from "@/lib/shopify/index";
import ProductCard from "@/components/product/product-card";
import SortSelect from "@/components/sort-select";
import SelectDropdown from "@/components/select-dropdown";
import { Container } from "@/components/ui/container";
import type { PageProps } from "@/types/page";
import settings from "../../../../settings.json";
import {
  CountryCode,
  ProductSortKeys,
  ProductCollectionSortKeys,
} from "@/gql/graphql";

interface CollectionPageParams extends Record<string, string> {
  readonly collection: string;
}

interface CollectionPageSearchParams
  extends Record<string, string | string[] | undefined> {
  readonly sort?: string | string[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<CollectionPageParams>;
}): Promise<Metadata> {
  const t = await getTranslations("Collections");
  const { collection } = await params;
  const collections = await getCollections();
  const currentCollection = collections.find((c) => c.handle === collection);

  if (!currentCollection) {
    return {
      title: t("metadata.notFound"),
    };
  }

  const title = currentCollection.seo?.title || currentCollection.title;
  const description =
    currentCollection.seo?.description || currentCollection.description;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      siteName: t("metadata.siteName"),
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: PageProps<CollectionPageParams, CollectionPageSearchParams>) {
  const t = await getTranslations("Collections");
  const { collection } = await params;

  if (!collection || typeof collection !== "string") {
    return null;
  }

  const searchParamsResolved = await searchParams;
  const sort = searchParamsResolved.sort;
  const sortValue = Array.isArray(sort) ? sort[0] : sort;
  const currentSortParam = sort ? `?sort=${sortValue}` : "?";

  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sortValue) || defaultSort;

  const currency =
    (await cookies()).get("currency")?.value || settings.defaultCurrency;
  const products = await getCollectionProducts({
    collection,
    sortKey: sortKey as ProductSortKeys | ProductCollectionSortKeys | undefined,
    reverse,
    currency: currency as CountryCode,
  });

  const collections = await getCollections();

  const currentCollection = collections.find((c) => c.handle === collection);

  const sortbyLinks = [
    {
      title: t("sort.relevance"),
      param: "?",
    },
    {
      title: t("sort.trending"),
      param: "?sort=trending-desc",
    },
    {
      title: t("sort.latestArrivals"),
      param: "?sort=latest-desc",
    },
    {
      title: t("sort.priceLowToHigh"),
      param: "?sort=price-asc",
    },
    {
      title: t("sort.priceHighToLow"),
      param: "?sort=price-desc",
    },
  ];

  return (
    <Container className="!pt-28">
      <h1 className="text-center capitalize">
        {currentCollection?.title || collection}
      </h1>
      <p className="text-center mt-6 max-w-2xl mx-auto">
        {currentCollection?.description}
      </p>
      <div className="flex justify-end mb-5 mt-20">
        <SortSelect
          triggerText={t("sortBy")}
          options={sortbyLinks}
          defaultValue={currentSortParam}
        />
      </div>
      <div className="flex gap-10 max-md:flex-col">
        {/* <div className="flex flex-col min-w-[270px]">
          <Accordion
            title="Collections"
            open={true}
            content={
              <div>
                {collections.map((collection) => (
                  <Link
                    className="block pb-3"
                    key={collection.handle}
                    href={collection.path}
                  >
                    {collection.title}
                  </Link>
                ))}
              </div>
            }
          />
        </div> */}
        <div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
