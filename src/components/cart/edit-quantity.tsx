"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { updateItemQuantity } from "./actions";
import { useTransition } from "react";
import type { CartLine } from "@/context/cart-context";

interface Props {
  readonly item: CartLine;
  readonly updateCart: (variantId: string, quantity: number) => void;
  readonly setErrorMsg: (error: string | null) => void;
}

export default function EditQuantity({ item, updateCart, setErrorMsg }: Props) {
  const t = useTranslations("Cart");
  const translate = (key: string) => t(key as Parameters<typeof t>[0]);
  const merchandiseId = item.merchandise.id;
  const quantity = item.quantity;
  const quantityAvailable = item.merchandise.quantityAvailable || 0;
  const [isPending, startTransition] = useTransition();

  const handleUpdateQuantity = async (newQuantity: number): Promise<void> => {
    if (!item.id) {
      setErrorMsg(translate("errors.missingItemId"));
      return;
    }

    if (newQuantity > quantityAvailable) {
      setErrorMsg(
        translate("errors.maxQuantity", {
          quantity: quantityAvailable,
          productTitle: item.merchandise.product.title,
          variantTitle: item.merchandise.title,
        } as Record<string, string | number>)
      );
      return;
    }

    if (newQuantity < 1) {
      return;
    }

    startTransition(async () => {
      try {
        updateCart(merchandiseId, newQuantity);
        const result = await updateItemQuantity(null, {
          lineId: item.id!,
          quantity: newQuantity,
        });

        if (result) {
          setErrorMsg(result);
        } else {
          setErrorMsg(null);
        }
      } catch (error: unknown) {
        console.error("Error updating quantity:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Unexpected error occurred. Please try again.";
        setErrorMsg(errorMessage);
      }
    });
  };

  const isLoading = isPending;
  const isMinReached = quantity <= 1;
  const isMaxReached = quantity >= quantityAvailable;

  return (
    <div className="flex gap-1 flex-row items-center rounded-full py-2 px-4 border bg-bg-gray border-border">
      <button
        type="button"
        disabled={isLoading || isMinReached}
        className={`flex items-center justify-center ${
          isLoading || isMinReached
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:opacity-70"
        }`}
        aria-label={translate("ariaLabels.decreaseQuantity")}
        onClick={() => {
          if (!isLoading && !isMinReached) {
            handleUpdateQuantity(quantity - 1);
          }
        }}
      >
        <Image
          src="/icons/icon-minus.svg"
          width={22}
          height={22}
          alt=""
          aria-hidden="true"
        />
      </button>
      <p className="w-6 text-center m-0">
        <span className="w-full text-sm">{quantity}</span>
      </p>
      <button
        type="button"
        disabled={isLoading || isMaxReached}
        className={`flex items-center justify-center ${
          isLoading || isMaxReached
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:opacity-70"
        }`}
        aria-label={translate("ariaLabels.increaseQuantity")}
        onClick={() => {
          if (!isLoading && !isMaxReached) {
            handleUpdateQuantity(quantity + 1);
          }
        }}
      >
        <Image
          src="/icons/icon-plus.svg"
          width={22}
          height={22}
          alt=""
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
