"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import EditQuantity from "./edit-quantity";
import { formatMoney } from "@/utils/formatters";
import { removeItem } from "./actions";
import type { CartLine } from "@/context/cart-context";

export interface CartDrawerLineItem extends CartLine {
  readonly merchandise: CartLine["merchandise"] & {
    readonly product: CartLine["merchandise"]["product"] & {
      readonly variants: Array<{
        readonly id: string;
        readonly image?: {
          readonly url: string;
          readonly altText?: string | null;
        } | null;
        readonly price: {
          readonly amount: string;
          readonly currencyCode: string;
        };
        readonly compareAtPrice?: {
          readonly amount: string;
          readonly currencyCode: string;
        } | null;
      }>;
    };
  };
}

interface Props {
  readonly item: CartDrawerLineItem;
  readonly updateCartItem: (variantId: string, quantity: number) => void;
}

export default function CartDrawerItem({
  item,
  updateCartItem,
}: Props): ReactNode {
  const t = useTranslations("Cart");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const isSingleProdct = item.merchandise.product.variants.length <= 1;

  const variant = item.merchandise.product.variants.find(
    (n) => n.id === item.merchandise.id
  );

  if (!variant) {
    return null;
  }

  if (!variant.image?.url) {
    return null;
  }

  return (
    <div className="border-b border-border pb-4 mb-4 flex gap-4">
      <div className="w-[70px] shrink-0">
        <Image
          className="aspect-square shrink-0 rounded-lg"
          src={variant.image.url}
          width={80}
          height={80}
          alt={variant.image.altText || "Product item"}
        />
      </div>
      <div className="flex flex-col gap-1 flex-grow">
        <h3 className="text-base">{item.merchandise.product.title}</h3>
        {!isSingleProdct && (
          <span className="text-gray font-medium text-sm">
            {item.merchandise.title}
          </span>
        )}

        {errorMsg && <span className="text-sm text-red-500">{errorMsg}</span>}

        <div className="flex gap-1">
          <span className="font-semibold text-base">
            {formatMoney(
              Number(variant.price.amount),
              variant.price.currencyCode
            )}
          </span>
          {variant.compareAtPrice &&
            Number(variant.compareAtPrice.amount) > 0 && (
              <span className="font-medium text-gray text-base line-through">
                {formatMoney(
                  Number(variant.compareAtPrice.amount),
                  variant.compareAtPrice.currencyCode
                )}
              </span>
            )}
        </div>
        <div className="flex justify-between">
          <EditQuantity
            item={item}
            updateCart={updateCartItem}
            setErrorMsg={(e: string | null) => setErrorMsg(e)}
          />
          <button
            type="button"
            className="cursor-pointer hover:opacity-70 flex items-center justify-center"
            aria-label={t("ariaLabels.deleteItem")}
            onClick={async () => {
              if (!item.id) {
                setErrorMsg(t("errors.missingItemId"));
                return;
              }
              updateCartItem(item.merchandise.id, 0);
              await removeItem(null, item.id);
            }}
          >
            <Image
              src="/icons/icon-trash.svg"
              width={22}
              height={22}
              alt=""
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
