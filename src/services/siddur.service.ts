/**
 * Service pour gérer les prières du Siddur
 * Gère le contenu liturgique, les nusach différents, et l'affichage conditionnel.
 */

import axios from 'axios';
import { Prayer, ServiceType, Nusach } from '@types/index';

interface PrayerTemplate {
  id: string;
  title: string;
  titleHe: string;
  ref: string;
  serviceType: ServiceType;
}

const PRAYER_TEMPLATES: Record<ServiceType, PrayerTemplate[]> = {
  shacharit: [
    {
      id: 'ashrei',
      title: 'Ashrei',
      titleHe: 'אשרי',
      ref: 'Psalms.145',
      serviceType: 'shacharit',
    },
    {
      id: 'shema',
      title: 'Shema',
      titleHe: 'שמע',
      ref: 'Deuteronomy.6.4-9',
      serviceType: 'shacharit',
    },
    {
      id: 'vayomer',
      title: 'Vayomer',
      titleHe: 'ויאמר',
      ref: 'Numbers.15.37-41',
      serviceType: 'shacharit',
    },
  ],
  mincha: [
    {
      id: 'ashrei-mincha',
      title: 'Ashrei',
      titleHe: 'אשרי',
      ref: 'Psalms.145',
      serviceType: 'mincha',
    },
    {
      id: 'tehillim-130',
      title: 'Shir HaMaalot',
      titleHe: 'שיר המעלות',
      ref: 'Psalms.130',
      serviceType: 'mincha',
    },
  ],
  arvit: [
    {
      id: 'shema-arvit',
      title: 'Shema',
      titleHe: 'שמע',
      ref: 'Deuteronomy.6.4-9',
      serviceType: 'arvit',
    },
    {
      id: 'psalm-91',
      title: 'Psalm 91',
      titleHe: 'יושב בסתר עליון',
      ref: 'Psalms.91',
      serviceType: 'arvit',
    },
  ],
  "ma'ariv": [
    {
      id: 'shema-maariv',
      title: 'Shema',
      titleHe: 'שמע',
      ref: 'Deuteronomy.6.4-9',
      serviceType: "ma'ariv",
    },
    {
      id: 'psalm-121',
      title: 'Psalm 121',
      titleHe: 'שיר למעלות',
      ref: 'Psalms.121',
      serviceType: "ma'ariv",
    },
  ],
};

const PRAYER_CACHE = new Map<string, Prayer[]>();

const flattenText = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value.flat(Infinity).filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
  }

  if (typeof value === 'string') {
    return value.replace(/\s+/g, ' ').trim();
  }

  return '';
};

const fetchSefariaText = async (
  ref: string
): Promise<{ he: string; en: string }> => {
  const url = new URL(`https://www.sefaria.org/api/texts/${encodeURIComponent(ref)}`);
  url.searchParams.set('context', '0');
  url.searchParams.set('commentary', '0');
  url.searchParams.set('pad', '0');
  url.searchParams.set('lang', 'he');
  url.searchParams.set('lang2', 'en');

  const response = await axios.get(url.toString(), { timeout: 12000 });
  const data = response.data;

  return {
    he: flattenText(data.he || data.hebrew || data.text || data.heTexts),
    en: flattenText(data.text || data.en || data.texts || data.textEnglish),
  };
};

const buildFallbackPrayer = (template: PrayerTemplate): Prayer => {
  return {
    id: template.id,
    title: template.title,
    titleHe: template.titleHe,
    content: `${template.title} text unavailable offline.`,
    contentHe: `${template.titleHe} - טקסט זמין במצב offline`,
    serviceType: template.serviceType,
    nusach: 'ashkenazi',
  };
};

export class SiddurService {
  /**
   * Récupère les prières pour un service spécifique et nusach
   */
  static async getPrayers(
    serviceType: ServiceType,
    nusach: Nusach
  ): Promise<Prayer[]> {
    try {
      const cacheKey = `${serviceType}:${nusach}`;
      const cached = PRAYER_CACHE.get(cacheKey);
      if (cached) {
        return cached;
      }

      const templates = PRAYER_TEMPLATES[serviceType];
      const prayers = await Promise.all(
        templates.map(async (template) => {
          try {
            const text = await fetchSefariaText(template.ref);

            return {
              id: template.id,
              title: template.title,
              titleHe: template.titleHe,
              content: text.en || template.title,
              contentHe: text.he || template.titleHe,
              serviceType,
              nusach,
            } satisfies Prayer;
          } catch (error) {
            console.warn(`Fallback prayer for ${template.ref}:`, error);
            return buildFallbackPrayer(template);
          }
        })
      );

      PRAYER_CACHE.set(cacheKey, prayers);
      return prayers;
    } catch (error) {
      console.error('Erreur lors du chargement des prières:', error);
      return PRAYER_TEMPLATES[serviceType].map(buildFallbackPrayer);
    }
  }

  /**
   * Récupère une prière spécifique par ID
   */
  static async getPrayerById(prayerId: string): Promise<Prayer | null> {
    try {
      for (const serviceType of Object.keys(PRAYER_TEMPLATES) as ServiceType[]) {
        const prayers = await this.getPrayers(serviceType, 'ashkenazi');
        const prayer = prayers.find((p) => p.id === prayerId);
        if (prayer) {
          return prayer;
        }
      }
      return null;
    } catch (error) {
      console.error('Erreur lors du chargement de la prière:', error);
      throw error;
    }
  }

  /**
   * Récupère le contenu d'une prière avec les brachot
   */
  static async getPrayerContent(
    prayerId: string,
    language: 'he' | 'en' | 'fr'
  ): Promise<string> {
    const prayer = await this.getPrayerById(prayerId);
    if (!prayer) return '';

    const content = language === 'he' ? prayer.contentHe : prayer.content;

    // Ajouter les brachot si présentes
    if (prayer.brachot) {
      const beforeBrachot = prayer.brachot
        .filter((b) => b.type === 'before')
        .map((b) => (language === 'he' ? b.contentHe : b.content))
        .join('\n\n');

      const afterBrachot = prayer.brachot
        .filter((b) => b.type === 'after')
        .map((b) => (language === 'he' ? b.contentHe : b.content))
        .join('\n\n');

      return `${beforeBrachot}\n\n${content}\n\n${afterBrachot}`;
    }

    return content;
  }

  /**
   * Recherche des prières par terme
   */
  static async searchPrayers(query: string, nusach: Nusach): Promise<Prayer[]> {
    const results: Prayer[] = [];
    const lowerQuery = query.toLowerCase();

    for (const serviceType of Object.keys(PRAYER_TEMPLATES) as ServiceType[]) {
      const prayers = await this.getPrayers(serviceType, nusach);
      const matched = prayers.filter(
        (p) =>
          p.title.toLowerCase().includes(lowerQuery) ||
          p.titleHe.toLowerCase().includes(lowerQuery)
      );
      results.push(...matched);
    }

    return results;
  }

  /**
   * Retourne les prières associées pour un service (ex: Shacharit complet)
   */
  static getServiceStructure(serviceType: ServiceType): string[] {
    // Structure standard d'un service
    const structures: Record<ServiceType, string[]> = {
      shacharit: [
        'blessings-morning',
        'psalms',
        'yigdal',
        'shema-brachot',
        'shema',
        'amidah',
        'takhanun',
      ],
      mincha: ['ashrei', 'amidah', 'tachanun', 'aleynu'],
      arvit: ['maariv', 'shema', 'amidah'],
      "ma'ariv": ['maariv', 'shema', 'amidah'],
    };

    return structures[serviceType];
  }
}

export default SiddurService;
