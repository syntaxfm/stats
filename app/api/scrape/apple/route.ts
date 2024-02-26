// Next.js Edge API Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/router-handlers#edge-and-nodejs-runtimes

import { db } from '@/db/db';
import * as schema from '@/src/schema';
import { getChartableChart } from '@/src/scrape';
import type { NextRequest, NextResponse } from 'next/server'
export const runtime = 'edge'

type ResponseData = {
  message: string
}

export async function GET(req: NextRequest, res: NextResponse<ResponseData>) {

  const chart = await getChartableChart();
  // Save to db
  const [myScrape] = await db.insert(schema.scrapes).values({
    type: 'itunes',
  }).returning();
  for (const chartItem of chart) {
    const insert = {
      ...chartItem,
      scrapeId: myScrape.id,
      type: 'itunes',
    } satisfies typeof schema.scrapeItem.$inferInsert;
    await db.insert(schema.scrapeItem).values(insert)
  }
  // JSON
  return Response.json({
    message: `Scraped ${chart.length} shows from Chartable`,
    data: myScrape
  });
}
