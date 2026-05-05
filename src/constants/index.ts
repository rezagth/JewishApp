import { Nusach, ServiceType } from '@types/index';

// Langues supportées
export const SUPPORTED_LANGUAGES = ['he', 'fr', 'en'] as const;
export const DEFAULT_LANGUAGE = 'he';

// Nusach (rites) supportés
export const NUSACH_OPTIONS: Record<Nusach, string> = {
  ashkenazi: 'Ashkenazi',
  sephardic: 'Sephardic',
  mizrahi: 'Mizrahi',
  teimani: 'Yemenite',
};

// Types de services
export const SERVICE_TYPES: Record<
  ServiceType,
  { name: string; nameHe: string }
> = {
  shacharit: { name: 'Morning Prayer', nameHe: 'שחרית' },
  mincha: { name: 'Afternoon Prayer', nameHe: 'מנחה' },
  arvit: { name: 'Evening Prayer', nameHe: 'ערבית' },
  "ma'ariv": { name: 'Evening Prayer', nameHe: 'מעריב' },
};

// Heures pour détermi ner le service actuel
export const SERVICE_HOURS = {
  shacharit: { start: 6, end: 9 }, // 6h - 9h
  mincha: { start: 13, end: 17 }, // 13h - 17h
  arvit: { start: 18, end: 23 }, // 18h - 23h
};

// Catégories de questions
export const QUESTION_CATEGORIES = {
  kashrut: { label: 'Kashrut', icon: '🥘' },
  holidays: { label: 'Holidays', icon: '🕎' },
  daily_life: { label: 'Daily Life', icon: '📖' },
  theology: { label: 'Theology', icon: '💭' },
  other: { label: 'Other', icon: '❓' },
};

// Tailles de police supportées
export const FONT_SIZES = [0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5];
export const DEFAULT_FONT_SIZE = 1;

// Couleurs du design
export const COLORS = {
  primary: '#1B5E87', // Bleu profond
  secondary: '#E8A537', // Or
  accent: '#C41E3A', // Rouge juif
  background: '#FAFAFA',
  darkBackground: '#121212',
  text: '#212121',
  lightText: '#757575',
  border: '#E0E0E0',
  error: '#B00020',
  success: '#2E7D32',
};

// Horaires de Shabbat (exemples par latitude/longitude)
export const SHABBAT_DEFAULTS = {
  candleLightingOffset: 18, // 18 minutes avant sunset
  nightfallOffset: 50, // 50 minutes après sunset
};

// Liens API externes
export const API_ENDPOINTS = {
  sefaria: 'https://www.sefaria.org/api/',
  hebcal: 'https://www.hebcal.com/api/',
  kosherZmanim: 'https://kosherzmanim.com/',
};

// Délais de cache (en secondes)
export const CACHE_DURATIONS = {
  prayers: 3600 * 24, // 24 heures
  zmanim: 3600, // 1 heure
  holidays: 3600 * 24 * 365, // 1 an
  community: 300, // 5 minutes
};
