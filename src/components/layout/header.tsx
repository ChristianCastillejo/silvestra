"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import CartDrawer from "../cart/cart-drawer";
import MobileMenu from "./header-mobile-menu";
import { headerMenuConfig, type NavMenuItemConfig } from "@/components/layout/navigation";
import { cn } from "@/utils/cn";
import { Menu, ChevronDown } from "lucide-react";

export default function Header(): React.JSX.Element {
  const t = useTranslations("Header");
  const [open, setOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Lógica de detección de scroll con un umbral ligeramente mayor para evitar "flicker"
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // CONTENEDOR MAESTRO:
    // Usamos `pointer-events-none` en el contenedor padre para que los clics pasen a través
    // de las áreas vacías a los lados cuando la barra flota.
    <header className="fixed top-0 z-50 w-full flex justify-center pt-4 pointer-events-none px-4">

      {/* CÁPSULA DE NAVEGACIÓN:
          Maneja la morfología de ancho completo a píldora flotante.
          `pointer-events-auto` reactiva los clics dentro de la barra.
      */}
      <div
        className={cn(
          "pointer-events-auto transition-all duration-700 cubic-bezier(0.19, 1, 0.22, 1)", // Animación ultra suave
          "flex items-center",
          isScrolled
            ? "w-full max-w-5xl h-[60px] bg-white/70 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 rounded-full mt-2"
            : "w-full md:max-w-5xl h-[80px] bg-transparent border-transparent mt-0"
        )}
      >
        <Container
          as="nav"
          size="full"
          className="flex h-full justify-between items-center px-4 md:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          {/* 1. LEFT: LOGO & MOBILE */}
          <div className="w-1/4 flex items-center gap-4">
            <button
              onClick={() => setOpen(true)}
              className="cursor-pointer lg:hidden text-gray-dark hover:text-primary transition-colors"
              aria-label={t("ariaLabels.openMobileMenu")}
              aria-expanded={open}
              type="button"
            >
              <Menu strokeWidth={1.5} size={24} />
            </button>

            <Link
              href="/"
              aria-label={t("ariaLabels.goToHome")}
              className="group flex items-center gap-2"
            >
              {/* Logo Typography: Serif para alinearse con el Hero */}
              <span className="font-serif text-xl lg:text-2xl font-medium tracking-tight text-primary transition-colors">
                {t("siteName")}
              </span>
            </Link>
          </div>

          {/* 2. CENTER: DESKTOP MENU */}
          <div className="hidden lg:flex flex-1 justify-center items-center h-full">
            <div className="flex items-center gap-8 h-full">
              {headerMenuConfig?.map((item) => (
                <DesktopMenuItem
                  key={item.titleKey}
                  item={item}
                  t={(key) => t(key as Parameters<typeof t>[0])}
                  isScrolled={isScrolled}
                />
              ))}
            </div>
          </div>

          {/* 3. RIGHT: CART & ACTIONS */}
          <div className="w-1/4 flex justify-end items-center">
            {/* Wrapper del carrito para mantener alineación */}
            <div className={cn(
              "transition-transform duration-500",
              isScrolled ? "scale-90" : "scale-100" // Sutil reducción de tamaño al hacer scroll
            )}>
              <CartDrawer />
            </div>
          </div>
        </Container>
      </div>

      <MobileMenu open={open} closeMenu={() => setOpen(false)} menu={headerMenuConfig || []} />
    </header>
  );
}

// --- SUBCOMPONENTS (Clean Code & Performance) ---

interface DesktopMenuItemProps {
  item: NavMenuItemConfig;
  t: (key: string) => string;
  isScrolled: boolean;
}

const DesktopMenuItem = ({ item, t, isScrolled }: DesktopMenuItemProps): React.JSX.Element | null => {
  if (!item?.titleKey || !item?.url) return null;

  const hasChild = (item.items?.length ?? 0) > 0;
  const hasGrandChild = item.items?.some((subItem) => (subItem.items?.length ?? 0) > 0) ?? false;
  const title = t(item.titleKey as Parameters<typeof t>[0]);

  return (
    <div className="relative group h-full flex items-center">
      <Link
        className={cn(
          "flex items-center gap-1 text-[13px] font-medium tracking-wide transition-all duration-300 px-3 py-1.5 rounded-full",
          "text-gray-600 hover:text-primary hover:bg-primary/5", // Estado base
          isScrolled && "hover:bg-black/5" // Ajuste de hover en modo scrolled
        )}
        href={item.url}
      >
        {title}
        {hasChild && (
          <ChevronDown
            size={12}
            strokeWidth={2}
            className="text-gray-400 group-hover:text-primary transition-transform duration-300 group-hover:-rotate-180"
          />
        )}
      </Link>

      {/* DROPDOWN LOGIC:
          Usamos `top-full` + `mt-2` para separarlo visualmente pero mantenemos el área de hover.
      */}
      {hasChild && (
        <div className="absolute top-[calc(100%-10px)] left-1/2 -translate-x-1/2 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out transform origin-top scale-95 group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto">
          {hasGrandChild ? (
            <GrandChildMenu items={item.items} t={t} />
          ) : (
            <ChildMenu items={item.items} t={t} />
          )}
        </div>
      )}
    </div>
  );
};

interface ChildMenuProps {
  items: NavMenuItemConfig[];
  t: (key: string) => string;
}

const ChildMenu = ({ items, t }: ChildMenuProps): React.JSX.Element | null => {
  if (!items?.length) return null;

  return (
    <nav
      className="flex flex-col gap-1 min-w-[200px] bg-white/80 backdrop-blur-2xl rounded-2xl p-2 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-white/40 ring-1 ring-black/5"
      aria-label="Submenu"
    >
      {items.map((item) =>
        item?.url && item?.titleKey ? (
          <Link
            key={item.titleKey}
            href={item.url}
            className="px-4 py-2.5 text-xs font-medium text-gray-600 hover:text-primary hover:bg-white rounded-xl transition-all duration-200 block"
          >
            {t(item.titleKey as Parameters<typeof t>[0])}
          </Link>
        ) : null
      )}
    </nav>
  );
};

const GrandChildMenu = ({ items, t }: ChildMenuProps): React.JSX.Element | null => {
  if (!items?.length) return null;

  return (
    <nav
      className="flex gap-10 lg:min-w-[600px] bg-white/90 backdrop-blur-2xl rounded-[2rem] p-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border border-white/40 ring-1 ring-black/5"
      aria-label="Mega menu"
    >
      {items.map((item: NavMenuItemConfig) =>
        item?.url && item?.titleKey ? (
          <div key={item.titleKey} className="flex flex-col min-w-[140px]">
            <Link
              href={item.url}
              className="font-serif text-lg text-primary mb-4 pb-2 border-b border-black/5 inline-block hover:text-accent transition-colors"
            >
              {t(item.titleKey as Parameters<typeof t>[0])}
            </Link>

            <div className="flex flex-col gap-2">
              {item.items?.map((subItem: NavMenuItemConfig) =>
                subItem?.url && subItem?.titleKey ? (
                  <Link
                    key={subItem.titleKey}
                    href={subItem.url}
                    className="text-xs font-medium text-gray-500 hover:text-primary hover:translate-x-1 transition-all"
                  >
                    {t(subItem.titleKey as Parameters<typeof t>[0])}
                  </Link>
                ) : null
              )}
            </div>
          </div>
        ) : null
      )}
    </nav>
  );
};