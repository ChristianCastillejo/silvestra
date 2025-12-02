"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/cn";
import { Link } from "@/i18n/routing";

export function CookieBanner() {
  const t = useTranslations("CookieBanner");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (consent === null) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    } else if (consent === "true") {
      loadScripts();
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "true");
    setIsVisible(false);
    loadScripts();
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "false");
    setIsVisible(false);
  };

  const loadScripts = () => {
    if (window.typeof === "undefined") return;
    if (document.getElementById("google-analytics")) return;

    const script = document.createElement("script");
    script.id = "google-analytics";
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-ID_HERE";
    document.head.appendChild(script);

    const inlineScript = document.createElement("script");
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-TU_ID_AQUI');
    `;
    document.head.appendChild(inlineScript);

    console.log("🍪 Analytics Loaded");
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-2xl",
        "flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between",
        "bg-neutral-white/90 backdrop-blur-md border border-border shadow-2xl rounded-2xl",
        "transition-all duration-500 ease-out transform translate-y-0 opacity-100"
      )}
    >
      <div className="text-sm text-text-black md:max-w-[60%]">
        <p className="font-medium mb-1">{t("title")}</p>
        <p className="text-neutral-500 text-xs leading-relaxed">
          {t("description")}{" "}
          <Link
            href="/pages/cookies"
            className="underline underline-offset-2 decoration-neutral-300 hover:decoration-black hover:text-text-black transition-all whitespace-nowrap"
          >
            {t("readMore")}
          </Link>
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          variant="fill"
          size="sm"
          onClick={accept}
          className="text-xs h-9 whitespace-nowrap"
        >
          {t("accept")}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={decline}
          className="text-xs h-9 whitespace-nowrap"
        >
          {t("decline")}
        </Button>
      </div>
    </div>
  );
}
