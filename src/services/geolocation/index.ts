/**
 * Service pour gérer la géolocalisation
 */

import * as Location from 'expo-location';
import { Alert } from 'react-native';

export interface LocationCoords {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
}

export class GeolocationService {
  private static watchId: string | null = null;

  /**
   * Demande les permissions de localisation
   */
  static async requestPermissions(): Promise<boolean> {
    try {
      console.log('📍 Vérification des permissions de localisation...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('📍 Statut permission:', status);
      const granted = status === 'granted';
      if (!granted) {
        console.warn('⚠️ Permission de localisation refusée ou non disponible');
      }
      return granted;
    } catch (error) {
      console.error('🔴 Erreur permissions de localisation:', error);
      return false;
    }
  }

  /**
   * Récupère la localisation actuelle
   */
  static async getCurrentLocation(): Promise<LocationCoords | null> {
    try {
      console.log('📍 Demande de localisation...');
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.warn('⚠️ Permission de localisation non accordée');
        Alert.alert(
          'Permission requise',
          "Veuillez autoriser l'accès à votre localisation"
        );
        return null;
      }

      console.log('📍 Récupération des coordonnées...');
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      console.log('✅ Localisation obtenue:', {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude ?? undefined,
        accuracy: location.coords.accuracy ?? undefined,
      };
    } catch (error) {
      console.error('🔴 Erreur obtention localisation:', error);
      return null;
    }
  }

  /**
   * Écoute les changements de localisation
   */
  static async watchLocation(
    callback: (location: LocationCoords) => void,
    errorCallback?: (error: any) => void
  ): Promise<void> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return;

      this.watchId = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 60000, // Mise à jour toutes les minutes
          distanceInterval: 1000, // Ou si distance > 1km
        },
        (location) => {
          callback({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            altitude: location.coords.altitude ?? undefined,
            accuracy: location.coords.accuracy ?? undefined,
          });
        }
      );

      if (errorCallback) {
        this.watchId = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Balanced },
          undefined,
          errorCallback
        );
      }
    } catch (error) {
      console.error('Erreur watch localisation:', error);
    }
  }

  /**
   * Arrête d'écouter les changements de localisation
   */
  static stopWatching(): void {
    if (this.watchId) {
      Location.removeWatchAsync(this.watchId);
      this.watchId = null;
    }
  }

  /**
   * Obtient le fuseaux horaire basé sur les coordonnées
   */
  static async getTimezone(coords: LocationCoords): Promise<string | null> {
    try {
      // Intégration avec une API de timezones (ex: Google)
      // Pour MVP: utiliser une approximation basée sur la longitude
      const offset = Math.round(coords.longitude / 15);
      const hours = Math.abs(offset);
      const sign = offset >= 0 ? '+' : '-';
      return `UTC${sign}${hours}`;
    } catch (error) {
      console.error('Erreur obtention timezone:', error);
      return null;
    }
  }

  /**
   * Convertit les coordonnées en nom de ville (reverse geocoding)
   */
  static async getCityName(coords: LocationCoords): Promise<string | null> {
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync(coords);
      if (reverseGeocode.length > 0) {
        const firstResult = reverseGeocode[0];
        return `${firstResult.city}, ${firstResult.country}`;
      }
      return null;
    } catch (error) {
      console.error('Erreur reverse geocoding:', error);
      return null;
    }
  }
}

export default GeolocationService;
