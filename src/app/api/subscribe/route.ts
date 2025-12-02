import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/utils";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z
      .string()
      .min(1, "Email is required")
      .email({ message: "Invalid email address" })
  ),
});

export async function POST(
  req: NextRequest
): Promise<NextResponse<{ message: string }>> {
  try {
    const body = await req.json();

    const validationResult = subscribeSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          error: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    const SHOPIFY_STORE = process.env.SHOPIFY_STORE_URL;
    const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_NEWSLETTER_ACCESS_TOKEN;

    if (!SHOPIFY_STORE || !SHOPIFY_ACCESS_TOKEN) {
      return NextResponse.json(
        { message: "Shopify configuration missing" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://${SHOPIFY_STORE}/admin/api/2025-07/customers.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
        },
        body: JSON.stringify({
          customer: {
            email: email,
            accepts_marketing: true,
          },
        }),
      }
    );

    const data = (await response.json()) as { errors?: unknown };

    if (!response.ok) {
      const errorMessage = data.errors
        ? JSON.stringify(data.errors)
        : "Failed to subscribe";
      return NextResponse.json(
        { message: errorMessage },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json(
      { message: "Subscribed successfully!" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
