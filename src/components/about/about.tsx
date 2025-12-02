"use client";

import { useTranslations } from "next-intl";

interface AboutSection {
  titleKey: string;
  contentKeys: string[];
  listItems?: string[];
  orderedListItems?: string[];
  contentKeysAfterList?: string[];
}

export default function AboutPage() {
  const t = useTranslations("About");

  const translate = (key: string) => t(key as Parameters<typeof t>[0]);

  const aboutSections: AboutSection[] = [
    {
      titleKey: "",
      contentKeys: ["intro.paragraph1", "intro.paragraph2", "intro.paragraph3"],
    },
    {
      titleKey: "sections.fromCode.title",
      contentKeys: [
        "sections.fromCode.paragraph1",
        "sections.fromCode.paragraph2",
        "sections.fromCode.paragraph3",
        "sections.fromCode.paragraph4",
        "sections.fromCode.paragraph5",
      ],
    },
    {
      titleKey: "sections.engineering.title",
      contentKeys: [
        "sections.engineering.paragraph1",
        "sections.engineering.paragraph2",
        "sections.engineering.paragraph3",
      ],
      listItems: [
        "sections.engineering.listItem1",
        "sections.engineering.listItem2",
      ],
      contentKeysAfterList: ["sections.engineering.paragraph4"],
    },
    {
      titleKey: "sections.workshop.title",
      contentKeys: [
        "sections.workshop.paragraph1",
        "sections.workshop.paragraph2",
        "sections.workshop.paragraph3",
      ],
      orderedListItems: [
        "sections.workshop.listItem1",
        "sections.workshop.listItem2",
        "sections.workshop.listItem3",
      ],
      contentKeysAfterList: ["sections.workshop.paragraph4"],
    },
    {
      titleKey: "sections.notAlone.title",
      contentKeys: [
        "sections.notAlone.paragraph1",
        "sections.notAlone.paragraph2",
        "sections.notAlone.paragraph3",
      ],
    },
  ];

  return (
    <section className="bg-background">
      <div className="flex flex-col items-center mt-20">
        <h1 className="text-center mb-2">{t("heading")}</h1>
      </div>
      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center gap-6 px-4 pt-8 pb-12 mt-20 md:gap-12 md:px-10">
        <div className="flex w-full max-w-4xl flex-col items-center gap-6 md:gap-12">
          <div className="flex w-full flex-col gap-6 md:gap-9">
            <div className="flex flex-col gap-6 md:gap-9">
              {aboutSections.map((section, index) => (
                <div
                  key={section.titleKey || index}
                  className="flex flex-col gap-4 md:gap-6"
                >
                  {section.titleKey && (
                    <h3 className="text-lg font-bold text-gray">
                      {translate(section.titleKey)}
                    </h3>
                  )}
                  <div
                    className={`text-lg text-gray [&_p]:m-0 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 [&_ul:first-child]:mt-0 [&_ul:last-child]:mb-0 [&_li]:mb-2 [&_li:last-child]:mb-0 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4 [&_ol:first-child]:mt-0 [&_ol:last-child]:mb-0 ${
                      !section.titleKey ? "mt-4" : ""
                    }`}
                  >
                    {section.contentKeys.map((key, i) => (
                      <p key={i}>{translate(key)}</p>
                    ))}
                    {section.listItems && (
                      <ul>
                        {section.listItems.map((key, i) => (
                          <li key={i}>{translate(key)}</li>
                        ))}
                      </ul>
                    )}
                    {section.orderedListItems && (
                      <ol>
                        {section.orderedListItems.map((key, i) => (
                          <li key={i}>{translate(key)}</li>
                        ))}
                      </ol>
                    )}
                    {section.contentKeysAfterList?.map((key, i) => (
                      <p key={i}>{translate(key)}</p>
                    ))}
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
