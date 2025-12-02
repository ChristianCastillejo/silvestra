export const isObject = (
  object: unknown
): object is Record<string, unknown> => {
  return (
    typeof object === "object" && object !== null && !Array.isArray(object)
  );
};

export interface ShopifyError extends Error {
  status?: number;
}

export const isShopifyError = (error: unknown): error is ShopifyError => {
  if (error instanceof Error) return true;

  return (
    isObject(error) &&
    (typeof error.message === "string" || typeof error.status === "number")
  );
};
