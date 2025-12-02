import ProductCard from "@/components/product/product-card";
import {
  getCollectionProducts,
  type ReshapedProduct,
} from "@/lib/shopify/index";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import settings from "../settings.json";
import type { CountryCode } from "@/gql/graphql";

export default async function FeaturedProducts(): Promise<React.JSX.Element | null> {
  const t = await getTranslations("Home.featured");
  const currency = ((await cookies()).get("currency")?.value ??
    settings.defaultCurrency) as CountryCode;

  const products: ReshapedProduct[] = await getCollectionProducts({
    collection: "featured-products",
    currency,
  });

  if (!products?.length) return null;

  return (
    <Container as="section" className="!mt-[140px] max-md:!mt-[80px]">
      <h2 className="h1 text-center mb-5">{t("title")}</h2>
      <p className="text-center mb-12">{t("description")}</p>
      <div className="grid grid-cols-3 gap-5 max-md:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </Container>
  );
}
