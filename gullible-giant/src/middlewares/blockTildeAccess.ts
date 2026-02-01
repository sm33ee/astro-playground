import { defineMiddleware } from 'astro:middleware';

export const blockTildeAccessMiddleware = defineMiddleware((context, next) => {
  if (context.url.pathname.startsWith('/~')) {
    return new Response('Not Found', { status: 404 });
  }

  return next();
});
