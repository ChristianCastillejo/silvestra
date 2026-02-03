import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PrivacyPolicy from "@/components/legal/privacy-policy";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("PrivacyPolicy");

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    openGraph: {
      title: t("metadata.title"),
      description: t("metadata.description"),
    },
  };
}

export default function PrivacyPolicyPage() {
  return (
    <main className="mt-[180px]">
      <PrivacyPolicy />
    </main>
  );
}
