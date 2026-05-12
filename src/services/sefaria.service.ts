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

export interface SpecialInsertion {
  id: string;
  titleHe: string;
  titleFr: string;
  textHe: string;
  textFr?: string;
}

export const getSpecialInsertionsForDate = (_date?: unknown): SpecialInsertion[] => {
  return [];
};

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
  sephardicSefariaRef?: string;
  // Si pas de ref Sefaria directe, texte statique
  staticHe?: string;
}

export const PRAYER_CATEGORIES: PrayerCategory[] = [
  {
    id: 'tehillim',
    titleHe: 'ספר תהילים',
    titleFr: 'Livre des psaumes',
    emoji: '📖',
    sefariaRef: 'Psalms',
    staticHe: 'מִזְמוֹר לְדָוִד יי רֹעִי לֹא אֶחְסָר\nבנאות דשא ירביצני על מי מנוחות ינהלני\nגַּם כִּי אֵלֵךְ בְּגֵיא צַלְמָוֶת לֹא אִירָא רָע\nכִּי אַתָּה עִמָּדִי',
  },
  {
    id: 'birkat_hamazon',
    titleHe: 'ברכת המזון',
    titleFr: 'Birkat Hamazon',
    emoji: '🍽️',
    sefariaRef: 'Birkat HaMazon',
    sephardicSefariaRef: 'Siddur Edot HaMizrach, Post Meal Blessing',
    staticHe: 'בָּרוּךְ אַתָּה יי אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם\nהַזָּן אֶת הָעוֹלָם כֻּלּוֹ בְּטוּבוֹ\nנֹדֶה לְּךָ יי אֱלֹהֵינוּ עַל שֶׁהִנְחַלְתָּ לַאֲבוֹתֵינוּ\nרַחֵם נָא יי אֱלֹהֵינוּ עַל יִשְׂרָאֵל עַמֶּךָ וְעַל יְרוּשָׁלַיִם עִירֶךָ\nבָּרוּךְ אַתָּה יי בּוֹנֵה בְּרַחֲמָיו אֶת יְרוּשָׁלָיִם',
  },
  {
    id: 'meen_chaloch',
    titleHe: 'מעין שלוש',
    titleFr: 'Meen Chaloch',
    emoji: '🍷',
    sefariaRef: 'Deuteronomy.8.10',
    staticHe: 'ברוך אתה יי אלהינו מלך העולם\nעל המחיה ועל הכלכלה ועל כל טוב\nועל ארץ חמדה טובה ורחבה\nורחם נא יי אלהינו על ישראל עמך ועל ירושלים עירך\nובנה ירושלים עיר הקודש במהרה בימינו\nברוך אתה יי על הארץ ועל המחיה',
  },
  {
    id: 'kadich_yehe_shelama',
    titleHe: 'קדיש יהא שלמא',
    titleFr: 'Kadich Yehe Shelama',
    emoji: '🙏',
    sefariaRef: 'Psalms.122',
    staticHe: 'יתגדל ויתקדש שמיה רבא\nבעלמא די ברא כרעותה וימליך מלכותה\nויצמח פורקניה ויקרב משיחה\nויחי ושלום רב\nיהא שלמא רבא מן שמיא וחיים טובים עלינו ועל כל ישראל\nואמרו אמן',
  },
  {
    id: 'kadich_al_israel',
    titleHe: 'קדיש על ישראל',
    titleFr: 'Kadich Al Israel',
    emoji: '🙏',
    sefariaRef: 'Daniel.2.20',
    staticHe: 'יתגדל ויתקדש שמיה רבא\nבעלמא די ברא כרעותה וימליך מלכותה\nויצמח פורקניה ויקרב משיחה\nויצמח פורקניה ויקרב משיחה\nויגדל ויתחזק\nיהא שלמא רבא מן שמיא וחיים טובים עלינו ועל כל ישראל\nואמרו אמן',
  },
  {
    id: 'hallel_moussaf',
    titleHe: 'הלל ומוסף לראש חודש',
    titleFr: 'Hallel et moussaf de Roch Hodech',
    emoji: '🎺',
    sefariaRef: 'Psalms.113,Psalms.114,Psalms.115,Psalms.116,Psalms.117,Psalms.118',
    staticHe: 'הַלְלוּ יָהּ הַלְלוּ עַבְדֵי יי\nהוֹדוּ לַיי כִּי טוֹב כִּי לְעוֹלָם חַסְדּוֹ\nאָנָּא יי הוֹשִׁיעָה נָּא\nבָּרוּךְ הַבָּא בְּשֵׁם יי',
  },
  {
    id: 'perek_chira',
    titleHe: 'פרק שירה',
    titleFr: 'Perek Chira',
    emoji: '🐦',
    sefariaRef: 'Psalms.148',
    staticHe: 'הַשָּׁמַיִם מְסַפְּרִים כְּבוֹד אֵל\nוּמַעֲשֵׂה יָדָיו מַגִּיד הָרָקִיעַ\nכל הנשמה תהלל יה\nהַלְלוּ יָהּ',
  },
  {
    id: 'tikoun_haklali',
    titleHe: 'תיקון הכללי',
    titleFr: 'Tikoun Haklali',
    emoji: '🔥',
    sefariaRef: 'Psalms.16,Psalms.32,Psalms.41,Psalms.42,Psalms.59,Psalms.77,Psalms.90,Psalms.105,Psalms.137,Psalms.150',
    staticHe: 'תִּקּוּן הַכְּלָלִי\nתהלים טז, לב, מא, מב, נט, עז, צ, קה, קלז, קנ\nמִזְמוֹר לְדָוִד שָׁמְרֵנִי אֵל כִּי חָסִיתִי בָךְ\nאַשְׁרֵי נְשׂוּי פֶשַׁע כְּסוּי חֲטָאָה',
  },
  {
    id: 'kriat_shema_amita',
    titleHe: 'קריאת שמע שעל המיטה',
    titleFr: 'Kriat Chema au coucher',
    emoji: '🛌',
    sefariaRef: 'Bedtime Shema',
    sephardicSefariaRef: 'Siddur Edot HaMizrach, Bedtime Shema',
    staticHe: 'שְׁמַע יִשְׂרָאֵל יי אֱלֹהֵינוּ יי אֶחָד\nבָּרוּךְ שֵׁם כְּבוֹד מַלְכוּתוֹ לְעוֹלָם וָעֶד\nבְּיָדְךָ אַפְקִיד רוּחִי פָּדִיתָ אוֹתִי יי אֵל אֱמֶת',
  },
  {
    id: 'tikkun-hatzot',
    titleHe: 'תיקון חצות',
    titleFr: 'Tikkun Hatzot',
    emoji: '🌙',
    staticHe: 'מזמור לאסף אל אלהים דמי לך אל תחרש\n\nקומי רני בלילה לראש אשמורות\nשפכי כמים לבך נוכח פני אדני\nזכור יי מה היה לנו הביט והביטה חרפתנו\nהשיבנו יי אליך ונשובה\nחדש ימינו כקדם',
  },
  {
    id: 'havdala',
    titleHe: 'הבדלה',
    titleFr: 'Havdala',
    emoji: '🕯️',
    sefariaRef: 'Havdalah',
    sephardicSefariaRef: 'Siddur, Havdalah',
  },
  {
    id: 'birkat-halevana',
    titleHe: 'ברכת הלבנה',
    titleFr: 'Birkat HaLevana',
    emoji: '🌙',
    sefariaRef: 'Psalms.148',
    staticHe: 'ברוך אתה יי אלהינו מלך העולם\nאשר במאמרו ברא שחקים\nוברוח פיו כל צבאם\nחוק וזמן נתן להם שלא ישנו את תפקידם\nששים ושמחים לעשות רצון קונם\nלעולם ועד\nברוך אתה מחדש חדשים',
  },
  {
    id: 'slihot',
    titleHe: 'סליחות',
    titleFr: 'Slihot',
    emoji: '🎺',
    sefariaRef: 'Psalms.130',
    staticHe: 'א-ל ארך אפים\nרב חסד ואמת\nנוצר חסד לאלפים\nנשא עון ופשע וחטאה\nונקה\nסלח נא לעון העם הזה כגודל חסדך\nעננו יי עננו',
  },
  {
    id: 'sefirat-haomer',
    titleHe: 'ספירת העומר',
    titleFr: 'Compte du Omer',
    emoji: '📊',
    sefariaRef: 'Leviticus.23.15',
    staticHe: 'ברוך אתה יי אלהינו מלך העולם אשר קדשנו במצותיו וצונו על ספירת העומר\nהיום יום אחד לעומר',
  },
  {
    id: 'hanukkah',
    titleHe: 'הדלקת נרות חנוכה',
    titleFr: 'Allumage des bougies de Hanoucca',
    emoji: '🕎',
    staticHe: 'ברוך אתה יי אלהינו מלך העולם אשר קדשנו במצותיו וצונו להדליק נר חנוכה\nברוך אתה יי אלהינו מלך העולם שעשה נסים לאבותינו בימים ההם בזמן הזה\nברוך אתה יי אלהינו מלך העולם שהחיינו וקימנו והגיענו לזמן הזה',
  },
  {
    id: 'meguila_esther',
    titleHe: 'מגילת אסתר',
    titleFr: 'Meguila ESTHER',
    emoji: '📜',
    sefariaRef: 'Esther',
  },
  {
    id: 'tefila_haderech',
    titleHe: 'תפילת הדרך',
    titleFr: 'Priere du voyage',
    emoji: '✈️',
    sefariaRef: 'Tefilat HaDerech',
    sephardicSefariaRef: 'Siddur Edot HaMizrach, Assorted Blessings and Prayers, Traveler\'s Prayer',
    staticHe: 'יהי רצון מלפניך יי אלהינו ואלהי אבותינו\nשתוליכנו לשלום ותצעדנו לשלום\nותגיענו למחוז חפצנו לחיים ולשמחה ולשלום\nותצילנו מכל אויב ואורב בדרך\nותתן חן וחסד ורחמים בעיניך ובעיני כל רואינו\nברוך אתה יי שומע תפלה',
  },
  {
    id: 'tfila_mezuza',
    titleHe: 'ברכת מזוזה',
    titleFr: 'Tfila Mezuza',
    emoji: '🚪',
    sefariaRef: 'Deuteronomy.6.4',
    staticHe: 'ברוך אתה יי אלהינו מלך העולם אשר קדשנו במצותיו וצונו לקבוע מזוזה',
  },
  {
    id: 'circumcision',
    titleHe: 'ברית מילה',
    titleFr: 'Circoncision',
    emoji: '👶',
    sefariaRef: 'Genesis.17.10',
    staticHe: 'ברוך אתה יי אלהינו מלך העולם אשר קדשנו במצותיו וצונו להכניסו בבריתו של אברהם אבינו',
  },
  {
    id: 'rachat_premier_ne',
    titleHe: 'פדיון הבן',
    titleFr: 'Rachat du premier ne',
    emoji: '💰',
    sefariaRef: 'Numbers.18.15',
    staticHe: 'ברוך אתה יי אלהינו מלך העולם אשר קדשנו במצותיו וצונו על פדיון הבן',
  },
  {
    id: 'hackava',
    titleHe: 'השכבה',
    titleFr: 'Hachkava',
    emoji: '🕊️',
    sefariaRef: 'Psalms.91',
    staticHe: 'המקום ינחם אתכם בתוך שאר אבלי ציון וירושלים\nלא תירא מפחד לילה מחץ יעוף יומם\nיי רועי לא אחסר',
  },
  {
    id: 'sheba_brakhot',
    titleHe: 'שבע ברכות',
    titleFr: 'Les Cheva Berakhot - Les 7 Benedictions Mariage',
    emoji: '💍',
    sefariaRef: 'Genesis.24.60',
    staticHe: 'ברוך אתה יי אלהינו מלך העולם\nיוצר האדם\nשהכל ברא לכבודו\nיוצר האדם\nאשר ברא ששון ושמחה חתן וכלה\nברוך אתה יי משמח חתן עם הכלה',
  },
  {
    id: 'alfa-beta',
    titleHe: 'אלפא ביתא',
    titleFr: 'Alfa Beta',
    emoji: '🔤',
    staticHe: 'אלף בית גימל דלת\nהי ויו זין חית טית\nיוד כף למד מם\nנון סמך עין פה צדי\nקוף ריש שין תיו',
  },
  {
    id: 'torah_reading',
    titleHe: 'קריאת התורה',
    titleFr: 'Lecture de la Torah',
    emoji: '📜',
    sefariaRef: 'Deuteronomy.1',
    staticHe: 'ברכו את יי המבורך\nברוך יי המבורך לעולם ועד\nברוך אתה יי אלהינו מלך העולם אשר בחר בנו מכל העמים ונתן לנו את תורתו',
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
