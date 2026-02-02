import { GET } from '../robots.txt';
import type { APIContext } from 'astro';

const createMockContext = (): Partial<APIContext> => ({
  url: new URL('http://localhost/robots.txt'),
  request: new Request('http://localhost/robots.txt'),
  locals: {}
});

describe('GET /robots.txt', () => {
  it('should return robots.txt content', async () => {
    const context = createMockContext();
    const response = await GET(context as APIContext);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');

    const text = await response.text();
    expect(text).toContain('User-agent: *');
    expect(text).toContain('Allow: /');
  });

  it('should allow all user agents', async () => {
    const context = createMockContext();
    const response = await GET(context as APIContext);

    const text = await response.text();
    expect(text).toMatch(/User-agent:\s*\*/);
  });
});
