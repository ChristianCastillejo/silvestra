import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Cookies from "@/components/legal/cookies";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Cookies");

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    openGraph: {
      title: t("metadata.title"),
      description: t("metadata.description"),
    },
  };
}

export default function CookiesPage() {
  return (
    <main className="mt-[180px]">
      <Cookies />
    </main>
  );
}
