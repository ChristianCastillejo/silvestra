"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function HeroSeason(): React.JSX.Element {
  const t = useTranslations("Home.gifts");

  return (
    <Container as="section" size="full" className="h-[calc(100vh-100px)] max-md:h-[140vh] relative overflow-hidden">
      <div className="rounded-2xl overflow-hidden h-full w-full">
        <div className="flex flex-col md:flex-row h-full">
          <div className="w-full md:w-1/2 h-[70vh] md:h-full overflow-hidden flex flex-col items-center justify-center p-7 gap-5">
            <h2 className="text-center md:text-left">{t("title")}</h2>

            <p className="text-center md:text-left m-0 md:px-7 md:w-3/4">
              {t("description")}
            </p>

            <Button asChild variant="secondary" className="!w-fit">
              <Link href="/collections/jardines-eternos">
                {t("buttonText")}
              </Link>
            </Button>
          </div>

          <div className="relative w-full md:w-1/2 h-[70vh] md:h-full overflow-hidden rounded-2xl md:rounded-none">
            <Image
              src="/images/present.jpg"
              alt={t("imageAlt")}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
