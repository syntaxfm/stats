import * as schema from './schema';
export type ScrapeItem = typeof schema.scrapeItem.$inferSelect
export type Scrape = typeof schema.scrapes.$inferSelect
export type ScrapeWithItems = typeof schema.scrapes.$inferSelect & {
  scrapeItems: ScrapeItem[]
}
