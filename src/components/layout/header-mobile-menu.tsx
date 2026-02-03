"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import type { Menu } from "@/lib/shopify/index";
import { Sheet, SheetContent, SheetTitle, SheetClose } from "../ui/sheet";

interface MenuItem {
  title: string;
  url: string;
  items: MenuItem[];
}

interface MobileMenuProps {
  open: boolean;
  closeMenu: () => void;
  menu: Menu;
}

interface MenuHeaderProps {
  isRoot?: boolean;
  title: string;
  closeMenu: () => void;
  close: () => void;
}

interface MenuItemsProps {
  items: MenuItem[];
  onClick: (item: MenuItem) => void;
  handleCloseMenu: () => void;
}

interface MobileChildMenuProps {
  title: string;
  items: MenuItem[];
  onClick?: (item: MenuItem) => void;
  closeMenu: () => void;
  close: () => void;
}

const MenuHeader = ({
  isRoot = false,
  title,
  closeMenu,
  close,
}: MenuHeaderProps): React.JSX.Element => {
  const t = useTranslations("Header");

  return (
    <div className="py-4 px-8 w-full h-fit border-b border-border flex justify-between">
      <button
        className="flex gap-2"
        onClick={close}
        type="button"
        aria-label={
          isRoot
            ? t("mobileMenu.ariaLabels.closeMenu")
            : t("mobileMenu.ariaLabels.goBack")
        }
      >
        {!isRoot && (
          <Image
            className="-rotate-90"
            height={18}
            width={18}
            alt=""
            src="/icons/icon-chevron.svg"
            aria-hidden="true"
          />
        )}
        {isRoot ? (
          <SheetTitle className="text-lg font-semibold">{title}</SheetTitle>
        ) : (
          <div className="text-lg font-semibold">{title}</div>
        )}
      </button>
      {isRoot ? (
        <SheetClose asChild>
          <button
            className="cursor-pointer"
            type="button"
            aria-label={t("mobileMenu.ariaLabels.closeMenu")}
          >
            <Image
              src="/icons/icon-close.svg"
              width={28}
              height={28}
              alt=""
              aria-hidden="true"
            />
          </button>
        </SheetClose>
      ) : (
        <button
          onClick={closeMenu}
          className="cursor-pointer"
          type="button"
          aria-label={t("mobileMenu.ariaLabels.closeMenu")}
        >
          <Image
            src="/icons/icon-close.svg"
            width={28}
            height={28}
            alt=""
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
};

const MenuItems = ({
  items,
  onClick,
  handleCloseMenu,
}: MenuItemsProps): React.JSX.Element | null => {
  const t = useTranslations("Header");

  if (!items?.length) {
    return null;
  }

  return (
    <div className="py-4 px-8">
      {items.map((item, i) => {
        if (!item?.title || !item?.url) {
          return null;
        }

        const hasChildren = (item.items?.length ?? 0) > 0;

        return (
          <div key={i} className="border-b border-border flex justify-between">
            <Link
              className="text-xl font-semibold py-5"
              href={item.url}
              onClick={handleCloseMenu}
            >
              {item.title}
            </Link>
            {hasChildren && (
              <button
                className="flex-grow flex items-center justify-end"
                onClick={() => onClick(item)}
                type="button"
                aria-expanded={false}
                aria-label={t("mobileMenu.ariaLabels.openSubmenu", {
                  title: item.title,
                })}
              >
                <Image
                  src="/icons/icon-chevron.svg"
                  width={24}
                  height={24}
                  className="rotate-90 cursor-pointer"
                  alt=""
                  aria-hidden="true"
                />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

const MobileChildMenu = ({
  title,
  items,
  onClick,
  closeMenu,
  close,
}: MobileChildMenuProps): React.JSX.Element | null => {
  if (!items?.length) {
    return null;
  }

  return (
    <div className="w-full bg-white h-screen absolute left-0 top-0 flex-col transition-transform duration-300 ease-in-out transform translate-x-0">
      <MenuHeader title={title} closeMenu={closeMenu} close={close} />
      {onClick ? (
        <MenuItems
          items={items}
          onClick={onClick}
          handleCloseMenu={closeMenu}
        />
      ) : (
        <MenuItems
          items={items}
          onClick={() => {}}
          handleCloseMenu={closeMenu}
        />
      )}
    </div>
  );
};

export default function MobileMenu({
  open,
  closeMenu,
  menu,
}: MobileMenuProps): React.JSX.Element | null {
  const t = useTranslations("Header");
  const [childMenu, setChildMenu] = useState<MenuItem | null>(null);
  const [grandchildMenu, setGrandchildMenu] = useState<MenuItem | null>(null);
  const [closingChildMenu, setClosingChildMenu] = useState<boolean>(false);
  const [closingGrandchildMenu, setClosingGrandchildMenu] =
    useState<boolean>(false);

  const handleMobileMenuClick = (item: MenuItem): void => {
    if (childMenu === item) {
      setClosingChildMenu(true);
      setTimeout(() => {
        setChildMenu(null);
        setClosingChildMenu(false);
      }, 300);
    } else {
      setChildMenu(item);
      setGrandchildMenu(null);
    }
  };

  const handleGrandchildMenuClick = (item: MenuItem): void => {
    if (grandchildMenu === item) {
      setClosingGrandchildMenu(true);
      setTimeout(() => {
        setGrandchildMenu(null);
        setClosingGrandchildMenu(false);
      }, 300);
    } else {
      setGrandchildMenu(item);
    }
  };

  const handleCloseMenu = (): void => {
    closeMenu();
    setTimeout(() => {
      setChildMenu(null);
      setGrandchildMenu(null);
    }, 300);
  };

  if (!menu?.items?.length) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={(val: boolean) => !val && closeMenu()}>
      <SheetContent side="left" className="p-0 overflow-hidden">
        <div className="relative w-full h-full flex flex-col">
          <MenuHeader
            isRoot={true}
            title={t("mobileMenu.title")}
            closeMenu={handleCloseMenu}
            close={() => {}}
          />
          <MenuItems
            items={menu.items}
            onClick={handleMobileMenuClick}
            handleCloseMenu={handleCloseMenu}
          />

          <div
            className={`w-full bg-white absolute left-0 top-0 flex-col transition-transform duration-300 ease-in-out transform translate-x-0 ${
              childMenu && !closingChildMenu ? "!-translate-x-full" : ""
            }`}
          >
            {childMenu && (
              <MobileChildMenu
                title={childMenu.title}
                items={childMenu.items}
                onClick={handleGrandchildMenuClick}
                closeMenu={handleCloseMenu}
                close={() => handleMobileMenuClick(childMenu)}
              />
            )}
          </div>

          <div
            className={`w-full bg-white absolute left-0 top-0 flex-col transition-transform duration-300 ease-in-out transform translate-x-0 ${
              grandchildMenu && !closingGrandchildMenu
                ? "!-translate-x-full"
                : ""
            }`}
          >
            {grandchildMenu && (
              <MobileChildMenu
                title={grandchildMenu.title}
                items={grandchildMenu.items}
                closeMenu={handleCloseMenu}
                close={() => handleGrandchildMenuClick(grandchildMenu)}
              />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
