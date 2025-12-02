import ProductCardSkeleton from "@/components/product/product-card-skeleton";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container className="!pt-28">
      <Skeleton className="h-10 w-48 mx-auto" />
      <Skeleton className="h-6 w-96 mx-auto mt-6" />
      <div className="flex justify-end mb-5 mt-20">
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="flex gap-10 max-md:flex-col">
        <div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
