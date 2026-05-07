import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import { 
  getPrayerCategories, 
  getPrayerTimeCategories, 
  PrayerCategory 
} from '@services/prayerCategories.service';
import { usePrayerTime } from '@hooks/usePrayerTime';
import PrayerReaderScreen from '@screens/PrayerReaderScreen';
import { useTheme } from '@hooks/useTheme';
import { AppTheme } from '@constants/theme';
import { RootState } from '@store/index';
import dayjs from 'dayjs';

// ─── Composant ligne de prière ────────────────────────────────────────────────
interface PrayerRowProps {
  category: PrayerCategory;
  onPress: () => void;
  isCurrent?: boolean;
  theme: AppTheme;
  showChevron?: boolean;
}

const PrayerRow: React.FC<PrayerRowProps> = ({ category, onPress, isCurrent = false, theme, showChevron = true }) => {
  const styles = createStyles(theme);
  
  return (
    <TouchableOpacity 
      style={[styles.row, isCurrent && styles.rowCurrent]} 
      onPress={onPress} 
      activeOpacity={0.6}
    >
      {showChevron && <Text style={[styles.chevron, isCurrent && styles.chevronCurrent]}>‹</Text>}
      <View style={styles.rowTextWrap}>
        <Text style={[styles.rowHe, isCurrent && styles.rowHeCurrent]}>
          {category.titleHe}
        </Text>
        <Text style={[styles.rowFr, isCurrent && styles.rowFrCurrent]}>{category.titleFr}</Text>
      </View>
    </TouchableOpacity>
  );
};

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
  theme: AppTheme;
}

const CurrentPrayerIndicator: React.FC<CurrentPrayerIndicatorProps> = ({
  name,
  nameHe,
  progress,
  endTime,
  theme,
}) => {
  const styles = createStyles(theme);
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
        <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: theme.colors.secondary }]} />
      </View>
    </View>
  );
};

type SiddurRouteProp = RouteProp<{ Siddur: { category?: PrayerCategory } }, 'Siddur'>;

