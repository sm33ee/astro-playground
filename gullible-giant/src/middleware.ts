import { sequence } from 'astro:middleware';
import { blockTildeAccessMiddleware } from './middlewares/blockTildeAccess';
import { currentDomainMiddleware } from './middlewares/currentDomain';
import { domainRoutingMiddleware } from './middlewares/domainRouting';
import { healthCheckMiddleware } from './middlewares/healthCheck';

export const onRequest = sequence(
  currentDomainMiddleware,
  blockTildeAccessMiddleware,
  healthCheckMiddleware,
  domainRoutingMiddleware
);
