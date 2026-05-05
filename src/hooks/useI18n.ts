/**
 * Custom Hook: useI18n
 * Hook pour la gestion de l'internationalisation (multi-langue)
 */

import { useAppDispatch, useAppSelector } from './useRedux';
import { setLanguage } from '@store/slices/userSlice';

const translations = {
  en: {
    'app.title': 'Jewish Connect',
    'app.subtitle': 'Siddur, Zmanim & Community',
    'nav.siddur': 'Prayer',
    'nav.calendar': 'Calendar',
    'nav.community': 'Community',
    'prayer.shacharit': 'Morning Prayer',
    'prayer.mincha': 'Afternoon Prayer',
    'prayer.arvit': 'Evening Prayer',
    'zmanim.next': 'Next Prayer Time',
    'zmanim.shabbat': 'Shabbat Times',
  },
  he: {
    'app.title': ' Jewish Connect',
    'app.subtitle': 'סידור, זמנים וקהילה',
    'nav.siddur': 'סידור',
    'nav.calendar': 'לוח שנה',
    'nav.community': 'קהילה',
    'prayer.shacharit': 'שחרית',
    'prayer.mincha': 'מנחה',
    'prayer.arvit': 'ערבית',
    'zmanim.next': 'הזמן הבא',
    'zmanim.shabbat': 'זמנים של שבת',
  },
  fr: {
    'app.title': 'Jewish Connect',
    'app.subtitle': 'Siddour, Zmanim & Communauté',
    'nav.siddur': 'Prière',
    'nav.calendar': 'Calendrier',
    'nav.community': 'Communauté',
    'prayer.shacharit': 'Prière du Matin',
    'prayer.mincha': "Prière de l'Après-midi",
    'prayer.arvit': 'Prière du Soir',
    'zmanim.next': 'Prochain Zman',
    'zmanim.shabbat': 'Heures du Shabbat',
  },
};

const FALLBACK_LANGUAGE: 'en' = 'en';

const translate = (
  language: 'he' | 'fr' | 'en',
  key: string,
  defaultValue?: string
): string => {
  const localizedValue = translations[language]?.[key];

  if (localizedValue) {
    return localizedValue;
  }

  const fallbackValue = translations[FALLBACK_LANGUAGE]?.[key];

  return fallbackValue || defaultValue || key;
};

export const useI18n = () => {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.user.preferences.language);

  const t = (key: string, defaultValue?: string): string => {
    return translate(language, key, defaultValue);
  };

  const changeLanguage = (newLanguage: 'he' | 'fr' | 'en') => {
    dispatch(setLanguage(newLanguage));
  };

  const isRTL = language === 'he';

  return {
    t,
    language,
    changeLanguage,
    isRTL,
  };
};

export default useI18n;
