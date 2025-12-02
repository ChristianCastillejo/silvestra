"use server";

import { TAGS } from "@/lib/shopify/constants";
import { revalidateTag } from "next/cache";
import {
  addToCart,
  removeFromCart,
  updateCart,
  createCart,
  type ReshapedCart,
} from "@/lib/shopify/index";
import { cookies } from "next/headers";
import { getCart } from "@/lib/shopify/index";
import { redirect } from "next/navigation";
import { CountryCode } from "@/gql/graphql";

export async function addItem(
  prevState: unknown,
  selectedVariantId: string | null | undefined,
  quantity: number = 1
): Promise<{ error?: string; cart?: ReshapedCart }> {
  let cartId = (await cookies()).get("cartId")?.value;
  if (!cartId || !selectedVariantId) {
    return { error: "Error adding item to cart" };
  }
  try {
    const updatedCart = await addToCart(cartId, [
      { merchandiseId: selectedVariantId, quantity },
    ]);

    // Revalidate the cart to ensure fresh data on next fetch
    revalidateTag(TAGS.cart);
    return { cart: updatedCart };
  } catch (e: unknown) {
    console.error("Error:", e);
    return { error: "Error adding item to cart" };
  }
}

interface UpdateItemQuantityPayload {
  readonly lineId: string;
  readonly quantity: number;
}

/**
 * Updates the quantity of an item in the cart.
 * Accepts lineId directly to avoid double-fetching the cart.
 */
export async function updateItemQuantity(
  prevState: unknown,
  payload: UpdateItemQuantityPayload
): Promise<string | undefined> {
  let cartId = (await cookies()).get("cartId")?.value;

  if (!cartId) {
    return "Missing cart ID";
  }

  const { lineId, quantity } = payload;

  try {
    if (quantity === 0) {
      await removeFromCart(cartId, [lineId]);
    } else {
      await updateCart(cartId, [
        {
          id: lineId,
          quantity,
        },
      ]);
    }

    revalidateTag(TAGS.cart);
  } catch (e: unknown) {
    console.error(e);
    return "Error updating item quantity";
  }
}

/**
 * Removes an item from the cart.
 * Accepts lineId directly to avoid double-fetching the cart.
 */
export async function removeItem(
  prevState: unknown,
  lineId: string
): Promise<string | undefined> {
  let cartId = (await cookies()).get("cartId")?.value;

  if (!cartId) {
    return "Missing cart ID";
  }

  if (!lineId) {
    return "Missing line ID";
  }

  try {
    await removeFromCart(cartId, [lineId]);
    revalidateTag(TAGS.cart);
  } catch (e: unknown) {
    console.error(e);
    return "Error removing item from cart";
  }
}

export async function redirectToCheckout(): Promise<never> {
  const cartId = (await cookies()).get("cartId")?.value;
  const cart = await getCart(cartId, CountryCode.Us);

  if (!cart) {
    throw new Error("Cart not found");
  }

  redirect(cart.checkoutUrl);
}

export async function createCartAndSetCookie(): Promise<void> {
  const cart = await createCart();
  (await cookies()).set("cartId", cart.id);
}
