"use client";

import { useTranslations } from "next-intl";

type ContentItem =
  | { type: "paragraph"; key: string }
  | { type: "list"; items: string[] };

interface SectionConfig {
  titleKey: string;
  content: ContentItem[];
}

function renderContentItem(
  item: ContentItem,
  index: number,
  translate: (key: string) => string
) {
  if (item.type === "paragraph") {
    return <p key={index}>{translate(item.key)}</p>;
  }
  if (item.type === "list") {
    return (
      <ul key={index}>
        {item.items.map((key, j) => (
          <li key={j}>{translate(key)}</li>
        ))}
      </ul>
    );
  }
  return null;
}

export default function ShippingPage() {
  const t = useTranslations("Shipping");
  const translate = (key: string) => t(key as Parameters<typeof t>[0]);

  const sections: SectionConfig[] = [
    {
      titleKey: "sections.delivery.title",
      content: [
        { type: "paragraph", key: "sections.delivery.paragraph1" },
        {
          type: "list",
          items: [
            "sections.delivery.listItem1",
            "sections.delivery.listItem2",
            "sections.delivery.listItem3",
            "sections.delivery.listItem4",
          ],
        },
        { type: "paragraph", key: "sections.delivery.paragraph2" },
      ],
    },
    {
      titleKey: "sections.complicatedPlaces.title",
      content: [
        { type: "paragraph", key: "sections.complicatedPlaces.paragraph1" },
        {
          type: "list",
          items: [
            "sections.complicatedPlaces.listItem1",
            "sections.complicatedPlaces.listItem2",
          ],
        },
        { type: "paragraph", key: "sections.complicatedPlaces.paragraph2" },
      ],
    },
    {
      titleKey: "sections.guarantee.title",
      content: [
        { type: "paragraph", key: "sections.guarantee.paragraph1" },
        { type: "paragraph", key: "sections.guarantee.paragraph2" },
        {
          type: "list",
          items: [
            "sections.guarantee.listItem1",
            "sections.guarantee.listItem2",
            "sections.guarantee.listItem3",
          ],
        },
        { type: "paragraph", key: "sections.guarantee.paragraph3" },
        {
          type: "list",
          items: [
            "sections.guarantee.listItem4",
            "sections.guarantee.listItem5",
          ],
        },
      ],
    },
    {
      titleKey: "sections.cancellations.title",
      content: [
        { type: "paragraph", key: "sections.cancellations.paragraph1" },
        {
          type: "list",
          items: [
            "sections.cancellations.listItem1",
            "sections.cancellations.listItem2",
          ],
        },
      ],
    },
    {
      titleKey: "sections.uniquePieces.title",
      content: [
        { type: "paragraph", key: "sections.uniquePieces.paragraph1" },
        {
          type: "list",
          items: [
            "sections.uniquePieces.listItem1",
            "sections.uniquePieces.listItem2",
            "sections.uniquePieces.listItem3",
          ],
        },
      ],
    },
    {
      titleKey: "sections.paymentMethods.title",
      content: [
        { type: "paragraph", key: "sections.paymentMethods.paragraph1" },
      ],
    },
  ];

  return (
    <section className="bg-background">
      <div className="flex flex-col items-center mt-20">
        <h1 className="text-center mb-2">{translate("heading")}</h1>
      </div>
      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center gap-6 px-4 pt-8 pb-12 mt-20 md:gap-12 md:px-10">
        <div className="flex w-full max-w-4xl flex-col items-center gap-6 md:gap-12">
          <div className="flex w-full flex-col gap-6 md:gap-9">
            <div className="flex flex-col gap-4 mt-4">
              <p className="text-lg text-gray m-0">
                {translate("intro")}
              </p>
            </div>

            <div className="flex flex-col gap-6 md:gap-9">
              {sections.map((section, index) => (
                <div key={index} className="flex flex-col gap-4 md:gap-6">
                  <h3 className="text-lg font-bold text-gray">
                    {translate(section.titleKey)}
                  </h3>
                  <div className="text-lg text-gray [&_p]:m-0 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 [&_ul:first-child]:mt-0 [&_ul:last-child]:mb-0 [&_li]:mb-2 [&_li:last-child]:mb-0">
                    {section.content.map((item, i) =>
                      renderContentItem(item, i, translate)
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <h3 className="text-lg font-bold text-gray">{translate("questions.title")}</h3>
              <p className="text-lg text-gray m-0">
                {translate("questions.paragraph1")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
