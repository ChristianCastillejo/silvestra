import { getTranslations } from "next-intl/server";
import Newsletter from "@/components/newsletter";
import { Container } from "@/components/ui/container";

export default async function NewsletterSection(): Promise<React.JSX.Element> {
  const t = await getTranslations(
    "NewsletterSection" as unknown as Parameters<typeof getTranslations>[0]
  );

  return (
    <Container as="section" size="full">
      <Container size="full" className="bg-secondary !py-20 rounded-xl !mt-[80px]">
        <h2 className="text-center text-white text-3xl max-md:text-2xl mb-5">
          {t("title")}
        </h2>
        <p className="text-center text-grayLight max-w-[500px] mx-auto">
          {t("description")}
        </p>
        <div className="max-w-[450px] mx-auto">
          <Newsletter className="flex justify-center [&_.success-msg]:!text-white [&_input]:!text-white [&_input]:!bg-transparent [&_input]:!border-grayLight [&_button]:!bg-white [&_button]:!text-black [&_button]:!border-white" />
        </div>
      </Container>
    </Container>
  );
}
