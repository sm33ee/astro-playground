import { sequence } from 'astro:middleware';
import {
  blockTildeAccessMiddleware,
  currentDomainMiddleware,
  domainRoutingMiddleware,
  healthCheckMiddleware
} from './middlewares';

/**
 * Middleware execution order:
 * 1. currentDomainMiddleware - Sets the current domain in locals (supports dev simulation)
 * 2. blockTildeAccessMiddleware - Blocks direct access to internal /~ routes
 * 3. healthCheckMiddleware - Handles health check endpoints (/health, /status, /alive)
 * 4. domainRoutingMiddleware - Routes requests to domain-specific or fallback pages
 */
export const onRequest = sequence(
  currentDomainMiddleware,
  blockTildeAccessMiddleware,
  healthCheckMiddleware,
  domainRoutingMiddleware
);
