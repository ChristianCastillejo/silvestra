const options = {
  autoConfig: true,
  debug: process.env.NODE_ENV === "development",
};

type BaseProduct = {
  id: string;
  name: string;
  price: string | number;
  currency: string;
};

const safePrice = (price: string | number): number => {
  if (typeof price === "number") return price;
  const cleaned = price.replace(/[^0-9.]/g, "");
  return Number(cleaned) || 0;
};

interface ReactPixel {
  init: (pixelId: string, config?: unknown, options?: unknown) => void;
  pageView: () => void;
  track: (eventName: string, data?: Record<string, unknown>) => void;
}

const getPixel = async (): Promise<ReactPixel | null> => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const ReactPixel = (await import("react-facebook-pixel")).default;
    return ReactPixel as ReactPixel;
  } catch {
    return null;
  }
};

export const initFacebookPixel = async (pixelId: string): Promise<void> => {
  const ReactPixel = await getPixel();
  if (ReactPixel) {
    ReactPixel.init(pixelId, undefined, options);
  }
};

export const trackPageView = async (): Promise<void> => {
  const ReactPixel = await getPixel();
  if (ReactPixel) {
    ReactPixel.pageView();
  }
};

export const trackEvent = async (
  eventName: string,
  data?: Record<string, unknown>
): Promise<void> => {
  const ReactPixel = await getPixel();
  if (ReactPixel) {
    ReactPixel.track(eventName, data);
  }
};

export const trackViewContent = async (product: BaseProduct): Promise<void> => {
  const ReactPixel = await getPixel();
  if (ReactPixel) {
    ReactPixel.track("ViewContent", {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      value: safePrice(product.price),
      currency: product.currency,
    });
  }
};

export const trackAddToCart = async (
  product: BaseProduct,
  quantity: number = 1
): Promise<void> => {
  const ReactPixel = await getPixel();
  if (ReactPixel) {
    ReactPixel.track("AddToCart", {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      value: safePrice(product.price) * quantity,
      currency: product.currency,
      quantity: quantity,
    });
  }
};

type Cart = {
  amount: number;
  currencyCode: string;
};

export const trackInitiateCheckout = async (cart: Cart): Promise<void> => {
  const ReactPixel = await getPixel();
  if (ReactPixel) {
    ReactPixel.track("InitiateCheckout", {
      value: cart.amount,
      currency: cart.currencyCode,
    });
  }
};

type Order = {
  id: string;
  line_items: Array<{ product_id: string }>;
  total_price: number;
  currency: string;
};

export const trackPurchase = async (order: Order): Promise<void> => {
  const ReactPixel = await getPixel();
  if (ReactPixel) {
    ReactPixel.track("Purchase", {
      content_ids: order.line_items.map((item) => item.product_id),
      content_type: "product",
      value: order.total_price,
      currency: order.currency,
      order_id: order.id,
    });
  }
};
