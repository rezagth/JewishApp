/**
 * Custom Hook: useSiddur
 * Gère le chargement du Siddur avec le nussah choisi et les insertions spéciales basées sur HebCal
 */

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useAppSelector } from './useRedux';
import { SIDDUR_DATA, PrayerSection as FullPrayerSection, PrayerVerse, SiddurService as FullSiddurService } from '../data/siddur.data';
import {
  SpecialInsertion,
  getSpecialInsertionsForDate,
  SefariaText,
} from '../services/sefaria.service';
import OpenSiddurService from '@services/opensiddur.service';
import ZmanService from '@services/zmanim.service';
// Local Sefaria export merged JSON (downloaded into src/data)
import SefariaAshkenazHe from '../data/siddur.sefaria_ashkenaz.he.json';
import SefariaAshkenazEn from '../data/siddur.sefaria_ashkenaz.en.json';

interface HebrewDate {
  month: number;
  day: number;
  year: number;
}

const DEFAULT_LOCATION = {
  latitude: 31.7683,
  longitude: 35.2137,
  city: 'Jerusalem',
};

type SiddurBundle = FullSiddurService & {
  specialInsertions: SpecialInsertion[];
};

interface LoadedSection extends FullPrayerSection {
  content?: SefariaText;
  loading?: boolean;
  error?: string;
}

const flattenVerse = (verse: PrayerVerse): string => {
  if (verse.hebrew) {
    return verse.hebrew;
  }

  return '';
};

const buildSectionContent = (section: FullPrayerSection): SefariaText => {
  const heText = section.verses
    .map((verse) => flattenVerse(verse))
    .filter(Boolean)
    .join('\n\n');

  const enText = section.verses
    .map((verse) => verse.french || verse.transliteration || '')
    .filter(Boolean)
    .join('\n\n');

  return {
    titleHe: section.titleHe,
    titleEn: section.title,
    heText,
    enText,
    ref: section.id,
  };
};

// ─── Parseurs de date hébraïque ───────────────────────────────────────────
const HEBREW_MONTHS: Record<string, number> = {
  'Nisan': 1,
  'Iyyar': 2,
  'Sivan': 3,
  'Tammuz': 4,
  'Av': 5,
  'Elul': 6,
  'Tishrei': 7,
  'Heshvan': 8,
  'Kislev': 9,
  'Tevet': 10,
  'Shevat': 11,
  'Adar': 12,
  'Adar II': 13, // En année bissextile
};

/**
 * Parse une date hébraïque au format "25 Kislev 5784" en objet {month, day, year}
 */
const parseHebrewDate = (dateString: string): HebrewDate | null => {
  if (!dateString) return null;
  
  // Format: "25 Kislev 5784"
  const parts = dateString.trim().split(/\s+/);
  if (parts.length < 3) return null;

  const day = parseInt(parts[0], 10);
  const monthName = parts[1];
  const year = parseInt(parts[2], 10);

  const month = HEBREW_MONTHS[monthName];
  if (!month || isNaN(day) || isNaN(year)) return null;

  return { month, day, year };
};

/**
 * Hook pour charger le Siddur avec le nussah et les insertions spéciales
 * @param serviceType - Type de service ('shacharit', 'mincha', 'maariv')
 * @returns Objet avec les sections et les insertions spéciales chargées
 */
