import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest, response: NextResponse) {
  // Not using next.js specific APIS here so it can run anywhere
  const url = new URL(request.url);
  if (url.pathname.startsWith('/api')) {
    // API Key can be passed via a header or query param
    const apiKey = request.headers.get('X-CRON-KEY') || url.searchParams.get('CRON-KEY');
    const secret = process.env.CRON_KEY;
    if (apiKey !== secret) {
      return NextResponse.json({ error: 'Unauthorized. Please send CRON-KEY header or query param with your request' }, { status: 401 });
    }
  }
  return NextResponse.next()
}


export const config = {
  matcher: '/api/:path*',
}
