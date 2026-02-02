import type { APIRoute } from 'astro';

const buildUrl = (origin: string, path: string) => `${origin}${path}`;

export const GET: APIRoute = ({ request }) => {
  const origin = new URL(request.url).origin;
  const urls = [buildUrl(origin, '/'), buildUrl(origin, '/questionnaire')];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>
`;

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
};
