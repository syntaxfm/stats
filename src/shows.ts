// List of coding podcasts to chart

async function fetchArt(showUri: string) {
  // https://embed.spotify.com/oembed?url=spotify:show:4kYCRYJ3yK5DQbP5tbfZby
  const url = `https://embed.spotify.com/oembed?url=${showUri}`;
  const res = await fetch(url)
    .then(response => response.json()) as { thumbnail_url: string };
  return res.thumbnail_url;
}

export type ShowtoWatch = {
  showUri: string;
  showName: string;
  color: string;
  slug: string;
  art: string;
};

export const showsToWatch: ShowtoWatch[] = [
  {
    showUri: 'spotify:show:4kYCRYJ3yK5DQbP5tbfZby',
    showName: 'Syntax',
    color: '#FABF46',
    slug: 'syntax-tasty-web-development-treats',
    art: 'https://i.scdn.co/image/ab67656300005f1fb84c022aff150c336f73b395'
  },
  {
    showUri: 'spotify:show:7CpuEnbCLIXwI6LEcbBOYP',
    showName: 'Free Code Camp',
    color: "#d0d0d5",
    slug: 'the-freecodecamp-podcast',
    art: 'https://i.scdn.co/image/ab67656300005f1f4fa5008b3e0659bc04a50b33'
  },
  {
    showUri: 'spotify:show:2T2OwucPOy2uDG1CUsjIMB',
    showName: 'Code Newbie',
    color: "#8f13fd",
    slug: 'codenewbie',
    art: 'https://i.scdn.co/image/ab67656300005f1fd378fff418f60055bd6634e8'
  },
  {
    showUri: 'spotify:show:41Av6Rq81LfOT3Volz7W9D',
    showName: 'Real Python',
    color: "#15354c",
    slug: 'the-real-python-podcast',
    art: 'https://i.scdn.co/image/f983e0dc12c37a5cc4a011aa6e63872616c57c6d'
  },
  {
    showUri: 'spotify:show:0Giuw6eNbTzP9CDZODDrA2',
    showName: 'FrontEnd Happy Hour',
    color: "#3a4750",
    slug: 'front-end-happy-hour',
    art: 'https://i.scdn.co/image/ab67656300005f1f144f9e61e8a815833a1def11'
  },
  {
    showUri: 'spotify:show:142I2b9HGjWhRgPXhOYUnN',
    showName: 'DevTools.fm',
    color: "#d483eb",
    slug: 'devtoolsfm',
    art: 'https://i.scdn.co/image/ab67656300005f1f9c0add3c3d76c74f3f438a90'
  },
  {
    showUri: 'spotify:show:2PUoQB330ft0sTzSNoCPrH',
    showName: 'Shoptalk Show',
    slug: 'shoptalk',
    color: "#ce6732",
    art: 'https://i.scdn.co/image/4fdd6e5b727c9b59ac4ced20f1060868d168bde5'
  },
  {
    showUri: 'spotify:show:59I1XnvAB9fQzSj9SIKCoI',
    showName: 'SoftSkills Engineering',
    color: "#faa28a",
    slug: 'soft-skills-engineering',
    art: 'https://i.scdn.co/image/a0674b7277bf2d271e55169ee92f441af44049ad'
  },
  {
    showUri: 'spotify:show:0e5eoM6w7eW9Wu7wMA04Tr',
    showName: 'StackOverflow Podcast',
    color: "#f48024",
    slug: 'the-stack-overflow-podcast-1483510527',
    art: 'https://i.scdn.co/image/ab67656300005f1f493e8f09033e2ed1d79ee18a'
  },
  {
    showUri: 'spotify:show:35trT95UkRVCkEb6tXndpF',
    showName: 'Backend Banter',
    slug: 'backend-banter',
    color: "#262a2d",
    art: 'https://i.scdn.co/image/ab67656300005f1f1e2d53fc7468148b84ab0ce9'
  },
  {
    showUri: 'spotify:show:6xpiit8aJmwDHk1rKdxmri',
    showName: 'JavaScript Jabber',
    color: "#f7df1e",
    slug: 'javascript-jabber',
    art: 'https://i.scdn.co/image/ab67656300005f1fcddac21934163913572ae2fd'
  },
  {
    showUri: 'spotify:show:02fM1JHpt9HmHGp482K71b',
    showName: 'Developer Tea',
    color: "#f29135",
    slug: 'developer-tea',
    art: 'https://i.scdn.co/image/b4109b7fb961f59129e333fb96c96c7d4fd3b58b'
  },
  {
    showUri: 'spotify:show:5bBki72YeKSLUqyD94qsuJ',
    showName: 'Changelog',
    color: "#c2c2c5",
    slug: 'the-changelog',
    art: 'https://i.scdn.co/image/ab67656300005f1f5848abe815d712799a336519'
  },
  {
    showUri: 'spotify:show:2ySVrxGkN6n6frMTo9Nsrt',
    showName: 'JS Party',
    color: "#f7df1e",
    slug: 'js-party',
    art: 'https://i.scdn.co/image/ba4f488bf8d834c0f75cd5d0de00601addf93832'
  },
  {
    showUri: 'spotify:show:6El1Q4QV8OTAJVY2DWKMbo',
    showName: 'Frontend Masters',
    color: "#990c74",
    slug: 'the-frontend-masters-podcast',
    art: 'https://i.scdn.co/image/ab67656300005f1fdafabc185cd6b865da286d42'
  },
  // {
  //   showUri: 'spotify:show:2p7zZVwVF6Yk0Zsb4QmT7t',
  //   showName: 'Latent Space',
  //   slug: 'latent-space-podcast',
  //   art: 'https://i.scdn.co/image/ab67656300005f1fd1157ab13e3e7438bf374972'
  // }
];

// async function go() {
//   const showsWithArt = [];
//   for (const show of showsToWatch) {
//     const art = await fetchArt(show.showUri);
//     show.art = art;
//   }
//   console.log('Done!');
//   console.log(showsWithArt);
// }

export const slugs = showsToWatch.flatMap(show => [show.slug, show.showUri]);

export function getShowBySlug(slug: string) {
  return showsToWatch.find(
    (show) => show.slug === slug || show.showUri === slug,
  );
}
