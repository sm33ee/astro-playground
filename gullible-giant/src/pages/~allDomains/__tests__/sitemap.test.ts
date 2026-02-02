import type { APIContext } from 'astro';
import { GET } from '../sitemap.xml';

const createMockContext = (): Partial<APIContext> => ({
  url: new URL('http://localhost/sitemap.xml'),
  request: new Request('http://localhost/sitemap.xml'),
  locals: {
    currentDomain: 'testing.com'
  }
});

describe('GET /sitemap.xml', () => {
  it('should return valid XML sitemap', async () => {
    const context = createMockContext();
    const response = await GET(context as APIContext);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/xml; charset=utf-8');

    const xml = await response.text();
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  });

  it('should include homepage in sitemap', async () => {
    const context = createMockContext();
    const response = await GET(context as APIContext);

    const xml = await response.text();
    expect(xml).toContain('<url><loc>http://localhost/</loc></url>');
  });

  it('should include questionnaire page in sitemap', async () => {
    const context = createMockContext();
    const response = await GET(context as APIContext);

    const xml = await response.text();
    expect(xml).toContain('<url><loc>http://localhost/questionnaire</loc></url>');
  });

  it('should use request origin for URLs', async () => {
    const context: Partial<APIContext> = {
      url: new URL('http://example.com/sitemap.xml'),
      request: new Request('http://example.com/sitemap.xml'),
      locals: {
        currentDomain: 'testing.com'
      }
    };

    const response = await GET(context as APIContext);
    const xml = await response.text();

    expect(xml).toContain('http://example.com/');
    expect(xml).toContain('http://example.com/questionnaire');
  });
});
