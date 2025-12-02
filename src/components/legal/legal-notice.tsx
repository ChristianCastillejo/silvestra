"use client";

import LegalPageLayout, {
  type SectionConfig,
} from "./legal-page-layout";

export default function LegalNoticePage() {
  const sections: SectionConfig[] = [
    {
      titleKey: "sections.identification.title",
      content: [
        { type: "paragraph", key: "sections.identification.paragraph1" },
        {
          type: "list",
          items: [
            "sections.identification.listItem1",
            "sections.identification.listItem2",
            "sections.identification.listItem3",
            "sections.identification.listItem4",
          ],
        },
      ],
    },
    {
      titleKey: "sections.intellectualProperty.title",
      content: [
        { type: "paragraph", key: "sections.intellectualProperty.paragraph1" },
      ],
    },
    {
      titleKey: "sections.portalUse.title",
      content: [
        { type: "paragraph", key: "sections.portalUse.paragraph1" },
      ],
    },
    {
      titleKey: "sections.liabilityLimitation.title",
      content: [
        { type: "paragraph", key: "sections.liabilityLimitation.paragraph1" },
      ],
    },
  ];

  return (
    <LegalPageLayout
      namespace="LegalNotice"
      headingKey="heading"
      sections={sections}
    />
  );
}
