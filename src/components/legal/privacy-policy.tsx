"use client";

import LegalPageLayout, { type SectionConfig } from "./legal-page-layout";

export default function PrivacyPolicyPage() {
  const sections: SectionConfig[] = [
    {
      titleKey: "sections.dataController.title",
      content: [
        { type: "paragraph", key: "sections.dataController.paragraph1" },
      ],
    },
    {
      titleKey: "sections.dataUsage.title",
      content: [
        { type: "paragraph", key: "sections.dataUsage.paragraph1" },
        {
          type: "list",
          items: [
            "sections.dataUsage.listItem1",
            "sections.dataUsage.listItem2",
            "sections.dataUsage.listItem3",
            "sections.dataUsage.listItem4",
          ],
        },
      ],
    },
    {
      titleKey: "sections.dataSharing.title",
      content: [
        { type: "paragraph", key: "sections.dataSharing.paragraph1" },
        {
          type: "list",
          items: [
            "sections.dataSharing.listItem1",
            "sections.dataSharing.listItem2",
            "sections.dataSharing.listItem3",
          ],
        },
      ],
    },
    {
      titleKey: "sections.yourRights.title",
      content: [
        { type: "paragraph", key: "sections.yourRights.paragraph1" },
        {
          type: "list",
          items: [
            "sections.yourRights.listItem1",
            "sections.yourRights.listItem2",
            "sections.yourRights.listItem3",
          ],
        },
      ],
    },
  ];

  return (
    <LegalPageLayout
      namespace="PrivacyPolicy"
      headingKey="heading"
      sections={sections}
    />
  );
}
