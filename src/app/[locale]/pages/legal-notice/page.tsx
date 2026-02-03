import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import LegalNotice from "@/components/legal/legal-notice";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("LegalNotice");

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    openGraph: {
      title: t("metadata.title"),
      description: t("metadata.description"),
    },
  };
}

export default function LegalNoticePage() {
  return (
    <main className="mt-[180px]">
      <LegalNotice />
    </main>
  );
}
