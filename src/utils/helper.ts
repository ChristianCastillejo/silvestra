import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

// Definimos qué aceptamos: Un objeto simple de strings o números
type QueryParams = Record<string, string | number | undefined>;

export function useUpdateURL(): (params: QueryParams) => void {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return useCallback(
    (params: QueryParams): void => {
      // Initialize with existing search params to preserve them (e.g., UTM tags, other filters)
      const newSearchParams = new URLSearchParams(searchParams.toString());

      // Update or set the specific keys from the new params
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          newSearchParams.set(key, String(value));
        } else {
          // Remove the key if value is undefined, null, or empty string
          newSearchParams.delete(key);
        }
      });

      const queryString = newSearchParams.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(url, { scroll: false });
    },
    [router, pathname, searchParams]
  );
}
