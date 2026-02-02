import { GET } from '../hello';
import type { APIContext } from 'astro';

const createMockContext = (searchParams: Record<string, string> = {}): Partial<APIContext> => {
  const url = new URL('http://localhost/api/hello');
  Object.entries(searchParams).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return {
    url,
    request: new Request(url.toString()),
    locals: {}
  };
};

describe('GET /api/hello', () => {
  it('should return a greeting with default name', async () => {
    const context = createMockContext();
    const response = await GET(context as APIContext);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');

    const data = await response.json();
    expect(data.message).toBe('Hello, Astro!');
    expect(data.timestamp).toBeDefined();
  });

  it('should return a greeting with custom name', async () => {
    const context = createMockContext({ name: 'World' });
    const response = await GET(context as APIContext);

    const data = await response.json();
    expect(data.message).toBe('Hello, World!');
  });

  it('should handle special characters in name', async () => {
    const context = createMockContext({ name: 'John Doe' });
    const response = await GET(context as APIContext);

    const data = await response.json();
    expect(data.message).toBe('Hello, John Doe!');
  });

  it('should return valid timestamp in ISO format', async () => {
    const context = createMockContext();
    const response = await GET(context as APIContext);

    const data = await response.json();
    const timestamp = new Date(data.timestamp);
    expect(timestamp.toISOString()).toBe(data.timestamp);
    expect(timestamp.getTime()).toBeLessThanOrEqual(Date.now());
  });

  it('should return 200 status code', async () => {
    const context = createMockContext();
    const response = await GET(context as APIContext);

    expect(response.status).toBe(200);
  });
});
