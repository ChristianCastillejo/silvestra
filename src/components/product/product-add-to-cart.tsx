"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useCart } from "@/context/cart-context";
import { addItem } from "../cart/actions";
import type { ReshapedProduct } from "@/lib/shopify/index";
import type { ProductFragment } from "@/gql/graphql";

interface Props {
  product: ReshapedProduct;
  selectedVariant: NonNullable<
    ProductFragment["variants"]["edges"][number]["node"]
  > | null;
}

export default function AddToCart({
  product,
  selectedVariant,
}: Props): React.JSX.Element {
  const t = useTranslations("Product");
  const router = useRouter();
  const { addCartItem, cart, setCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const quantityAvailable: number = selectedVariant?.quantityAvailable ?? 0;
  const isAvailableForSale: boolean =
    selectedVariant?.availableForSale ?? false;

  const incrementQuantity = (): void => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = (): void => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = Number.parseInt(e.target.value, 10);
    if (!Number.isNaN(value) && value >= 1) {
      setQuantity(value);
    } else {
      setQuantity(1);
    }
  };

  const handleAddToCart = async (): Promise<void> => {
    if (!selectedVariant || !isAvailableForSale) {
      toast.error(t("errors.variantNotAvailable"));
      return;
    }

    setLoading(true);

    const existingCartItem = cart?.lines?.find(
      (line) => line.merchandise.id === selectedVariant.id
    );

    const currentQuantityInCart: number = existingCartItem
      ? existingCartItem.quantity
      : 0;

    if (currentQuantityInCart + quantity > quantityAvailable) {
      toast.error(
        t("errors.maxQuantity", {
          quantity: quantityAvailable,
          productTitle: product.title,
          variantTitle: selectedVariant.title,
        })
      );
      setLoading(false);
      return;
    }

    try {
      const result = await addItem(null, selectedVariant.id, quantity);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.cart) {
        setCart(result.cart);
      } else {
        addCartItem({
          product,
          variant: selectedVariant,
          quantity: currentQuantityInCart + quantity,
        });
        router.refresh();
      }
    } catch (error: unknown) {
      console.error("Error adding to cart:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("errors.unexpectedError");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-2 mt-10">
        <div className="flex gap-1 flex-row items-center rounded-full py-2 px-4 border bg-bg-gray border-border">
          <button
            type="button"
            aria-label={t("ariaLabels.decreaseQuantity")}
            onClick={decrementQuantity}
          >
            <Image
              className="cursor-pointer"
              src="/icons/icon-minus.svg"
              width={22}
              height={22}
              alt="Minus"
            />
          </button>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-6 text-center border-none outline-none bg-transparent text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            min="1"
          />
          <button
            type="button"
            aria-label={t("ariaLabels.increaseQuantity")}
            onClick={incrementQuantity}
          >
            <Image
              className="cursor-pointer"
              src="/icons/icon-plus.svg"
              width={22}
              height={22}
              alt="Plus"
            />
          </button>
        </div>

        <button
          className={`btn fill ${loading && "loading"} !w-fit !px-14`}
          onClick={handleAddToCart}
          disabled={!selectedVariant || !isAvailableForSale || loading}
        >
          {t("addToCart")}
        </button>
      </div>
    </>
  );
}
