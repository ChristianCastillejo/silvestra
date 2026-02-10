"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("Home.heroNew");

  return (
    <section className="relative min-h-[95vh] w-full flex flex-col lg:flex-row items-center overflow-hidden px-6 lg:pl-32 lg:pr-12 pt-24 lg:pt-0">

      {/* COLUMNA IZQUIERDA: Texto */}
      <div className="flex-1 flex items-center z-10 lg:pr-16 mb-16 lg:mb-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl"
        >
          <span className="mb-8 inline-block rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            {t("tagline")}
          </span>

          <h1 className="mb-8 font-serif text-6xl leading-[1.05] text-primary md:text-7xl lg:text-8xl tracking-tight">
            {t("titlePart1")} <br />
            <span className="italic font-light text-accent">{t("titlePart2")}</span>
          </h1>

          <p className="mb-10 max-w-lg text-base md:text-lg text-gray-dark leading-relaxed">
            {t("description")}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <Link href="/collections/jardines-eternos">
              <Button size="lg" className="rounded-full h-14 px-12 text-base shadow-xl shadow-primary/15 hover:scale-[1.02] active:scale-95 transition-all">
                {t("cta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* COLUMNA DERECHA: El "Soft Frame" */}
      <div className="flex-1 relative w-full h-[60vh] lg:h-[85vh] flex items-center justify-center lg:justify-end">

        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[800px] h-full rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] overflow-hidden bg-white"
        >
          <Image
            src="/images/hero-1.jpg"
            alt="Terrarios artesanales Silvestra"
            fill
            className="object-cover object-center"
            style={{ filter: "saturate(0.85) brightness(1.05) contrast(1.02)" }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/30 opacity-50 pointer-events-none mix-blend-overlay" />
        </motion.div>

        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[80vw] h-[80vw] rounded-full bg-accent/5 blur-[120px] -z-10" />
      </div>
    </section>
  );
}