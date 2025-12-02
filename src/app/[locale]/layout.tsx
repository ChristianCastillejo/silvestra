import { Playfair_Display, Instrument_Sans } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
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
import { routing } from "@/i18n/routing";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  style: ["normal"],
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations(
    "Layout" as unknown as Parameters<typeof getTranslations>[0]
  );
  const translate = (key: string): string =>
    t(key as unknown as Parameters<typeof t>[0]) as string;

  return {
    title: {
      default: translate("metadata.title"),
      template: translate("metadata.titleTemplate"),
    },
    description: translate("metadata.description"),
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: translate("metadata.siteName"),
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

  if (!routing.locales.includes(locale as any)) {
    return null;
  }

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
