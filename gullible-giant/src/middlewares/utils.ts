import type { APIContext } from 'astro';

const ROUTED_PATHS = new Set(['/favicon.ico', '/favicon.svg', '/robots.txt']);
const STATIC_EXTENSIONS = new Set([
  'css',
  'js',
  'mjs',
  'map',
  'json',
  'png',
  'jpg',
  'jpeg',
  'webp',
  'gif',
  'svg',
  'ico',
  'txt',
  'xml',
  'webmanifest'
]);

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
  if (ROUTED_PATHS.has(pathname)) return false;
  if (pathname.startsWith('/~')) return true;
  if (pathname.startsWith('/_astro') || pathname.startsWith('/_image')) return true;
  if (pathname === '/sitemap.xml') return true;

  const lastSegment = pathname.split('/').pop() ?? '';
  if (!lastSegment.includes('.')) return false;
  const extension = lastSegment.split('.').pop()?.toLowerCase();
  return Boolean(extension && STATIC_EXTENSIONS.has(extension));
};
