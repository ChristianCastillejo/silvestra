export interface NavMenuItemConfig {
  titleKey: string;
  url: string;
  items: NavMenuItemConfig[];
}

export interface NavSectionConfig {
  sectionTitleKey: string;
  items: Omit<NavMenuItemConfig, "items">[];
}

export const headerMenuConfig: NavMenuItemConfig[] = [
  { titleKey: "menu.home", url: "/", items: [] },
  { titleKey: "menu.products", url: "/collections/jardines-eternos", items: [] },
  { titleKey: "menu.care", url: "/care", items: [] },
  { titleKey: "menu.about", url: "/about", items: [] },
  { titleKey: "menu.contact", url: "/contact", items: [] },
];

export const footerMenuConfig: NavSectionConfig[] = [
  {
    sectionTitleKey: "menu.sections.shop",
    items: [
      { titleKey: "menu.items.terrariums", url: "/collections/jardines-eternos" },
      { titleKey: "menu.items.care", url: "/care" },
    ],
  },
  {
    sectionTitleKey: "menu.sections.legal",
    items: [
      { titleKey: "menu.items.legalNotice", url: "/pages/legal-notice" },
      { titleKey: "menu.items.privacyPolicy", url: "/pages/privacy-policy" },
      { titleKey: "menu.items.termsOfPurchase", url: "/pages/terms-of-purchase" },
      { titleKey: "menu.items.cookiesPolicy", url: "/pages/cookies" },
    ],
  },
  {
    sectionTitleKey: "menu.sections.info",
    items: [
      { titleKey: "menu.items.about", url: "/about" },
      { titleKey: "menu.items.shippingPolicy", url: "/pages/shipping" },
      { titleKey: "menu.items.contact", url: "/contact" },
    ],
  },
];
