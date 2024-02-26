import { Hono } from 'hono'

import { desc, eq } from 'drizzle-orm';
import { DrizzleD1Database, drizzle } from 'drizzle-orm/d1';
import { ItunesChart } from '../components/ChartRankings';
import { ChartsList } from '../components/ChartsList';
import { Layout } from './components/Layout';
import * as schema from './schema';
import { getChartableChart, getSpotifyChart } from './scrape';
import { slugs } from './shows';

import { ComparisonChart } from '../components/ComparisonChart';
import { asyncLocalStorageMiddleware, env } from './utils/asyncLocalStorage';
import { calculateChange } from './utils/calculateChange';

export type Env = {
  D1: D1Database;
  db: DrizzleD1Database<typeof schema>;
  COOKIE: string;
  API_KEY: string;
}

const app = new Hono<{ Bindings: Env }>();

app.use('*', async (c, next) => {
  if (!c.env) {
    return await next();
  }
  c.env.db = drizzle(c.env.D1, { schema });
  await next();
});

app.use('*', asyncLocalStorageMiddleware);

app.get('/', async (c) => {
  // Get the latest 10 scrapes
  const scrapes = await c.env.db.select().from(schema.scrapes).orderBy(desc(schema.scrapes.date));
  return c.html(Layout(ChartsList(scrapes)))
})
app.get('/chart', async (c) => {
  // Get the latest 10 scrapes
  const scrapes = await c.env.db.select().from(schema.scrapes).orderBy(desc(schema.scrapes.date));
  return c.html(Layout(ComparisonChart(scrapes)))
})

app.get('/chart/:chartId', async (c) => {
  // Get the latest 10 scrapes
  const scrape = await c.env.db.select().from(schema.scrapes).where(
    eq(schema.scrapes.id, parseInt(c.req.param('chartId')))
  );
  const scrapes = await c.env.db.select().from(schema.scrapeItem).where(
    eq(schema.scrapeItem.scrapeId, parseInt(c.req.param('chartId')))
  );
  const codingShows = scrapes.filter(show => slugs.includes(show.slug));
  return c.html(Layout(ItunesChart(scrape.at(0), codingShows)))
})


app.post('/chart/:chartId/delete', async (c) => {
  const id = c.req.param('chartId');
  // Delete the scrape and all scrape Items
  const scrape = await c.env.db.query.scrapes.findFirst({
    where: (scrape, { eq }) => eq(scrape.id, parseInt(id))
  });
  const scrapeItems = await c.env.db.query.scrapeItem.findMany({
    where: (scrape, { eq }) => eq(scrape.scrapeId, parseInt(id))
  });
  const deletedItems = await c.env.db.delete(schema.scrapeItem).where(
    eq(schema.scrapeItem.scrapeId, parseInt(id))
  ).returning({ deletedId: schema.scrapeItem.id });
  const deletedScrape = await c.env.db.delete(schema.scrapes).where(
    eq(schema.scrapes.id, parseInt(id))
  ).returning({ deletedId: schema.scrapes.id }
  )

  return c.json({
    message: `Deleted ${deletedScrape.length} scrape and ${deletedItems.length} items`
  })
})

app.get('/last', async ({ env, ...c }) => {
  const store = asyncLocalStorage.getStore();
  console.log(store);
  const lastScrape = await env.db.query.scrapes.findFirst({
    where: (scrape, { eq }) => eq(scrape.type, 'spotify'),
    orderBy: (scrape, { desc }) => [desc(scrape.id)],
    with: {
      scrapeItems: true
    }
  });
  return c.json(lastScrape)
});

app.get('/spotify', async ({ env, ...c }) => {
  const db = env.db;
  const spotifyChart = await getSpotifyChart();
  // Find the last spotify chart so we can compare
  const lastScrape = await env.db.query.scrapes.findFirst({
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
  return c.redirect(`/chart/${myScrape.id}`)
});

app.get('/scrape', async ({ env, ...c }) => {
  const db = env.db;

  const chart = (await getChartableChart());
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

  return c.redirect(`/chart/${myScrape.id}`);
})

export default app
