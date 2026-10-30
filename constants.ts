
import { Category, Album } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'photoshoots',
    title: 'Photoshoots',
    description: 'Ensaios editoriais e revistas icônicas.',
    coverImage: '' 
  },
  {
    id: 'video',
    title: 'Video',
    description: 'Bastidores e capturas dos videoclipes.',
    coverImage: '' 
  },
  {
    id: 'artwork',
    title: 'Artwork',
    description: 'Capas de álbuns, singles e arte promocional.',
    coverImage: '' 
  },
  {
    id: 'live',
    title: 'Live',
    description: 'Turnês mundiais e apresentações ao vivo.',
    coverImage: '' 
  }
];

export const YEARS = Array.from({ length: 2025 - 1987 + 1 }, (_, i) => 2025 - i);

export const SPECIFIC_ALBUMS: Record<string, { id: string, title: string, coverTag?: string }[]> = {
  'photoshoots_1988': [{ id: 'lawrence-lawry', title: 'Lawrence Lawry', coverTag: 'photoshoots_1988_lawrence-lawry-cover' }],
  'photoshoots_1989': [{ id: 'simon-fowler', title: 'Simon Fowler', coverTag: 'photoshoots_1989_simon-fowler-cover' }],
  'photoshoots_1990': [{ id: 'marcus-morianz', title: 'Marcus Morianz', coverTag: 'photoshoots_1990_marcus-morianz-cover' }],
  'photoshoots_1991': [{ id: 'juergen-teller', title: 'Juergen Teller', coverTag: 'photoshoots_1991_juergen-teller-cover' }],
  'photoshoots_1997': [{ id: 'stephanie-sednaoui', title: 'Stephanie Sednaoui', coverTag: 'photoshoots_1997_stephanie-sednaoui-cover' }],
  'photoshoots_2001': [{ id: 'vincent-peters', title: 'Vincent Peters', coverTag: 'photoshoots_2001_vincent-peters-cover' }],
  'photoshoots_2003': [{ id: 'mert-alas-and-marcus-piggott', title: 'Mert Alas And Marcus Piggott', coverTag: 'photoshoots_2003_mert-alas-and-marcus-piggott-cover' }],
  'photoshoots_2010': [{ id: 'william-baker', title: 'William Baker', coverTag: 'photoshoots_2010_william-baker-cover' }],
  'photoshoots_2025': [{ id: 'christian-vermaak', title: 'Christian Vermaak', coverTag: 'photoshoots_2025_christian-vermaak-cover' }],
  'live_2020': [{ id: 'festival-grls', title: 'Festival GRLS', coverTag: 'live_2020_festival-grls-cover' }],
  'live_2008': [{ id: 'x2008-tour', title: 'KYLIEX2008 Tour', coverTag: 'live_2008_x2008-tour-cover' }],
  'live_2005': [{ id: 'showgirl-the-greatest-hits-tour', title: 'Showgirl: The Greatest Hits Tour', coverTag: 'live_2005_showgirl-the-greatest-hits-tour-cover' }],
  'live_1998': [{ id: 'intimate-and-live', title: 'Intimate and Live', coverTag: 'live_1998_intimate-and-live-cover' }],
  'live_1992': [{ id: 'lets-get-to-it-tour', title: "Let's Get To It Tour", coverTag: 'live_1992_lets-get-to-it-tour-cover' }],
  'live_1991': [{ id: 'rhythm-of-love-tour', title: 'Rhythm of Love Tour', coverTag: 'live_1991_rhythm-of-love-tour-cover' }],
  'live_1990': [{ id: 'enjoy-yourself-tour', title: 'Enjoy Yourself Tour', coverTag: 'live_1990_enjoy-yourself-tour-cover' }],
  'live_1989': [{ id: 'disco-in-dream', title: 'Disco in Dream', coverTag: 'live_1989_disco-in-dream-cover' }],
  'live_2025': [
    { id: 'tension-tour-brasil', title: "Tension Tour Brasil", coverTag: 'live_2025_tension-tour-brasil_cover' },
    { id: 'capitals-jingle-bell-ball', title: "Capital's Jingle Bell Ball", coverTag: 'live_2025_capitals-jingle-bell-ball-cover' }
  ]
};

// --- CATÁLOGO DE VÍDEOS ---
const VIDEO_CATALOG = [
  { id: 'XMAS', title: 'XMAS', year: 2025, coverTag: 'video_2025_XMAS-cover' },
  { id: 'cant-get-you-out-of-my-head', title: "Can't Get You Out Of My Head", year: 2001, coverTag: 'video_2001_cant-get-you-out-of-my-head-cover' },
  { id: 'your-disco-needs-you', title: 'Your Disco Needs You', year: 2001, coverTag: 'video_2001_your-disco-needs-you-cover' },
  { id: 'finer-feelings', title: 'Finer Feelings', year: 1992, coverTag: 'video_1992_finer-feelings-cover' },
  { id: 'shocked', title: 'Shocked', year: 1991, coverTag: 'video_1991_shocked-cover' },
  { id: 'hand_on_your_heart', title: 'Hand On Your Heart', year: 1989, coverTag: 'video_1989_hand_on_your_heart-cover' },
  { id: 'the-locomotion', title: 'The Loco-Motion', year: 1988, coverTag: 'video_1988_the-locomotion-cover' },
  { id: 'got-to-be-certain', title: 'Got To Be Certain', year: 1988, coverTag: 'video_1988_got-to-be-certain-cover' },
  { id: 'i-should-be-so-lucky', title: 'I Should Be So Lucky', year: 1987, coverTag: 'video_1987_i-should-be-so-lucky-cover' },
];

