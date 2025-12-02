"use client";

import { useProductContext } from "@/context/product-context";
import { useUpdateURL } from "@/utils/helper";
import settings from "../../settings.json";

interface SelectedOptions {
  readonly [optionName: string]: string;
}

export default function ProductVariants(): React.JSX.Element {
  const { product, selectedOptions, handleOptionChange } = useProductContext();
  const updateURL = useUpdateURL();

  const handleOptionClick = (optionName: string, value: string): void => {
    handleOptionChange(optionName, value);
    updateURL({ ...selectedOptions, [optionName]: value });
  };

  const isVariantAvailable = (optionName: string, value: string): boolean => {
    return product.variants.some((variant) => {
      if (!variant || !variant.availableForSale) return false;

      return product.options.every((option) => {
        const selectedValue =
          option.name === optionName ? value : selectedOptions[option.name];
        return variant.selectedOptions.some(
          (selectedOption) =>
            selectedOption.name === option.name &&
            selectedOption.value === selectedValue
        );
      });
    });
  };

  const renderOptions = (): React.JSX.Element[] => {
    const colorMap: Record<string, string> = settings.colorSwatches as Record<
      string,
      string
    >;

    return product.options.map((option) => (
      <div key={option.name} className="mb-5">
        <div className="variant-option-group__title text-lg font-medium mb-2">
          {option.name}
        </div>
        <fieldset className="flex gap-4 flex-wrap">
          {option.values.map((value) => {
            const isAvailable = isVariantAvailable(option.name, value);
            const isSelected = selectedOptions[option.name] === value;

            if (option.name === "Color") {
              const colorHex: string = colorMap[value] || "#ccc";

              return (
                <label
                  key={value}
                  className={`cursor-pointer product__item-option relative option option-color w-9 h-9 rounded-full block outline outline-1 outline-offset-[3px] outline-border ${
                    !isAvailable ? "not-available" : ""
                  } ${isSelected ? "!outline-black" : ""}`}
                  style={{ backgroundColor: colorHex }}
                >
                  <input
                    type="radio"
                    name={option.name}
                    value={value}
                    checked={isSelected}
                    onChange={() => handleOptionClick(option.name, value)}
                    className="hidden"
                    disabled={!isAvailable}
                  />
                </label>
              );
            } else {
              return (
                <label
                  key={value}
                  htmlFor={`${option.name}-${value}`}
                  className={`product__item-option cursor-pointer relative option option-button border border-border py-3 px-5 rounded-md text-sm font-medium ${
                    !isAvailable ? "not-available text-border" : ""
                  } ${isSelected ? "bg-black text-white" : ""}`}
                >
                  <input
                    type="radio"
                    name={option.name}
                    id={`${option.name}-${value}`}
                    value={value}
                    checked={isSelected}
                    onChange={() => handleOptionClick(option.name, value)}
                    className="hidden"
                    disabled={!isAvailable}
                  />
                  {value}
                </label>
              );
            }
          })}
        </fieldset>
      </div>
    ));
  };

  return (
    <div className="product-details__variants mt-5 flex flex-col">
      {renderOptions()}
    </div>
  );
}
