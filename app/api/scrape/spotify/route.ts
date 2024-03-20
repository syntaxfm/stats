// Next.js Edge API Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/router-handlers#edge-and-nodejs-runtimes

import { db } from '@/db/db';
import * as schema from '@/src/schema';
import { getChartableChart, getSpotifyChart } from '@/src/scrape';
import { calculateChange } from '@/src/utils/calculateChange';
import type { NextRequest, NextResponse } from 'next/server'
export const runtime = 'edge'

type ResponseData = {
  message: string
}

export async function GET(req: NextRequest, res: NextResponse<ResponseData>) {
  const spotifyChart = await getSpotifyChart();
  // Find the last spotify chart so we can compare
  const lastScrape = await db.query.scrapes.findFirst({
    where: (scrape, { eq }) => eq(scrape.type, 'spotify'),
    orderBy: (scrape, { desc }) => [desc(scrape.id)],
    with: {
      scrapeItems: true
    }
  });
  const [myScrape] = await db.insert(schema.scrapes).values({
    type: 'spotify',
  }).returning();

  for (const [i, chartItem] of spotifyChart.entries()) {
    const lastScrapeItem = lastScrape?.scrapeItems.find(scrapeItem => scrapeItem.slug === chartItem.showUri);
    const insert: typeof schema.scrapeItem.$inferInsert = {
      rank: i + 1,
      slug: chartItem.showUri,
      showName: chartItem.showName,
      change: calculateChange({
        lastRank: lastScrapeItem?.rank,
        currentRank: i + 1,
      }), // TODO: Make UP / DOWN / UNCHANGED into numbers
      scrapeId: myScrape.id,
      type: 'spotify',
    };
    await db.insert(schema.scrapeItem).values(insert)
  }
  // JSON
  return Response.json({
    message: `Scraped ${spotifyChart.length} shows from Spotify!`,
    data: myScrape
  });
}
