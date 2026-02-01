import { defineMiddleware } from 'astro:middleware';
import { buildRewriteUrl, normalizeDomain, shouldSkipRouting } from './utils';

export const domainRoutingMiddleware = defineMiddleware(async (context, next) => {
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
