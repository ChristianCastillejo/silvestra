"use client";

import { useTranslations } from "next-intl";

export type ContentItem =
  | { type: "paragraph"; key: string; textKey?: string }
  | { type: "list"; items: string[] }
  | { type: "nestedList"; items: Array<{ key: string; nestedItems: string[] }> }
  | { type: "linksList"; links: Array<{ text: string; url: string }> };

export interface SectionConfig {
  titleKey: string;
  content: ContentItem[];
}

interface LegalPageLayoutProps {
  namespace: string;
  headingKey: string;
  sections: SectionConfig[];
}

type TranslatorFn = (key: string) => string;

function renderContentItem(
  item: ContentItem,
  index: number,
  t: TranslatorFn
) {
  if (item.type === "paragraph") {
    if (item.textKey) {
      return (
        <p key={index}>
          {t(item.key)}: {t(item.textKey)}
        </p>
      );
    }
    return <p key={index}>{t(item.key)}</p>;
  }
  if (item.type === "list") {
    return (
      <ul key={index}>
        {item.items.map((key, j) => (
          <li key={j}>{t(key)}</li>
        ))}
      </ul>
    );
  }
  if (item.type === "nestedList") {
    return (
      <ul key={index}>
        {item.items.map((listItem, j) => (
          <li key={j}>
            {t(listItem.key)}
            <ul>
              {listItem.nestedItems.map((nestedKey, k) => (
                <li key={k}>{t(nestedKey)}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    );
  }
  if (item.type === "linksList") {
    return (
      <ul key={index}>
        {item.links.map((link, j) => (
          <li key={j}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {t(link.text)}
            </a>
          </li>
        ))}
      </ul>
    );
  }
  return null;
}

export default function LegalPageLayout({
  namespace,
  headingKey,
  sections,
}: LegalPageLayoutProps) {
  const t = useTranslations(namespace as Parameters<typeof useTranslations>[0]) as unknown as TranslatorFn;

  return (
    <section className="bg-background">
      <div className="flex flex-col items-center mt-20">
        <h1 className="text-center mb-2">{t(headingKey)}</h1>
      </div>
      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center gap-6 px-4 pt-8 pb-12 mt-20 md:gap-12 md:px-10">
        <div className="flex w-full max-w-4xl flex-col items-center gap-6 md:gap-12">
          <div className="flex w-full flex-col gap-6 md:gap-9">
            <div className="flex flex-col gap-6 md:gap-9">
              {sections.map((section, index) => (
                <div key={index} className="flex flex-col gap-4 md:gap-6">
                  <h3 className="text-lg font-bold text-gray">
                    {t(section.titleKey)}
                  </h3>
                  <div className="text-lg text-gray [&_p]:m-0 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 [&_ul:first-child]:mt-0 [&_ul:last-child]:mb-0 [&_li]:mb-2 [&_li:last-child]:mb-0 [&_table]:w-full [&_strong]:font-normal [&_a]:text-gray [&_a:hover]:text-gray">
                    {section.content.map((item, i) =>
                      renderContentItem(item, i, t)
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
