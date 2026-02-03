"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

export default function About() {
  const t = useTranslations("About1");

  return (
    <section className="bg-background">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center gap-6 px-4   pb-12 overflow-hidden md:gap-9 md:px-10  ">
        <div className="flex w-full flex-col gap-4 md:max-w-4xl md:items-start md:gap-6">
          <h2 className="text-4xl font-normal text-primary">
            {t("heading")}
          </h2>

          <div className="flex flex-col gap-4 md:gap-6">
            <p className="text-lg text-gray m-0">
              {t("paragraph")}
            </p>
          </div>
        </div>

        <div className="relative w-full overflow-hidden rounded-2xl aspect-[343/467] md:aspect-[1000/467] md:rounded-[36px] md:max-w-5xl">
          <Image
            src="/hero-1.jpeg"
            alt={t("imageAlt")}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 1000px, (min-width: 768px) 80vw, 100vw"
            priority
          />
        </div>
      </div>
    </section>
  );
}