// ─── Composant principal ──────────────────────────────────────────────────────
const SiddurScreen = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const route = useRoute<SiddurRouteProp>();
  const nusach = useSelector((state: RootState) => state.user.preferences.nusach);
  
  const [selectedCategory, setSelectedCategory] = useState<PrayerCategory | null>(route.params?.category || null);
  const [parentCategory, setParentCategory] = useState<PrayerCategory | null>(null);
  const { current: currentPrayer } = usePrayerTime();

  React.useEffect(() => {
    if (route.params?.category) {
      handleCategoryPress(route.params.category);
    }
  }, [route.params?.category]);

  const styles = createStyles(theme);

  const prayerCategories = useMemo(() => getPrayerCategories(nusach), [nusach]);
  const prayerTimeCategories = useMemo(() => getPrayerTimeCategories(nusach), [nusach]);

  const handleCategoryPress = (cat: PrayerCategory) => {
    if (cat.subCategories && cat.subCategories.length > 0) {
      setParentCategory(cat);
      setSelectedCategory(null);
    } else {
      setSelectedCategory(cat);
    }
  };

  const handleBack = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    } else if (parentCategory) {
      setParentCategory(null);
    }
  };

  if (selectedCategory) {
    return (
      <PrayerReaderScreen
        category={selectedCategory}
        onBack={handleBack}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle={theme.colors.background === '#0C1322' ? 'light-content' : 'dark-content'} />
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
          {parentCategory && (
            <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
               <Text style={styles.backArrow}>›</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.brand}>{parentCategory ? parentCategory.titleFr.toUpperCase() : 'SIDDUR'}</Text>
          {!parentCategory && <Text style={styles.headerIcon}>☰</Text>}
        </View>

        {!parentCategory ? (
          <>
            <Text style={styles.titleHe}>תפילות</Text>
            <Text style={styles.titleFr}>PRIERES</Text>

            <View style={styles.nusachBadge}>
              <Text style={styles.nusachBadgeText}>
                Rite: {nusach === 'ashkenazi' ? 'Ashkénaze' : 'Séfarade'}
              </Text>
            </View>

            {currentPrayer && (
              <CurrentPrayerIndicator
                name={currentPrayer.name}
                nameHe={currentPrayer.nameHe}
                progress={currentPrayer.progress}
                endTime={currentPrayer.endTime}
                theme={theme}
              />
            )}

            {/* Services Quotidiens */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Services Quotidiens</Text>
              <View style={styles.sectionList}>
                {prayerTimeCategories.map((cat) => {
                  const isCurrent = currentPrayer?.name.toLowerCase().includes(cat.id);
                  return (
                    <PrayerRow
                      key={cat.id}
                      category={cat}
                      onPress={() => handleCategoryPress(cat)}
                      isCurrent={isCurrent}
                      theme={theme}
                    />
                  );
                })}
              </View>
            </View>

            {/* Prières diverses */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Prières diverses</Text>
              <View style={styles.sectionList}>
                {prayerCategories.map((cat) => (
                  <PrayerRow
                    key={cat.id}
                    category={cat}
                    onPress={() => handleCategoryPress(cat)}
                    theme={theme}
                  />
                ))}
              </View>
            </View>
          </>
        ) : (
          <View style={styles.subCatSection}>
             <Text style={styles.titleHe}>{parentCategory.titleHe}</Text>
             <View style={[styles.sectionList, {marginTop: 20}]}>
                {parentCategory.subCategories?.map((sub) => (
                  <PrayerRow
                    key={sub.id}
                    category={sub}
                    onPress={() => handleCategoryPress(sub)}
                    theme={theme}
                    showChevron={false}
                  />
                ))}
             </View>
          </View>
        )}
      </ScrollView>
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
  content: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    height: 60,
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
  brand: {
    color: theme.colors.primary,
    fontSize: 22,
    letterSpacing: 1.6,
    fontWeight: '800',
    fontFamily: 'serif',
    flex: 1,
    textAlign: 'center',
  },
  headerIcon: {
    color: theme.colors.secondary,
    fontSize: 22,
  },
  titleHe: {
    color: theme.colors.text,
    fontSize: 42,
    fontFamily: 'serif',
    fontWeight: '700',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  titleFr: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 6,
    textAlign: 'right',
  },
  currentPrayerBox: {
    marginTop: 20,
    padding: 18,
    backgroundColor: theme.colors.card,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  currentPrayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentPrayerLabel: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  currentPrayerTitle: {
    fontSize: 28,
    fontFamily: 'serif',
    color: theme.colors.text,
    fontWeight: '700',
    marginTop: 6,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  currentPrayerSubtitle: {
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  currentPrayerEmoji: {
    fontSize: 28,
  },
  currentPrayerTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 10,
  },
  progressTrack: {
    marginTop: 10,
    height: 4,
    borderRadius: 999,
    backgroundColor: theme.colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  section: {
    marginTop: 22,
  },
  sectionTitle: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  sectionList: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: theme.colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  rowCurrent: {
    borderColor: theme.colors.secondary,
    backgroundColor: theme.colors.highlight,
  },
  chevron: {
    fontSize: 24,
    color: theme.colors.primary,
  },
  chevronCurrent: {
    color: theme.colors.secondary,
  },
  rowTextWrap: {
    flex: 1,
    alignItems: 'flex-end',
  },
  rowHe: {
    fontSize: 22,
    fontFamily: 'serif',
    color: theme.colors.text,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  rowHeCurrent: {
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  rowFr: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'right',
    marginTop: 3,
    letterSpacing: 0.4,
  },
  rowFrCurrent: {
    color: theme.colors.text,
  },
  nusachBadge: {
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: theme.colors.highlight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  nusachBadgeText: {
    fontSize: 10,
    color: theme.colors.secondary,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  subCatSection: {
    marginTop: 10,
  }
});

export default SiddurScreen;
