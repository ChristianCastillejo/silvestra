import { NextRequest, NextResponse } from "next/server";

const FACEBOOK_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL

interface LineItem {
  product_id: number;
  title: string;
  price: string;
  quantity: number;
}

interface ShopifyOrder {
  id: number;
  total_price: string;
  currency: string;
  line_items: LineItem[];
  email: string;
  client_details?: {
    browser_ip?: string;
  };
}

interface OrderData {
  order_id: number;
  total_price: string;
  currency: string;
  products: Array<{
    id: number;
    name: string;
    price: string;
    quantity: number;
  }>;
  customer_email: string;
  customer_ip?: string;
}

async function verifyShopifyWebhook(
  body: string,
  hmacHeader: string | null
): Promise<boolean> {
  if (!SHOPIFY_WEBHOOK_SECRET || !hmacHeader) {
    return false;
  }

  const encoder = new TextEncoder();
  const keyData = encoder.encode(SHOPIFY_WEBHOOK_SECRET);
  const data = encoder.encode(body);

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, data);

  const hash = btoa(String.fromCharCode(...Array.from(new Uint8Array(signature))));

  return hash === hmacHeader;
}

async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);

  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sendPurchaseEvent(order: OrderData): Promise<void> {
  if (!FACEBOOK_PIXEL_ID || !FACEBOOK_ACCESS_TOKEN) {
    console.error("Facebook Pixel configuration missing");
    return;
  }

  const hashedEmail = order.customer_email
    ? await hashData(order.customer_email)
    : undefined;

  const url = `https://graph.facebook.com/v18.0/${FACEBOOK_PIXEL_ID}/events`;

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_source_url: SITE_URL,
        user_data: {
          em: hashedEmail ? [hashedEmail] : [],
          client_ip_address: order.customer_ip || "",
        },
        custom_data: {
          content_ids: order.products.map((p) => p.id),
          content_name: order.products.map((p) => p.name).join(", "),
          content_type: "product",
          value: order.total_price,
          currency: order.currency,
        },
      },
    ],
    access_token: FACEBOOK_ACCESS_TOKEN,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const result = await response.json();
      console.error("Facebook API error:", result);
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending Facebook Pixel event:", errorMessage);
  }
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<{ message: string }>> {
  try {
    const topic = req.headers.get("x-shopify-topic");
    const hmacHeader = req.headers.get("x-shopify-hmac-sha256");
    const rawBody = await req.text();

    if (!topic) {
      return NextResponse.json(
        { message: "Missing x-shopify-topic header" },
        { status: 400 }
      );
    }

    const isValid = await verifyShopifyWebhook(rawBody, hmacHeader);
    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    let body: ShopifyOrder;
    try {
      body = JSON.parse(rawBody) as ShopifyOrder;
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    if (topic === "orders/create") {
      if (!body.line_items || !Array.isArray(body.line_items)) {
        return NextResponse.json(
          { message: "Invalid order data: missing line_items" },
          { status: 400 }
        );
      }

      const order: OrderData = {
        order_id: body.id,
        total_price: body.total_price || "0",
        currency: body.currency || "USD",
        products: body.line_items.map((item) => ({
          id: item.product_id,
          name: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        customer_email: body.email || "",
        customer_ip: body.client_details?.browser_ip,
      };

      await sendPurchaseEvent(order);
    }

    return NextResponse.json({ message: "Webhook received!" }, { status: 200 });
  } catch (error: unknown) {
    console.error(
      "Error handling webhook:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}