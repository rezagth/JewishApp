/**
 * Custom Hook: usePrayerTime
 * Détermine l'heure de prière actuelle basée sur les Zmanim
 */

import { useEffect, useState } from 'react';
import { useAppSelector } from './useRedux';
import dayjs from 'dayjs';

export interface CurrentPrayerTime {
  name: string;
  nameHe: string;
  startTime: Date;
  endTime: Date;
  isNow: boolean;
  progress: number; // 0-100
}

export const usePrayerTime = (): {
  current: CurrentPrayerTime | null;
  next: CurrentPrayerTime | null;
} => {
  const zmanim = useAppSelector((state) => state.zmanim.zmanim);
  const [current, setCurrent] = useState<CurrentPrayerTime | null>(null);
  const [next, setNext] = useState<CurrentPrayerTime | null>(null);

  useEffect(() => {
    if (!zmanim) return;

    const now = dayjs();
    const sunrise = dayjs(zmanim.sunrise);
    const sofZmanTefilla = dayjs(zmanim.sof_zman_tefilla);
    const midday = dayjs(zmanim.midday);
    const sunset = dayjs(zmanim.sunset);
    const tzaitStars = dayjs(zmanim.tzait_stars);

    // Définir les périodes de prière
    const prayerTimes = [
      {
        name: 'Shacharit',
        nameHe: 'שחרית',
        startTime: sunrise,
        endTime: sofZmanTefilla,
      },
      {
        name: 'Mincha',
        nameHe: 'מנחה',
        startTime: midday,
        endTime: sunset,
      },
      {
        name: "Ma'ariv",
        nameHe: "מעריב",
        startTime: sunset,
        endTime: tzaitStars.add(1, 'hour'), // Un peu après tzait
      },
    ];

    const isInRange = (time: dayjs.Dayjs, start: dayjs.Dayjs, end: dayjs.Dayjs) =>
      time.valueOf() >= start.valueOf() && time.valueOf() < end.valueOf();

    const isBefore = (time: dayjs.Dayjs, start: dayjs.Dayjs) =>
      time.valueOf() < start.valueOf();

    // Trouver la prière actuelle et la prochaine
    let currentPrayer: CurrentPrayerTime | null = null;
    let nextPrayer: CurrentPrayerTime | null = null;

    for (let i = 0; i < prayerTimes.length; i++) {
      const prayer = prayerTimes[i];
      if (isInRange(now, prayer.startTime, prayer.endTime)) {
        const duration = prayer.endTime.diff(prayer.startTime, 'millisecond');
        const elapsed = now.diff(prayer.startTime, 'millisecond');
        const progress = Math.min(100, Math.max(0, (elapsed / duration) * 100));

        currentPrayer = {
          name: prayer.name,
          nameHe: prayer.nameHe,
          startTime: prayer.startTime.toDate(),
          endTime: prayer.endTime.toDate(),
          isNow: true,
          progress,
        };

        // La prière suivante est la prochaine dans la liste
        if (i + 1 < prayerTimes.length) {
          const nextPrayer_ = prayerTimes[i + 1];
          nextPrayer = {
            name: nextPrayer_.name,
            nameHe: nextPrayer_.nameHe,
            startTime: nextPrayer_.startTime.toDate(),
            endTime: nextPrayer_.endTime.toDate(),
            isNow: false,
            progress: 0,
          };
        }
        break;
      }
    }

    // Si aucune prière en cours, trouver la prochaine
    if (!currentPrayer) {
      for (let i = 0; i < prayerTimes.length; i++) {
        const prayer = prayerTimes[i];
        if (isBefore(now, prayer.startTime)) {
          nextPrayer = {
            name: prayer.name,
            nameHe: prayer.nameHe,
            startTime: prayer.startTime.toDate(),
            endTime: prayer.endTime.toDate(),
            isNow: false,
            progress: 0,
          };
          break;
        }
      }
    }

    setCurrent(currentPrayer);
    setNext(nextPrayer);
  }, [zmanim]);

  return { current, next };
};
