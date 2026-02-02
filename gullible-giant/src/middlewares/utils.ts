import type { APIContext } from 'astro';

/**
 * Normalizes a domain string by trimming, lowercasing, and removing port numbers.
 */
export const normalizeDomain = (value: string | null | undefined): string => {
  if (!value) return '';
  return value.trim().toLowerCase().split(':')[0];
};

/**
 * Builds a rewrite URL by updating the pathname of the original request URL.
 */
export const buildRewriteUrl = (context: APIContext, pathname: string): URL => {
  const url = new URL(context.request.url);
  url.pathname = pathname;
  return url;
};

/**
 * Static asset prefixes that should skip domain routing.
 * These are typically framework or build-generated assets.
 */
const SKIP_PREFIXES = ['/_astro', '/_image', '/~'] as const;

/**
 * Checks if a pathname should skip domain-based routing.
 * Returns true for internal routes (tilde paths) and static assets.
 */
export const shouldSkipRouting = (pathname: string): boolean => {
  return SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix));
};
