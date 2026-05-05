/**
 * Composant: PrayerDisplay
 * Affichage principal des prières avec affichage conditionnel selon l'heure locale
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
  I18nManager,
} from 'react-native';
import { usePrayer } from '@hooks/usePrayer';
import { useZmanim } from '@hooks/useZmanim';
import { useI18n } from '@hooks/useI18n';
import { useAppSelector } from '@hooks/useRedux';
import { COLORS } from '@constants/index';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  darkContainer: {
    backgroundColor: COLORS.darkBackground,
  },
  header: {
    marginBottom: 20,
  },
  serviceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  darkServiceTitle: {
    color: '#FFFFFF',
  },
  zmanimInfo: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  darkZmanimInfo: {
    backgroundColor: '#1E3A5F',
  },
  zmanimText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  darkZmanimText: {
    color: '#81D4FA',
  },
  scrollView: {
    flex: 1,
  },
  prayerSection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  darkPrayerSection: {
    borderBottomColor: '#424242',
  },
  prayerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 12,
  },
  darkPrayerTitle: {
    color: '#81D4FA',
  },
  prayerContent: {
    fontSize: 16,
    lineHeight: 28,
    color: '#212121',
    textAlign: 'justify',
  },
  darkPrayerContent: {
    color: '#E0E0E0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 16,
    textAlign: 'center',
  },
});

export interface PrayerDisplayProps {
  fontSize?: number;
}

/**
 * Composant principal d'affichage des prières
 * Affiche les prières selon le service actuel (Shacharit, Mincha, Arvit)
 * basé sur l'heure locale et la localisation de l'utilisateur
 */
export const PrayerDisplay: React.FC<PrayerDisplayProps> = ({
  fontSize = 1,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { t, isRTL } = useI18n();
  const { currentService, currentPrayers, isLoading } = usePrayer();
  const { zmanim, nextZman } = useZmanim();
  const fontSizeMultiplier = useAppSelector(
    (state) => state.user.preferences.fontSize
  );
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mettre à jour l'heure actuelle
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Mise à jour chaque minute

    return () => clearInterval(timer);
  }, []);

  // Configurer l'orientation RTL
  React.useEffect(() => {
    I18nManager.forceRTL(isRTL);
  }, [isRTL]);

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, isDark && styles.darkContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!currentPrayers || currentPrayers.length === 0) {
    return (
      <View style={[styles.errorContainer, isDark && styles.darkContainer]}>
        <Text style={styles.errorText}>
          {t('app.noPrayersAvailable', 'Aucune prière disponible')}
        </Text>
      </View>
    );
  }

  const adjustedFontSize = 16 * fontSizeMultiplier;

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      {/* En-tête avec le service actuel et les Zmanim */}
      <View style={styles.header}>
        <Text
          style={[
            styles.serviceTitle,
            isDark && styles.darkServiceTitle,
            { fontSize: 24 * fontSizeMultiplier },
          ]}
        >
          {t(`prayer.${currentService}`, currentService)}
        </Text>

        {/* Informations Zmanim */}
        {nextZman && (
          <View style={[styles.zmanimInfo, isDark && styles.darkZmanimInfo]}>
            <Text style={[styles.zmanimText, isDark && styles.darkZmanimText]}>
              {t('zmanim.next', 'Prochain Zman')}: {nextZman.name} à{' '}
              {new Date(nextZman.time).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        )}
      </View>

      {/* Contenu des prières */}
      <ScrollView
        style={styles.scrollView}
        contentInsetAdjustmentBehavior="automatic"
      >
        {currentPrayers.map((prayer) => (
          <View
            key={prayer.id}
            style={[styles.prayerSection, isDark && styles.darkPrayerSection]}
          >
            <Text
              style={[
                styles.prayerTitle,
                isDark && styles.darkPrayerTitle,
                { fontSize: 18 * fontSizeMultiplier },
              ]}
            >
              {isRTL ? prayer.titleHe : prayer.title}
            </Text>

            <Text
              style={[
                styles.prayerContent,
                isDark && styles.darkPrayerContent,
                { fontSize: adjustedFontSize },
              ]}
            >
              {isRTL ? prayer.contentHe : prayer.content}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default PrayerDisplay;
