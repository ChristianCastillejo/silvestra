"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
  use,
} from "react";
import type { ReactNode } from "react";
import type { MoneyV2, SelectedOption, ProductFragment } from "@/gql/graphql";
import { CurrencyCode } from "@/gql/graphql";
import { trackAddToCart } from "@/lib/pixels/facebook-pixel";

type ReadonlyMoneyV2 = Readonly<MoneyV2>;

interface CartCost {
  readonly subtotalAmount: ReadonlyMoneyV2;
  readonly totalAmount: ReadonlyMoneyV2;
  readonly totalTaxAmount: ReadonlyMoneyV2;
}

type CartProduct = Pick<ProductFragment, "id" | "title">;

interface Variant {
  readonly id: string;
  readonly title: string;
  readonly price: ReadonlyMoneyV2;
  readonly selectedOptions: readonly Readonly<SelectedOption>[];
  readonly quantityAvailable?: number | null;
}

export interface CartLine {
  readonly id?: string;
  readonly quantity: number;
  readonly cost: {
    readonly totalAmount: ReadonlyMoneyV2;
  };
  readonly merchandise: {
    readonly id: string;
    readonly title: string;
    readonly selectedOptions: readonly Readonly<SelectedOption>[];
    readonly quantityAvailable?: number | null;
    readonly product: CartProduct;
  };
}

interface CartState {
  readonly id?: string;
  readonly checkoutUrl: string;
  readonly totalQuantity: number;
  readonly lines: readonly CartLine[];
  readonly cost: CartCost;
}

interface AddItemPayload {
  readonly variant: Variant;
  readonly product: CartProduct;
  readonly quantity: number;
}

interface UpdateItemPayload {
  readonly variantId: string;
  readonly quantity: number;
}

type CartAction =
  | { readonly type: "ADD_ITEM"; readonly payload: AddItemPayload }
  | { readonly type: "UPDATE_ITEM"; readonly payload: UpdateItemPayload }
  | { readonly type: "SET_CART"; readonly payload: CartState };

interface CartContextValue {
  readonly cart: CartState;
  readonly addCartItem: (params: AddItemPayload) => void;
  readonly updateCartItem: (variantId: string, quantity: number) => void;
  readonly setCart: (cart: CartState) => void;
}

interface CartProviderProps {
  readonly children: ReactNode;
  readonly cartPromise: Promise<CartState | null | undefined>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

function createEmptyCart(): CartState {
  return {
    id: undefined,
    checkoutUrl: "",
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: "0", currencyCode: CurrencyCode.Usd },
      totalAmount: { amount: "0", currencyCode: CurrencyCode.Usd },
      totalTaxAmount: { amount: "0", currencyCode: CurrencyCode.Usd },
    },
  };
}

function calculateItemCost(quantity: number, price: string): string {
  return (Number(price) * quantity).toString();
}

function updateCartTotals(
  lines: readonly CartLine[]
): Pick<CartState, "totalQuantity" | "cost"> {
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = lines.reduce(
    (sum, item) => sum + Number(item.cost.totalAmount.amount),
    0
  );
  const currencyCode =
    lines[0]?.cost.totalAmount.currencyCode ?? CurrencyCode.Usd;

  return {
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode },
      totalAmount: { amount: totalAmount.toString(), currencyCode },
      totalTaxAmount: { amount: "0", currencyCode },
    },
  };
}

function createOrUpdateCartItem(
  existingItem: CartLine | undefined,
  variant: Variant,
  product: CartProduct,
  quantity: number
): CartLine {
  const totalAmount = calculateItemCost(quantity, variant.price.amount);

  return {
    id: existingItem?.id,
    quantity,
    cost: {
      totalAmount: {
        amount: totalAmount,
        currencyCode: variant.price.currencyCode,
      },
    },
    merchandise: {
      id: variant.id,
      title: variant.title,
      selectedOptions: variant.selectedOptions,
      quantityAvailable: variant.quantityAvailable,
      product: {
        ...product,
      },
    },
  };
}

function cartReducer(
  cartState: CartState | null | undefined,
  action: CartAction
): CartState {
  const currentCart = cartState ?? createEmptyCart();

  switch (action.type) {
    case "ADD_ITEM": {
      const { variant, product, quantity } = action.payload;
      const existingItem = currentCart.lines.find(
        (item) => item.merchandise.id === variant.id
      );

      const updatedItem = createOrUpdateCartItem(
        existingItem,
        variant,
        product,
        quantity
      );

      const updatedLines: readonly CartLine[] = existingItem
        ? currentCart.lines.map((item) =>
            item.merchandise.id === variant.id
              ? {
                  ...item,
                  quantity: quantity,
                  cost: {
                    ...item.cost,
                    totalAmount: {
                      amount: calculateItemCost(
                        item.quantity + quantity,
                        variant.price.amount
                      ),
                      currencyCode: item.cost.totalAmount.currencyCode,
                    },
                  },
                }
              : item
          )
        : [...currentCart.lines, updatedItem];

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }

    case "UPDATE_ITEM": {
      const { variantId, quantity } = action.payload;

      const updatedLines: readonly CartLine[] = currentCart.lines
        .map((line): CartLine | null => {
          if (line.merchandise.id !== variantId) return line;

          if (quantity <= 0) {
            return null;
          }

          const singleItemAmount =
            Number(line.cost.totalAmount.amount) / line.quantity;
          const newTotalAmount = calculateItemCost(
            quantity,
            singleItemAmount.toString()
          );

          return {
            ...line,
            quantity,
            cost: {
              ...line.cost,
              totalAmount: {
                amount: newTotalAmount,
                currencyCode: line.cost.totalAmount.currencyCode,
              },
            },
          };
        })
        .filter((line): line is CartLine => line !== null);

      if (updatedLines.length === 0) {
        return createEmptyCart();
      }

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }

    case "SET_CART": {
      return action.payload;
    }

    default:
      return currentCart;
  }
}

export function CartProvider({
  children,
  cartPromise,
}: CartProviderProps): React.JSX.Element {
  const initialCart = use(cartPromise);
  const [state, dispatch] = useReducer(
    cartReducer,
    initialCart ?? createEmptyCart()
  );

  const addCartItem = useCallback(
    ({ variant, product, quantity = 1 }: AddItemPayload): void => {
      dispatch({ type: "ADD_ITEM", payload: { variant, product, quantity } });
      const baseProduct = {
        id: product.id,
        name: product.title,
        price: variant.price.amount,
        currency: variant.price.currencyCode,
      };
      trackAddToCart(baseProduct, quantity);
    },
    []
  );

  const updateCartItem = useCallback(
    (variantId: string, quantity: number): void => {
      dispatch({ type: "UPDATE_ITEM", payload: { variantId, quantity } });
    },
    []
  );

  const setCart = useCallback((cart: CartState): void => {
    dispatch({ type: "SET_CART", payload: cart });
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      cart: state,
      addCartItem,
      updateCartItem,
      setCart,
    }),
    [state, addCartItem, updateCartItem, setCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
