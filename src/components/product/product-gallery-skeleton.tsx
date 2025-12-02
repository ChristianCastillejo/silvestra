import { Skeleton } from "../ui/skeleton";

export default function ProductGallerySkeleton() {
  return (
    <div className="product-gallery flex flex-col-reverse md:flex-row gap-[10px] sticky top-[80px]">
      <div className="thumbnail-slide overflow-x-auto md:overflow-visible">
        <div className="flex flex-row md:flex-col h-12 gap-[10px] w-fit md:w-12 flex-shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              className="aspect-square rounded-[5px] w-12 h-12 shrink-0"
            />
          ))}
        </div>
      </div>
      <div className="product-slider rounded-lg overflow-hidden w-full aspect-square relative">
        <Skeleton className="w-full h-full rounded-lg" />
      </div>
    </div>
  );
}
