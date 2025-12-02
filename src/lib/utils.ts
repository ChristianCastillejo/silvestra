import { NextResponse } from "next/server";

export const ensureStartsWith = (string: string, prefix: string): string => {
  return string.startsWith(prefix) ? string : `${prefix}${string}`;
};

export function handleApiError(
  error: unknown
): NextResponse<{ message: string }>;
export function handleApiError(
  error: unknown,
  format: "success"
): NextResponse<{ success: boolean; message?: string; error?: string }>;
export function handleApiError(
  error: unknown,
  format?: "default" | "success"
):
  | NextResponse<{ message: string }>
  | NextResponse<{ success: boolean; message?: string; error?: string }> {
  const errorMessage = error instanceof Error ? error.message : "Unknown error";

  if (format === "success") {
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: errorMessage }, { status: 500 });
}
