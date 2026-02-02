import { GET as getIco } from '../favicon.ico';
import { GET as getSvg } from '../favicon.svg';
import type { APIContext } from 'astro';

const createMockContext = (pathname: string): Partial<APIContext> => ({
  url: new URL(`http://localhost${pathname}`),
  request: new Request(`http://localhost${pathname}`),
  locals: {}
});

describe('favicon endpoints', () => {
  describe('GET /favicon.ico', () => {
    it('should redirect to SVG favicon', async () => {
      const context = createMockContext('/favicon.ico');
      const response = await getIco(context as APIContext);

      expect(response.status).toBe(302);
      expect(response.headers.get('Location')).toBe('/favicon.svg');
    });

    it('should not return body content', async () => {
      const context = createMockContext('/favicon.ico');
      const response = await getIco(context as APIContext);

      const text = await response.text();
      expect(text).toBe('');
    });
  });

  describe('GET /favicon.svg', () => {
    it('should return SVG content', async () => {
      const context = createMockContext('/favicon.svg');
      const response = await getSvg(context as APIContext);

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('image/svg+xml');
    });

    it('should return valid SVG', async () => {
      const context = createMockContext('/favicon.svg');
      const response = await getSvg(context as APIContext);

      const svg = await response.text();
      expect(svg).toContain('<svg');
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(svg).toContain('</svg>');
    });

    it('should include dark mode styles', async () => {
      const context = createMockContext('/favicon.svg');
      const response = await getSvg(context as APIContext);

      const svg = await response.text();
      expect(svg).toContain('prefers-color-scheme: dark');
    });

    it('should include path element', async () => {
      const context = createMockContext('/favicon.svg');
      const response = await getSvg(context as APIContext);

      const svg = await response.text();
      expect(svg).toContain('<path');
      expect(svg).toContain('</style>');
    });
  });
});
