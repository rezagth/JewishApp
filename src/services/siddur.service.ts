<<<<<<< HEAD
import { Prayer, ServiceType, Nusach } from '../types';
import siddurSfaradHe from '../data/siddur_sfarad_he.json';

// Types pour le JSON
interface JsonSection {
  label: string;
  ref: string | null;
  text_he: string;
}

interface JsonService {
  label: string;
  sections: Record<string, JsonSection>;
}

interface SiddurJson {
  siddur: Record<string, JsonService>;
}

const typedSiddur = siddurSfaradHe as SiddurJson;
=======
/**
 * Service pour gérer les prières du Siddur
 * Version corrigée et stable (Sefaria API)
 */

import axios from 'axios';
import { Prayer, ServiceType, Nusach } from '../types';

interface PrayerTemplate {
  id: string;
  title: string;
  titleHe: string;
  ref: string;
  serviceType: ServiceType;
}

interface SefariaSection {
  ref: string;
  title: string;
  heTitle: string;
}

// 🔥 Bases Siddur
const SIDDUR_BASE: Record<Nusach, string> = {
  ashkenazi: 'Siddur Ashkenaz',
  sephardic: 'Siddur Edot HaMizrach',
  mizrahi: 'Siddur Edot HaMizrach',
  teimani: 'Siddur Edot HaMizrach', // Simplification pour le moment
};

// 🔥 STRUCTURE CORRIGÉE
const SEFARIA_SIDDUR_STRUCTURE: Record<
  ServiceType,
  (nusach: Nusach) => SefariaSection[]
> = {
  shacharit: (nusach) => {
    if (nusach === 'ashkenazi') {
      return [
        { ref: 'Siddur Ashkenaz, Weekday, Shacharit, Preparatory Prayers, Morning Blessings', title: 'Morning Blessings', heTitle: 'ברכות השחר' },
        { ref: 'Siddur Ashkenaz, Weekday, Shacharit, Pesukei Dezimra', title: 'Pesukei Dezimra', heTitle: 'פסוקי דזמרה' },
        { ref: 'Siddur Ashkenaz, Weekday, Shacharit, Blessings of the Shema', title: 'Shema', heTitle: 'שמע ישראל' },
        { ref: 'Siddur Ashkenaz, Weekday, Shacharit, Amidah', title: 'Amidah', heTitle: 'עמידה' },
      ];
    }
    return [
      { ref: 'Siddur Edot HaMizrach, Weekday Shacharit, Preparatory Prayers', title: 'Morning Blessings', heTitle: 'ברכות השחר' },
      { ref: 'Siddur Edot HaMizrach, Weekday Shacharit, Pesukei D\'Zimra', title: 'Pesukei Dezimra', heTitle: 'פסוקי דזמרה' },
      { ref: 'Siddur Edot HaMizrach, Weekday Shacharit, The Shema', title: 'Shema', heTitle: 'שמע ישראל' },
      { ref: 'Siddur Edot HaMizrach, Weekday Shacharit, Amida', title: 'Amidah', heTitle: 'עמידה' },
    ];
  },

  mincha: (nusach) => {
    if (nusach === 'ashkenazi') {
      return [
        { ref: 'Siddur Ashkenaz, Weekday, Minchah, Ashrei', title: 'Ashrei', heTitle: 'אשרי' },
        { ref: 'Siddur Ashkenaz, Weekday, Minchah, Amida', title: 'Amidah', heTitle: 'עמידה' },
        { ref: 'Siddur Ashkenaz, Weekday, Minchah, Concluding Prayers, Alenu', title: 'Aleinu', heTitle: 'עלינו' },
      ];
    }
    return [
      { ref: 'Siddur Edot HaMizrach, Weekday Mincha, Offerings', title: 'Ashrei', heTitle: 'אשרי' },
      { ref: 'Siddur Edot HaMizrach, Weekday Mincha, Amida', title: 'Amidah', heTitle: 'עמידה' },
      { ref: 'Siddur Edot HaMizrach, Weekday Mincha, Alenu', title: 'Aleinu', heTitle: 'עלינו' },
    ];
  },

  arvit: (nusach) => {
    if (nusach === 'ashkenazi') {
      return [
        { ref: 'Siddur Ashkenaz, Weekday, Maariv, Blessings of the Shema', title: 'Shema', heTitle: 'שמע ישראל' },
        { ref: 'Siddur Ashkenaz, Weekday, Maariv, Amidah', title: 'Amidah', heTitle: 'עמידה' },
        { ref: 'Siddur Ashkenaz, Weekday, Maariv, Alenu', title: 'Aleinu', heTitle: 'עלינו' },
      ];
    }
    return [
      { ref: 'Siddur Edot HaMizrach, Weekday Arvit, The Shema', title: 'Shema', heTitle: 'שמע ישראל' },
      { ref: 'Siddur Edot HaMizrach, Weekday Arvit, Amidah', title: 'Amidah', heTitle: 'עמידה' },
      { ref: 'Siddur Edot HaMizrach, Weekday Arvit, Alenu', title: 'Aleinu', heTitle: 'עלינו' },
    ];
  },

  "ma'ariv": (nusach) => {
    if (nusach === 'ashkenazi') {
      return [
        { ref: 'Siddur Ashkenaz, Weekday, Maariv, Blessings of the Shema', title: 'Shema', heTitle: 'שמע ישראל' },
        { ref: 'Siddur Ashkenaz, Weekday, Maariv, Amidah', title: 'Amidah', heTitle: 'עמידה' },
      ];
    }
    return [
      { ref: 'Siddur Edot HaMizrach, Weekday Arvit, The Shema', title: 'Shema', heTitle: 'שמע ישראל' },
      { ref: 'Siddur Edot HaMizrach, Weekday Arvit, Amidah', title: 'Amidah', heTitle: 'עמידה' },
    ];
  },
};

