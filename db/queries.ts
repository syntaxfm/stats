import { unstable_cache as cache } from "next/cache";
import { db } from '@/db/db';

export async function getScrapes() {
  const scrapes = await db.query.scrapes.findMany({
    orderBy: (scrape, { desc }) => desc(scrape.date),
  });
  return scrapes;
}

export const getCachedScrapes = cache(
  getScrapes,
  ["scrapes"],
  {
    tags: ["scrapes"],
    revalidate: 20,
  },
);
