import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import Hero from "@/sections/hero";
import HeroTwins from "@/sections/hero-twins";
import HeroSeason from "@/sections/hero-season";
import FeaturedProducts from "@/sections/featured-products";
import FeaturedProductsSkeleton from "@/sections/featured-products-skeleton";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Home");

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    openGraph: {
      type: "website",
      title: t("metadata.title"),
      description: t("metadata.description"),
      siteName: t("metadata.siteName"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("metadata.title"),
      description: t("metadata.description"),
    },
  };
}

export default async function Home() {
  return (
    <div className="flex flex-col gap-4">
      <Hero />
      <HeroTwins />
      <HeroSeason />
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <FeaturedProducts />
      </Suspense>
    </div>
  );
}
