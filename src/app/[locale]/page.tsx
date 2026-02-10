import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import Hero from "@/sections/hero";
import FeaturedProducts from "@/sections/featured-products";
import FeaturedProductsSkeleton from "@/sections/featured-products-skeleton";
import ProductHighlight from "@/sections/product-highlight";
import Features from "@/sections/features-section";

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

    <main className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-white">
      <Hero />
      <Features />
      <ProductHighlight />
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <FeaturedProducts />
      </Suspense>
    </main>
  );
}
