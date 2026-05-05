/**
 * Service pour gérer les Zmanim (heures des prières)
 * Utilise Hebcal pour les calculs astronomiques et le calendrier juif.
 */

import axios from 'axios';
import { API_ENDPOINTS } from '@constants/index';
import { ZmanDetails, JewishHoliday } from '../types';
import dayjs, { Dayjs } from 'dayjs';

interface Location {
  latitude: number;
  longitude: number;
  timezone?: string;
  city?: string;
}

interface HebcalZmanimResponse {
  date: string;
  location?: {
    title?: string;
    tzid?: string;
  };
  times?: Record<string, string>;
}

interface HebcalCalendarResponse {
  items?: Array<{
    title: string;
    hebrew?: string;
    category?: string;
    subcat?: string;
    date: string;
    hdate?: string;
  }>;
}

export interface CalendarSummary {
  hebrewDate: string;
  parasha: string | null;
  candleLighting: Date | null;
  havdalah: Date | null;
  holidays: JewishHoliday[];
  todayLabel: string;
}

const HEBCAL_BASE_URL = 'https://www.hebcal.com';

const toDate = (value?: string): Date => {
  if (!value) {
    return new Date();
  }

  return new Date(value);
};

const toIsoString = (value?: string): string => {
  if (!value) {
    return new Date().toISOString();
  }

  return new Date(value).toISOString();
};

const isLikelyIsrael = (location: Location): boolean => {
  return (
    location.latitude >= 29 &&
    location.latitude <= 34.8 &&
    location.longitude >= 33 &&
    location.longitude <= 36.5
  );
};

export class ZmanService {
  /**
   * Récupère les Zmanim (heures prière) pour une date et localisation donnée
   * @param date - Date pour laquelle calculer les Zmanim
   * @param location - Localisation (latitude, longitude)
   * @returns ZmanDetails avec toutes les heures importantes
   */
  static async getZmanim(
    date: Dayjs,
    location: Location
  ): Promise<ZmanDetails> {
    const tzid =
      location.timezone ||
      Intl.DateTimeFormat().resolvedOptions().timeZone ||
      'UTC';

    const url = new URL('/zmanim', HEBCAL_BASE_URL);
    url.searchParams.set('cfg', 'json');
    url.searchParams.set('latitude', String(location.latitude));
    url.searchParams.set('longitude', String(location.longitude));
    url.searchParams.set('tzid', tzid);
    url.searchParams.set('date', date.format('YYYY-MM-DD'));
    url.searchParams.set('sec', '0');
    url.searchParams.set('ue', 'on');

    try {
      const response = await axios.get<HebcalZmanimResponse>(url.toString(), {
        timeout: 12000,
      });

      const times = response.data.times ?? {};

      return {
        alot: toIsoString(times.alotHaShachar ?? times.alot ?? times.dawn),
        sunrise: toIsoString(times.sunrise),
        sof_zman_shema: toIsoString(times.sofZmanShma ?? times.sofZmanShmaMGA),
        sof_zman_tefilla: toIsoString(times.sofZmanTfilla ?? times.sofZmanTfillaMGA),
        midday: toIsoString(times.chatzot),
        sunset: toIsoString(times.sunset),
        tzait_stars: toIsoString(times.tzeit42min ?? times.tzeit50min ?? times.tzeit7083deg),
      };
    } catch (error: any) {
      if (error?.response?.status) {
        console.error('🔴 Hebcal Zmanim Error:', {
          status: error.response.status,
          url: url.toString(),
          latitude: location.latitude,
          longitude: location.longitude,
          timezone: tzid,
          message: error.message,
        });
      } else {
        console.error('🔴 Erreur Zmanim:', error);
      }
      console.warn('⚠️ Utilisation des heures approximatives par défaut');
      const baseDate = date.toDate();

      return {
        alot: dayjs(baseDate).hour(5).minute(45).toDate().toISOString(),
        sunrise: dayjs(baseDate).hour(6).minute(30).toDate().toISOString(),
        sof_zman_shema: dayjs(baseDate).hour(9).minute(0).toDate().toISOString(),
        sof_zman_tefilla: dayjs(baseDate).hour(9).minute(45).toDate().toISOString(),
        midday: dayjs(baseDate).hour(12).toDate().toISOString(),
        sunset: dayjs(baseDate).hour(18).minute(30).toDate().toISOString(),
        tzait_stars: dayjs(baseDate).hour(19).minute(15).toDate().toISOString(),
      };
    }
  }

