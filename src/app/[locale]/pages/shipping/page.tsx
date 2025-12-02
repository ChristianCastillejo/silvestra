import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Shipping from "@/components/shipping/shipping";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(
    "Shipping" as unknown as Parameters<typeof getTranslations>[0]
  );
  const translate = (key: string): string =>
    t(key as unknown as Parameters<typeof t>[0]) as string;

  return {
    title: translate("metadata.title"),
    description: translate("metadata.description"),
    openGraph: {
      title: translate("metadata.title"),
      description: translate("metadata.openGraphDescription"),
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
