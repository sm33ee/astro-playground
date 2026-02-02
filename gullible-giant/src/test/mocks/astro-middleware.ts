import type { MiddlewareHandler } from 'astro';

export const defineMiddleware = (handler: MiddlewareHandler): MiddlewareHandler => {
  return handler;
};

export const sequence = (...handlers: MiddlewareHandler[]): MiddlewareHandler => {
  return async (context, next) => {
    let index = 0;

    const runNext = async (): Promise<Response> => {
      if (index < handlers.length) {
        const handler = handlers[index++];
        return handler(context, runNext);
      }
      return next();
    };

    return runNext();
  };
};
