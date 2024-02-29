export default {
  async scheduled(event, env, ctx) {
    // Write code for updating your API
    switch (event.cron) {
      case "* * * * *":
        console.log(`Once a min: ${event.cron}`);
        break;
      case "*/3 * * * *": {
        console.log(`Three times a min: ${event.cron}`);
        const result = await fetch("https://stats.syntax.fm/api/scrape/spotify", {
          headers: {
            "X-CRON-KEY": process.env.CRON_KEY
          }
        });
        console.log(await result.json());
        break;
      }
    }
    console.log("cron processed");
  },
  async fetch(event, env, ctx) {
    return new Response("We dont need a fetch handler for cron jobs. But Hi!");
  }
} satisfies ExportedHandler;

