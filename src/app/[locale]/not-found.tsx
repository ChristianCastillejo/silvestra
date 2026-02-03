"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          {t("statusCode")}
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          {t("heading")}
        </h2>
        <p className="text-gray-600 mb-8 max-w-md">
          {t("description")}
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          {t("returnHome")}
        </Link>
      </div>
    </main>
  );
}




