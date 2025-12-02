import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import FAQ from "@/components/faq";
import { Container } from "@/components/ui/container";
import { getPage } from "@/lib/shopify/index";
import type { PageFragment, SeoFragment } from "@/gql/graphql";
import Image from "next/image";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(
    "FAQ" as unknown as Parameters<typeof getTranslations>[0]
  );
  const translate = (key: string): string =>
    t(key as unknown as Parameters<typeof t>[0]) as string;

  const page = (await getPage("faq")) as PageFragment | null;

  const seo = page?.seo as SeoFragment | null | undefined;
  const title = seo?.title || page?.title || translate("metadata.title");
  const description =
    seo?.description || page?.bodySummary || translate("metadata.description");

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: page?.createdAt,
      modifiedTime: page?.updatedAt,
      siteName: translate("metadata.siteName"),
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function FAQPage() {
  const t = await getTranslations(
    "FAQ" as unknown as Parameters<typeof getTranslations>[0]
  );
  const translate = (key: string): string =>
    t(key as unknown as Parameters<typeof t>[0]) as string;

  const page = (await getPage("faq")) as PageFragment | null;

  return (
    <Container>
      {page && (
        <div className="flex flex-col items-center mt-[180px]">
          <h1 className="text-center mb-2">{page.title}</h1>
          <div
            className="[&_li]:my-2 [&_p]:text-gray"
            dangerouslySetInnerHTML={{ __html: page.body }}
          />
        </div>
      )}

      {!page && (
        <div className="flex flex-col items-center mt-[180px]">
          <h1 className="text-center mb-2">{translate("heading")}</h1>
        </div>
      )}

      <div className="mt-20 max-w-[600px] mx-auto">
        <FAQ />
      </div>

      <div className="relative w-full overflow-hidden rounded-2xl aspect-[4/3] md:rounded-[36px] md:max-w-5xl mx-auto mt-20">
        <Image
          src="/images/cicle.jpg"
          alt={translate("imageAlt")}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 1000px, (min-width: 768px) 80vw, 100vw"
          priority
        />
      </div>
    </Container>
  );
}
