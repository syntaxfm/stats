import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../src/schema';

import { getRequestContext } from "@cloudflare/next-on-pages";

function getDB() {
  if (process.env.NODE_ENV === "development") {
    const { env } = getRequestContext();
    return drizzle(env.D1, { schema });
  }
  // Production
  return drizzle(process.env.D1, { schema });
}

export const db = getDB();

export const runtime = "edge";