export const getAllVideoAlbums = (): Album[] => {
  return [...VIDEO_CATALOG]
    .sort((a, b) => (a.year || 0) - (b.year || 0))
    .map(item => ({
      id: `video_${item.year}_${item.id}`,
      title: item.title,
      coverImage: '',
      count: 0,
      year: item.year,
      coverTag: item.coverTag
    }));
};

// --- CATÁLOGO DE ARTWORK ---
const ARTWORK_CATALOG = [
  { id: 'kylie-christmas-fully-wrapped', title: 'Kylie Christmas (Fully Wrapped)', year: 2025, coverTag: 'artwork_2025_kylie-christmas-fully-wrapped-cover' },
  { id: 'tension-II', title: 'Tension II', year: 2024, coverTag: 'artwork_2024_tension-II-cover' },
  { id: 'tension', title: 'Tension', year: 2023, coverTag: 'artwork_2023_tension-cover' },
  { id: 'disco', title: 'Disco', year: 2020, coverTag: 'artwork_2020_disco-cover' },
  { id: 'step-back-in-time', title: 'Step Back In Time', year: 2019, coverTag: 'artwork_2019_step-back-in-time-cover' },
  { id: 'golden', title: 'Golden', year: 2018, coverTag: 'artwork_2018_golden-cover' },
  { id: 'kylie-christmas', title: 'Kylie Christmas', year: 2015, coverTag: 'artwork_2015_kylie-christmas-cover' },
  { id: 'kiss-me-once', title: 'Kiss Me Once', year: 2014, coverTag: 'artwork_2014_kiss-me-once-cover' },
  { id: 'abbey-road-sessions', title: 'The Abbey Road Sessions', year: 2012, coverTag: 'artwork_2012_abbey-road-sessions-cover' },
  { id: 'aphrodite', title: 'Aphrodite', year: 2010, coverTag: 'artwork_2010_aphrodite-cover' },
  { id: 'x', title: 'X', year: 2007, coverTag: 'artwork_2007_x-cover' },
  { id: 'ultimate-kylie', title: 'Ultimate Kylie', year: 2004, coverTag: 'artwork_2004_ultimate-kylie-cover' },
  { id: 'body-language', title: 'Body Language', year: 2003, coverTag: 'artwork_2003_body-language-cover' },
  { id: 'fever', title: 'Fever', year: 2001, coverTag: 'artwork_2001_fever-cover' },
  { id: 'light-years', title: 'Light Years', year: 2000, coverTag: 'artwork_2000_light-years-cover' },
  { id: 'impossible-princess', title: 'Impossible Princess', year: 1997, coverTag: 'artwork_1997_impossible-princess-cover' },
  { id: 'kylie-minogue', title: 'Kylie Minogue', year: 1994, coverTag: 'artwork_1994_kylie-minogue-cover' },
  { id: 'greatest-hits', title: 'Greatest Hits', year: 1992, coverTag: 'artwork_1992_greatest-hits-cover' },
  { id: 'lets-get-to-it', title: 'Let\'s Get To It', year: 1991, coverTag: 'artwork_1991_lets-get-to-it-cover' },
  { id: 'rhythm-of-love', title: 'Rhythm of Love', year: 1990, coverTag: 'artwork_1990_rhythm-of-love-cover' },
  { id: 'enjoy-yourself', title: 'Enjoy Yourself', year: 1989, coverTag: 'artwork_1989_enjoy-yourself-cover' },
  { id: 'kylie', title: 'Kylie', year: 1988, coverTag: 'artwork_1988_kylie-cover' },
  // Álbuns sem data fixa
  { id: 'artwork_live_albums', title: 'Live Album Artworks', year: undefined, coverTag: 'artwork_live_albums-cover' },
  { id: 'artwork_other', title: 'Other Artworks', year: undefined, coverTag: 'artwork_other-cover' },
];

export const getAllArtworkAlbums = (): Album[] => {
  return ARTWORK_CATALOG
    .sort((a, b) => (b.year || 0) - (a.year || 0))
    .map(item => ({
      id: item.year ? `artwork_${item.year}_${item.id}` : item.id,
      title: item.title,
      coverImage: '', 
      count: 0,
      year: item.year,
      coverTag: item.coverTag
    }));
};

// --- HELPER FUNCTIONS PARA CLOUDINARY ---
const CLOUD_NAME = 'Kylie-gallery';

// Gera uma URL única otimizada com largura opcional
export const getOptimizedUrl = (version: number, public_id: string, width?: number) => {
  const transforms = ['f_auto', 'q_auto'];
  if (width) transforms.push(`w_${width}`);
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms.join(',')}/v${version}/${public_id}`;
};

// Gera o string para o atributo srcSet
export const generateSrcSet = (version: number, public_id: string) => {
  const widths = [300, 500, 800, 1000];
  return widths
    .map(w => `${getOptimizedUrl(version, public_id, w)} ${w}w`)
    .join(', ');
};
