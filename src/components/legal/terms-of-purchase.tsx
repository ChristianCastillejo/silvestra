"use client";

import LegalPageLayout, {
  type SectionConfig,
} from "./legal-page-layout";

export default function TermsOfPurchasePage() {
  const sections: SectionConfig[] = [
    {
      titleKey: "sections.productNature.title",
      content: [
        { type: "paragraph", key: "sections.productNature.paragraph1" },
        {
          type: "list",
          items: [
            "sections.productNature.listItem1",
            "sections.productNature.listItem2",
          ],
        },
      ],
    },
    {
      titleKey: "sections.pricesAndPayments.title",
      content: [
        { type: "paragraph", key: "sections.pricesAndPayments.paragraph1" },
      ],
    },
    {
      titleKey: "sections.shippingAndDeadlines.title",
      content: [
        { type: "paragraph", key: "sections.shippingAndDeadlines.paragraph1" },
        {
          type: "list",
          items: [
            "sections.shippingAndDeadlines.listItem1",
            "sections.shippingAndDeadlines.listItem2",
          ],
        },
      ],
    },
    {
      titleKey: "sections.returns.title",
      content: [
        { type: "paragraph", key: "sections.returns.paragraph1" },
        {
          type: "list",
          items: [
            "sections.returns.listItem1",
            "sections.returns.listItem2",
            "sections.returns.listItem3",
          ],
        },
      ],
    },
    {
      titleKey: "sections.applicableLaw.title",
      content: [
        { type: "paragraph", key: "sections.applicableLaw.paragraph1" },
      ],
    },
  ];

  return (
    <LegalPageLayout
      namespace="TermsOfPurchase"
      headingKey="heading"
      sections={sections}
    />
  );
}
