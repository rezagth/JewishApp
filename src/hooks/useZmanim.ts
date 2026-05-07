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
   * Rafraîchit les données pour une localisation spécifique
   */
  const refreshZmanim = async (location: Location) => {
    dispatch(setLoading(true));
    try {
      const timezone = await GeolocationService.getTimezone(location);
      const zmanimData = await ZmanService.getZmanim(dayjs(), {
        ...location,
        timezone: timezone ?? undefined,
      });
      dispatch(setZmanim(zmanimData));

      const rangeStart = dayjs().startOf('month').startOf('week');
      const rangeEnd = rangeStart.clone().add(42, 'day');
      const summary = await ZmanService.getCalendarSummary(
        rangeStart,
        { ...location, timezone: timezone ?? undefined },
        rangeEnd
      );
      dispatch(setHolidays(summary.holidays));
      setCalendarSummary(summary);
    } catch (error) {
      console.error('Erreur rafraîchissement Zmanim:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Charge la localisation initiale si nécessaire
   */
  useEffect(() => {
    if (!userLocation) {
      const initLocation = async () => {
        dispatch(setLoading(true));
        try {
          const location = await GeolocationService.getCurrentLocation();
          if (location) {
            const cityName = await GeolocationService.getCityName(location);
            const timezone = await GeolocationService.getTimezone(location);
            const newLoc = {
              latitude: location.latitude,
              longitude: location.longitude,
              city: cityName ?? undefined,
              timezone: timezone ?? undefined,
            };
            dispatch(setUserLocation(newLoc));
          } else {
            dispatch(setUserLocation(DEFAULT_LOCATION as any));
          }
        } catch (err) {
          dispatch(setUserLocation(DEFAULT_LOCATION as any));
        } finally {
          dispatch(setLoading(false));
        }
      };
      initLocation();
    }
  }, [dispatch, userLocation]);

  /**
   * Réagit aux changements de localisation
   */
  useEffect(() => {
    if (userLocation) {
      refreshZmanim(userLocation);
    }
  }, [userLocation?.latitude, userLocation?.longitude]);

  return {
    zmanim,
    userLocation,
    isLoading,
    calendarSummary,
    nextZman: zmanim ? ZmanService.getNextZman(zmanim) : null,
    refreshZmanim,
  };
};

export default useZmanim;
