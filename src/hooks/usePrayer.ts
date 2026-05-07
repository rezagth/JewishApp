/**
 * Custom Hook: usePrayer
 * Hook pour gérer l'affichage conditionnel des prières selon l'heure
 */

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import {
  setCurrentService,
  setPrayers,
  setLoading,
} from '@store/slices/prayerSlice';
import SiddurService from '@services/siddur.service';
import ZmanService from '@services/zmanim.service';
import { ServiceType, Prayer } from '@types/index';

export const usePrayer = () => {
  const dispatch = useAppDispatch();
  const { currentService, currentPrayers, isLoading } = useAppSelector(
    (state) => state.prayer
  );
  const { nusach } = useAppSelector((state) => state.user.preferences);
  const [currentServicePrayers, setCurrentServicePrayers] = useState<Prayer[]>(
    []
  );

  /**
   * Charge les prières au démarrage et quand le service change
   */
  useEffect(() => {
    const loadPrayers = async () => {
      dispatch(setLoading(true));
      try {
        const prayers = await SiddurService.getCompleteSiddur(currentService, nusach);
        dispatch(setPrayers(prayers));
        setCurrentServicePrayers(prayers);
      } catch (error) {
        console.error('Erreur chargement prières:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadPrayers();
  }, [currentService, nusach]);

  /**
   * Met à jour le service actuel basé sur l'heure
   */
  useEffect(() => {
    const updateServiceBasedOnTime = () => {
      const now = new Date();
      const service = ZmanService.getCurrentService(now);
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
