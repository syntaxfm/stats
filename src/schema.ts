import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const scrapes = sqliteTable('scrapes', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  type: text('type', { enum: ["itunes", "spotify"] }).notNull(),
  date: text('date').notNull().$default(() => Date.now().toString())
});


export const scrapeItem = sqliteTable('scrapeItem', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  rank: integer('rank').notNull(),
  showName: text('showName').default('Show Name Unable to be Scraped'),
  change: integer('change'),
  slug: text('slug').notNull().default('slug-unable-to-be-scraped'),
  scrapeId: integer('scrapeId', { mode: 'number' }).notNull(),
  type: text('type', { enum: ["itunes", "spotify"] }).notNull(),
  date: text('date').notNull().$default(() => Date.now().toString())
});

export const scrapeRelations = relations(scrapes, ({ many }) => ({
  scrapeItems: many(scrapeItem)
}));

export const scrapeItemRelations = relations(scrapeItem, ({ one }) => ({
  scrape: one(scrapes, {
    // The field on scrapeItem that references the scrape
    fields: [scrapeItem.scrapeId],
    // The PK on scrape that is referenced
    references: [scrapes.id]
  })
}));
