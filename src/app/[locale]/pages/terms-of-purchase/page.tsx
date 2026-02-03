import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import TermsOfPurchase from "@/components/legal/terms-of-purchase";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("TermsOfPurchase");

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    openGraph: {
      title: t("metadata.title"),
      description: t("metadata.description"),
    },
  };
}

export default function TermsOfPurchasePage() {
  return (
    <main className="mt-[180px]">
      <TermsOfPurchase />
    </main>
  );
}
