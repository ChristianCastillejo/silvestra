import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { handleApiError } from "@/lib/utils";

interface CookiePayload {
  name: string;
  value: string;
}

export async function POST(
  req: NextRequest
): Promise<
  NextResponse<{ success: boolean; message?: string; error?: string }>
> {
  try {
    const body: CookiePayload = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { success: false, message: "Cookie name is required" },
        { status: 400 }
      );
    }

    if (body.value === undefined || body.value === null) {
      return NextResponse.json(
        { success: false, message: "Cookie value is required" },
        { status: 400 }
      );
    }

    (await cookies()).set(body.name, body.value);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    return handleApiError(error, "success");
  }
}
