import type { APIContext } from 'astro';

export const normalizeDomain = (value: string | null | undefined) => {
  if (!value) return '';
  return value.trim().toLowerCase().split(':')[0];
};

export const buildRewriteUrl = (context: APIContext, pathname: string) => {
  const url = new URL(context.request.url);
  url.pathname = pathname;
  return url;
};

export const shouldSkipRouting = (pathname: string) => {
  if (pathname.startsWith('/~')) return true;
  return pathname.startsWith('/_astro') || pathname.startsWith('/_image');
};
