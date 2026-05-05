/**
 * Screen: Calendrier (Zmanim & Holidays)
 * Écran pour afficher le calendrier hébraïque, les Zmanim et les vacances juives
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useZmanim } from '@hooks/useZmanim';
import { useI18n } from '@hooks/useI18n';
import { useAppSelector } from '@hooks/useRedux';
import { COLORS } from '@constants/index';
import dayjs from 'dayjs';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C1322',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  brand: {
    color: '#DCE2F7',
    fontSize: 26,
    fontFamily: 'serif',
    fontWeight: '700',
  },
  title: {
    color: '#DCE2F7',
    fontSize: 42,
    fontFamily: 'serif',
    fontWeight: '700',
    lineHeight: 46,
  },
  monthText: {
    color: '#A7B0C4',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginTop: 4,
  },
  calendarShell: {
    marginTop: 18,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderRadius: 34,
    padding: 18,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  day: {
    color: '#8F97A8',
    fontSize: 12,
    width: 36,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dayCard: {
    width: '18%',
    minWidth: 54,
    aspectRatio: 0.78,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCardActive: {
    borderColor: '#E9C349',
    backgroundColor: 'rgba(233, 195, 73, 0.10)',
  },
  dayNum: {
    color: '#DCE2F7',
    fontSize: 16,
    fontWeight: '700',
  },
  daySub: {
    color: '#8F97A8',
    fontSize: 9,
    marginTop: 4,
    textAlign: 'center',
  },
  sectionTitle: {
    color: '#A7B0C4',
    fontSize: 12,
    letterSpacing: 2,
    marginTop: 22,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderRadius: 28,
    padding: 18,
    marginBottom: 14,
  },
  cardTitle: {
    color: '#DCE2F7',
    fontSize: 28,
    fontFamily: 'serif',
    marginBottom: 4,
  },
  cardText: {
    color: '#A7B0C4',
    fontSize: 15,
    marginBottom: 10,
    lineHeight: 22,
  },
  heroImage: {
    height: 170,
    borderRadius: 22,
    backgroundColor: 'rgba(233, 195, 73, 0.12)',
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: {
    fontSize: 74,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  metaBadge: {
    color: '#F1D77A',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  metaLabel: {
    color: '#DCE2F7',
    fontSize: 14,
    fontWeight: '700',
  },
  metaValue: {
    color: '#B9C7E4',
    fontSize: 15,
  },
  summaryCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderRadius: 28,
    padding: 18,
    marginTop: 14,
    marginBottom: 14,
  },
  summaryLabel: {
    color: '#F1D77A',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  summaryText: {
    color: '#DCE2F7',
    fontFamily: 'serif',
    fontSize: 22,
    marginTop: 6,
  },
  holidayList: {
    gap: 10,
  },
  holidayItem: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  holidayItemTitle: {
    color: '#DCE2F7',
    fontSize: 16,
    fontWeight: '700',
  },
  holidayItemSub: {
    color: '#8F97A8',
    marginTop: 4,
  },
});

export const CalendarScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { zmanim, userLocation, calendarSummary } = useZmanim();
  const holidays = useAppSelector((state) => state.zmanim.holidays);

  const formatTime = (date: Date) => dayjs(date).format('HH:mm');
  const today = dayjs();
  const start = today.startOf('month').startOf('week');
  const days = Array.from({ length: 42 }, (_, index) => start.add(index, 'day'));

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 10 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Text style={styles.brand}>Siddur</Text>
          <Text style={{ color: '#E9C349', fontSize: 22 }}>☰</Text>
        </View>

        <Text style={styles.title}>{today.format('MMMM YYYY')}</Text>
        <Text style={styles.monthText}>{calendarSummary?.hebrewDate || 'Calendrier hébreu en direct'}</Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Aujourd'hui</Text>
          <Text style={styles.summaryText}>{calendarSummary?.todayLabel || today.format('dddd')}</Text>
          <Text style={styles.cardText}>{calendarSummary?.parasha || 'Données de parasha et de fête chargées depuis Hebcal'}</Text>
        </View>

        <View style={styles.calendarShell}>
          <View style={styles.weekRow}>
            {['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'].map((item) => (
              <Text key={item} style={styles.day}>{item}</Text>
            ))}
          </View>
          <View style={styles.grid}>
            {days.map((day) => {
              const isCurrentMonth = day.month() === today.month();
              const isToday = day.isSame(today, 'day');

              return (
              <View key={day.format('YYYY-MM-DD')} style={[styles.dayCard, isToday && styles.dayCardActive, !isCurrentMonth && { opacity: 0.35 }]}>
                <Text style={styles.dayNum}>{day.date()}</Text>
                <Text style={styles.daySub}>{day.format('MMM')}</Text>
              </View>
              );
            })}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Parasha hebdomadaire</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{calendarSummary?.parasha || 'Flux du calendrier en direct'}</Text>
          <Text style={styles.cardText}>Progression d'étude et guidance hebdomadaire pour le cycle actuel.</Text>
          <View style={{ height: 3, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.08)' }}>
            <View style={{ width: '72%', height: '100%', borderRadius: 999, backgroundColor: '#E9C349' }} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Allumage des bougies</Text>
          <Text style={styles.cardText}>Ce soir à {zmanim ? formatTime(zmanim.sunset) : '—'}</Text>
          <View style={styles.heroImage}><Text style={styles.heroEmoji}>🕯</Text></View>
          <View style={styles.metaRow}>
            <Text style={styles.metaBadge}>Fête</Text>
            <Text style={styles.metaValue}>{t('calendar.updatedAt', calendarSummary?.hebrewDate || 'Aujourd\'hui')}</Text>
          </View>
          <Text style={styles.cardTitle}>{holidays[0]?.name || 'Données de fête en direct'}</Text>
          <Text style={styles.cardText}>
            {holidays[0]?.nameHe || 'Les détails de la fête sont chargés en temps réel depuis Hebcal.'}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Prière du matin</Text>
            <Text style={styles.metaValue}>Shacharit & Hallel</Text>
          </View>
        </View>

        {userLocation && (
          <View style={styles.card}>
            <Text style={styles.metaBadge}>Localisation</Text>
            <Text style={styles.cardTitle}>{userLocation.city || 'Localisation actuelle'}</Text>
            <Text style={styles.cardText}>Atmosphère actuelle: données en direct</Text>
            <Text style={styles.metaValue}>
              {zmanim ? `${formatTime(zmanim.alot)} · ${formatTime(zmanim.sunset)}` : '05:12 · 17:34'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default CalendarScreen;
