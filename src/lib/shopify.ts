import { isShopifyError } from "./shopify/type-guard";
import { ensureStartsWith } from "./utils";

const DOMAIN = process.env.SHOPIFY_STORE_URL;
const ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_CLIENT_ACCESS_TOKEN;
const API_VERSION = "2025-07";

const API_URL = DOMAIN
  ? `${ensureStartsWith(DOMAIN, "https://")}/api/${API_VERSION}/graphql.json`
  : "";

type RequestCache =
  | "default"
  | "force-cache"
  | "no-cache"
  | "no-store"
  | "only-if-cached"
  | "reload";

export interface GraphQLError {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: Array<string | number>;
  extensions?: Record<string, unknown>;
}

export interface GraphQLResponse<TData = unknown> {
  data?: TData;
  errors?: GraphQLError[];
}

export interface ShopifyFetchOptions<TVariables = Record<string, unknown>> {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: TVariables;
}

export interface ShopifyFetchResponse<TData = unknown> {
  status: number;
  body: GraphQLResponse<TData>;
}

// Timeout in milliseconds (30 seconds)
const FETCH_TIMEOUT = 30000;

export async function shopifyFetch<
  TData = unknown,
  TVariables = Record<string, unknown>
>({
  cache = "no-store",
  headers,
  query,
  tags,
  variables,
}: ShopifyFetchOptions<TVariables>): Promise<ShopifyFetchResponse<TData>> {
  if (!API_URL || !ACCESS_TOKEN) {
    const missingVars = [];
    if (!API_URL) missingVars.push("SHOPIFY_STORE_URL");
    if (!ACCESS_TOKEN)
      missingVars.push("SHOPIFY_STOREFRONT_CLIENT_ACCESS_TOKEN");
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }

  // Create an AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const result = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
        ...headers,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      cache,
      ...(tags && { next: { tags } }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!result.ok) {
      throw new Error(
        `Shopify API request failed with status ${result.status}: ${result.statusText}`
      );
    }

    const body = (await result.json()) as GraphQLResponse<TData>;

    if (body.errors) {
      const errorMessages = body.errors.map((err) => err.message).join("; ");
      throw new Error(`GraphQL Error: ${errorMessages}`);
    }

    return {
      status: result.status,
      body,
    };
  } catch (e: unknown) {
    // Ensure timeout is cleared even if an error occurs
    clearTimeout(timeoutId);
    if (isShopifyError(e)) {
      throw e;
    }

    // Handle timeout/abort errors
    if (e instanceof Error && e.name === "AbortError") {
      throw new Error(
        `Shopify API request timed out after ${FETCH_TIMEOUT}ms. Please check your network connection and Shopify store configuration.`
      );
    }

    // Handle fetch errors (network issues, DNS, etc.)
    if (e instanceof Error && (e.message.includes("fetch failed") || e.cause)) {
      const cause = e.cause as { code?: string } | undefined;
      const errorCode = cause?.code || "NETWORK_ERROR";
      throw new Error(
        `Failed to connect to Shopify API (${errorCode}). Please verify:\n` +
          `1. SHOPIFY_STORE_URL is correct: ${DOMAIN ? "set" : "missing"}\n` +
          `2. SHOPIFY_STOREFRONT_CLIENT_ACCESS_TOKEN is set: ${
            ACCESS_TOKEN ? "set" : "missing"
          }\n` +
          `3. Your network connection is working\n` +
          `4. The Shopify store is accessible\n` +
          `Original error: ${e.message}`
      );
    }

    throw new Error(
      e instanceof Error ? e.message : "Unknown error during Shopify fetch"
    );
  }
}
