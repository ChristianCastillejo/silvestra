"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Container } from "@/components/ui/container";

export default function HeroTwins(): React.JSX.Element {
  const t = useTranslations("HeroTwins");
  const translate = (key: string) => t(key as Parameters<typeof t>[0]);

  const images = [
    {
      src: "/images/twins-1.jpg",
      alt: translate("image1.alt"),
      description: translate("image1.description"),
    },
    {
      src: "/images/twins-2.jpg",
      alt: translate("image2.alt"),
      description: translate("image2.description"),
    },
  ] as const;

  return (
    <Container as="section" size="full" className="h-[calc(100vh-100px)] max-md:h-[140vh] relative overflow-hidden">
      <div className="rounded-2xl overflow-hidden h-full w-full">
        <div className="flex flex-col md:flex-row h-full">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative w-full md:w-1/2 h-[70vh] md:h-full overflow-hidden"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
