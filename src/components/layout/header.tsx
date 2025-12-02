"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import type { Menu } from "@/lib/shopify/index";
import CartDrawer from "../cart/cart-drawer";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import MobileMenu from "./header-mobile-menu";

interface HeaderProps {
  menu: Menu;
}

export default function Header({ menu }: HeaderProps): React.JSX.Element {
  const t = useTranslations("Header");
  const translate = (key: string) => t(key as Parameters<typeof t>[0]);
  const [open, setOpen] = useState<boolean>(false);

  const closeMenu = (): void => {
    setOpen(false);
  };

  if (!menu?.items?.length) {
    return (
      <header className="h-[70px] fixed top-0 z-50 bg-white w-full">
        <Container size="full" className="flex h-full justify-between">
          <div className="w-1/5 flex items-center">
            <Link href="/">
              <h1 className="max-md:hidden">Logo</h1>
            </Link>
          </div>
          <div className="w-1/5 flex justify-end items-center">
            <CartDrawer />
          </div>
        </Container>
      </header>
    );
  }

  return (
    <header className="h-[70px] fixed top-0 z-50 bg-white w-full">
      <Container
        as="nav"
        size="full"
        className="flex h-full justify-between"
        aria-label="Main navigation"
      >
        <div className="w-1/5 flex items-center">
          <Link
            href="/"
            aria-label={translate("ariaLabels.goToHome")}
            className="group flex items-center gap-3 max-md:hidden"
          >
            <div className="relative h-10 w-10 shrink-0">
              <Image
                src="/logo.svg"
                alt={translate("logoAlt")}
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-110"
                priority
              />
            </div>

            <h1 className="  font-bold tracking-tight text-black transition-colors group-hover:text-primary">
              {translate("siteName")}
            </h1>
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="rotate-180 cursor-pointer hidden max-md:block"
            aria-label={translate("ariaLabels.openMobileMenu")}
            aria-expanded={open}
            type="button"
          >
            <Image
              height={30}
              width={30}
              alt="Menu icon"
              src="/icons/icon-hamburger.svg"
            />
          </button>
        </div>
        <div className="w-3/5 flex justify-center items-center gap-10">
          <Link
            href="/"
            aria-label={translate("ariaLabels.goToHome")}
            className="group flex items-center flex-row gap-2 max-md:block hidden"
          >
            <h1 className=" font-bold tracking-tight text-black transition-colors group-hover:text-primary">
              {translate("siteName")}
            </h1>
          </Link>

          {menu.items.map((item, i) => (
            <DesktopMenuItem key={i} item={item} />
          ))}
        </div>
        <div className="w-1/5 flex justify-end items-center">
          <CartDrawer />
        </div>
      </Container>
      <MobileMenu open={open} closeMenu={closeMenu} menu={menu} />
    </header>
  );
}

interface MenuItem {
  title: string;
  url: string;
  items: MenuItem[];
}

interface DesktopMenuItemProps {
  item: MenuItem;
}

const DesktopMenuItem = ({
  item,
}: DesktopMenuItemProps): React.JSX.Element | null => {
  if (!item?.title || !item?.url) {
    return null;
  }

  const hasChild = (item.items?.length ?? 0) > 0;
  const hasGrandChild =
    item.items?.some((subItem) => (subItem.items?.length ?? 0) > 0) ?? false;

  return (
    <div className="relative group h-full flex items-center gap-2 max-md:hidden">
      <Link className="font-semibold" href={item.url}>
        {item.title}
      </Link>
      {hasChild && (
        <Image
          className="rotate-180 group-hover:rotate-0 transition-transform ease-out duration-200"
          height={18}
          width={18}
          alt="Chevron icon"
          src="/icons/icon-chevron.svg"
        />
      )}
      {hasChild &&
        (hasGrandChild ? (
          <GrandChildMenu items={item.items} />
        ) : (
          <ChildMenu items={item.items} />
        ))}
    </div>
  );
};

interface ChildMenuProps {
  items: MenuItem[];
}

const ChildMenu = ({ items }: ChildMenuProps): React.JSX.Element | null => {
  if (!items?.length) {
    return null;
  }

  return (
    <nav
      className="absolute flex flex-col gap-3 px-10 py-8 top-full left-0 -translate-x-1/4 bg-white rounded-2xl ring-1 ring-black/5 shadow-lg opacity-0 pointer-events-none origin-top scale-75 group-hover:scale-100 transition-all duration-300 group-hover:opacity-100 group-hover:pointer-events-auto"
      aria-label="Submenu"
    >
      {items.map((item, i) =>
        item?.url && item?.title ? (
          <Link className="text-nowrap" key={i} href={item.url}>
            {item.title}
          </Link>
        ) : null
      )}
    </nav>
  );
};

interface GrandChildMenuProps {
  items: MenuItem[];
}

const GrandChildMenu = ({
  items,
}: GrandChildMenuProps): React.JSX.Element | null => {
  if (!items?.length) {
    return null;
  }

  return (
    <nav
      className="absolute lg:min-w-[750px] md:min-w-[600px] w-fit flex-wrap flex gap-8 px-10 py-8 top-full left-0 -translate-x-1/3 bg-white rounded-2xl shadow-lg ring-1 ring-black/5 opacity-0 pointer-events-none transition-all origin-top scale-75 group-hover:scale-100 duration-300 group-hover:opacity-100 group-hover:pointer-events-auto"
      aria-label="Submenu with nested items"
    >
      {items.map((item, i) =>
        item?.url && item?.title ? (
          <div key={i} className="flex flex-col">
            <Link className="font-semibold mb-3 text-nowrap" href={item.url}>
              {item.title}
            </Link>
            {item.items?.map((subItem, j) =>
              subItem?.url && subItem?.title ? (
                <Link key={j} href={subItem.url} className="mb-2 text-nowrap">
                  {subItem.title}
                </Link>
              ) : null
            )}
          </div>
        ) : null
      )}
    </nav>
  );
};
