"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import DiscountBadge from "../discount-badge";
import ProductVariants from "./product-variants";
import { useProductContext } from "@/context/product-context";
import AddToCart from "./product-add-to-cart";
import { formatMoney } from "@/utils/formatters";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export default function ProductDetails(): React.JSX.Element {
  const t = useTranslations("Product");
  const { product, selectedVariant } = useProductContext();
  const isSingleProduct = product.variants.length <= 1;

  const careAndMaintenance = (
    <>
      <p>{t("careAndMaintenance.intro")}</p>
      <p>{t("careAndMaintenance.paragraph1")}</p>
      <p>{t("careAndMaintenance.paragraph2")}</p>
      <ul>
        <li>{t("careAndMaintenance.light")}</li>
        <li>{t("careAndMaintenance.water")}</li>
        <li>{t("careAndMaintenance.temperature")}</li>
      </ul>
      <p>
        {t("careAndMaintenance.guideText")}{" "}
        <Link href="/care" className="text-primary">
          {t("careAndMaintenance.guideLink")}
        </Link>
      </p>
    </>
  );

  const shippingAndReturn = (
    <>
      <p>{t("shippingAndReturn.intro")}</p>
      <p>{t("shippingAndReturn.paragraph1")}</p>
      <p>
        {t("shippingAndReturn.paragraph2")}{" "}
        <Link href="/care" className="text-primary">
          {t("shippingAndReturn.guaranteeLink")}
        </Link>
      </p>
    </>
  );

  return (
    <div>
      {product?.title && <h1 className="mb-4 text-2xl">{product.title}</h1>}
      <div className="flex gap-2 items-center">
        {selectedVariant?.price?.amount && (
          <span className="text-3xl font-semibold">
            {formatMoney(
              selectedVariant.price.amount,
              selectedVariant.price.currencyCode
            )}
          </span>
        )}
        {selectedVariant?.compareAtPrice?.amount &&
          Number(selectedVariant.compareAtPrice.amount) > 0 && (
            <>
              <span className="text-lg font-light text-gray line-through">
                {formatMoney(
                  selectedVariant.compareAtPrice.amount,
                  selectedVariant.price.currencyCode
                )}
              </span>
              <div className="ml-2">
                <DiscountBadge
                  price={selectedVariant.price.amount}
                  compareAtPrice={selectedVariant.compareAtPrice.amount}
                />
              </div>
            </>
          )}
      </div>
      {product?.shortDescription?.value && (
        <p className="my-5">{product?.shortDescription?.value}</p>
      )}
      {!isSingleProduct && <ProductVariants />}
      <AddToCart product={product} selectedVariant={selectedVariant} />
      <div className="mt-5">
        <Accordion type="single" collapsible defaultValue="description">
          <AccordionItem
            value="description"
            className="border-y border-border overflow-hidden transition-all duration-300"
          >
            <AccordionTrigger className="h-[60px] font-semibold">
              {t("accordion.description")}
            </AccordionTrigger>
            <AccordionContent>
              {product?.descriptionHtml && (
                <div
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="care"
            className="border-y border-border overflow-hidden transition-all duration-300"
          >
            <AccordionTrigger className="h-[60px] font-semibold">
              {t("accordion.careAndMaintenance")}
            </AccordionTrigger>
            <AccordionContent>{careAndMaintenance}</AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="shipping"
            className="border-y border-border overflow-hidden transition-all duration-300"
          >
            <AccordionTrigger className="h-[60px] font-semibold">
              {t("accordion.shippingAndReturn")}
            </AccordionTrigger>
            <AccordionContent>{shippingAndReturn}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
