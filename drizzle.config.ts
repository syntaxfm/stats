import { Config } from 'drizzle-kit';
console.log(process.cwd());
export default {
	"out": "drizzle",
	"schema": "src/schema.ts",
	"driver": "d1",
  dbCredentials: {
    wranglerConfigPath: `${process.cwd()}/wrangler.toml`,
    dbName: "podcast-stats-prod"
  }
} satisfies Config;