// 🔁 Cache
const PRAYER_CACHE = new Map<string, Prayer[]>();

// 🧠 Nettoyage texte
const flattenText = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value.flat(Infinity).filter(Boolean).join('\n');
  }
  if (typeof value === 'string') return value;
  return '';
};

// 🔁 Retry automatique
const fetchWithRetry = async (
  ref: string,
  retries = 2
): Promise<{ he: string; en: string }> => {
  try {
    const url = new URL(
      `https://www.sefaria.org/api/texts/${encodeURIComponent(ref)}`
    );

    url.searchParams.set('context', '0');
    url.searchParams.set('commentary', '0');
    url.searchParams.set('pad', '0');

    const response = await axios.get(url.toString(), { timeout: 10000 });
    const data = response.data;

    return {
      he: flattenText(data.he || data.hebrew),
      en: flattenText(data.text || data.en),
    };
  } catch (err: any) {
    if (retries > 0 && err.response?.status >= 500) {
      return fetchWithRetry(ref, retries - 1);
    }
    throw err;
  }
};

// 🧱 Fallback template
const buildFallbackPrayer = (
  section: SefariaSection,
  serviceType: ServiceType,
  nusach: Nusach,
  index: number
): Prayer => ({
  id: `${serviceType}:${index}`,
  title: section.title,
  titleHe: section.heTitle,
  content: `${section.title} unavailable`,
  contentHe: `${section.heTitle} לא זמין`,
  serviceType,
  nusach,
});
>>>>>>> 9173f91caf7a76f4ff1a09cc678c194f2a736c57

export class SiddurService {
  static async getCompleteSiddur(
    serviceType: ServiceType,
    nusach: Nusach
  ): Promise<Prayer[]> {
<<<<<<< HEAD
    // Normalisation du type de service pour correspondre aux clés JSON
    let jsonKey = serviceType.toLowerCase();
    if (jsonKey === "ma'ariv") jsonKey = "maariv";
    if (jsonKey === "arvit") jsonKey = "maariv";

    const serviceData = typedSiddur.siddur[jsonKey];
    
    if (!serviceData) {
      console.warn(`Service ${jsonKey} non trouvé dans le JSON`);
      return [];
    }

    return Object.entries(serviceData.sections).map(([id, section], index) => ({
      id: `${jsonKey}:${id}`,
      title: section.label, // Titre en hébreu depuis le JSON (sera utilisé comme titre principal)
      titleHe: section.label,
      content: section.text_he,
      contentHe: section.text_he,
      serviceType,
      nusach,
    }));
  }

  static async getPrayerById(id: string): Promise<Prayer | null> {
    const [serviceKey, sectionId] = id.split(':');
    const serviceData = typedSiddur.siddur[serviceKey];
    
    if (!serviceData || !serviceData.sections[sectionId]) return null;

    const section = serviceData.sections[sectionId];
    return {
      id,
      title: section.label,
      titleHe: section.label,
      content: section.text_he,
      contentHe: section.text_he,
      serviceType: serviceKey as ServiceType,
      nusach: 'sephardic',
    };
  }

  static async getPrayerContent(id: string): Promise<string> {
    const prayer = await this.getPrayerById(id);
    return prayer?.content || '';
=======
    const cacheKey = `${serviceType}:${nusach}`;
    if (PRAYER_CACHE.has(cacheKey)) {
      return PRAYER_CACHE.get(cacheKey)!;
    }

    const sections = SEFARIA_SIDDUR_STRUCTURE[serviceType](nusach);

    const prayers = await Promise.all(
      sections.map(async (section, index) => {
        try {
          const text = await fetchWithRetry(section.ref);

          return {
            id: `${serviceType}:${index}`,
            title: section.title,
            titleHe: section.heTitle,
            content: text.en || section.title,
            contentHe: text.he || section.heTitle,
            serviceType,
            nusach,
          } satisfies Prayer;
        } catch (error: any) {
          console.warn('Fallback:', section.ref, error?.response?.status);

          // fallback vers service complet
          try {
            const base = SIDDUR_BASE[nusach];
            const fallback = await fetchWithRetry(
              `${base}, ${serviceType}`
            );

            return {
              id: `${serviceType}:${index}`,
              title: section.title,
              titleHe: section.heTitle,
              content: fallback.en,
              contentHe: fallback.he,
              serviceType,
              nusach,
            } satisfies Prayer;
          } catch {
            return buildFallbackPrayer(section, serviceType, nusach, index);
          }
        }
      })
    );

    PRAYER_CACHE.set(cacheKey, prayers);
    return prayers;
  }

  static async getPrayerById(id: string): Promise<Prayer | null> {
    for (const serviceType of Object.keys(
      SEFARIA_SIDDUR_STRUCTURE
    ) as ServiceType[]) {
      const prayers = await this.getCompleteSiddur(
        serviceType,
        'ashkenazi'
      );
      const found = prayers.find((p) => p.id === id);
      if (found) return found;
    }
    return null;
  }

  static async getPrayerContent(
    id: string,
    lang: 'he' | 'en'
  ): Promise<string> {
    const prayer = await this.getPrayerById(id);
    if (!prayer) return '';
    return lang === 'he' ? prayer.contentHe : prayer.content;
>>>>>>> 9173f91caf7a76f4ff1a09cc678c194f2a736c57
  }
}

export default SiddurService;