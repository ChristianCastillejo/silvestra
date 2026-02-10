import React from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import LanguageSwitcher from "../language-switcher";
import { Container } from "@/components/ui/container";
import { footerMenuConfig } from "@/components/layout/navigation";

export default async function Footer(): Promise<React.JSX.Element> {
  const t = await getTranslations("Footer");

  return (
    <footer className="border-t border-border mt-32">
      <Container>
        <div className="flex justify-center items-start py-14 max-md:flex-col max-md:pt-7 max-md:pb-0 md:gap-8 lg:gap-20">
          <section className="flex-shrink-0 px-4 max-md:px-0 md:hidden">
            <h3 className="text-base font-medium py-2">{t("contact")}</h3>
            <div className="flex flex-col mt-5 gap-2">
              <Link
                className="w-fit text-gray"
                href="mailto:hola@silvestra.es"
              >
                hola@silvestra.es
              </Link>
            </div>
          </section>
          {footerMenuConfig.length > 0 &&
            footerMenuConfig.map((section) => {
              if (!section?.sectionTitleKey || !section?.items?.length) {
                return null;
              }
              const sectionTitle = t(section.sectionTitleKey as Parameters<typeof t>[0]);
              return (
                <nav
                  key={section.sectionTitleKey}
                  className="px-2 flex-shrink-0 min-w-[16%] max-md:hidden"
                  aria-label={sectionTitle}
                >
                  <h3 className="text-base font-medium py-5">{sectionTitle}</h3>
                  <ul className="pl-0 flex flex-col gap-2">
                    {section.items.map((item) =>
                      item?.url && item?.titleKey ? (
                        <li key={item.titleKey} className="list-none">
                          <Link href={item.url}>
                            {t(item.titleKey as Parameters<typeof t>[0])}
                          </Link>
                        </li>
                      ) : null
                    )}
                  </ul>
                </nav>
              );
            })}
          <Accordion type="multiple" className="md:hidden w-full max-md:w-full">
            {footerMenuConfig.map((section, index) => {
              if (!section?.sectionTitleKey) {
                return null;
              }
              const sectionTitle = t(section.sectionTitleKey as Parameters<typeof t>[0]);
              return (
                <AccordionItem
                  key={section.sectionTitleKey}
                  value={`menu-${index}`}
                  className={`border-y border-border overflow-hidden transition-all duration-300 ${index === 0 ? "mt-5 border-b-0" : ""
                    }`}
                >
                  <AccordionTrigger className="h-[60px] font-semibold">
                    {sectionTitle}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="pl-0 flex flex-col gap-2">
                      {section.items?.length > 0 &&
                        section.items.map((item) =>
                          item?.url && item?.titleKey ? (
                            <li key={item.titleKey} className="list-none">
                              <Link href={item.url}>
                                {t(item.titleKey as Parameters<typeof t>[0])}
                              </Link>
                            </li>
                          ) : null
                        )}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
          <section className="flex-shrink-0 px-4 max-md:px-0 max-md:hidden">
            <h3 className="text-base font-medium py-5">{t("contact")}</h3>
            <div className="flex flex-col mt-5 gap-2">
              <Link
                className="w-fit text-gray"
                href="mailto:hola@silvestra.es"
              >
                hola@silvestra.es
              </Link>
            </div>
          </section>
        </div>
      </Container>
      <Container className="!py-8 border-t border-border max-md:border-none flex justify-between max-md:flex-col items-center max-md:gap-5 max-md:items-start">
        <div className="flex gap-5 max-md:flex-col max-md:items-start">
          <LanguageSwitcher className="pl-0" />
          <span className="self-center text-gray">{t("copyright")}</span>
        </div>
        <Image
          className="max-w-[350px]"
          src="/payment.avif"
          width={1080}
          height={200}
          alt="Payment methods"
        />
      </Container>
    </footer>
  );
}
