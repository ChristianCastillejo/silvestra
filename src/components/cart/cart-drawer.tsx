"use client";

import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import CartDrawerItem, { type CartDrawerLineItem } from "./cart-drawer-item";
import { redirectToCheckout, createCartAndSetCookie } from "./actions";
import { useFormStatus } from "react-dom";
import { formatMoney } from "@/utils/formatters";
import { trackInitiateCheckout } from "@/lib/pixels/facebook-pixel";
import { Button } from "../ui/button";
import { cn } from "@/utils/cn";
import { Sheet, SheetContent, SheetTitle, SheetClose } from "../ui/sheet";

export default function CartDrawer(): ReactNode {
  const t = useTranslations("Cart");
  const { cart, updateCartItem } = useCart();
  const quantityRef = useRef<number | undefined>(cart?.totalQuantity);

  const [isOpen, setIsOpen] = useState(false);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (!cart?.id) {
      createCartAndSetCookie();
    }
  }, [cart?.id]);

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0 &&
      !isOpen
    ) {
      setIsOpen(true);
    }
    quantityRef.current = cart?.totalQuantity;
  }, [cart?.totalQuantity, isOpen]);

  const handleRedirectToCheckout = (): void => {
    trackInitiateCheckout(cart.cost.subtotalAmount);
    redirectToCheckout();
  };

  return (
    <>
      <button
        type="button"
        className="relative"
        onClick={openCart}
        aria-label="Open shopping cart"
      >
        <Image
          className="cursor-pointer"
          src="/icons/icon-cart.svg"
          width={32}
          height={32}
          alt=""
          aria-hidden="true"
        />
        <div className="absolute h-[18px] w-[18px] top-0 right-[-5px] text-xs flex justify-center items-center bg-black text-white rounded-full">
          {cart?.totalQuantity}
        </div>
      </button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="flex flex-col p-0">
          <div className="py-4 px-8 border-b border-border flex justify-between items-center">
            <SheetTitle className="text-lg font-semibold">
              {t("title")}
            </SheetTitle>
            <SheetClose asChild>
              <button
                type="button"
                className="cursor-pointer hover:opacity-70 flex items-center justify-center"
                aria-label={t("ariaLabels.closeCart")}
              >
                <Image
                  src="/icons/icon-close.svg"
                  width={28}
                  height={28}
                  alt=""
                  aria-hidden="true"
                />
              </button>
            </SheetClose>
          </div>

          {!cart || cart.lines.length === 0 ? (
            <div className="p-8 flex-grow flex justify-center flex-col items-center">
              <span className="text-xl font-medium">
                {t("emptyCart")}
              </span>
              <Button
                type="button"
                variant="fill"
                className={cn("mt-5 !w-fit")}
                onClick={(e) => {
                  e.stopPropagation();
                  closeCart();
                }}
              >
                {t("continueShopping")}
              </Button>
            </div>
          ) : (
            <>
              <div className="p-8 flex-grow flex flex-col overflow-y-auto">
                {cart.lines.map((item) => (
                  <CartDrawerItem
                    key={item.id || item.merchandise.id}
                    item={item as CartDrawerLineItem}
                    updateCartItem={updateCartItem}
                  />
                ))}
              </div>
              <div className="bg-bg-gray border-t border-border p-[30px]">
                <div className="flex justify-between font-medium text-lg">
                  <div>{t("subtotal")}</div>
                  <div>
                    {formatMoney(
                      cart.cost.subtotalAmount.amount,
                      cart.cost.subtotalAmount.currencyCode
                    )}
                  </div>
                </div>
                <p className="text-sm mb-5">{t("shippingNote")}</p>
                <form action={handleRedirectToCheckout}>
                  <CheckoutButton />
                </form>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

function CheckoutButton(): ReactNode {
  const t = useTranslations("Cart");
  const { pending } = useFormStatus();

  return (
    <Button variant="fill" type="submit" isLoading={pending}>
      {t("checkout")}
    </Button>
  );
}
