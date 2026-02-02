import { defineMiddleware } from 'astro:middleware';
import { buildRewriteUrl, normalizeDomain, shouldSkipRouting } from './utils';

const FALLBACK_PREFIX = '/~allDomains';

export const domainRoutingMiddleware = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  if (shouldSkipRouting(pathname)) return next();

  // currentDomainMiddleware already normalizes the domain, use it directly if available
  const currentDomain = context.locals.currentDomain || normalizeDomain(context.url.hostname);
  if (!currentDomain) return next();

  // Try domain-specific route first
  const primaryPath = `/~${currentDomain}${pathname}`;
  const primaryResponse = await next(buildRewriteUrl(context, primaryPath));
  if (primaryResponse.status !== 404) {
    return primaryResponse;
  }

  // Fall back to shared routes
  const fallbackPath = `${FALLBACK_PREFIX}${pathname}`;
  return next(buildRewriteUrl(context, fallbackPath));
});
