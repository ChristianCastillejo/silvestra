import type { CodegenConfig } from "@graphql-codegen/cli";
import * as dotenv from "dotenv";

// Carga las variables de entorno locales
dotenv.config({ path: ".env.local" });

const config: CodegenConfig = {
  overwrite: true,
  // Esquema de Shopify (Storefront API)
  schema: [
    {
      [`https://${process.env.SHOPIFY_STORE_URL}/api/2025-07/graphql.json`]: {
        headers: {
          "X-Shopify-Storefront-Access-Token":
            process.env.SHOPIFY_STOREFRONT_CLIENT_ACCESS_TOKEN || "",
          "Content-Type": "application/json",
        },
      },
    },
  ],
  // Dónde buscar tus queries (incluimos JS/JSX para que detecte lo que aún no migras)
  documents: ["src/**/*.{ts,tsx,js,jsx}"],
  ignoreNoDocuments: true, // Para que no falle si empiezas de cero
  generates: {
    "src/gql/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "graphql",
      },
    },
  },
};

export default config;
