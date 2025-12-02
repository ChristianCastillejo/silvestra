import settings from "../settings.json";

interface Settings {
  localizations: Array<{
    currency: string;
    locale: string;
    // Añade más campos si los usas
  }>;
}

const config = settings as Settings;

export const formatMoney = (amount: number, currencyCode: string): string => {
  const localization = config.localizations.find(
    (loc) => loc.currency === currencyCode
  );

  const locale = localization?.locale ?? "en-US";

  const options: Intl.NumberFormatOptions = {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };

  try {
    return new Intl.NumberFormat(locale, options).format(amount);
  } catch (error: unknown) {
    console.error(`formatMoney error: ${currencyCode}`, error);
    return `${amount}`;
  }
};

export const formatMenuUrl = (url: string): string => {
  if (url.startsWith("/")) return url;

  try {
    const urlObject = new URL(url);
    return urlObject.pathname;
  } catch {
    return url;
  }
};
