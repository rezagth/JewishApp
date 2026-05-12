import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePrayer } from '@hooks/usePrayer';
import { useZmanim } from '@hooks/useZmanim';
import { useI18n } from '@hooks/useI18n';
import { useAppSelector, useAppDispatch } from '@hooks/useRedux';
import { useTheme } from '@hooks/useTheme';
import { useNavigation } from '@react-navigation/native';
import { PRAYER_TIME_CATEGORIES } from '@services/sefaria.service';
import { setDarkMode } from '@store/slices/userSlice';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const { currentService } = usePrayer();
  const { nextZman, zmanim, userLocation, calendarSummary } = useZmanim();
  const { t } = useI18n();
  const holidays = useAppSelector((state) => state.zmanim.holidays);
  const preferences = useAppSelector((state) => state.user.preferences);
  const nusach = preferences.nusach;

  const styles = createStyles(theme);

  const handleStartPrayer = () => {
    const currentCat = PRAYER_TIME_CATEGORIES.find((c) => c.timeOfDay === currentService);
    if (currentCat) {
      navigation.navigate('Siddur', { category: currentCat });
    } else {
      navigation.navigate('Siddur');
    }
  };

  const nextPrayerLabel =
    currentService === 'shacharit'
      ? "Cha'harith"
      : currentService === 'mincha'
        ? "Min'hah"
        : 'Arvith';

  const nextPrayerTime = nextZman
    ? new Date(nextZman.time).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

  const hebrewDate =
    calendarSummary?.hebrewDate ||
    new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  const mainHoliday = holidays[0];
  const candleTime = zmanim
    ? new Date(zmanim.sunset).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

  return (
    <View style={styles.screen}>
      <View style={styles.backdropTop} />
      <View style={styles.backdropBottom} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 8 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('app.title', 'Siddur')}</Text>
          <TouchableOpacity 
            style={styles.avatar} 
            activeOpacity={0.7}
            onPress={() => dispatch(setDarkMode(!preferences.isDarkMode))}
          >
            <Ionicons 
              name={preferences.isDarkMode ? "sunny" : "moon"} 
              size={20} 
              color={theme.colors.primary} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.hero}>
          <Text style={styles.heroLabel}>Prière suivante</Text>
          <View style={styles.heroRow}>
            <View>
              <Text style={styles.heroService}>{nextPrayerLabel}</Text>
            </View>
            <View>
              <Text style={styles.heroTime}>{nextPrayerTime}</Text>
              <Text style={styles.heroMeta}>{nextZman ? 'Dans 22 min' : 'Prêt maintenant'}</Text>
            </View>
          </View>

          <View style={styles.progressWrap}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabel}>Ashrei</Text>
              <Text style={styles.progressLabel}>Tachnun</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { backgroundColor: theme.colors.primary }]} />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.primaryButton} 
            activeOpacity={0.85}
            onPress={handleStartPrayer}
          >
            <Text style={styles.primaryButtonText}>Commencer</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Date hébraïque</Text>
            <Text style={styles.sectionAction}>{calendarSummary?.todayLabel || 'Actuel'}</Text>
          </View>
          <View style={styles.highlightCard}>
            <View style={styles.highlightText}>
              <Text style={styles.highlightTitle}>{hebrewDate}</Text>
              <Text style={styles.highlightSubtitle}>{calendarSummary?.parasha || 'Données du calendrier'}</Text>
            </View>
            <View style={styles.highlightThumbnail}>
              <Text style={styles.thumbnailEmoji}>🕍</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Zmanim du jour</Text>
            <Text style={styles.sectionAction}>{userLocation?.city || 'Localisation actuelle'}</Text>
          </View>
          <View style={styles.prayerGrid}>
            <View style={styles.prayerCard}>
              <Text style={styles.prayerIcon}>☀</Text>
              <Text style={styles.prayerTitle}>Aube</Text>
              <Text style={styles.prayerSubtitle}>{zmanim ? new Date(zmanim.alot).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '05:12'}</Text>
              <View style={styles.prayerMiniBar}><View style={[styles.prayerMiniFill, { width: '58%' }]} /></View>
            </View>
            <View style={styles.prayerCard}>
              <Text style={styles.prayerIcon}>☀</Text>
              <Text style={styles.prayerTitle}>Lever</Text>
              <Text style={styles.prayerSubtitle}>{zmanim ? new Date(zmanim.sunrise).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '06:45'}</Text>
              <View style={styles.prayerMiniBar}><View style={[styles.prayerMiniFill, { width: '34%' }]} /></View>
            </View>
          </View>
          <View style={[styles.prayerGrid, { marginTop: 12 }]}>
            <View style={styles.prayerCard}>
              <Text style={styles.prayerIcon}>◔</Text>
              <Text style={styles.prayerTitle}>Midi</Text>
              <Text style={styles.prayerSubtitle}>{zmanim ? new Date(zmanim.midday).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '12:30'}</Text>
              <View style={styles.prayerMiniBar}><View style={[styles.prayerMiniFill, { width: '82%' }]} /></View>
            </View>
            <View style={styles.prayerCard}>
              <Text style={styles.prayerIcon}>☾</Text>
              <Text style={styles.prayerTitle}>Coucher</Text>
              <Text style={styles.prayerSubtitle}>{zmanim ? new Date(zmanim.sunset).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '17:34'}</Text>
              <View style={styles.prayerMiniBar}><View style={[styles.prayerMiniFill, { width: '46%' }]} /></View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Bénédictions courantes</Text>
            <Text style={styles.sectionAction}>Voir tout</Text>
          </View>
          <View style={styles.blessingList}>
            {[
              { id: 1, icon: '🍽', title: 'Birkat HaMazon', sub: 'Action de grâce après repas' },
              { id: 2, icon: '☾', title: 'Kriat Shema Al HaMitah', sub: 'Chema au coucher' },
              { id: 3, icon: '✈', title: 'Tefilat HaDerech', sub: 'Prière du voyageur' },
            ].map((item) => (
              <View key={item.id} style={styles.blessingCard}>
                <Text style={styles.blessingIcon}>{item.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.blessingTitle}>{item.title}</Text>
                  <Text style={styles.blessingSubtitle}>{item.sub}</Text>
                </View>
                <Text style={{ color: theme.colors.textSecondary, fontSize: 20 }}>♡</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Occasions spéciales</Text>
            <Text style={styles.sectionAction}>{mainHoliday ? "Aujourd'hui" : 'À venir'}</Text>
          </View>
          <View style={styles.highlightCard}>
            <View style={styles.highlightText}>
              <Text style={styles.highlightTitle}>{mainHoliday ? mainHoliday.name : 'Chabbat'}</Text>
              <Text style={styles.highlightSubtitle}>{mainHoliday ? mainHoliday.nameHe : 'Kiddouch & bougies'}</Text>
            </View>
            <Text style={{ color: theme.colors.secondary, fontSize: 42 }}>🕯</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
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
    opacity: 0.5,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 14,
    paddingBottom: 18,
  },
  headerTitle: {
    color: theme.colors.primary,
    fontSize: 22,
    letterSpacing: 1.2,
    fontWeight: '700',
    fontFamily: 'serif',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 28,
    padding: 22,
    ...theme.shadows.md,
  },
  heroLabel: {
    color: theme.colors.secondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroService: {
    fontSize: 30,
    color: theme.colors.text,
    fontFamily: 'serif',
    fontWeight: '700',
  },
  heroTime: {
    fontSize: 22,
    color: theme.colors.textSecondary,
    textAlign: 'right',
    fontWeight: '700',
  },
  heroMeta: {
    color: theme.colors.textSecondary,
    textAlign: 'right',
    marginTop: 4,
    fontSize: 12,
  },
  progressWrap: {
    marginTop: 18,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  progressBar: {
    height: 2,
    borderRadius: 999,
    backgroundColor: theme.colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    width: '62%',
    height: '100%',
  },
  primaryButton: {
    marginTop: 18,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  primaryButtonText: {
    color: theme.colors.background,
    fontSize: 15,
    fontWeight: '800',
  },
  section: {
    marginTop: 22,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontFamily: 'serif',
    fontWeight: '600',
  },
  sectionAction: {
    color: theme.colors.secondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  prayerGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  prayerCard: {
    flex: 1,
    minHeight: 132,
    borderRadius: 26,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
  },
  prayerIcon: {
    fontSize: 22,
    color: theme.colors.secondary,
    marginBottom: 18,
  },
  prayerTitle: {
    color: theme.colors.text,
    fontFamily: 'serif',
    fontSize: 20,
    marginBottom: 3,
  },
  prayerSubtitle: {
    color: theme.colors.secondary,
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  prayerMiniBar: {
    marginTop: 16,
    height: 3,
    borderRadius: 999,
    backgroundColor: theme.colors.border,
  },
  prayerMiniFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: theme.colors.secondary,
  },
  blessingList: {
    gap: 10,
  },
  blessingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  blessingIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    color: theme.colors.textSecondary,
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 38,
  },
  blessingTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  blessingSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  highlightCard: {
    marginTop: 4,
    borderRadius: 28,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...theme.shadows.sm,
  },
  highlightText: {
    flex: 1,
    paddingRight: 12,
  },
  highlightTitle: {
    color: theme.colors.text,
    fontFamily: 'serif',
    fontSize: 17,
    marginBottom: 4,
  },
  highlightSubtitle: {
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  highlightThumbnail: {
    width: 74,
    height: 74,
    borderRadius: 18,
    backgroundColor: theme.colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailEmoji: {
    fontSize: 30,
  },
});

export default HomeScreen;