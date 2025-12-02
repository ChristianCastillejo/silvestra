"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import type { ProductFragment } from "@/gql/graphql";
import type { ReshapedProduct } from "@/lib/shopify/index";

type ProductVariant = Readonly<
  ProductFragment["variants"]["edges"][number]["node"]
> | null;

interface SelectedOptions {
  [optionName: string]: string;
}

interface ProductContextValue {
  readonly product: ReshapedProduct;
  readonly selectedVariant: ProductVariant;
  readonly selectedOptions: SelectedOptions;
  readonly handleOptionChange: (optionName: string, value: string) => void;
  readonly selectedImageIndex: number;
}

interface ProductProviderProps {
  readonly children: ReactNode;
  readonly product: ReshapedProduct;
  readonly initialOptions?: Readonly<Partial<SelectedOptions>>;
}

const ProductContext = createContext<ProductContextValue | undefined>(
  undefined
);

export function useProductContext(): ProductContextValue {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
}

export function ProductProvider({
  children,
  product,
  initialOptions = {},
}: ProductProviderProps): React.JSX.Element {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>(
    () => {
      if (!product.options) return {};

      return product.options.reduce<SelectedOptions>((acc, option) => {
        acc[option.name] =
          initialOptions[option.name] ?? option.values[0] ?? "";
        return acc;
      }, {});
    }
  );

  const findVariantIndex = (currentOptions: SelectedOptions): number => {
    if (!product.variants) return -1;

    return product.variants.findIndex((variant) => {
      if (!variant) return false;

      return variant.selectedOptions.every(
        (option) => currentOptions[option.name] === option.value
      );
    });
  };

  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(() =>
    findVariantIndex(selectedOptions)
  );

  const handleOptionChange = useCallback(
    (optionName: string, value: string): void => {
      const newSelectedOptions: SelectedOptions = {
        ...selectedOptions,
        [optionName]: value,
      };

      setSelectedOptions(newSelectedOptions);

      const matchedVariantIndex = findVariantIndex(newSelectedOptions);

      setSelectedVariantIndex(matchedVariantIndex);
    },
    [selectedOptions, product.variants]
  );

  const selectedVariant =
    selectedVariantIndex >= 0 &&
    product.variants &&
    product.variants[selectedVariantIndex]
      ? product.variants[selectedVariantIndex]
      : null;

  const selectedImageIndex = useMemo(() => {
    if (!selectedVariant?.image?.url || !product.images) return 0;

    const index = product.images.findIndex(
      (img) => img.url === selectedVariant.image?.url
    );
    return index === -1 ? 0 : index;
  }, [selectedVariant, product.images]);

  const value = useMemo<ProductContextValue>(
    () => ({
      product,
      selectedVariant,
      selectedOptions,
      handleOptionChange,
      selectedImageIndex,
    }),
    [
      product,
      selectedVariant,
      selectedOptions,
      handleOptionChange,
      selectedImageIndex,
    ]
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}