  /**
   * Récupère un résumé du calendrier juif réel pour la date et la localisation.
   */
  static async getCalendarSummary(
    date: Dayjs,
    location: Location
  ): Promise<CalendarSummary> {
    const tzid =
      location.timezone ||
      Intl.DateTimeFormat().resolvedOptions().timeZone ||
      'UTC';

    const url = new URL('/hebcal', HEBCAL_BASE_URL);
    url.searchParams.set('v', '1');
    url.searchParams.set('cfg', 'json');
    url.searchParams.set('maj', 'on');
    url.searchParams.set('min', 'on');
    url.searchParams.set('mod', 'on');
    url.searchParams.set('nx', 'on');
    url.searchParams.set('ss', 'on');
    url.searchParams.set('d', 'on');
    url.searchParams.set('start', date.format('YYYY-MM-DD'));
    url.searchParams.set('end', date.format('YYYY-MM-DD'));
    url.searchParams.set('i', isLikelyIsrael(location) ? 'on' : 'off');

    try {
      const response = await axios.get<HebcalCalendarResponse>(url.toString(), {
        timeout: 12000,
      });

      const items = response.data.items ?? [];
      const hebrewDate = items.find((item) => item.hdate)?.hdate ?? '';
      const parashaItem = items.find(
        (item) => item.category === 'parashat' || item.subcat === 'parashat'
      );
      const candleItem = items.find((item) => /candle/i.test(item.title));
      const havdalahItem = items.find((item) => /havdalah/i.test(item.title));

      const holidays = items
        .filter((item) =>
          ['holiday', 'fast', 'special_shabbat', 'candles', 'havdalah'].includes(
            item.category || ''
          )
        )
        .map((item, index) => ({
          id: `${item.title}-${index}`,
          name: item.title,
          nameHe: item.hebrew || item.title,
          hebrewDate: item.hdate || hebrewDate,
          gregorianDate: new Date(item.date).toISOString(),
          type: (item.category === 'fast'
            ? 'fast'
            : item.category === 'special_shabbat'
              ? 'special_shabbat'
              : 'holiday') as 'holiday' | 'fast' | 'special_shabbat',
          torah_portion: parashaItem?.title,
        }));

      return {
        hebrewDate: hebrewDate || date.format('DD/MM/YYYY'),
        parasha: parashaItem?.title || null,
        candleLighting: candleItem ? toDate(candleItem.date) : null,
        havdalah: havdalahItem ? toDate(havdalahItem.date) : null,
        holidays,
        todayLabel: items[0]?.title || date.format('dddd D MMMM YYYY'),
      };
    } catch (error: any) {
      if (error?.response?.status) {
        console.error('🔴 Hebcal Calendar API Error:', {
          status: error.response.status,
          url: url.toString(),
          message: error.message,
        });
      } else {
        console.error('🔴 Erreur Calendrier:', error?.message || error);
      }
      console.warn('⚠️ Calendrier juif indisponible, retour du fallback');
      return {
        hebrewDate: date.format('DD/MM/YYYY'),
        parasha: null,
        candleLighting: null,
        havdalah: null,
        holidays: [],
        todayLabel: date.format('dddd D MMMM YYYY'),
      };
    }
  }

  /**
   * Détermine le service actuel en fonction de l'heure
   */
  static getCurrentService(now: Date): 'shacharit' | 'mincha' | 'arvit' {
    const hour = dayjs(now).hour();

    if (hour >= 6 && hour < 12) return 'shacharit';
    if (hour >= 12 && hour < 18) return 'mincha';
    return 'arvit';
  }

  /**
   * Récupère le prochain Zman important
   */
  static getNextZman(zmanim: ZmanDetails): { name: string; time: Date } | null {
    const now = new Date();

    const times = [
      { name: 'Alot Hashachar', time: new Date(zmanim.alot) },
      { name: 'Sunrise', time: new Date(zmanim.sunrise) },
      { name: 'Sof Zman Shema', time: new Date(zmanim.sof_zman_shema) },
      { name: 'Sof Zman Tefilla', time: new Date(zmanim.sof_zman_tefilla) },
      { name: 'Sunset', time: new Date(zmanim.sunset) },
      { name: 'Tzait Hakochavim', time: new Date(zmanim.tzait_stars) },
    ];

    const futureTime = times.find((t) => t.time > now);
    return futureTime || null;
  }

  /**
   * Vérifie si c'est Shabbat
   */
  static isShabbat(date: Date): boolean {
    // 5 = Friday, 6 = Saturday
    const day = dayjs(date).day();
    return day === 5 || day === 6;
  }

  /**
   * Récupère les heures d'allumage des bougies et fin de Shabbat
   */
  static getShabbatTimes(zmanim: ZmanDetails): {
    candles: Date;
    havdalah: Date;
  } {
    return {
      candles: dayjs(zmanim.sunset).subtract(18, 'minutes').toDate(),
      havdalah: dayjs(zmanim.tzait_stars).add(30, 'minutes').toDate(),
    };
  }
}

export default ZmanService;
