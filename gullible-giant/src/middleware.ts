import { sequence } from 'astro:middleware';
import { blockTildeAccessMiddleware } from './middlewares/blockTildeAccess';
import { currentDomainMiddleware } from './middlewares/currentDomain';
import { domainRoutingMiddleware } from './middlewares/domainRouting';
import { healthCheckMiddleware } from './middlewares/healthCheck';
import { rateLimitMiddleware } from './middlewares/rateLimit';

export const onRequest = sequence(
  currentDomainMiddleware,
  blockTildeAccessMiddleware,
  rateLimitMiddleware,
  healthCheckMiddleware,
  domainRoutingMiddleware
);
