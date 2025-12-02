"use client";

import { GallerySlider } from "@/components/ui/gallery-slider";
import { useTranslations } from "next-intl";
import { ArrowIcon } from "@/components/icons/arrow-icon";
import type { ReshapedImage } from "@/lib/shopify/index";
import type { GalleryImage } from "@/components/ui/gallery-slider";

interface ProductGalleryProps {
  images: ReadonlyArray<ReshapedImage>;
  selectedVariantIndex?: number;
}

export default function ProductGallery({
  images,
  selectedVariantIndex,
}: ProductGalleryProps) {
  const t = useTranslations("Product");

  const galleryImages: GalleryImage[] = images.map((img) => ({
    id: img.url,
    url: img.url,
    alt: img.altText,
  }));

  return (
    <GallerySlider
      images={galleryImages}
      selectedIndex={selectedVariantIndex}
      prevIcon={<ArrowIcon className="rotate-180" />}
      nextIcon={<ArrowIcon />}
      labels={{
        prevSlide: t("ariaLabels.prev"),
        nextSlide: t("ariaLabels.next"),
        viewImage: (i) => t("ariaLabels.viewImage", { number: i + 1 }),
      }}
    />
  );
}
