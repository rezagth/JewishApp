/**
 * PrayerReaderScreen - Écran de lecture d'une prière
 * Affiche le texte hébreu récupéré depuis Sefaria API
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrayerCategory, getCachedSefariaText, SefariaText } from '@services/sefaria.service';

interface Props {
  category: PrayerCategory;
  onBack: () => void;
}

const PrayerReaderScreen: React.FC<Props> = ({ category, onBack }) => {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [sefariaData, setSefariaData] = useState<SefariaText | null>(null);
  const [fontSize, setFontSize] = useState(26);

  const loadText = useCallback(async () => {
    if (!category.sefariaRef) return;
    setLoading(true);
    try {
      const data = await getCachedSefariaText(category.sefariaRef);
      setSefariaData(data);
    } catch (err) {
      console.warn('Sefaria fetch error:', err);
      Alert.alert('Erreur', 'Impossible de charger le texte. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  }, [category.sefariaRef]);

  useEffect(() => {
    loadText();
  }, [loadText]);

  // Texte à afficher : Sefaria ou statique
  const hebrewText = sefariaData?.heText || category.staticHe || '';

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#0C1322" />
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
          <ActivityIndicator size="large" color="#E9C349" />
          <Text style={styles.loadingText}>Chargement depuis Sefaria...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 80 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Badge source */}
          {sefariaData && (
            <View style={styles.sourceBadge}>
              <Text style={styles.sourceBadgeText}>📖 Sefaria.org</Text>
            </View>
          )}

          {/* Texte hébreu */}
          {hebrewText ? (
            <View style={styles.textCard}>
              <Text style={[styles.hebrewText, { fontSize }]} selectable>
                {hebrewText}
              </Text>
            </View>
          ) : (
            <Text style={styles.emptyText}>Texte non disponible</Text>
          )}

          {/* Titre anglais si disponible */}
          {sefariaData?.enText ? (
            <View style={styles.translationCard}>
              <Text style={styles.translationLabel}>Traduction</Text>
              <Text style={styles.translationText} selectable>
                {sefariaData.enText}
              </Text>
            </View>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0C1322',
  },
  backdropTop: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(233, 195, 73, 0.06)',
  },
  backdropBottom: {
    position: 'absolute',
    bottom: 80,
    left: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(30, 58, 95, 0.22)',
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
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  backArrow: {
    fontSize: 26,
    color: '#F1D77A',
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
    color: '#DCE2F7',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  headerFr: {
    fontSize: 11,
    color: '#A7B0C4',
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
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  fontBtnText: {
    fontSize: 13,
    color: '#F1D77A',
    fontFamily: 'serif',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#A7B0C4',
    fontSize: 14,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sourceBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  sourceBadgeText: {
    fontSize: 12,
    color: '#DCE2F7',
    letterSpacing: 0.5,
  },
  textCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: 18,
  },
  hebrewText: {
    fontFamily: 'serif',
    color: '#DCE2F7',
    textAlign: 'right',
    writingDirection: 'rtl',
    lineHeight: 52,
    letterSpacing: 0.5,
  },
  emptyText: {
    textAlign: 'center',
    color: '#A7B0C4',
    fontSize: 16,
    marginTop: 40,
  },
  translationCard: {
    marginTop: 18,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: 18,
  },
  translationLabel: {
    fontSize: 11,
    color: '#F1D77A',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  translationText: {
    fontSize: 15,
    color: '#A7B0C4',
    lineHeight: 26,
  },
});

export default PrayerReaderScreen;
