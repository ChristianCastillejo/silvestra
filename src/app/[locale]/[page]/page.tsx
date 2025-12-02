import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getPage } from "@/lib/shopify/index";
import type { PageProps } from "@/types/page";
import type { PageFragment, SeoFragment } from "@/gql/graphql";

interface DynamicPageParams extends Record<string, string> {
  readonly page: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<DynamicPageParams>;
}): Promise<Metadata> {
  const t = await getTranslations(
    "DynamicPage" as unknown as Parameters<typeof getTranslations>[0]
  );
  const translate = (key: string): string =>
    t(key as unknown as Parameters<typeof t>[0]) as string;

  const { page: pageHandle } = await params;

  if (!pageHandle || typeof pageHandle !== "string") {
    return {
      title: translate("metadata.notFound"),
    };
  }

  const page = (await getPage(pageHandle)) as PageFragment | null;

  if (!page) {
    return {
      title: translate("metadata.notFound"),
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

export default async function DynamicPage({
  params,
}: PageProps<DynamicPageParams>) {
  const t = await getTranslations(
    "DynamicPage" as unknown as Parameters<typeof getTranslations>[0]
  );
  const translate = (
    key: string,
    values?: Record<string, string | number | Date>
  ): string =>
    values
      ? (t(key as unknown as Parameters<typeof t>[0], values) as string)
      : (t(key as unknown as Parameters<typeof t>[0]) as string);

  const { page: pageHandle } = await params;

  if (!pageHandle || typeof pageHandle !== "string") {
    notFound();
  }

  const page = (await getPage(pageHandle)) as PageFragment | null;

  if (!page) {
    notFound();
  }

  const lastUpdatedDate = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(page.updatedAt));

  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="mb-8 text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
        {page.title}
      </h1>
      <div
        className="prose prose-neutral prose-lg mx-auto"
        dangerouslySetInnerHTML={{ __html: page.body }}
      />

      <p className="mt-16 text-sm italic text-neutral-500">
        {translate("lastUpdated", {
          date: lastUpdatedDate,
        } as Record<string, string | number>)}
      </p>
    </div>
  );
}
