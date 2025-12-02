import ProductCardSkeleton from "@/components/product/product-card-skeleton";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecommendedProductsSkeleton() {
  return (
    <Container as="section" className="!my-36 flex flex-col">
      <Skeleton className="h-10 w-64 mx-auto mb-12" />
      <div className="grid grid-cols-3 gap-5 max-md:grid-cols-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </Container>
  );
}
