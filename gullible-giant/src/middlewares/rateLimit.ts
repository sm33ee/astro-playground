import { defineMiddleware } from 'astro:middleware';

/**
 * Simple in-memory rate limiter for API endpoints.
 * For production, consider using Redis or a dedicated rate limiting service.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 60; // 60 requests per minute
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // Clean up old entries every 5 minutes

/**
 * Get client identifier from request (IP address or other identifier)
 */
const getClientId = (request: Request, url: URL): string => {
  // Try to get real IP from headers (for proxied requests)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  const ip = cfConnectingIp || realIp || forwardedFor?.split(',')[0] || url.hostname;
  return ip.trim();
};

/**
 * Check if request should be rate limited based on path
 */
const shouldRateLimit = (pathname: string): boolean => {
  // Rate limit API endpoints
  return pathname.startsWith('/api/') || pathname.startsWith('/~allDomains/api/');
};

/**
 * Clean up expired entries from the rate limit store
 */
const cleanupExpiredEntries = () => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
};

// Set up periodic cleanup
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, CLEANUP_INTERVAL_MS);
}

/**
 * Rate limiting middleware
 */
export const rateLimitMiddleware = defineMiddleware((context, next) => {
  const { request, url } = context;
  const pathname = url.pathname;

  // Skip rate limiting for non-API endpoints
  if (!shouldRateLimit(pathname)) {
    return next();
  }

  const clientId = getClientId(request, url);
  const now = Date.now();
  const key = `${clientId}:${pathname}`;

  let entry = rateLimitStore.get(key);

  // Create new entry or reset if window expired
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS
    };
    rateLimitStore.set(key, entry);
    return next();
  }

  // Increment request count
  entry.count++;

  // Check if limit exceeded
  if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

    return new Response(
      JSON.stringify({
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
        retryAfter
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': entry.resetTime.toString()
        }
      }
    );
  }

  // Add rate limit headers to response
  const response = next();

  // If response is a promise, add headers after resolving
  if (response instanceof Promise) {
    return response.then((res) => {
      res.headers.set('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());
      res.headers.set(
        'X-RateLimit-Remaining',
        (RATE_LIMIT_MAX_REQUESTS - entry.count).toString()
      );
      res.headers.set('X-RateLimit-Reset', entry.resetTime.toString());
      return res;
    });
  }

  // Add headers to synchronous response
  response.headers.set('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());
  response.headers.set('X-RateLimit-Remaining', (RATE_LIMIT_MAX_REQUESTS - entry.count).toString());
  response.headers.set('X-RateLimit-Reset', entry.resetTime.toString());

  return response;
});
