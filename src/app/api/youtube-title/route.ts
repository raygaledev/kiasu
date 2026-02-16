import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Could not fetch video info' },
        { status: 404 },
      );
    }

    const data = await res.json();
    return NextResponse.json({ title: data.title });
  } catch {
    return NextResponse.json(
      { error: 'Could not fetch video info' },
      { status: 500 },
    );
  }
}
