"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import { ArrowIcon } from "@/components/icons/arrow-icon";

export interface GalleryImage {
  id: string | number;
  url: string;
  alt?: string;
}

interface GallerySliderProps {
  images: GalleryImage[];
  selectedIndex?: number;
  gap?: number;
  aspectRatio?: string;
  showThumbnails?: boolean;
  prevIcon?: ReactNode;
  nextIcon?: ReactNode;
  labels?: {
    prevSlide?: string;
    nextSlide?: string;
    viewImage?: (index: number) => string;
  };
}

export function GallerySlider({
  images,
  selectedIndex = 0,
  gap = 10,
  aspectRatio = "aspect-square",
  showThumbnails = true,
  prevIcon,
  nextIcon,
  labels = {
    prevSlide: "Previous slide",
    nextSlide: "Next slide",
    viewImage: (i) => `View image ${i + 1}`,
  },
}: GallerySliderProps) {
  const [activeIndex, setActiveIndex] = useState<number>(selectedIndex);

  // Motor Fantasma (Solo lógica)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    duration: 20,
  });

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setActiveIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (emblaApi && selectedIndex !== undefined) {
      emblaApi.scrollTo(selectedIndex);
    }
  }, [selectedIndex, emblaApi]);

  const scrollTo = (index: number) => emblaApi && emblaApi.scrollTo(index);

  return (
    <>
      <div
        className="flex flex-col-reverse md:flex-row sticky top-[80px]"
        style={{ gap: `${gap}px` }}
      >
        {/* Thumbnails */}
        {showThumbnails && (
          <div className="overflow-x-auto md:overflow-visible scrollbar-hide">
            <div
              className="flex flex-row md:flex-col h-12 w-fit md:w-12 flex-shrink-0"
              style={{ gap: `${gap}px` }}
            >
              {images.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  className={`relative overflow-hidden rounded-[5px] border-[.5px] transition-colors duration-200 sm:shrink-0 ${aspectRatio} ${
                    activeIndex === index ? "border-black" : "border-border"
                  }`}
                  onClick={() => scrollTo(index)}
                  aria-label={labels.viewImage?.(index)}
                >
                  <img
                    src={image.url}
                    alt={image.alt || ""}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Slider */}
        <div
          className={`relative w-full rounded-lg overflow-hidden group touch-pan-y ${aspectRatio}`}
        >
          {/* Capa Visual (CSS Nativo) */}
          <div className="absolute inset-0 z-10 pointer-events-none h-full w-full overflow-hidden">
            <div
              className="flex h-full"
              style={{
                gap: `${gap}px`,
                transform: `translateX(calc(-${activeIndex} * (100% + ${gap}px)))`,
                transition: "transform 0.5s ease",
              }}
            >
              {images.map((image) => (
                <div
                  key={image.id}
                  className={`shrink-0 w-full rounded-[5px] overflow-hidden ${aspectRatio}`}
                >
                  <img
                    src={image.url}
                    alt={image.alt || ""}
                    className="w-full h-full object-cover select-none"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>

          <div ref={emblaRef} className="absolute inset-0 z-20 h-full w-full">
            <div className="flex h-full w-full">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="flex-[0_0_100%] h-full w-full min-w-0"
                />
              ))}
            </div>
          </div>

          <button
            className="swiper-arrow swipe-left left-0 hidden md:flex group-hover:opacity-100 group-hover:left-4 disabled:opacity-0 disabled:pointer-events-none z-30"
            onClick={() => scrollTo(activeIndex - 1)}
            disabled={activeIndex === 0}
          >
            <ArrowIcon className="w-6 h-6" />
          </button>
          <button
            className="swiper-arrow swipe-right right-0 hidden md:flex group-hover:opacity-100 group-hover:right-4 disabled:opacity-0 disabled:pointer-events-none z-30"
            onClick={() => scrollTo(activeIndex + 1)}
            disabled={activeIndex === images.length - 1}
          >
            <ArrowIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </>
  );
}
