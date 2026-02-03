"use client";

import Image from "next/image";
import { formatMoney } from "@/utils/formatters";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { toast } from "sonner";
import { useCart } from "@/context/cart-context";
import { addItem } from "../cart/actions";
import DiscountBadge from "../discount-badge";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { cn } from "@/utils/cn";
import { Card as UICard, CardHeader, CardContent, CardBadge } from "../ui/card";
import type { ReshapedImage, ReshapedProduct } from "@/lib/shopify/index";

interface Props {
  readonly product: ReshapedProduct;
}

export default function ProductCard({ product }: Props) {
  if (!product || !product.images || product.images.length === 0) {
    return null;
  }

  const t = useTranslations("Card");
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [loading, setLoading] = useState(false);
  const { addCartItem, cart, setCart } = useCart();
  const variant = product.variants?.[0];

  if (!variant) {
    return null;
  }

  const imageHeight = selectedImage.height ?? 800;
  const imageWidth = selectedImage.width ?? 800;

  const isOnSale =
    Number(variant?.compareAtPrice?.amount) > Number(variant.price.amount);

  const handleAddToCart = async () => {
    setLoading(true);
    const quantity = 1;

    const quantityAvailable = variant.quantityAvailable || 0;
    const existingCartItem = cart?.lines?.find(
      (line) => line.merchandise.id === variant.id
    );

    const currentQuantityInCart = existingCartItem
      ? existingCartItem.quantity
      : 0;

    if (currentQuantityInCart + quantity > quantityAvailable) {
      const maxQuantityMessage = t("errors.maxQuantity", {
        quantity: quantityAvailable,
        productTitle: product.title,
        variantTitle: variant.title,
      });
      toast.error(maxQuantityMessage);
      setLoading(false);
      return;
    }

    try {
      const result = await addItem(null, variant.id, quantity);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.cart) {
        setCart(result.cart);
      } else {
        addCartItem({
          product,
          variant: variant,
          quantity: currentQuantityInCart + quantity,
        });
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
    <UICard>
      <CardHeader className="!w-full h-auto">
        <Link href={`/products/${product.handle}`}>
          <Image
            className="w-full group-hover:scale-110 transition-cubic"
            height={imageHeight}
            width={imageWidth}
            src={selectedImage.url}
            alt={selectedImage.altText ?? product.title}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </Link>

        {!product.availableForSale && (
          <CardBadge position="topRight">
            <Badge variant="secondary">{t("outOfStock")}</Badge>
          </CardBadge>
        )}

        {isOnSale && product.availableForSale && (
          <CardBadge position="topLeft">
            <DiscountBadge
              price={variant.price.amount}
              compareAtPrice={variant?.compareAtPrice?.amount}
            />
          </CardBadge>
        )}

        {product.availableForSale && (
          <div className="max-md:hidden">
            {product.variants.length > 1 ? (
              <Button
                asChild
                className={cn(
                  "!absolute !w-[calc(100%-2rem)] bottom-0 left-[1rem] opacity-0 group-hover:bottom-[1rem] group-hover:opacity-100 transition-ease"
                )}
              >
                <Link href={`/products/${product.handle}`}>
                  {t("selectVariant")}
                </Link>
              </Button>
            ) : (
              <Button
                type="button"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  event.preventDefault();
                  handleAddToCart();
                }}
                isLoading={loading}
                className={cn(
                  "!absolute !w-[calc(100%-2rem)] bottom-0 left-[1rem] opacity-0 group-hover:bottom-[1rem] group-hover:opacity-100 transition-ease focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                )}
                aria-label={t("addToCartAriaLabel")}
              >
                {t("addToCart")}
              </Button>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <h3 className="text-lg text-center">{product.title}</h3>
        <div className="flex gap-1 justify-center">
          <span className="font-semibold text-base">
            {formatMoney(
              variant?.price?.amount,
              product.priceRange.minVariantPrice.currencyCode
            )}
          </span>
          {isOnSale && (
            <span className="font-medium text-gray text-base line-through">
              {formatMoney(
                variant?.compareAtPrice?.amount,
                product.priceRange.maxVariantPrice.currencyCode
              )}
            </span>
          )}
        </div>
        {product.images && product.images.length > 0 && (
          <div className="flex gap-3 mt-2 justify-center max-md:hidden">
            {product.images.map((img: ReshapedImage, i: number) => (
              <button
                type="button"
                className="cursor-pointer rounded-full overflow-hidden w-6 h-6 outline outline-1 outline-border outline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                key={img.url}
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  event.preventDefault();
                  setSelectedImage(img);
                }}
                aria-label={`Select image ${i + 1} of ${product.images.length}`}
              >
                <Image
                  className="w-full"
                  height={128}
                  width={128}
                  src={img.url}
                  alt={img.altText}
                />
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </UICard>
  );
}
