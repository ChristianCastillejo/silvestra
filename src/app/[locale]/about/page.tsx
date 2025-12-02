import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import About from "@/components/about/about";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("About");

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    openGraph: {
      title: t("metadata.title"),
      description: t("metadata.description"),
    },
  };
}

export default function AboutPage() {
  return (
    <main className="mt-[180px]">
      <About />
    </main>
  );
}
