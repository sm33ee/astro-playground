import type { APIContext } from 'astro';
import { defineMiddleware, sequence } from 'astro:middleware';

const HEALTH_PATHS = new Set(['/health', '/status', '/alive']);
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

const normalizeDomain = (value: string | null | undefined) => {
  if (!value) return '';
  return value.trim().toLowerCase().split(':')[0];
};

const buildRewriteUrl = (context: APIContext, pathname: string) => {
  const url = new URL(context.request.url);
  url.pathname = pathname;
  return url;
};

const shouldSkipRouting = (pathname: string) => {
  if (pathname.startsWith('/~')) return true;
  if (pathname.startsWith('/_astro') || pathname.startsWith('/_image')) return true;
  if (pathname === '/favicon.ico' || pathname === '/favicon.svg') return true;
  if (pathname === '/robots.txt' || pathname === '/sitemap.xml') return true;

  const lastSegment = pathname.split('/').pop() ?? '';
  if (!lastSegment.includes('.')) return false;
  const extension = lastSegment.split('.').pop()?.toLowerCase();
  return Boolean(extension && STATIC_EXTENSIONS.has(extension));
};

const currentDomainMiddleware = defineMiddleware((context, next) => {
  const actualDomain = normalizeDomain(context.url.hostname);
  let currentDomain = actualDomain;
  const isDev = import.meta.env?.DEV ?? process.env.NODE_ENV !== 'production';

  if (isDev) {
    const simulatedDomain = normalizeDomain(context.url.searchParams.get('simulated_domain'));
    const localDomain = normalizeDomain(process.env.LOCAL_DOMAIN);
    currentDomain = simulatedDomain || localDomain || actualDomain;
  }

  context.locals.currentDomain = currentDomain;
  return next();
});

const healthCheckMiddleware = defineMiddleware((context, next) => {
  const pathname = context.url.pathname.endsWith('/') && context.url.pathname !== '/'
    ? context.url.pathname.slice(0, -1)
    : context.url.pathname;

  if (HEALTH_PATHS.has(pathname)) {
    return next(buildRewriteUrl(context, '/~allDomains/api/status/health'));
  }

  return next();
});

const domainRoutingMiddleware = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  if (shouldSkipRouting(pathname)) return next();

  const currentDomain = normalizeDomain(context.locals.currentDomain ?? context.url.hostname);
  if (!currentDomain) return next();

  const primaryPath = `/~${currentDomain}${pathname}`;
  const primaryResponse = await next(buildRewriteUrl(context, primaryPath));
  if (primaryResponse.status !== 404) {
    return primaryResponse;
  }

  const fallbackPath = `/~allDomains${pathname}`;
  return next(buildRewriteUrl(context, fallbackPath));
});

export const onRequest = sequence(
  currentDomainMiddleware,
  healthCheckMiddleware,
  domainRoutingMiddleware
);
