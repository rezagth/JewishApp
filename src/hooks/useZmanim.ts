/**
 * Custom Hook: useZmanim
 * Hook pour gérer les Zmanim (horaires des prières)
 */

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import {
  setZmanim,
  setHolidays,
  setUserLocation,
  setLoading,
} from '@store/slices/zmanimSlice';
import ZmanService from '@services/zmanim.service';
import GeolocationService from '@services/geolocation';
import dayjs from 'dayjs';
import { CalendarSummary } from '@services/zmanim.service';

interface Location {
  latitude: number;
  longitude: number;
  timezone?: string;
  city?: string;
}

export const useZmanim = () => {
  const dispatch = useAppDispatch();
  const { zmanim, userLocation, isLoading } = useAppSelector(
    (state) => state.zmanim
  );
  const [calendarSummary, setCalendarSummary] = useState<CalendarSummary | null>(
    null
  );

  /**
   * Localisation par défaut: Jérusalem
   */
  const DEFAULT_LOCATION = {
    latitude: 31.7683,
    longitude: 35.2137,
    city: 'Jérusalem',
    timezone: 'Asia/Jerusalem',
  };

  /**
   * Charge la localisation et les Zmanim
   */
  useEffect(() => {
    const loadZmanim = async () => {
      dispatch(setLoading(true));
      try {
        // Obtenir la localisation
        console.log('📍 Demande de localisation...');
        const location = await GeolocationService.getCurrentLocation();
        if (location) {
          console.log('✅ Localisation obtenue:', location);
          const timezone = await GeolocationService.getTimezone(location);
          dispatch(
            setUserLocation({
              latitude: location.latitude,
              longitude: location.longitude,
              timezone: timezone ?? undefined,
            })
          );

          // Obtenir les Zmanim pour aujourd'hui
          const zmanimData = await ZmanService.getZmanim(dayjs(), location);
          dispatch(setZmanim(zmanimData));

          const summary = await ZmanService.getCalendarSummary(
            dayjs(),
            {
              ...location,
              timezone: timezone ?? undefined,
            }
          );

          dispatch(setHolidays(summary.holidays));
          setCalendarSummary(summary);

          // Obtenir le nom de la ville
          const cityName = await GeolocationService.getCityName(location);
          dispatch(
            setUserLocation({
              latitude: location.latitude,
              longitude: location.longitude,
              city: cityName ?? undefined,
              timezone: timezone ?? undefined,
            })
          );
        } else {
          // 🔴 Fallback à Jérusalem si geolocation échoue
          console.warn('⚠️ Localisation non disponible, utilisation de Jérusalem');
          dispatch(setUserLocation(DEFAULT_LOCATION as any));
          
          const zmanimData = await ZmanService.getZmanim(dayjs(), DEFAULT_LOCATION as Location);
          console.log('📊 Zmanim obtenues:', zmanimData);
          dispatch(setZmanim(zmanimData));
          
          const summary = await ZmanService.getCalendarSummary(
            dayjs(),
            DEFAULT_LOCATION as Location
          );
          dispatch(setHolidays(summary.holidays));
          setCalendarSummary(summary);
        }
      } catch (error) {
        console.error('🔴 Erreur chargement Zmanim:', error);
        // Fallback final: Jérusalem avec heures approximatives
        console.warn('⚠️ Fallback à Jérusalem (heures approximatives)');
        dispatch(setUserLocation(DEFAULT_LOCATION as any));
        const zmanimData = await ZmanService.getZmanim(dayjs(), DEFAULT_LOCATION as Location);
        dispatch(setZmanim(zmanimData));
        setCalendarSummary(null);
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadZmanim();

    // Rafraîchir tous les jours
    const interval = setInterval(loadZmanim, 86400000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return {
    zmanim,
    userLocation,
    isLoading,
    calendarSummary,
    nextZman: zmanim ? ZmanService.getNextZman(zmanim) : null,
  };
};

export default useZmanim;
