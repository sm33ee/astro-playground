import { defineMiddleware } from 'astro:middleware';
import { normalizeDomain } from './utils';

export const currentDomainMiddleware = defineMiddleware((context, next) => {
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
