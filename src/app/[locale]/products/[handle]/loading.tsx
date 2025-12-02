import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import ProductGallerySkeleton from "@/components/product/product-gallery-skeleton";

export default function Loading() {
  return (
    <Container as="section" className="!pt-5">
      <div className="flex gap-10 max-md:flex-col">
        <div className="w-1/2 max-md:w-full">
          <ProductGallerySkeleton />
        </div>
        <div className="w-1/2 max-md:w-full">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-20 w-full mb-6" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </Container>
  );
}
