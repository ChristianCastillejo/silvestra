import { getTranslations } from "next-intl/server";
import {
  getProductRecommendations,
  type ReshapedProduct,
} from "@/lib/shopify/index";
import ProductCard from "@/components/product/product-card";
import { Container } from "@/components/ui/container";
import type { CountryCode } from "@/gql/graphql";

interface Props {
  readonly id: string;
  readonly currency: CountryCode;
}

export default async function RecommendedProducts({
  id,
  currency,
}: Props): Promise<React.JSX.Element | null> {
  const t = await getTranslations("Product");

  const relatedProducts: ReshapedProduct[] = await getProductRecommendations(
    id,
    currency
  );

  if (!relatedProducts?.length) return null;

  return (
    <Container as="section" className="!my-36 flex flex-col">
      <h2 className="text-3xl text-center mb-12">
        {t("relatedProducts")}
      </h2>
      <div className="grid grid-cols-3 gap-5 max-md:grid-cols-2">
        {relatedProducts.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </Container>
  );
}
