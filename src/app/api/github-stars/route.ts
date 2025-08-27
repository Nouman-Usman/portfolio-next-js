export async function GET() {
  const res = await fetch('https://api.github.com/repos/Nouman-Usman/portfolio', {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
    },
  });

  if (!res.ok) {
    return new Response('Failed to fetch stars', { status: res.status });
  }

  const data = await res.json();
  return new Response(JSON.stringify({ stars: data.stargazers_count }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}