import type { APIRoute } from 'astro';

const body = `User-agent: *
Allow: /
`;

export const GET: APIRoute = () => {
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
};
