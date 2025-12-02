interface SetCookieResponse {
  success?: boolean;
}

function isSetCookieResponse(value: unknown): value is SetCookieResponse {
  return (
    (typeof value === "object" &&
      value !== null &&
      // Casting seguro para comprobar propiedades
      (value as Record<string, unknown>).success === undefined) ||
    typeof (value as Record<string, unknown>).success === "boolean"
  );
}

export async function setCookie(name: string, value: string): Promise<boolean> {
  if (typeof window === "undefined" || typeof fetch === "undefined") {
    console.error("setCookie: fetch is not available (SSR environment)");
    return false;
  }

  try {
    const response = await fetch("/api/set-cookie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, value }),
    });

    const data: unknown = await response.json();

    if (!isSetCookieResponse(data)) {
      console.error("setCookie: invalid response format");
      return false;
    }

    return data.success ?? false;
  } catch (error: unknown) {
    console.error("Error setting cookie:", error);
    return false;
  }
}
