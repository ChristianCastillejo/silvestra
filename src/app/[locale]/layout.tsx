import { Playfair_Display, Instrument_Sans } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Toaster } from "sonner";
import "@/style/theme.css";
import "@/style/global.scss";
import { CartProvider } from "@/context/cart-context";
import { CookieBanner } from "@/components/cookie-banner";
import { cookies } from "next/headers";
import { getCart } from "../../lib/shopify/index";
import Header from "@/components/layout/header";
import { getMenu } from "../../lib/shopify/index";
import Footer from "@/components/layout/footer";
import FacebookPixel from "@/components/pixels/facebook-pixel";
import settings from "@/settings.json";
import { CountryCode } from "@/gql/graphql";
import { routing, isValidLocale } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  style: ["normal"],
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: "Layout" });

  return {
    title: {
      default: t("metadata.title"),
      template: t("metadata.titleTemplate"),
    },
    description: t("metadata.description"),
    openGraph: {
      type: "website",
      locale: locale,
      siteName: t("metadata.siteName"),
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

interface LocaleLayoutProps {
  readonly children: ReactNode;
  readonly params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    return null;
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const cartId = (await cookies()).get("cartId")?.value;
  const currency =
    (await cookies()).get("currency")?.value || settings.defaultCurrency;
  const cart = getCart(cartId, currency as CountryCode);
  const menu = await getMenu(settings.components.header.menu);

  return (
    <html lang={locale}>
      <body
        className={`${instrumentSans.variable} ${playfair.variable} ${instrumentSans.className} antialiased mt-[70px]`}
      >
        <NextIntlClientProvider messages={messages}>
          <CartProvider cartPromise={cart}>
            <FacebookPixel />
            <Header menu={menu} />
            {children}
            <Footer />
            <CookieBanner />
          </CartProvider>
        </NextIntlClientProvider>
        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={3000}
          offset="80px"
        />
      </body>
    </html>
  );
}
