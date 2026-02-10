"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Sheet, SheetContent } from "../ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X, ChevronRight } from "lucide-react";
import type { NavMenuItemConfig } from "@/components/layout/navigation";
import { cn } from "@/utils/cn";

interface MobileMenuProps {
  open: boolean;
  closeMenu: () => void;
  menu: NavMenuItemConfig[];
}

export default function MobileMenu({ open, closeMenu, menu }: MobileMenuProps): React.JSX.Element {
  const t = useTranslations("Header");

  // Navigation Stack State: Maneja el historial de navegación "profunda"
  // [root, child, grandchild]
  const [navStack, setNavStack] = useState<NavMenuItemConfig[]>([]);

  // Reset stack when menu closes
  useEffect(() => {
    if (!open) {
      // Delay reset to allow closing animation to finish
      const timer = setTimeout(() => setNavStack([]), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Current active menu level items
  const currentItems = navStack.length > 0
    ? navStack[navStack.length - 1].items || []
    : menu;

  const currentTitle = navStack.length > 0
    ? t(navStack[navStack.length - 1].titleKey as any)
    : t("mobileMenu.title");

  const handlePush = (item: NavMenuItemConfig) => {
    setNavStack([...navStack, item]);
  };

  const handlePop = () => {
    setNavStack(navStack.slice(0, -1));
  };

  return (
    <Sheet open={open} onOpenChange={(val) => !val && closeMenu()}>
      <SheetContent
        side="left"
        className="w-full sm:max-w-md p-0 border-r-0 bg-white/95 backdrop-blur-3xl"
      >
        <div className="flex flex-col h-full bg-white/90">

          {/* HEADER DE NAVEGACIÓN */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-black/5">
            {navStack.length > 0 ? (
              <button
                onClick={handlePop}
                className="p-2 -ml-2 text-gray-600 hover:text-primary transition-colors rounded-full hover:bg-black/5"
                aria-label={t("mobileMenu.ariaLabels.goBack")}
              >
                <ArrowLeft size={20} />
              </button>
            ) : (
              // Spacer para mantener el título centrado/alineado cuando no hay botón "back"
              <div className="w-9" />
            )}

            <span className="font-serif text-lg font-medium text-primary tracking-tight">
              {currentTitle}
            </span>

            <button
              onClick={closeMenu}
              className="p-2 -mr-2 text-gray-600 hover:text-primary transition-colors rounded-full hover:bg-black/5"
              aria-label={t("mobileMenu.ariaLabels.closeMenu")}
            >
              <X size={20} />
            </button>
          </div>

          {/* ÁREA DE CONTENIDO CON TRANSICIONES */}
          <div className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={navStack.length} // Clave para disparar la animación al cambiar de nivel
                initial={{ x: navStack.length === 0 ? 0 : "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-20%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-0 overflow-y-auto py-4 px-6"
              >
                <div className="flex flex-col gap-1">
                  {currentItems.map((item) => {
                    const hasChildren = (item.items?.length ?? 0) > 0;

                    return (
                      <div key={item.titleKey} className="group">
                        {hasChildren ? (
                          <button
                            onClick={() => handlePush(item)}
                            className="w-full flex items-center justify-between p-4 text-left text-lg font-medium text-gray-dark hover:text-primary hover:bg-primary/5 rounded-2xl transition-all active:scale-[0.98]"
                          >
                            <span>{t(item.titleKey as any)}</span>
                            <ChevronRight size={18} className="text-gray-400 group-hover:text-primary" />
                          </button>
                        ) : (
                          <Link
                            href={item.url || "#"}
                            onClick={closeMenu}
                            className={cn(
                              "block w-full p-4 text-lg font-medium text-gray-dark hover:text-primary hover:bg-primary/5 rounded-2xl transition-all active:scale-[0.98]",
                              // Destacar el enlace si es una "acción" o enlace final
                              !hasChildren && "text-gray-600"
                            )}
                          >
                            {t(item.titleKey as any)}
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Footer Decorativo en el nivel raíz */}
                {navStack.length === 0 && (
                  <div className="mt-12 p-6 rounded-3xl bg-bg-gray/50 border border-black/5">
                    <p className="font-serif text-xl text-primary mb-2">Silvestra</p>
                    <p className="text-sm text-gray-500">
                      Hecho a mano en Sierra Morena.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}