import { defineMiddleware } from 'astro:middleware';
import { normalizeDomain } from './utils';
import { isDomainAllowed } from '../config/domains';

export const currentDomainMiddleware = defineMiddleware((context, next) => {
  const actualDomain = normalizeDomain(context.url.hostname);
  let currentDomain = actualDomain;
  const isDev = import.meta.env?.DEV ?? process.env.NODE_ENV !== 'production';

  if (isDev) {
    const simulatedDomain = normalizeDomain(context.url.searchParams.get('simulated_domain'));
    const localDomain = normalizeDomain(process.env.LOCAL_DOMAIN);
    currentDomain = simulatedDomain || localDomain || actualDomain;
  }

  // Validate domain is allowed (skip in development)
  if (!isDomainAllowed(currentDomain, isDev)) {
    return new Response('Forbidden: Domain not allowed', { status: 403 });
  }

  context.locals.currentDomain = currentDomain;
  return next();
});
