export default {
  async scheduled(event, env, ctx) {
    // Write code for updating your API
    switch (event.cron) {
      // case "* * * * *":
      //   console.log(`Once a min: ${event.cron}`);
      //   break;
      case "0 12 * * *": {
        const headers: HeadersInit = {
          "X-CRON-KEY": env.CRON_KEY
        };
        const result = await Promise.all([
          fetch("https://stats.syntax.fm/api/scrape/spotify", { headers }).then(res => res.json()),
          fetch("https://stats.syntax.fm/api/scrape/apple", { headers }).then(res => res.json())
        ]);
        console.log(result);
        break;
      }
    }
    console.log("cron processed");
  },
  async fetch(event, env, ctx) {
    return new Response("We dont need a fetch handler for cron jobs. But Hi!");
  }
} satisfies ExportedHandler<{
  CRON_KEY: string;
}>;
