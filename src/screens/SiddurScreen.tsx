/**
 * SiddurScreen - Écran Siddur / תפילות (Prières)
 * Affiche les prières de l'heure d'abord, puis les autres catégories
 * Design cohérent avec le reste de l'app
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PRAYER_CATEGORIES, PRAYER_TIME_CATEGORIES, PrayerCategory } from '@services/sefaria.service';
import { usePrayerTime } from '@hooks/usePrayerTime';
import PrayerReaderScreen from '@screens/PrayerReaderScreen';
import dayjs from 'dayjs';

// ─── Composant ligne de prière ────────────────────────────────────────────────
interface PrayerRowProps {
  category: PrayerCategory;
  onPress: () => void;
  isCurrent?: boolean;
}

const PrayerRow: React.FC<PrayerRowProps> = ({ category, onPress, isCurrent = false }) => (
  <TouchableOpacity 
    style={[styles.row, isCurrent && styles.rowCurrent]} 
    onPress={onPress} 
    activeOpacity={0.6}
  >
    {/* Flèche gauche (chevron RTL) */}
    <Text style={[styles.chevron, isCurrent && styles.chevronCurrent]}>‹</Text>

    {/* Texte aligné à droite */}
    <View style={styles.rowTextWrap}>
      <Text style={[styles.rowHe, isCurrent && styles.rowHeCurrent]}>
        {category.emoji ? `${category.titleHe} ${category.emoji}` : category.titleHe}
      </Text>
      <Text style={[styles.rowFr, isCurrent && styles.rowFrCurrent]}>{category.titleFr}</Text>
    </View>
  </TouchableOpacity>
);

const formatTimeRemaining = (endTime: Date): string => {
  const now = dayjs();
  const end = dayjs(endTime);
  const diffMinutes = Math.max(0, end.diff(now, 'minute'));

  if (diffMinutes >= 60) {
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }

  return `${diffMinutes} min`;
};

// ─── Composant barre de progression ────────────────────────────────────────────
interface CurrentPrayerIndicatorProps {
  name: string;
  nameHe: string;
  progress: number;
  endTime: Date;
}

const CurrentPrayerIndicator: React.FC<CurrentPrayerIndicatorProps> = ({
  name,
  nameHe,
  progress,
  endTime,
}) => {
  const timeRemaining = formatTimeRemaining(endTime);
  
  return (
    <View style={styles.currentPrayerBox}>
      <View style={styles.currentPrayerHeader}>
        <View>
          <Text style={styles.currentPrayerLabel}>Prière en cours</Text>
          <Text style={styles.currentPrayerTitle}>{nameHe}</Text>
          <Text style={styles.currentPrayerSubtitle}>{name}</Text>
        </View>
        <Text style={styles.currentPrayerEmoji}>⏱️</Text>
      </View>
      <Text style={styles.currentPrayerTime}>Fin dans {timeRemaining}</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
};

// ─── Composant principal ──────────────────────────────────────────────────────
const SiddurScreen = () => {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<PrayerCategory | null>(null);
  const { current: currentPrayer } = usePrayerTime();

  // Si une catégorie est sélectionnée → afficher le lecteur
  if (selectedCategory) {
    return (
      <PrayerReaderScreen
        category={selectedCategory}
        onBack={() => setSelectedCategory(null)}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#0C1322" />
      <View style={styles.backdropTop} />
      <View style={styles.backdropBottom} />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.brand}>SIDDUR</Text>
          <Text style={styles.headerIcon}>☰</Text>
        </View>

        <Text style={styles.titleHe}>תפילות</Text>
        <Text style={styles.titleFr}>PRIERES</Text>

        {currentPrayer && (
          <CurrentPrayerIndicator
            name={currentPrayer.name}
            nameHe={currentPrayer.nameHe}
            progress={currentPrayer.progress}
            endTime={currentPrayer.endTime}
          />
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prières de l'heure</Text>
          <View style={styles.sectionList}>
            {PRAYER_TIME_CATEGORIES.map((cat) => {
              const isCurrent = currentPrayer?.nameHe === cat.titleHe;
              return (
                <PrayerRow
                  key={cat.id}
                  category={cat}
                  onPress={() => setSelectedCategory(cat)}
                  isCurrent={isCurrent}
                />
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Autres prières</Text>
          <View style={styles.sectionList}>
            {PRAYER_CATEGORIES.map((cat) => (
              <PrayerRow
                key={cat.id}
                category={cat}
                onPress={() => setSelectedCategory(cat)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
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
  content: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
  },
  brand: {
    color: '#F1D77A',
    fontSize: 26,
    letterSpacing: 1.6,
    fontWeight: '800',
    fontFamily: 'serif',
  },
  headerIcon: {
    color: '#E9C349',
    fontSize: 22,
  },
  titleHe: {
    color: '#DCE2F7',
    fontSize: 42,
    fontFamily: 'serif',
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  titleFr: {
    color: '#A7B0C4',
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 6,
    textAlign: 'right',
  },

  // Boîte prière en cours
  currentPrayerBox: {
    marginTop: 20,
    padding: 18,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  currentPrayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentPrayerLabel: {
    fontSize: 11,
    color: '#F1D77A',
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  currentPrayerTitle: {
    fontSize: 28,
    fontFamily: 'serif',
    color: '#DCE2F7',
    fontWeight: '700',
    marginTop: 6,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  currentPrayerSubtitle: {
    color: '#A7B0C4',
    marginTop: 4,
  },
  currentPrayerEmoji: {
    fontSize: 28,
  },
  currentPrayerTime: {
    fontSize: 12,
    color: '#A7B0C4',
    marginTop: 10,
  },
  progressTrack: {
    marginTop: 10,
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E9C349',
  },

  // Titre de section
  section: {
    marginTop: 22,
  },
  sectionTitle: {
    color: '#A7B0C4',
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  sectionList: {
    gap: 12,
  },

  // Ligne de prière
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  rowCurrent: {
    borderColor: '#E9C349',
    backgroundColor: 'rgba(233, 195, 73, 0.10)',
  },
  chevron: {
    fontSize: 24,
    color: '#F1D77A',
  },
  chevronCurrent: {
    color: '#E9C349',
  },
  rowTextWrap: {
    flex: 1,
    alignItems: 'flex-end',
  },
  rowHe: {
    fontSize: 22,
    fontFamily: 'serif',
    color: '#DCE2F7',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  rowHeCurrent: {
    color: '#FFFFFF',
  },
  rowFr: {
    fontSize: 12,
    color: '#A7B0C4',
    textAlign: 'right',
    marginTop: 3,
    letterSpacing: 0.4,
  },
  rowFrCurrent: {
    color: '#DCE2F7',
  },
});

export default SiddurScreen;
