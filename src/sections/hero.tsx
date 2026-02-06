"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/utils/cn";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { EmblaCarouselType } from "embla-carousel";

export default function Hero(): React.JSX.Element {
  const t = useTranslations("Home.hero");

  const slides = [
    {
      image: "/images/hero-1.jpg",
      title: t("slide1.title"),
      description: t("slide1.description"),
      link: {
        href: "/collections/jardines-eternos",
        text: t("slide1.linkText"),
      },
    },
  ] as const;

  const [activeIndex, setActiveIndex] = useState<number>(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

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

  const scrollTo = (index: number) => emblaApi && emblaApi.scrollTo(index);

  return (
    <Container
      as="section"
      size="full"
      className="h-[calc(100vh-100px)] max-md:h-[70vh] relative overflow-hidden"
    >
      <div className="relative w-full h-full bg-neutral-black/40 rounded-2xl">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute h-full w-full transition-opacity duration-1000 pointer-events-none ${index === activeIndex ? "opacity-100 z-30" : "opacity-0 z-0"
              }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              width={1920}
              height={1080}
              priority={index === 0}
              className="w-full h-full object-cover rounded-2xl pointer-events-none"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/20 to-transparent rounded-2xl pointer-events-none" />


            <div className="absolute bottom-20 left-5 right-5 md:bottom-[20%] md:left-[10%] md:right-auto flex flex-col gap-3 text-white max-w-[600px] pointer-events-none">
              <h1 className="text-3xl md:text-5xl font-medium leading-tight md:leading-normal">
                {slide.title}
              </h1>

              <p className="text-white text-sm md:text-lg font-medium opacity-90">
                {slide.description}
              </p>

              <Button
                asChild
                variant="primary"
                className={cn("!w-fit !px-10 pointer-events-auto")}
              >
                <Link href={slide.link.href}>{slide.link.text}</Link>
              </Button>
            </div>
          </div>
        ))}

        <div ref={emblaRef} className="absolute inset-0 z-20 h-full w-full">
          <div className="flex h-full w-full">
            {slides.map((_, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] h-full w-full min-w-0"
              />
            ))}
          </div>
        </div>

        {slides.length > 1 && (
          <div className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2 flex  z-40">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                className="group flex items-center justify-center w-8 h-8 cursor-pointer pointer-events-auto"
                onClick={() => scrollTo(index)}
                aria-label={t("slideIndicator", {
                  number: index + 1,
                })}
              >
                <span
                  className={`block w-[10px] h-[10px] rounded-full bg-white outline outline-1 outline-white transition-all duration-300 ${index === activeIndex
                    ? "outline-offset-6"
                    : "group-hover:outline-offset-4 opacity-70 group-hover:opacity-100"
                    }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
