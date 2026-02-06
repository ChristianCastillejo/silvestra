"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { cn } from "@/utils/cn";

type TabId =
  | "howItWorks"
  | "watering"
  | "light"
  | "pruning"
  | "troubleshooting";

type ContentItem =
  | { type: "paragraph"; key: string }
  | { type: "list"; items: string[] };

interface TabConfig {
  tabTitleKey: string;
  titleKey: string;
  content: ContentItem[];
}

export default function Care() {
  const t = useTranslations("Care");
  const translate = (key: string) => t(key as Parameters<typeof t>[0]);

  const [activeTab, setActiveTab] = useState<TabId>("howItWorks");

  const tabConfigs: Record<TabId, TabConfig> = {
    howItWorks: {
      tabTitleKey: "tabs.howItWorks.tabTitle",
      titleKey: "tabs.howItWorks.title",
      content: [
        { type: "paragraph", key: "tabs.howItWorks.paragraph1" },
        { type: "paragraph", key: "tabs.howItWorks.paragraph2" },
      ],
    },
    watering: {
      tabTitleKey: "tabs.watering.tabTitle",
      titleKey: "tabs.watering.title",
      content: [
        { type: "paragraph", key: "tabs.watering.paragraph1" },
        {
          type: "list",
          items: [
            "tabs.watering.listItem1",
            "tabs.watering.listItem2",
            "tabs.watering.listItem3",
          ],
        },
        { type: "paragraph", key: "tabs.watering.paragraph2" },
        {
          type: "list",
          items: [
            "tabs.watering.listItem4",
            "tabs.watering.listItem5",
            "tabs.watering.listItem6",
          ],
        },
      ],
    },
    light: {
      tabTitleKey: "tabs.light.tabTitle",
      titleKey: "tabs.light.title",
      content: [
        { type: "paragraph", key: "tabs.light.paragraph1" },
        {
          type: "list",
          items: ["tabs.light.listItem1", "tabs.light.listItem2"],
        },
      ],
    },
    pruning: {
      tabTitleKey: "tabs.pruning.tabTitle",
      titleKey: "tabs.pruning.title",
      content: [
        { type: "paragraph", key: "tabs.pruning.paragraph1" },
        {
          type: "list",
          items: [
            "tabs.pruning.listItem1",
            "tabs.pruning.listItem2",
            "tabs.pruning.listItem3",
          ],
        },
      ],
    },
    troubleshooting: {
      tabTitleKey: "tabs.troubleshooting.tabTitle",
      titleKey: "tabs.troubleshooting.title",
      content: [
        { type: "paragraph", key: "tabs.troubleshooting.paragraph1" },
        {
          type: "list",
          items: ["tabs.troubleshooting.listItem1"],
        },
        { type: "paragraph", key: "tabs.troubleshooting.paragraph2" },
        {
          type: "list",
          items: ["tabs.troubleshooting.listItem2"],
        },
        { type: "paragraph", key: "tabs.troubleshooting.paragraph3" },
        {
          type: "list",
          items: ["tabs.troubleshooting.listItem3"],
        },
        { type: "paragraph", key: "tabs.troubleshooting.paragraph4" },
        { type: "paragraph", key: "tabs.troubleshooting.paragraph5" },
        { type: "paragraph", key: "tabs.troubleshooting.paragraph6" },
      ],
    },
  };

  const currentConfig = tabConfigs[activeTab];

  return (
    <section className="bg-background">
      <div className="flex flex-col items-center mt-20">
        <h1 className="text-center mb-2">{t("heading")}</h1>
      </div>
      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center gap-6 px-4 pt-8 pb-12 mt-20 md:gap-12 md:px-10">
        <div className="flex w-full max-w-4xl flex-col items-center gap-6 md:gap-12">
          <div className="flex w-full flex-col gap-6 md:gap-9">
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4 overflow-x-auto pb-2 w-full max-w-full scrollbar-hide">
                  {(Object.keys(tabConfigs) as TabId[]).map((tabId) => (
                    <Button
                      key={tabId}
                      onClick={() => setActiveTab(tabId)}
                      variant={activeTab === tabId ? "secondary" : "tertiary"}
                      stable
                      className={cn(
                        "flex-shrink-0 !w-fit",
                        activeTab === tabId &&
                        "hover:!bg-neutral-black hover:!border-neutral-black hover:!text-text-white"
                      )}
                    >
                      {translate(tabConfigs[tabId].tabTitleKey)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-4">
                <h3 className="text-lg font-bold text-gray">
                  {translate(currentConfig.titleKey)}
                </h3>
                <div className="text-lg text-gray [&_p]:m-0 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 [&_ul:first-child]:mt-0 [&_ul:last-child]:mb-0 [&_li]:mb-2 [&_li:last-child]:mb-0">
                  {currentConfig.content.map((item, i) => {
                    if (item.type === "paragraph") {
                      return <p key={i}>{translate(item.key)}</p>;
                    } else {
                      return (
                        <ul key={i}>
                          {item.items.map((key, j) => (
                            <li key={j}>{translate(key)}</li>
                          ))}
                        </ul>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* <div className="relative w-full overflow-hidden rounded-2xl aspect-video md:aspect-[600/384] md:max-w-[600px] md:rounded-[32px]">
            <Image
              src="/hero-1.jpeg"
              alt="Video thumbnail"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 600px, 100vw"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 md:gap-3">
              <div className="relative h-16 w-24">
                <Image
                  src="/hero-1.jpeg"
                  alt="Play button"
                  fill
                  className="object-contain"
                  sizes="96px"
                />
              </div>
              <div className="rounded-lg bg-white/30 px-2 py-1 backdrop-blur-sm">
                <p className="text-center text-lg font-medium text-white m-0 md:text-xl">
                  {currentContent.videoTitle}
                </p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}
