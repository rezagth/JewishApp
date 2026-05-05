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
import { useAppSelector } from '@hooks/useRedux';
import { COLORS } from '@constants/index';

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
    color: '#F1D77A',
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
    borderColor: 'rgba(255,255,255,0.22)',
  },
  hero: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderRadius: 28,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  heroLabel: {
    color: COLORS.secondary,
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
    color: '#DCE2F7',
    fontFamily: 'serif',
    fontWeight: '700',
  },
  heroTime: {
    fontSize: 22,
    color: '#B9C7E4',
    textAlign: 'right',
    fontWeight: '700',
  },
  heroMeta: {
    color: '#8F97A8',
    textAlign: 'right',
    marginTop: 4,
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
    color: '#B9C7E4',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  progressBar: {
    height: 2,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
  },
  progressFill: {
    width: '62%',
    height: '100%',
    backgroundColor: 'linear-gradient',
  },
  primaryButton: {
    marginTop: 18,
    borderRadius: 20,
    backgroundColor: '#E9C349',
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#0C1322',
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
    color: '#DCE2F7',
    fontSize: 16,
    fontFamily: 'serif',
    fontWeight: '600',
  },
  sectionAction: {
    color: COLORS.secondary,
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
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 16,
  },
  prayerIcon: {
    fontSize: 22,
    color: COLORS.secondary,
    marginBottom: 18,
  },
  prayerTitle: {
    color: '#DCE2F7',
    fontFamily: 'serif',
    fontSize: 20,
    marginBottom: 3,
  },
  prayerSubtitle: {
    color: COLORS.secondary,
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  prayerMiniBar: {
    marginTop: 16,
    height: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  prayerMiniFill: {
    width: '38%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: COLORS.secondary,
  },
  blessingList: {
    gap: 10,
  },
  blessingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  blessingIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    color: '#8F97A8',
    fontSize: 18,
  },
  blessingTitle: {
    color: '#DCE2F7',
    fontSize: 15,
    fontWeight: '600',
  },
  blessingSubtitle: {
    color: '#8F97A8',
    marginTop: 2,
  },
  highlightCard: {
    marginTop: 20,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  highlightText: {
    flex: 1,
    paddingRight: 12,
  },
  highlightTitle: {
    color: '#DCE2F7',
    fontFamily: 'serif',
    fontSize: 17,
    marginBottom: 4,
  },
  highlightSubtitle: {
    color: '#8F97A8',
    fontSize: 13,
  },
  highlightThumbnail: {
    width: 74,
    height: 74,
    borderRadius: 18,
    backgroundColor: 'rgba(233, 195, 73, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailEmoji: {
    fontSize: 30,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
  },
  cardTitle: {
    color: '#DCE2F7',
    fontFamily: 'serif',
    fontSize: 18,
    marginBottom: 8,
  },
  cardText: {
    color: '#A7B0C4',
    fontSize: 14,
    lineHeight: 21,
  },
});

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const { currentService } = usePrayer();
  const { nextZman, zmanim, userLocation, calendarSummary } = useZmanim();
  const { t } = useI18n();
  const holidays = useAppSelector((state) => state.zmanim.holidays);

  const nextPrayerLabel =
    currentService === 'shacharit'
      ? 'Shacharit'
      : currentService === 'mincha'
        ? 'Mincha'
        : 'Arvit';

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
          <View style={styles.avatar} />
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
              <View style={styles.progressFill} />
            </View>
          </View>

          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85}>
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
              <Text style={styles.prayerTitle}>Alot</Text>
              <Text style={styles.prayerSubtitle}>{zmanim ? new Date(zmanim.alot).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '05:12'}</Text>
              <View style={styles.prayerMiniBar}><View style={[styles.prayerMiniFill, { width: '58%' }]} /></View>
            </View>
            <View style={styles.prayerCard}>
              <Text style={styles.prayerIcon}>☀</Text>
              <Text style={styles.prayerTitle}>Sunrise</Text>
              <Text style={styles.prayerSubtitle}>{zmanim ? new Date(zmanim.sunrise).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '06:45'}</Text>
              <View style={styles.prayerMiniBar}><View style={[styles.prayerMiniFill, { width: '34%' }]} /></View>
            </View>
          </View>
          <View style={[styles.prayerGrid, { marginTop: 12 }]}>
            <View style={styles.prayerCard}>
              <Text style={styles.prayerIcon}>◔</Text>
              <Text style={styles.prayerTitle}>Chatzot</Text>
              <Text style={styles.prayerSubtitle}>{zmanim ? new Date(zmanim.midday).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '12:30'}</Text>
              <View style={styles.prayerMiniBar}><View style={[styles.prayerMiniFill, { width: '82%' }]} /></View>
            </View>
            <View style={styles.prayerCard}>
              <Text style={styles.prayerIcon}>☾</Text>
              <Text style={styles.prayerTitle}>Sunset</Text>
              <Text style={styles.prayerSubtitle}>{zmanim ? new Date(zmanim.sunset).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '17:34'}</Text>
              <View style={styles.prayerMiniBar}><View style={[styles.prayerMiniFill, { width: '46%' }]} /></View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Common Blessings</Text>
            <Text style={styles.sectionAction}>View all</Text>
          </View>
          <View style={styles.blessingList}>
            <View style={styles.blessingCard}>
              <Text style={styles.blessingIcon}>🍽</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.blessingTitle}>Birkat HaMazon</Text>
                <Text style={styles.blessingSubtitle}>Grace after meals</Text>
              </View>
              <Text style={{ color: '#6E7A92', fontSize: 20 }}>♡</Text>
            </View>
            <View style={styles.blessingCard}>
              <Text style={styles.blessingIcon}>☾</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.blessingTitle}>Kriat Shema Al HaMitah</Text>
                <Text style={styles.blessingSubtitle}>Bedtime Shema</Text>
              </View>
              <Text style={{ color: '#6E7A92', fontSize: 20 }}>♡</Text>
            </View>
            <View style={styles.blessingCard}>
              <Text style={styles.blessingIcon}>✈</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.blessingTitle}>Tefilat HaDerech</Text>
                <Text style={styles.blessingSubtitle}>Traveler’s Prayer</Text>
              </View>
              <Text style={{ color: '#6E7A92', fontSize: 20 }}>♡</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Special Occasions</Text>
            <Text style={styles.sectionAction}>{mainHoliday ? 'Today' : 'Upcoming'}</Text>
          </View>
          <View style={styles.highlightCard}>
            <View style={styles.highlightText}>
              <Text style={styles.highlightTitle}>{mainHoliday ? mainHoliday.name : 'Shabbat'}</Text>
              <Text style={styles.highlightSubtitle}>{mainHoliday ? mainHoliday.nameHe : 'Kiddush & candles'}</Text>
            </View>
            <Text style={{ color: COLORS.secondary, fontSize: 42 }}>🕯</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Live note</Text>
            <Text style={styles.sectionAction}>Real data</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Today’s candle lighting</Text>
            <Text style={styles.cardText}>{candleTime}</Text>
            <Text style={styles.cardText}>
              Data is loaded from Hebcal and Sefaria at runtime, then cached locally.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;