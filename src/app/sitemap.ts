import type { MetadataRoute } from "next";
import { baseUrl } from "@/lib/shopify/index";
import {
  getCollections,
  getPages,
  getCollectionProducts,
} from "@/lib/shopify/index";
import { CountryCode } from "@/gql/graphql";
import settings from "@/settings.json";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_URL || baseUrl;
  const defaultCurrency = settings.defaultCurrency as CountryCode;

  // Static routes (homepage and other fixed pages)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
    },
  ];

  // Fetch all dynamic data in parallel
  const [collections, products, pages] = await Promise.all([
    getCollections(),
    getCollectionProducts({
      collection: "all",
      currency: defaultCurrency,
    }),
    getPages(),
  ]);

  // Map collections to sitemap entries
  const collectionRoutes: MetadataRoute.Sitemap = collections.map(
    (collection) => ({
      url: `${base}${collection.path}`,
      lastModified:
        "updatedAt" in collection && collection.updatedAt
          ? new Date(collection.updatedAt)
          : new Date(),
    })
  );

  // Map products to sitemap entries
  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${base}/products/${product.handle}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
  }));

  // Map pages to sitemap entries
  const pageRoutes: MetadataRoute.Sitemap = pages
    .filter((page) => "handle" in page && page.handle)
    .map((page) => {
      const pageWithHandle = page as typeof page & {
        handle: string;
        updatedAt?: string;
      };
      return {
        url: `${base}/${pageWithHandle.handle}`,
        lastModified: pageWithHandle.updatedAt
          ? new Date(pageWithHandle.updatedAt)
          : new Date(),
      };
    });

  // Return flattened array of all routes
  return [
    ...staticRoutes,
    ...collectionRoutes,
    ...productRoutes,
    ...pageRoutes,
  ];
}
