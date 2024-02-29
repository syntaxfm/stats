'use server';

import { eq } from 'drizzle-orm';
import { db } from '../db/db';
import { scrapes } from '../src/schema';
import { revalidatePath, revalidateTag } from 'next/cache';

export type ServerActionSuccess = {
  success: true;
  message: string;
};

export type ServerActionError = {
  success: false;
  errors: string;
};

export type ServerActionResponse = ServerActionSuccess | ServerActionError;

export async function deleteScrape(state: unknown, formData: FormData): Promise<ServerActionResponse> {
  const id = parseInt(formData.get('id')?.toString() || '');
  if (!id) {
    return {
      success: false,
      errors: 'No id provided',
    };
  }
  const [deletedScrape] = await db.delete(scrapes).where(eq(scrapes.id, id)).returning();
  console.log(`Deleting scrape with id: `, formData.get("id"));
  revalidateTag('scrapes');
  return {
    success: true,
    message: `Deleted ${deletedScrape.type} Scrape from ${new Date(parseInt(deletedScrape.date)).toLocaleString()}! (id: ${deletedScrape.id})`,
  };
}
