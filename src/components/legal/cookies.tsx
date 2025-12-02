"use client";

import LegalPageLayout, { type SectionConfig } from "./legal-page-layout";

export default function CookiesPage() {
  const sections: SectionConfig[] = [
    {
      titleKey: "sections.whatAreCookies.title",
      content: [
        { type: "paragraph", key: "sections.whatAreCookies.paragraph1" },
        { type: "paragraph", key: "sections.whatAreCookies.paragraph2" },
      ],
    },
    {
      titleKey: "sections.typesOfCookies.title",
      content: [
        { type: "paragraph", key: "sections.typesOfCookies.paragraph1" },
        {
          type: "nestedList",
          items: [
            {
              key: "sections.typesOfCookies.technical.main",
              nestedItems: [
                "sections.typesOfCookies.technical.provider",
                "sections.typesOfCookies.technical.function",
              ],
            },
            {
              key: "sections.typesOfCookies.analytical.main",
              nestedItems: [
                "sections.typesOfCookies.analytical.provider",
                "sections.typesOfCookies.analytical.function",
              ],
            },
            {
              key: "sections.typesOfCookies.advertising.main",
              nestedItems: [
                "sections.typesOfCookies.advertising.provider",
                "sections.typesOfCookies.advertising.function",
              ],
            },
          ],
        },
      ],
    },
    {
      titleKey: "sections.cookiesList.title",
      content: [
        {
          type: "paragraph",
          key: "sections.cookiesList.technical.type",
          textKey: "sections.cookiesList.technical.text",
        },
        {
          type: "paragraph",
          key: "sections.cookiesList.analytical.type",
          textKey: "sections.cookiesList.analytical.text",
        },
        {
          type: "paragraph",
          key: "sections.cookiesList.advertising.type",
          textKey: "sections.cookiesList.advertising.text",
        },
      ],
    },
    {
      titleKey: "sections.howToDisable.title",
      content: [
        { type: "paragraph", key: "sections.howToDisable.paragraph1" },
        { type: "paragraph", key: "sections.howToDisable.paragraph2" },
        {
          type: "linksList",
          links: [
            {
              text: "sections.howToDisable.links.chrome",
              url: "https://support.google.com/chrome/answer/95647?hl=es",
            },
            {
              text: "sections.howToDisable.links.firefox",
              url: "https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias",
            },
            {
              text: "sections.howToDisable.links.safari",
              url: "https://support.apple.com/es-es/guide/safari/sfri11471/mac",
            },
            {
              text: "sections.howToDisable.links.edge",
              url: "https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09",
            },
          ],
        },
      ],
    },
    {
      titleKey: "sections.updates.title",
      content: [{ type: "paragraph", key: "sections.updates.paragraph1" }],
    },
  ];

  return (
    <LegalPageLayout
      namespace="Cookies"
      headingKey="heading"
      sections={sections}
    />
  );
}
