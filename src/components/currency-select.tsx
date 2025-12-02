"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import SelectDropdown from "./select-dropdown";
import settings from "../settings.json";
import { setCookie } from "@/utils/cookies";

interface Localization {
  readonly country: string;
  readonly countryCode: string;
  readonly currency: string;
  readonly prefix: string;
  readonly locale: string;
}

interface Props {
  readonly currencyCookie?: string;
  readonly className?: string;
}

export default function CurrencySelect({ currencyCookie, className }: Props) {
  const t = useTranslations("CurrencySelect");
  const translate = (key: string, values?: Record<string, string | number>) =>
    values
      ? (t(key as Parameters<typeof t>[0], values) as string)
      : (t(key as Parameters<typeof t>[0]) as string);

  const currency: Localization =
    settings.localizations.find(
      (locale: Localization) => locale.countryCode === currencyCookie
    ) ||
    settings.localizations.find(
      (locale: Localization) => locale.countryCode === settings.defaultCurrency
    ) ||
    settings.localizations[0];

  useEffect(() => {
    if (!currencyCookie) {
      setCookie("currency", settings.defaultCurrency).catch(
        (error: unknown) => {
          console.error("Failed to set default currency cookie:", error);
        }
      );
    }
  }, [currencyCookie]);

  const handleChangeCurrency = (value: string): void => {
    setCookie("currency", value)
      .then(() => {
        window.location.reload();
      })
      .catch((error: unknown) => {
        console.error("Failed to set currency cookie:", error);
      });
  };

  return (
    <SelectDropdown
      direction="up"
      text={`${currency.country} (${currency.currency} ${currency.prefix})`}
      className={className}
    >
      {settings.localizations.map((locale: Localization) => (
        <button
          type="button"
          key={locale.countryCode}
          className="block px-8 py-2 text-nowrap text-left cursor-pointer w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 hover:bg-gray-50"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            handleChangeCurrency(locale.countryCode);
          }}
          aria-label={translate("ariaLabels.selectCurrency", {
            country: locale.country,
            currency: locale.currency,
            prefix: locale.prefix,
          } as Record<string, string | number>)}
        >
          {`${locale.country} (${locale.currency} ${locale.prefix})`}
        </button>
      ))}
    </SelectDropdown>
  );
}
