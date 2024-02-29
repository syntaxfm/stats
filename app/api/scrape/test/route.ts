import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
  return Response.json({
    test: 'Hello from the edgxxxxe!',
  })
}
