/**
 * PrayerReaderScreen - Écran de lecture d'une prière
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
<<<<<<< HEAD
import { PrayerCategory } from '@services/prayerCategories.service';
import { useTheme } from '@hooks/useTheme';
import { AppTheme } from '@constants/theme';
import SiddurService from '@services/siddur.service';
import { Prayer } from '../types';
=======
import { PrayerCategory, getCachedSefariaText, SefariaText } from '@services/sefaria.service';
import { useTheme } from '@hooks/useTheme';
import { AppTheme } from '@constants/theme';
>>>>>>> 9173f91caf7a76f4ff1a09cc678c194f2a736c57

interface Props {
  category: PrayerCategory;
  onBack: () => void;
}

const PrayerReaderScreen: React.FC<Props> = ({ category, onBack }) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [fontSize, setFontSize] = useState(24);

  const styles = createStyles(theme);

  const styles = createStyles(theme);

  const loadText = useCallback(async () => {
    setLoading(true);
    try {
<<<<<<< HEAD
      // On utilise la clé JSON définie dans la catégorie ou l'ID par défaut
      const serviceKey = category.jsonKey || category.id;
      const data = await SiddurService.getCompleteSiddur(serviceKey as any, 'sephardic');
      setPrayers(data);
=======
      // Si plusieurs refs séparées par virgule, on les fusionne (ex: Tikoun Haklali)
      const refs = category.sefariaRef.split(',');
      if (refs.length > 1) {
        let combinedHe = '';
        let combinedEn = '';
        for (const ref of refs) {
          const data = await getCachedSefariaText(ref.trim());
          combinedHe += (combinedHe ? '\n\n' : '') + data.heText;
          combinedEn += (combinedEn ? '\n\n' : '') + data.enText;
        }
        setSefariaData({
          titleHe: category.titleHe,
          titleEn: category.titleFr,
          heText: combinedHe,
          enText: combinedEn,
          ref: category.sefariaRef,
        });
      } else {
        const data = await getCachedSefariaText(category.sefariaRef);
        setSefariaData(data);
      }
>>>>>>> 9173f91caf7a76f4ff1a09cc678c194f2a736c57
    } catch (err) {
      console.warn('Siddur fetch error:', err);
    } finally {
      setLoading(false);
    }
<<<<<<< HEAD
  }, [category]);
=======
  }, [category.sefariaRef, category.titleHe, category.titleFr]);
>>>>>>> 9173f91caf7a76f4ff1a09cc678c194f2a736c57

  useEffect(() => {
    loadText();
  }, [loadText]);

<<<<<<< HEAD
=======
  const hebrewText = sefariaData?.heText || category.staticHe || '';

>>>>>>> 9173f91caf7a76f4ff1a09cc678c194f2a736c57
  return (
    <View style={styles.screen}>
      <StatusBar barStyle={theme.colors.background === '#0C1322' ? 'light-content' : 'dark-content'} />
      <View style={styles.backdropTop} />
      <View style={styles.backdropBottom} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backArrow}>›</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerHe}>{category.titleHe}</Text>
          <Text style={styles.headerFr}>{category.titleFr}</Text>
        </View>
        <View style={styles.fontControls}>
          <TouchableOpacity
            style={styles.fontBtn}
            onPress={() => setFontSize((s) => Math.max(16, s - 2))}
            activeOpacity={0.7}
          >
            <Text style={styles.fontBtnText}>א-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.fontBtn}
            onPress={() => setFontSize((s) => Math.min(40, s + 2))}
            activeOpacity={0.7}
          >
            <Text style={styles.fontBtnText}>א+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Contenu */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
<<<<<<< HEAD
          <Text style={styles.loadingText}>Chargement des prières...</Text>
=======
          <Text style={styles.loadingText}>Chargement depuis Sefaria...</Text>
>>>>>>> 9173f91caf7a76f4ff1a09cc678c194f2a736c57
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 40 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {prayers.length > 0 ? (
            prayers.map((prayer, index) => (
              <View key={prayer.id} style={[styles.textCard, index > 0 && { marginTop: 20 }]}>
                <Text style={styles.prayerSectionTitle}>{prayer.titleHe}</Text>
                <View style={styles.sectionDivider} />
                <Text style={[styles.contentText, { fontSize }]} selectable>
                  {prayer.contentHe}
                </Text>
              </View>
            ))
          ) : (
<<<<<<< HEAD
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucun texte trouvé pour cette catégorie.</Text>
=======
            <Text style={styles.emptyText}>Texte non disponible</Text>
          )}

          {/* Traduction si disponible */}
          {sefariaData?.enText ? (
            <View style={styles.translationCard}>
              <Text style={styles.translationLabel}>Traduction (En)</Text>
              <Text style={styles.translationText} selectable>
                {sefariaData.enText}
              </Text>
>>>>>>> 9173f91caf7a76f4ff1a09cc678c194f2a736c57
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const createStyles = (theme: AppTheme) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backdropTop: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: theme.colors.highlight,
  },
  backdropBottom: {
    position: 'absolute',
    bottom: 80,
    left: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: theme.colors.card,
    opacity: 0.3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  backArrow: {
    fontSize: 26,
    color: theme.colors.primary,
    transform: [{ rotate: '180deg' }],
    lineHeight: 30,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerHe: {
    fontSize: 20,
    fontFamily: 'serif',
    color: theme.colors.text,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  headerFr: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  fontControls: {
    flexDirection: 'row',
    gap: 6,
  },
  fontBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  fontBtnText: {
    fontSize: 13,
    color: theme.colors.primary,
    fontFamily: 'serif',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
<<<<<<< HEAD
=======
  sourceBadge: {
    alignSelf: 'center',
    backgroundColor: theme.colors.highlight,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sourceBadgeText: {
    fontSize: 12,
    color: theme.colors.text,
    letterSpacing: 0.5,
  },
>>>>>>> 9173f91caf7a76f4ff1a09cc678c194f2a736c57
  textCard: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 24,
<<<<<<< HEAD
    padding: 20,
=======
    padding: 18,
>>>>>>> 9173f91caf7a76f4ff1a09cc678c194f2a736c57
    ...theme.shadows.sm,
  },
  prayerSectionTitle: {
    fontSize: 18,
    fontFamily: 'serif',
<<<<<<< HEAD
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '700',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    width: '40%',
    alignSelf: 'center',
    marginBottom: 15,
  },
  contentText: {
    fontFamily: 'serif',
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 44,
    letterSpacing: 0.2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
=======
    color: theme.colors.text,
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 52,
    letterSpacing: 0.5,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: 16,
    marginTop: 40,
  },
  translationCard: {
    marginTop: 18,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 24,
    padding: 18,
  },
  translationLabel: {
    fontSize: 11,
    color: theme.colors.primary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  translationText: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    lineHeight: 26,
>>>>>>> 9173f91caf7a76f4ff1a09cc678c194f2a736c57
  },
});

export default PrayerReaderScreen;

