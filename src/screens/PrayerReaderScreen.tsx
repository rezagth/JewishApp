/**
 * PrayerReaderScreen - Écran de lecture d'une prière
 * Affiche le texte hébreu récupéré depuis Sefaria API
 * Supporte aussi les services complets (Shacharit, Mincha, Maariv) avec sections
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
import { PrayerCategory, getCachedSefariaText, SefariaText, PrayerTimeCategory } from '../services/sefaria.service';
import { useAppSelector } from '@hooks/useRedux';
import { useTheme } from '@hooks/useTheme';
import { AppTheme } from '@constants/theme';
import useSiddur from '@hooks/useSiddur';

interface Props {
  category: PrayerCategory | PrayerTimeCategory;
  onBack: () => void;
}

const PrayerReaderScreen: React.FC<Props> = ({ category, onBack }) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const userNusach = useAppSelector((state) => state.user.preferences.nusach);
  const [loading, setLoading] = useState(false);
  const [sefariaData, setSefariaData] = useState<SefariaText | null>(null);
  const [fontSize, setFontSize] = useState(26);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const styles = createStyles(theme);

  // Déterminer si c'est un service complet ou une catégorie simple
  const isService = 'timeOfDay' in category;
  const serviceType = isService ? (category as PrayerTimeCategory).timeOfDay : null;
  
  // Utiliser le hook useSiddur si c'est un service
  const { loadedSections, isLoading: siddurLoading, error: siddurError } = useSiddur(serviceType as any);

  const loadText = useCallback(async () => {
    if (isService) return;

    const selectedRef = userNusach === 'sephardic' && category.sephardicSefariaRef
      ? category.sephardicSefariaRef
      : category.sefariaRef;

    if (!selectedRef) {
      if (category.staticHe) {
        setSefariaData({
          titleHe: category.titleHe,
          titleEn: category.titleFr,
          heText: category.staticHe,
          enText: '',
          ref: category.id,
        });
      }
      return;
    }

    setLoading(true);
    try {
      // Si plusieurs refs séparées par virgule, on les fusionne (ex: Tikoun Haklali)
      const refs = selectedRef.split(',');
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
          ref: selectedRef,
        });
      } else {
        const data = await getCachedSefariaText(selectedRef);
        setSefariaData(data);
      }
    } catch (err) {
      if (category.staticHe) {
        setSefariaData({
          titleHe: category.titleHe,
          titleEn: category.titleFr,
          heText: category.staticHe,
          enText: '',
          ref: category.id,
        });
      } else {
        console.warn('Sefaria fetch error:', err);
        Alert.alert('Erreur', 'Impossible de charger le texte. Vérifiez votre connexion.');
      }
    } finally {
      setLoading(false);
    }
  }, [category.id, category.sefariaRef, category.sephardicSefariaRef, category.staticHe, category.titleHe, category.titleFr, isService, userNusach]);

  useEffect(() => {
    if (!isService) {
      loadText();
    }
  }, [loadText, isService]);

  const hebrewText = sefariaData?.heText || '';

  // Afficher la liste des sections si c'est un service et qu'une section est sélectionnée
  if (isService && selectedSection) {
    if (selectedSection === '__all__') {
      const combinedHe = loadedSections
        .map((s) => s.content?.heText || '')
        .filter(Boolean)
        .join('\n\n');

      const combinedEn = loadedSections
        .map((s) => s.content?.enText || '')
        .filter(Boolean)
        .join('\n\n');

      const allSources = Array.from(
        new Map(
          loadedSections
            .flatMap((s) => s.sources || [])
            .map((src) => [src.url, src])
        ).values()
      );

      return (
        <View style={styles.screen}>
          <StatusBar barStyle={theme.colors.background === '#0C1322' ? 'light-content' : 'dark-content'} />
          <View style={styles.backdropTop} />
          <View style={styles.backdropBottom} />

          <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedSection(null)} activeOpacity={0.7}>
              <Text style={styles.backArrow}>›</Text>
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerHe}>{category.titleHe}</Text>
              <Text style={styles.headerFr}>Service complet</Text>
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

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + 40 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.sourceBadge}>
              <Text style={styles.sourceBadgeText}>
                {allSources.length ? allSources.map((s) => s.label).join(' · ') : '📖 Service complet'}
              </Text>
            </View>

            <View style={styles.textCard}>
              <Text style={[styles.hebrewText, { fontSize }]} selectable>
                {combinedHe}
              </Text>
            </View>

            {combinedEn ? (
              <View style={styles.translationCard}>
                <Text style={styles.translationLabel}>Traduction (En)</Text>
                <Text style={styles.translationText} selectable>
                  {combinedEn}
                </Text>
              </View>
            ) : null}
          </ScrollView>
        </View>
      );
    }
    const section = loadedSections.find((s) => s.id === selectedSection);
    if (section && section.content) {
      const sectionContent = section.content;
      return (
        <View style={styles.screen}>
          <StatusBar barStyle={theme.colors.background === '#0C1322' ? 'light-content' : 'dark-content'} />
          <View style={styles.backdropTop} />
          <View style={styles.backdropBottom} />

          <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedSection(null)} activeOpacity={0.7}>
              <Text style={styles.backArrow}>›</Text>
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerHe}>{section.titleHe}</Text>
              <Text style={styles.headerFr}>{section.title}</Text>
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

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + 40 },
            ]}
            showsVerticalScrollIndicator={false}
          >
              <View style={styles.sourceBadge}>
                <Text style={styles.sourceBadgeText}>
                  {section.sources?.some((s) => s.label.toLowerCase().includes('open siddur'))
                    ? '📖 Open Siddur (complet)'
                    : '📖 Section complète'}
                </Text>
              </View>

            <View style={styles.textCard}>
              <Text style={[styles.hebrewText, { fontSize }]} selectable>
                {sectionContent.heText}
              </Text>
            </View>

            {sectionContent.enText ? (
              <View style={styles.translationCard}>
                <Text style={styles.translationLabel}>Traduction (En)</Text>
                <Text style={styles.translationText} selectable>
                  {sectionContent.enText}
                </Text>
              </View>
            ) : null}
          </ScrollView>
        </View>
      );
    }
  }

  // Afficher la liste des sections si c'est un service
  if (isService) {
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
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.divider} />

        {siddurLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Chargement des sections...</Text>
          </View>
        ) : siddurError ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Erreur: {siddurError}</Text>
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
            <View style={styles.sectionsList}>
              <TouchableOpacity
                style={[styles.sectionItem, { marginBottom: 8 }]}
                onPress={() => setSelectedSection('__all__')}
                activeOpacity={0.8}
              >
                <View>
                  <Text style={styles.sectionItemHe}>Afficher tout le service</Text>
                  <Text style={styles.sectionItemFr}>Voir l'intégralité des sections concaténées</Text>
                </View>
                <Text style={styles.sectionItemArrow}>›</Text>
              </TouchableOpacity>
              {loadedSections.map((section) => (
                <TouchableOpacity
                  key={section.id}
                  style={styles.sectionItem}
                  onPress={() => setSelectedSection(section.id)}
                  activeOpacity={0.7}
                >
                  <View>
                    <Text style={styles.sectionItemHe}>{section.titleHe}</Text>
                    <Text style={styles.sectionItemFr}>{section.title}</Text>
                    {section.sources?.length ? (
                      <Text style={styles.sectionItemSource} numberOfLines={1}>
                        {section.sources.map((source: { label: string }) => source.label).join(' · ')}
                      </Text>
                    ) : null}
                  </View>
                  <Text style={styles.sectionItemArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    );
  }

  // Afficher la catégorie simple
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
          <Text style={styles.loadingText}>Chargement depuis Sefaria...</Text>
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
          {/* Badge source */}
          {sefariaData && (
            <View style={styles.sourceBadge}>
              <Text style={styles.sourceBadgeText}>📖 Sefaria · Open Siddur</Text>
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

          {/* Traduction si disponible */}
          {sefariaData?.enText ? (
            <View style={styles.translationCard}>
              <Text style={styles.translationLabel}>Traduction (En)</Text>
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
  textCard: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 24,
    padding: 18,
    ...theme.shadows.sm,
  },
  hebrewText: {
    fontFamily: 'serif',
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
  },
  sectionsList: {
    gap: 12,
  },
  sectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    ...theme.shadows.sm,
  },
  sectionItemHe: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  sectionItemFr: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 3,
  },
  sectionItemSource: {
    marginTop: 6,
    fontSize: 11,
    color: theme.colors.primary,
    letterSpacing: 0.4,
  },
  sectionItemArrow: {
    fontSize: 20,
    color: theme.colors.primary,
  },
});

export default PrayerReaderScreen;

