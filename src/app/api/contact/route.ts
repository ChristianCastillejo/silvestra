import { NextRequest, NextResponse } from "next/server";
import EmailTemplate from "@/components/email/email-template";
import { Resend } from "resend";
import { handleApiError } from "@/lib/utils";
import { z } from "zod";

const contactSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  name: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(
  req: NextRequest
): Promise<NextResponse<{ message: string; error?: unknown; data?: unknown }>> {
  try {
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        {
          message: "Invalid request body",
          error: "Request body must be valid JSON",
        },
        { status: 400 }
      );
    }

    const validationResult = contactSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          error: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { email, name, message } = validationResult.data;

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { message: "Email service not configured" },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: "Website <onboarding@resend.dev>",
      to: ["your@gmail.com"],
      subject: "New contact message!",
      react: EmailTemplate({
        name: name || "",
        email: email,
        message: message || "",
      }),
    });

    if (error) {
      return NextResponse.json(
        { message: "Failed to send email", error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Successfully sent!", data },
      { status: 200 }
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
