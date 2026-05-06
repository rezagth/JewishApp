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
    id: 'tehillim',
    titleHe: 'ספר תהילים',
    titleFr: 'Livre des psaumes',
    sefariaRef: 'Psalms',
  },
  {
    id: 'birkat_hamazon',
    titleHe: 'ברכת המזון',
    titleFr: 'Birkat Hamazon',
    sefariaRef: 'Birkat Hamazon',
  },
  {
    id: 'meen_shalosh',
    titleHe: 'מעין שלוש',
    titleFr: 'Meen Chaloch',
    staticHe:
      'עַל הַמִּחְיָה וְעַל הַכַּלְכָּלָה וְעַל תְּנוּבַת הַשָּׂדֶה\nוְעַל אֶרֶץ חֶמְדָּה טוֹבָה וּרְחָבָה\nשֶׁרָצִיתָ וְהִנְחַלְתָּ לַאֲבוֹתֵינוּ\nלֶאֱכוֹל מִפִּרְיָהּ וְלִשְׂבּוֹעַ מִטּוּבָהּ',
  },
  {
    id: 'kadish_yehe_shelama',
    titleHe: 'קדיש יהא שלמא',
    titleFr: 'Kadich Yehe Chelama',
    staticHe:
      'יִתְגַּדַּל וְיִתְקַדַּשׁ שְׁמֵהּ רַבָּא\nבְּעָלְמָא דִּי בְרָא כִרְעוּתֵהּ\nוְיַמְלִיךְ מַלְכוּתֵהּ\nבְּחַיֵּיכוֹן וּבְיוֹמֵיכוֹן\nוּבְחַיֵּי דְכָל בֵּית יִשְׂרָאֵל\nבַּעֲגָלָא וּבִזְמַן קָרִיב\nוְאִמְרוּ אָמֵן\nיְהֵא שְׁמֵהּ רַבָּא מְבָרַךְ\nלְעָלַם וּלְעָלְמֵי עָלְמַיָּא',
  },
  {
    id: 'kadish_al_israel',
    titleHe: 'קדיש על ישראל',
    titleFr: 'Kadich Al Israel',
    staticHe:
      'יִתְגַּדַּל וְיִתְקַדַּשׁ שְׁמֵהּ רַבָּא\nבְּעָלְמָא דִּי בְרָא כִרְעוּתֵהּ\nוְיַמְלִיךְ מַלְכוּתֵהּ\nעַל יִשְׂרָאֵל וְעַל כָּל יוֹשְׁבֵי תֵבֵל\nבְּחַיֵּיכוֹן וּבְיוֹמֵיכוֹן\nוּבְחַיֵּי דְכָל בֵּית יִשְׂרָאֵל\nבַּעֲגָלָא וּבִזְמַן קָרִיב\nוְאִמְרוּ אָמֵן',
  },
  {
    id: 'hallel_moussaf',
    titleHe: 'הלל ומוסף לראש חודש',
    titleFr: 'Hallel et moussaf',
    sefariaRef: 'Psalms.113',
  },
  {
    id: 'perek_shira',
    titleHe: 'פרק שירה',
    titleFr: 'Perek Chira',
    staticHe:
      'הַשָּׁמַיִם אוֹמְרִים\nהַשָּׁמַיִם מְסַפְּרִים כְּבוֹד אֵל\nוּמַעֲשֵׂה יָדָיו מַגִּיד הָרָקִיעַ\nהָאָרֶץ אוֹמֶרֶת\nלַה׳ הָאָרֶץ וּמְלוֹאָהּ\nתֵּבֵל וְיֹשְׁבֵי בָהּ\nהַגָּן אוֹמֵר\nיָקוּם אֱלֹהִים יָפוּצוּ אוֹיְבָיו',
  },
  {
    id: 'tikoun_haklali',
    titleHe: 'תיקון הכללי',
    titleFr: 'Tikoun Haklali',
    emoji: '🔥',
    sefariaRef: 'Psalms.16',
  },
  {
    id: 'kriat_shema_amita',
    titleHe: 'קריאת שמע על המיטה',
    titleFr: 'Kriat Chema al amita',
    sefariaRef: 'Deuteronomy.6.4-9',
  },
  {
    id: 'tikoun_hatzot',
    titleHe: 'תיקון חצות',
    titleFr: 'Tikoun Hatzot',
    staticHe:
      'עַל נַהֲרוֹת בָּבֶל שָׁם יָשַׁבְנוּ גַּם בָּכִינוּ\nבְּזָכְרֵנוּ אֶת צִיּוֹן\nעַל עֲרָבִים בְּתוֹכָהּ תָּלִינוּ כִּנֹּרוֹתֵינוּ\nכִּי שָׁם שְׁאֵלוּנוּ שׁוֹבֵינוּ דִּבְרֵי שִׁיר\nוְתוֹלָלֵינוּ שִׂמְחָה\nשִׁירוּ לָנוּ מִשִּׁיר צִיּוֹן',
  },
  {
    id: 'tefila_haderech',
    titleHe: 'תפילת הדרך',
    titleFr: 'Tefila Haderech',
    staticHe:
      'יְהִי רָצוֹן מִלְּפָנֶיךָ\nה׳ אֱלֹהֵינוּ וֵאלֹהֵי אֲבוֹתֵינוּ\nשֶׁתּוֹלִיכֵנוּ לְשָׁלוֹם\nוְתַצְעִידֵנוּ לְשָׁלוֹם\nוְתַדְרִיכֵנוּ לְשָׁלוֹם\nוְתִסְמְכֵנוּ לְשָׁלוֹם\nוְתַגִּיעֵנוּ לִמְחוֹז חֶפְצֵנוּ לְחַיִּים\nוּלְשִׂמְחָה וּלְשָׁלוֹם',
  },
  {
    id: 'havdala',
    titleHe: 'הבדלה',
    titleFr: 'Havdala',
    staticHe:
      'הִנֵּה אֵל יְשׁוּעָתִי\nאֶבְטַח וְלֹא אֶפְחָד\nכִּי עָזִּי וְזִמְרָת יָהּ ה׳\nוַיְהִי לִי לִישׁוּעָה\nוּשְׁאַבְתֶּם מַיִם בְּשָׂשׂוֹן\nמִמַּעַיְנֵי הַיְשׁוּעָה\nלַה׳ הַיְשׁוּעָה\nעַל עַמְּךָ בִרְכָתֶךָ סֶּלָה',
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
    titleHe: 'שחרית',
    titleFr: 'Chaharith (Matin)',
    emoji: '🌅',
    timeOfDay: 'shacharit',
    sefariaRef: 'Psalms.113-150', // Hallel matinal
  },
  {
    id: 'mincha_service',
    titleHe: 'מנחה',
    titleFr: 'Mincha (Après-midi)',
    emoji: '☀️',
    timeOfDay: 'mincha',
    sefariaRef: 'Psalms.84',
  },
  {
    id: 'maariv_service',
    titleHe: 'מעריב',
    titleFr: "Ma'ariv (Soirée)",
    emoji: '🌙',
    timeOfDay: 'maariv',
    sefariaRef: 'Psalms.4',
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
