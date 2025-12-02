"use client";

import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import { useEffect, type ReactNode } from "react";

interface CarouselProps {
  children: ReactNode;
  options?: Parameters<typeof useEmblaCarousel>[0];
  plugins?: Parameters<typeof useEmblaCarousel>[1];
  setApi?: (api: EmblaCarouselType | undefined) => void;
  className?: string;
}

export function Carousel({
  children,
  options,
  plugins,
  setApi,
  className,
}: CarouselProps) {
  const [emblaRef, api] = useEmblaCarousel(options, plugins);

  useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  return (
    <div ref={emblaRef} className={className}>
      <div className="embla__container">{children}</div>
    </div>
  );
}
