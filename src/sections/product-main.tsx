"use client";

import { useTranslations } from "next-intl";
import ProductGallery from "@/components/product/product-gallery";
import ProductDetails from "@/components/product/product-details";
import ProductGallerySkeleton from "@/components/product/product-gallery-skeleton";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductContext } from "@/context/product-context";

export default function ProductMain(): React.JSX.Element {
  const t = useTranslations("Product");
  const translate = (key: string) => t(key as Parameters<typeof t>[0]);
  const { product, selectedImageIndex } = useProductContext();

  if (!product) {
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

  if (!product?.images?.length) {
    return (
      <Container as="section" className="!pt-5">
        <p>{translate("imagesNotAvailable")}</p>
      </Container>
    );
  }

  return (
    <Container as="section" className="!pt-5">
      <div className="flex gap-10 max-md:flex-col">
        <div className="w-1/2 max-md:w-full">
          <ProductGallery
            images={product.images}
            selectedVariantIndex={selectedImageIndex}
          />
        </div>
        <div className="w-1/2 max-md:w-full">
          <ProductDetails />
        </div>
      </div>
    </Container>
  );
}
