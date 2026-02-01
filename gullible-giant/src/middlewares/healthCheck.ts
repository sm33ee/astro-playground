import { defineMiddleware } from 'astro:middleware';
import { buildRewriteUrl } from './utils';

const HEALTH_PATHS = new Set(['/health', '/status', '/alive']);

export const healthCheckMiddleware = defineMiddleware((context, next) => {
  const pathname =
    context.url.pathname.endsWith('/') && context.url.pathname !== '/'
      ? context.url.pathname.slice(0, -1)
      : context.url.pathname;

  if (HEALTH_PATHS.has(pathname)) {
    return next(buildRewriteUrl(context, '/~allDomains/api/status/health'));
  }

  return next();
});
