"use client";

import { useTranslations } from "next-intl";
import { ArrowIcon } from "./icons/arrow-icon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

type FAQAnswerContent =
  | string
  | Array<
      | string
      | {
          text: string;
          link?: { text: string; url: string };
          textAfter?: string;
        }
    >;

interface FAQItemConfig {
  id: string;
  questionKey: string;
  answerType: "text" | "list";
  answerContent: FAQAnswerContent;
}

interface Props {
  readonly faqs?: FAQItemConfig[];
}

function RenderFAQAnswer({
  type,
  content,
  translate,
}: {
  type: "text" | "list";
  content: FAQAnswerContent;
  translate: (key: string) => string;
}) {
  if (type === "text" && typeof content === "string") {
    return (
      <p className="text-gray-600 leading-relaxed">{translate(content)}</p>
    );
  }

  if (type === "list" && Array.isArray(content)) {
    return (
      <ul className="list-disc pl-5 space-y-2 text-gray-600 leading-relaxed">
        {content.map((item, index) => {
          if (typeof item === "string") {
            return <li key={index}>{translate(item)}</li>;
          }
          return (
            <li key={index}>
              {translate(item.text)}
              {item.link && (
                <>
                  {" "}
                  <a
                    href={item.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-medium underline hover:no-underline transition-colors"
                  >
                    {translate(item.link.text)}
                  </a>
                </>
              )}
              {item.textAfter && <> {translate(item.textAfter)}</>}
            </li>
          );
        })}
      </ul>
    );
  }

  return null;
}

export default function FAQ({ faqs }: Props) {
  const t = useTranslations("FAQ");
  const translate = (key: string) => t(key as any);

  const defaultFaqs: FAQItemConfig[] = [
    {
      id: "faq-1",
      questionKey: "faqs.item1.question",
      answerType: "list",
      answerContent: [
        "faqs.item1.answer.item1",
        "faqs.item1.answer.item2",
        "faqs.item1.answer.item3",
        {
          text: "faqs.item1.answer.item4.text",
          link: {
            text: "faqs.item1.answer.item4.link.text",
            url: "https://example.com",
          },
          textAfter: "faqs.item1.answer.item4.textAfter",
        },
      ],
    },
    {
      id: "faq-2",
      questionKey: "faqs.item2.question",
      answerType: "text",
      answerContent: "faqs.item2.answer",
    },
    {
      id: "faq-3",
      questionKey: "faqs.item3.question",
      answerType: "list",
      answerContent: [
        "faqs.item3.answer.item1",
        "faqs.item3.answer.item2",
        "faqs.item3.answer.item3",
      ],
    },
    {
      id: "faq-4",
      questionKey: "faqs.item4.question",
      answerType: "text",
      answerContent: "faqs.item4.answer",
    },
    {
      id: "faq-5",
      questionKey: "faqs.item5.question",
      answerType: "list",
      answerContent: ["faqs.item5.answer.item1", "faqs.item5.answer.item2"],
    },
    {
      id: "faq-6",
      questionKey: "faqs.item6.question",
      answerType: "text",
      answerContent: "faqs.item6.answer",
    },
  ];

  const displayFaqs = faqs || defaultFaqs;

  return (
    <Accordion
      type="single"
      collapsible
      className="hs-accordion-group w-full divide-y divide-gray-200 border-gray-200"
    >
      {displayFaqs.map((faq) => (
        <AccordionItem
          key={faq.id}
          value={faq.id}
          className="hs-accordion py-6"
        >
          <AccordionTrigger variant="faq">
            <span className="group-hover:text-primary transition-colors duration-200">
              {translate(faq.questionKey)}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <RenderFAQAnswer
              type={faq.answerType}
              content={faq.answerContent}
              translate={translate}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
