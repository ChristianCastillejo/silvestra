"use client";

import React from "react";
import { motion } from "framer-motion";
import { Leaf, Sparkles, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

const FEATURE_KEYS = ["no_maintenance", "guarantee", "shipping"] as const;
type FeatureKey = (typeof FEATURE_KEYS)[number];

const FEATURE_ICONS: Record<FeatureKey, typeof Leaf> = {
    no_maintenance: Leaf,
    guarantee: Sparkles,
    shipping: ShieldCheck
};

export default function Features() {
    const t = useTranslations("Home.heroNew");

    return (
        <section className="relative z-10 bg-white py-32 px-6">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 text-center md:grid-cols-3">
                {FEATURE_KEYS.map((key, index) => {
                    const Icon = FEATURE_ICONS[key];
                    return (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="group flex flex-col items-center cursor-default"
                        >
                            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-bg-gray text-primary transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:bg-primary group-hover:scale-105 group-hover:text-white group-hover:shadow-2xl group-hover:shadow-primary/20">
                                <Icon size={36} strokeWidth={1.2} />
                            </div>
                            <h3 className="mb-4 font-serif text-3xl text-primary tracking-tight">{t(`features.${key}.title`)}</h3>
                            <p className="max-w-xs text-base leading-relaxed text-gray-dark font-medium">
                                {t(`features.${key}.desc`)}
                            </p>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}