import { healthCheckMiddleware } from '../healthCheck';
import type { APIContext } from 'astro';

const createMockContext = (pathname: string): Partial<APIContext> => ({
  url: new URL(`http://localhost${pathname}`),
  request: new Request(`http://localhost${pathname}`),
  locals: {}
});

const mockNext = jest.fn((url?: URL) => {
  if (url) {
    return new Response(JSON.stringify({ status: 'ok' }), { status: 200 });
  }
  return new Response('OK', { status: 200 });
});

describe('healthCheckMiddleware', () => {
  beforeEach(() => {
    mockNext.mockClear();
  });

  it('should route /health to health check endpoint', async () => {
    const context = createMockContext('/health');
    await healthCheckMiddleware(context as APIContext, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const callArg = mockNext.mock.calls[0][0];
    expect(callArg.pathname).toBe('/~allDomains/api/status/health');
  });

  it('should route /status to health check endpoint', async () => {
    const context = createMockContext('/status');
    await healthCheckMiddleware(context as APIContext, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const callArg = mockNext.mock.calls[0][0];
    expect(callArg.pathname).toBe('/~allDomains/api/status/health');
  });

  it('should route /alive to health check endpoint', async () => {
    const context = createMockContext('/alive');
    await healthCheckMiddleware(context as APIContext, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const callArg = mockNext.mock.calls[0][0];
    expect(callArg.pathname).toBe('/~allDomains/api/status/health');
  });

  it('should strip trailing slash from health paths', async () => {
    const context = createMockContext('/health/');
    await healthCheckMiddleware(context as APIContext, mockNext);

    expect(mockNext).toHaveBeenCalled();
    const callArg = mockNext.mock.calls[0][0];
    expect(callArg.pathname).toBe('/~allDomains/api/status/health');
  });

  it('should not route regular paths', async () => {
    const context = createMockContext('/about');
    await healthCheckMiddleware(context as APIContext, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should preserve trailing slash for root path', async () => {
    const context = createMockContext('/');
    await healthCheckMiddleware(context as APIContext, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
  });
});