export const useSiddur = (serviceType: 'shacharit' | 'mincha' | 'maariv') => {
  const userLocation = useAppSelector((state) => state.user.currentUser?.location);
  const userNusach = useAppSelector((state) => state.user.preferences.nusach);
  
  // Utiliser des coordonnées par défaut (Jerusalem) plutôt que la location dynamique
  const location = userLocation || DEFAULT_LOCATION;

  const [siddur, setSiddur] = useState<SiddurBundle | null>(null);
  const [loadedSections, setLoadedSections] = useState<LoadedSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer la date hébraïque et charger les sections
  useEffect(() => {
    const loadSiddur = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Récupérer la date hébraïque (une fois par jour uniquement)
        const today = dayjs();
        const calendarSummary = await ZmanService.getCalendarSummary(today, location);
        const hebrewDate = parseHebrewDate(calendarSummary.hebrewDate);

        if (!hebrewDate) {
          throw new Error('Impossible de parser la date hébraïque');
        }

        const resolvedServiceType = serviceType === 'maariv' ? 'arvit' : serviceType;

        const specialInsertions = getSpecialInsertionsForDate(hebrewDate);

        // Prefer Sefaria export when user nusach is ashkenazi.
        // Also allow 'sephardic' to reuse the Ashkenaz export loading logic
        // (we'll apply sephardic-specific transformations afterwards).
        const useSefariaExport = (userNusach === 'ashkenazi' || userNusach === 'sephardic') && SefariaAshkenazHe && SefariaAshkenazEn;

        const loaded: LoadedSection[] = [];

        if (useSefariaExport) {
          const keyMap: Record<string, string> = { shacharit: 'Shacharit', mincha: 'Minchah', maariv: 'Maariv' };
          const sfKey = keyMap[serviceType];
          const targetHe = (SefariaAshkenazHe as any).text?.Weekday?.[sfKey];
          const targetEn = (SefariaAshkenazEn as any).text?.Weekday?.[sfKey];

          const flattenNode = (node: any): string => {
            if (!node) return '';
            if (typeof node === 'string') return node.replace(/<[^>]+>/g, '').trim();
            if (Array.isArray(node)) return node.map(flattenNode).filter(Boolean).join('\n\n');
            if (typeof node === 'object') return Object.keys(node).map((k) => flattenNode(node[k])).filter(Boolean).join('\n\n');
            return '';
          };

          if (targetHe && typeof targetHe === 'object') {
            for (const secName of Object.keys(targetHe)) {
              const heNode = targetHe[secName];
              const enNode = targetEn?.[secName];
              const heText = flattenNode(heNode);
              const enText = flattenNode(enNode);
              loaded.push({
                id: secName.toLowerCase().replace(/\s+/g, '-'),
                title: secName,
                titleHe: secName,
                category: 'obligatoire',
                verses: [],
                content: {
                  titleHe: secName,
                  titleEn: secName,
                  heText,
                  enText,
                  ref: `SefariaExport:${sfKey}:${secName}`,
                },
                loading: false,
              });
            }
          }
        } else {
          const serviceData = SIDDUR_DATA.find((s) => s.id === resolvedServiceType);
          if (!serviceData) throw new Error(`Service introuvable: ${serviceType}`);
          loaded.push(...serviceData.sections.map((section) => ({
            ...section,
            content: buildSectionContent(section),
            loading: false,
          })));
        }

        // If the user chose 'sephardic', keep the same loading logic as
        // ashkenaz but mark the bundle as sephardic and apply any
        // sephardic-specific transformations.
        const applySephardicMods = (sections: LoadedSection[]): LoadedSection[] => {
          // This function is intentionally small and extensible.
          // Add mapping/replace rules here when specific sephardic
          // textual modifications are required.
          return sections.map((s) => ({
            ...s,
            // Example placeholder for future modifications:
            // title: s.title.replace('Amidah', 'Amidah (Sefardi)')
          }));
        };

        const finalSections = userNusach === 'sephardic' ? applySephardicMods(loaded) : loaded;

        setLoadedSections(finalSections);

        setSiddur({
          id: resolvedServiceType as any,
          title: '',
          titleHe: '',
          icon: '',
          color: '',
          sections: finalSections,
          specialInsertions,
        } as any);
      } catch (err) {
        setError(String(err));
        console.error('Erreur chargement Siddur:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSiddur();
  }, [serviceType, location]);

  return {
    siddur,
    loadedSections,
    isLoading,
    error,
  };
};

export default useSiddur;
