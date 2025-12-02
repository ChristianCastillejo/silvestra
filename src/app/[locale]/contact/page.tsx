import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ContactForm from "@/components/contact/form";
import { Container } from "@/components/ui/container";
import { getPage } from "@/lib/shopify/index";
import type { PageFragment, SeoFragment } from "@/gql/graphql";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Contact" as unknown as Parameters<typeof getTranslations>[0]);
  const translate = (key: string): string => t(key as unknown as Parameters<typeof t>[0]) as string;
  const page = (await getPage("contact")) as unknown as PageFragment | null;

  if (!page) {
    return {
      title: translate("metadata.title"),
      description: translate("metadata.description"),
    };
  }

  const seo = page.seo as SeoFragment | null | undefined;
  const title = seo?.title || page.title;
  const description = seo?.description || page.bodySummary;

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: page.createdAt,
      modifiedTime: page.updatedAt,
      siteName: translate("metadata.siteName"),
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function ContactPage() {
  const t = await getTranslations("Contact" as unknown as Parameters<typeof getTranslations>[0]);
  const translate = (key: string): string => t(key as unknown as Parameters<typeof t>[0]) as string;
  const page = (await getPage("contact")) as unknown as PageFragment | null;

  return (
    <Container>
      <div className="flex flex-col items-center mt-[180px]">
        <h1 className="text-center mb-2">{translate("heading")}</h1>
      </div>

      <div className="mt-20 max-w-[600px] mx-auto">
        <div className="flex flex-col gap-2 mb-10 md:gap-3 ">
          <p className="text-gray text-lg m-0">
            {translate("description.paragraph1")}
          </p>
          <p className="text-gray text-lg m-0">
            {translate("description.paragraph2")}
          </p>
        </div>

        <ContactForm />
      </div>
    </Container>
  );
}
