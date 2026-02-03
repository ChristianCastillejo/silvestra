"use client";

import { useRef, useState, useEffect } from "react";
import type { RefObject } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/container";

interface CollectionImage {
  readonly url: string;
  readonly altText?: string | null;
}

interface Collection {
  readonly handle: string;
  readonly title: string;
  readonly description?: string | null;
  readonly path: string;
  readonly image?: CollectionImage | null;
}

interface Props {
  readonly collections: readonly Collection[];
}

export default function FeaturedCollections({
  collections,
}: Props): React.JSX.Element | null {
  const t = useTranslations("FeaturedCollections");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const visibleCollections = collections.filter(
    (collection) => collection?.image?.url
  );

  const handleScroll = (direction: number): void => {
    if (!scrollContainerRef.current) return;

    const scrollContainer = scrollContainerRef.current;
    const firstChild = scrollContainer.firstElementChild as HTMLElement | null;
    const itemWidth = (firstChild?.offsetWidth ?? 0) + 20;
    scrollContainer.scrollBy({
      left: direction * itemWidth,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScrollEvent = (): void => {
      const scrollLeft = scrollContainer.scrollLeft;
      const firstChild =
        scrollContainer.firstElementChild as HTMLElement | null;
      const itemWidth = (firstChild?.offsetWidth ?? 0) + 20;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setActiveIndex(newIndex);
    };

    scrollContainer.addEventListener("scroll", handleScrollEvent);
    return () =>
      scrollContainer.removeEventListener("scroll", handleScrollEvent);
  }, []);

  if (!collections?.length) return null;

  return (
    <Container as="section" size="full" className="!my-20 relative group/parent">
      <div className="overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-scroll scroll-smooth no-scrollbar snap-x snap-mandatory"
        >
          {collections.map((collection, i) =>
            collection?.image?.url ? (
              <div
                key={collection.handle ?? i}
                className={`basis-3/4 md:basis-[calc(25%-15px)] aspect-[2/3] rounded-lg overflow-hidden shrink-0 relative group ${
                  i !== collections.length - 1 && "mr-5"
                } snap-center`}
              >
                <Link href={collection.path}>
                  <Image
                    className="w-full h-full object-cover transition-transform transition-cubic group-hover:scale-110"
                    src={collection.image.url}
                    alt={collection.image.altText ?? collection.title}
                    width={1920}
                    height={1080}
                  />
                  <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-t from-[#12131652] to-transparent"></div>
                  <div className="absolute inset-x-12 bottom-12">
                    <h2 className="text-white text-xl font-semibold text-center">
                      {collection.title}
                    </h2>
                  </div>
                </Link>
              </div>
            ) : null
          )}
        </div>
      </div>

      <div className="md:hidden flex justify-center mt-4 space-x-2">
        {visibleCollections.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === activeIndex ? "bg-black" : "bg-border"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>

      {visibleCollections.length > 4 && (
        <>
          <button
            type="button"
            onClick={() => handleScroll(-1)}
            className="swiper-arrow swipe-left left-8 -rotate-90 hidden md:flex absolute top-1/2 -translate-y-1/2 opacity-0 transition-all duration-300 ease-in-out group-hover/parent:left-10 group-hover/parent:opacity-100"
            aria-label={t("ariaLabels.scrollLeft")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="#000"
                strokeDasharray="10"
                strokeDashoffset="12"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8l-7 7M12 8l7 7"
              >
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  dur="0.3s"
                  values="12;0"
                />
              </path>
            </svg>
          </button>

          <button
            type="button"
            onClick={() => handleScroll(1)}
            className="swiper-arrow swipe-right right-8 -rotate-90 hidden md:flex absolute top-1/2 -translate-y-1/2 opacity-0 transition-all duration-300 ease-in-out group-hover/parent:right-10 group-hover/parent:opacity-100"
            aria-label={t("ariaLabels.scrollRight")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="#000"
                strokeDasharray="10"
                strokeDashoffset="12"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8l-7 7M12 8l7 7"
              >
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  dur="0.3s"
                  values="12;0"
                />
              </path>
            </svg>
          </button>
        </>
      )}
    </Container>
  );
}
