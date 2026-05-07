/**
 * Service Sefaria API - Récupère les textes liturgiques réels
 * API gratuite: https://www.sefaria.org/api/
 */

const SEFARIA_BASE = 'https://www.sefaria.org/api';

// Supprime les balises HTML et les entités HTML des textes Sefaria
const cleanHtml = (text: string): string => {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&thinsp;/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
};

const flattenVerses = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value
      .flat(Infinity)
      .filter(Boolean)
      .map((v) => cleanHtml(String(v)))
      .join('\n');
  }
  if (typeof value === 'string') {
    return cleanHtml(value);
  }
  return '';
};

export interface SefariaText {
  titleHe: string;
  titleEn: string;
  heText: string;
  enText: string;
  ref: string;
}

export const fetchSefariaText = async (ref: string): Promise<SefariaText> => {
  const encoded = encodeURIComponent(ref);
  const url = `${SEFARIA_BASE}/texts/${encoded}?context=0&commentary=0&pad=0`;

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Sefaria API error: ${response.status}`);
  }

  const data = await response.json();

  return {
    titleHe: data.heTitle || data.title || ref,
    titleEn: data.title || ref,
    heText: flattenVerses(data.he || data.hebrew || ''),
    enText: flattenVerses(data.text || data.en || ''),
    ref,
  };
};

// Catégories de prières diverses (תפילות שונות) - correspond à l'image
export interface PrayerCategory {
  id: string;
  titleHe: string;
  titleFr: string;
  emoji?: string;
  sefariaRef?: string;
  // Si pas de ref Sefaria directe, texte statique
  staticHe?: string;
}

export const PRAYER_CATEGORIES: PrayerCategory[] = [
  {
    id: 'preparatory',
    titleHe: 'סדר השכמת הבוקר',
    titleFr: 'Prières du matin (Préparatoires)',
    emoji: '🧼',
    sefariaRef: 'Siddur Edot HaMizrach, Preparatory Prayers',
  },
  {
    id: 'birkat_hamazon',
    titleHe: 'ברכת המזון',
    titleFr: 'Birkat Hamazon',
    emoji: '🍽️',
    sefariaRef: 'Siddur Edot HaMizrach, Post Meal Blessing',
  },
  {
    id: 'kriat_shema_amita',
    titleHe: 'קריאת שמע שעל המיטה',
    titleFr: 'Kriat Chema au coucher',
    emoji: '🛌',
    sefariaRef: 'Siddur Edot HaMizrach, Bedtime Shema',
  },
  {
    id: 'shabbat_evening',
    titleHe: 'סדר ליל שבת',
    titleFr: 'Chabbat Soir',
    emoji: '🕯️',
    sefariaRef: 'Siddur Edot HaMizrach, Shabbat Arvit, Barchu,Siddur Edot HaMizrach, Shabbat Arvit, The Shema,Siddur Edot HaMizrach, Shabbat Arvit, Magen Avot,Siddur Edot HaMizrach, Shabbat Arvit, Alenu,Siddur Edot HaMizrach, Shabbat Evening, Shalom Alekhem,Siddur Edot HaMizrach, Shabbat Evening, Eshet Hayil,Siddur Edot HaMizrach, Shabbat Evening, Kiddush',
  },
  {
    id: 'shabbat_shacharit',
    titleHe: 'שחרית של שבת',
    titleFr: 'Chabbat Matin',
    emoji: '⛪',
    sefariaRef: 'Siddur Edot HaMizrach, Shabbat Shacharit, Psalms for Shabbat,Siddur Edot HaMizrach, Shabbat Shacharit, Pesukei D\'Zimra,Siddur Edot HaMizrach, Shabbat Shacharit, The Shema,Siddur Edot HaMizrach, Shabbat Shacharit, Amidah',
  },
  {
    id: 'shabbat_mussaf',
    titleHe: 'מוסף של שבת',
    titleFr: 'Chabbat Moussaf',
    emoji: '🍷',
    sefariaRef: 'Siddur Edot HaMizrach, Shabbat Mussaf, Amida,Siddur Edot HaMizrach, Shabbat Mussaf, Incense Offering,Siddur Edot HaMizrach, Shabbat Mussaf, Alenu',
  },
  {
    id: 'havdala',
    titleHe: 'סדר הבדלה',
    titleFr: 'Havdala',
    emoji: '🕯️',
    sefariaRef: 'Siddur Edot HaMizrach, Havdalah',
  },
  {
    id: 'tehillim',
    titleHe: 'ספר תהילים',
    titleFr: 'Livre des psaumes',
    emoji: '📖',
    sefariaRef: 'Psalms',
  },
  {
    id: 'tefila_haderech',
    titleHe: 'תפילת הדרך',
    titleFr: 'Tefila Haderech',
    emoji: '✈️',
    sefariaRef: 'Siddur Edot HaMizrach, Assorted Blessings and Prayers, Traveler\'s Prayer',
  },
  {
    id: 'tikoun_haklali',
    titleHe: 'תיקון הכללי',
    titleFr: 'Tikoun Haklali',
    emoji: '🔥',
    sefariaRef: 'Psalms.16,Psalms.32,Psalms.41,Psalms.42,Psalms.59,Psalms.77,Psalms.90,Psalms.105,Psalms.137,Psalms.150',
  },
];

// Catégories de prières horaires (basées sur l'heure)
export interface PrayerTimeCategory extends PrayerCategory {
  timeOfDay: 'shacharit' | 'mincha' | 'maariv';
  emoji: string;
}

export const PRAYER_TIME_CATEGORIES: PrayerTimeCategory[] = [
  {
    id: 'shacharit_service',
    titleHe: 'שחרית לימי החול',
    titleFr: 'Chaharith (Semaine)',
    emoji: '🌅',
    timeOfDay: 'shacharit',
    sefariaRef: 'Siddur Edot HaMizrach, Weekday Shacharit, Morning Prayer,Siddur Edot HaMizrach, Weekday Shacharit, Incense Offering,Siddur Edot HaMizrach, Weekday Shacharit, Hodu,Siddur Edot HaMizrach, Weekday Shacharit, Pesukei D\'Zimra,Siddur Edot HaMizrach, Weekday Shacharit, The Shema,Siddur Edot HaMizrach, Weekday Shacharit, Amida,Siddur Edot HaMizrach, Weekday Shacharit, Vidui,Siddur Edot HaMizrach, Weekday Shacharit, Torah Reading,Siddur Edot HaMizrach, Weekday Shacharit, Ashrei,Siddur Edot HaMizrach, Weekday Shacharit, Uva LeSion,Siddur Edot HaMizrach, Weekday Shacharit, Alenu',
  },
  {
    id: 'mincha_service',
    titleHe: 'מנחה לימי החול',
    titleFr: 'Mincha (Semaine)',
    emoji: '☀️',
    timeOfDay: 'mincha',
    sefariaRef: 'Siddur Edot HaMizrach, Weekday Mincha, Offerings,Siddur Edot HaMizrach, Weekday Mincha, Amida,Siddur Edot HaMizrach, Weekday Mincha, Vidui,Siddur Edot HaMizrach, Weekday Mincha, Alenu',
  },
  {
    id: 'maariv_service',
    titleHe: 'ערבית לימי החול',
    titleFr: 'Arvit (Semaine)',
    emoji: '🌙',
    timeOfDay: 'maariv',
    sefariaRef: 'Siddur Edot HaMizrach, Weekday Arvit, Barchu,Siddur Edot HaMizrach, Weekday Arvit, The Shema,Siddur Edot HaMizrach, Weekday Arvit, Amidah,Siddur Edot HaMizrach, Weekday Arvit, Alenu',
  },
];


// Récupère les psaumes individuels (1-150) pour le livre des psaumes
export const fetchPsalm = async (psalmNumber: number): Promise<SefariaText> => {
  return fetchSefariaText(`Psalms.${psalmNumber}`);
};

// Cache simple en mémoire
const textCache = new Map<string, SefariaText>();

export const getCachedSefariaText = async (ref: string): Promise<SefariaText> => {
  if (textCache.has(ref)) {
    return textCache.get(ref)!;
  }
  const text = await fetchSefariaText(ref);
  textCache.set(ref, text);
  return text;
};
