export default {
  async scheduled(event, env, ctx) {
    // Write code for updating your API
    switch (event.cron) {
      case "* * * * *":
        // Every one minutes
        console.log(`CRon: ${event.cron}`);
        break;
      case "*/3 * * * *":
        // Every ten minutes
        console.log(`Running cron job with cron: ${event.cron}`);
        // await updateAPI2();
        break;
    }
    console.log("cron processed");
  },
  fetch: async (event, env, ctx) => {
    return new Response("We dont need a fetch handler for cron jobs. But Hi!");
  }
} satisfies ExportedHandler;
