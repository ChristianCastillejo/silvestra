import type { Metadata } from "next";

export interface PageProps<
  TParams extends Record<string, string> = Record<string, string>,
  TSearchParams extends Record<string, string | string[] | undefined> = Record<
    string,
    string | string[] | undefined
  >
> {
  params: Promise<TParams>;
  searchParams: Promise<TSearchParams>;
}

export type PageMetadata = Metadata | Promise<Metadata>;




