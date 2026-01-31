import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ request }) => {
  const url = new URL(request.url);
  const name = url.searchParams.get('name') ?? 'Astro';

  return new Response(
    JSON.stringify({
      message: `Hello, ${name}!`,
      timestamp: new Date().toISOString()
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};
