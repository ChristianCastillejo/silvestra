"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Sparkles } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ProductHighlight() {
    const t = useTranslations("Home.heroNew");

    return (
        <section className="py-32 px-6 bg-bg-gray/50">

            <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                {/* COLUMNA IMAGEN CON LIQUID GLASS GRADIENT */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl group">
                    <Image
                        src="/images/present2.jpg"
                        alt="Terrario Ginseng Premium Silvestra"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="absolute bottom-0 left-0 right-0 h-1/3 md:h-1/8 bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-[2px] z-10" />

                    <div className="absolute bottom-8 left-8 z-20 text-white">
                        <p className="font-serif text-3xl drop-shadow-sm">{t("productHighlight.imageLabel")}</p>
                    </div>
                </div>

                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h2 className="font-serif text-4xl md:text-6xl text-primary leading-tight mb-6">
                            {t("productHighlight.titlePart1")} <br />
                            <span className="italic opacity-60 font-light">{t("productHighlight.titlePart2")}</span>
                        </h2>
                        <p className="text-gray-dark leading-relaxed text-lg mb-8">
                            {t("productHighlight.description")}
                        </p>

                        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border/40">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-accent">
                                    <Leaf size={16} />
                                    <h4 className="font-bold text-xs uppercase tracking-tighter">{t("productHighlight.sustainability.title")}</h4>
                                </div>
                                <p className="text-sm text-gray-dark italic">{t("productHighlight.sustainability.desc")}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-accent">
                                    <Sparkles size={16} />
                                    <h4 className="font-bold text-xs uppercase tracking-tighter">{t("productHighlight.craftsmanship.title")}</h4>
                                </div>
                                <p className="text-sm text-gray-dark italic">{t("productHighlight.craftsmanship.desc")}</p>
                            </div>
                        </div>

                        <div className="pt-10">
                            <Link href="/products/jardin-eterno-ficus">
                                <Button variant="primary" size="lg" className="rounded-full group shadow-lg shadow-primary/20">
                                    {t("productHighlight.cta")}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}