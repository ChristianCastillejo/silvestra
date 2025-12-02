declare namespace NodeJS {
  interface ProcessEnv {
    readonly SHOPIFY_STORE_URL?: string;
    readonly SHOPIFY_STOREFRONT_CLIENT_ACCESS_TOKEN?: string;
    readonly SHOPIFY_NEWSLETTER_ACCESS_TOKEN?: string;
    readonly SHOPIFY_WEBHOOK_SECRET?: string;
    readonly RESEND_API_KEY?: string;
    readonly NEXT_PUBLIC_FACEBOOK_PIXEL_ID?: string;
    readonly FACEBOOK_ACCESS_TOKEN?: string;
    readonly NEXT_PUBLIC_SITE_URL?: string;
    readonly VERCEL_URL?: string;
  }
}

import '../i18n/types';
