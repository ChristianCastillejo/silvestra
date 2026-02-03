import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Shipping from "@/components/shipping/shipping";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Shipping");

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    openGraph: {
      title: t("metadata.title"),
      description: t("metadata.openGraphDescription"),
    },
  };
}

export default function ShippingPage() {
  return (
    <main className="mt-[180px]">
      <Shipping />
    </main>
  );
}
