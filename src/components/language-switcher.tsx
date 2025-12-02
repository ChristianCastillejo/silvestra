"use client";

import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/routing";
import settings from "../settings.json";
import { routing } from "@/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn } from "@/utils/cn";

interface Localization {
  readonly country: string;
  readonly countryCode: string;
  readonly currency: string;
  readonly prefix: string;
  readonly locale: string;
}

interface Props {
  readonly className?: string;
}

function extractLanguageFromLocale(locale: string): string {
  const language = locale.split("-")[0];
  const locales = routing.locales as readonly string[];
  return locales.includes(language) ? language : routing.defaultLocale;
}

function getLanguageDisplayName(locale: string, country: string): string {
  const language = extractLanguageFromLocale(locale);
  const languageNames: Record<string, string> = {
    en: "English",
    es: "Español",
  };
  return languageNames[language] || country;
}

function getLanguageFlag(locale: string): string {
  const language = extractLanguageFromLocale(locale);
  const flags: Record<string, string> = {
    en: "🇬🇧",
    es: "🇪🇸",
  };
  return flags[language] || "🌐";
}

export default function LanguageSwitcher({ className }: Props) {
  const currentLocale = useLocale();
  const pathname = usePathname();

  const availableLocalizations = settings.localizations
    .filter((locale: Localization) => {
      const language = extractLanguageFromLocale(locale.locale);
      return routing.locales.includes(language as any);
    })
    .map((locale: Localization) => ({
      ...locale,
      languageCode: extractLanguageFromLocale(locale.locale),
    }));

  const handleLanguageChange = (newLocale: string) => {
    window.location.href = `/${newLocale}${pathname}`;
  };

  return (
    <Select defaultValue={currentLocale} onValueChange={handleLanguageChange}>
      <SelectTrigger
        className={cn(
          "w-auto gap-2 bg-transparent border-none shadow-none h-auto pl-0 focus:ring-0 px-0",
          className
        )}
      >
        <SelectValue aria-label={currentLocale} />
      </SelectTrigger>
      <SelectContent side="top" align="start">
        {availableLocalizations.map(
          (locale: Localization & { languageCode: string }) => (
            <SelectItem key={locale.languageCode} value={locale.languageCode}>
              <span className="flex items-center gap-2">
                <span className="text-lg leading-none">
                  {getLanguageFlag(locale.locale)}
                </span>
                <span>
                  {getLanguageDisplayName(locale.locale, locale.country)}
                </span>
              </span>
            </SelectItem>
          )
        )}
      </SelectContent>
    </Select>
  );
}
