/**
 * Custom Hook: usePrayer
 * Hook pour gérer l'affichage conditionnel des prières selon l'heure
 */

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import {
  setCurrentService,
  setLoading,
} from '@store/slices/prayerSlice';
import ZmanService from '@services/zmanim.service';
import { Prayer, ServiceType } from '../runtime-types';

export const usePrayer = () => {
  const dispatch = useAppDispatch();
  const { currentService, currentPrayers, isLoading } = useAppSelector(
    (state) => state.prayer
  );
  const [currentServicePrayers, setCurrentServicePrayers] = useState<Prayer[]>([]);

  /**
   * Met à jour le service actuel basé sur l'heure
   */
  useEffect(() => {
    const updateServiceBasedOnTime = () => {
      const now = new Date();
      // Approximation simple: déterminer le service basé sur l'heure
      const hour = now.getHours();
      let service: ServiceType = 'shacharit';
      
      if (hour >= 5 && hour < 11) {
        service = 'shacharit';
      } else if (hour >= 11 && hour < 16) {
        service = 'mincha';
      } else {
        service = 'arvit';
      }
      
      dispatch(setCurrentService(service));
    };

    // Mettre à jour immédiatement
    updateServiceBasedOnTime();

    // Puis chaque heure
    const interval = setInterval(updateServiceBasedOnTime, 3600000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return {
    currentService,
    currentPrayers: currentServicePrayers || currentPrayers,
    isLoading,
  };
};

export default usePrayer;
