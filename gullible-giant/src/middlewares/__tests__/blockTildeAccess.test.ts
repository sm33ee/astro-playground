import { blockTildeAccessMiddleware } from '../blockTildeAccess';
import type { APIContext } from 'astro';

const createMockContext = (pathname: string): Partial<APIContext> => ({
  url: new URL(`http://localhost${pathname}`),
  request: new Request(`http://localhost${pathname}`),
  locals: {}
});

const mockNext = jest.fn(() => new Response('OK', { status: 200 }));

describe('blockTildeAccessMiddleware', () => {
  beforeEach(() => {
    mockNext.mockClear();
  });

  it('should block paths starting with tilde', async () => {
    const context = createMockContext('/~allDomains');
    const response = await blockTildeAccessMiddleware(context as APIContext, mockNext);

    expect(response.status).toBe(404);
    expect(await response.text()).toBe('Not Found');
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should block domain-specific tilde paths', async () => {
    const context = createMockContext('/~domain1.com/page');
    const response = await blockTildeAccessMiddleware(context as APIContext, mockNext);

    expect(response.status).toBe(404);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should allow regular paths', async () => {
    const context = createMockContext('/about');
    const response = await blockTildeAccessMiddleware(context as APIContext, mockNext);

    expect(response.status).toBe(200);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should allow root path', async () => {
    const context = createMockContext('/');
    await blockTildeAccessMiddleware(context as APIContext, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('should allow API paths', async () => {
    const context = createMockContext('/api/hello');
    await blockTildeAccessMiddleware(context as APIContext, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});
