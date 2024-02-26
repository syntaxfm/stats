import { HTMLElement } from 'linkedom';
import { parseHTML } from 'linkedom/worker';
import { showsToWatch } from './shows';
import { formatChange } from './utils/format';

export type Show = {
  showUri: string;
  chartRankMove: 'UP' | 'DOWN' | 'UNCHANGED';
  showName: string;
  showPublisher: string;
  showImageUrl: string;
  showDescription: string;
}

export type SpotifyChartedShow = Awaited<ReturnType<typeof populateShowPositions>>[0]
export type ITunesChartedShow = Awaited<ReturnType<typeof getChartableChart>>[0]

// Get the HTML from a URL
async function getDocument(url: string, selector: string) {
  const Cookie = process.env.COOKIE;
  if (!Cookie) {
    throw new Error('No Cookie Found!');
  }
  const response = await fetch(url, { // Send cookies along
    cache: 'no-cache',
    headers: {
      // cookies
      Cookie,
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:122.0) Gecko/20100101 Firefox/122.0'
    }
  });
  const data = await response.text();
  // Use Linkedom to parse the HTML
  const { document } = parseHTML(data);
  return document.querySelector(selector)?.innerHTML;
}

export async function getChartableChart() {
  const html = await Promise.all([
    getDocument(`https://chartable.com/charts/itunes/us-technology-podcasts`, 'table.collapse.w-100'),
    getDocument(`https://chartable.com/charts/itunes/us-technology-podcasts?page=2`, 'table'),
    getDocument(`https://chartable.com/charts/itunes/us-technology-podcasts?page=3`, 'table.collapse.w-100'),
  ]
  ).then(htmls => htmls.join(''));
  // Use Linkedom to parse the HTML
  const { document } = parseHTML(html);
  const rows = document.querySelectorAll('tr')
  console.log(`rows.length: ${rows.length}`);
  const shows = (Array.from(rows) as HTMLElement[]).map((row, index) => ({
    rank: index + 1,
    showName: row.querySelector('a.link.blue')?.textContent,
    change: formatChange(row.querySelector('.green, .red, .tracked')?.textContent),
    slug: row.querySelector('a.link.blue')?.getAttribute('href')?.split('/').pop(),
  }))
  return shows;
}


export async function getSpotifyChart(region = 'us') {
  const url = `https://podcastcharts.byspotify.com/api/charts/technology?region=${region}`;
  const response = await fetch(url, {
    cache: 'no-cache',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:122.0) Gecko/20100101 Firefox/122.0'
    }
  });
  const data = await response.json() as Show[];
  data.forEach((show, i) => {
    console.log(`[scrape]: ${i + 1}. ${show.showName} - ${show.chartRankMove}`);
  });
  return data;
};

async function populateShowPositions(shows: Show[] = []) {
  const showPositions = showsToWatch.map(showToWatch => {
    const showIndex = shows.findIndex(show => show.showUri === showToWatch.showUri);
    const show = shows[showIndex];
    if (!show) {
      return {
        showUri: showToWatch.showUri,
        showName: showToWatch.showName,
        chartRankMove: null,
        rank: null,
      }
    }
    return {
      showUri: show.showUri,
      showName: show.showName,
      rank: showIndex + 1,
      chartRankMove: show.chartRankMove,
    }
  }).filter(show => show.rank).sort((a, b) => {
    if (!a.rank) return 1;
    if (a.rank < b.rank) return -1;
    if (a.rank > b.rank) return 1;
    return 0;
  });
  // console.log(showPositions);
  return showPositions;
}



function formatChart(shows: ChartedShow[] = []) {
  const skinny = shows.map(show => ({ showName: show.showName, rank: show.rank }));
  console.table(skinny)
}
