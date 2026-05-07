import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useZmanim } from '@hooks/useZmanim';
import { useI18n } from '@hooks/useI18n';
import { useAppSelector } from '@hooks/useRedux';
import { useTheme } from '@hooks/useTheme';
import { AppTheme } from '@constants/theme';
import dayjs from 'dayjs';

const CalendarScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { t } = useI18n();
  const { zmanim, userLocation, calendarSummary } = useZmanim();
  const holidays = useAppSelector((state) => state.zmanim.holidays);

  const styles = createStyles(theme);

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
          <Text style={{ color: theme.colors.secondary, fontSize: 22 }}>☰</Text>
        </View>

        <Text style={styles.title}>{today.locale('fr').format('MMMM YYYY').charAt(0).toUpperCase() + today.locale('fr').format('MMMM YYYY').slice(1)}</Text>
        <Text style={styles.monthText}>{calendarSummary?.hebrewDate || 'Calendrier hébreu en direct'}</Text>



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
              const hasEvent = holidays.some(h => dayjs(h.gregorianDate).isSame(day, 'day'));

              return (
                <View key={day.format('YYYY-MM-DD')} style={[styles.dayCard, isToday && styles.dayCardActive, !isCurrentMonth && { opacity: 0.25 }]}>
                  <Text style={[styles.dayNum, isToday && { color: theme.colors.secondary }]}>{day.date()}</Text>
                  {hasEvent && <View style={styles.eventDot} />}
                </View>
              );
            })}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Parasha hebdomadaire</Text>
        <View style={styles.card}>
<<<<<<< HEAD
          <Text style={styles.cardTitle}>{calendarSummary?.parasha || 'Étude de la Torah'}</Text>
          <Text style={styles.cardText}>
            Cette section nous enseigne les fondements de la foi et de la pratique juive.
            C'est un guide précieux pour élever notre quotidien par la sagesse ancestrale.
          </Text>
          <View style={{ height: 3, borderRadius: 999, backgroundColor: theme.colors.border, marginTop: 8 }}>
=======
          <Text style={styles.cardTitle}>{calendarSummary?.parasha || 'Flux du calendrier en direct'}</Text>
          <Text style={styles.cardText}>Progression d'étude et guidance hebdomadaire pour le cycle actuel.</Text>
          <View style={{ height: 3, borderRadius: 999, backgroundColor: theme.colors.border }}>
>>>>>>> 9173f91caf7a76f4ff1a09cc678c194f2a736c57
            <View style={{ width: '72%', height: '100%', borderRadius: 999, backgroundColor: theme.colors.secondary }} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Allumage des bougies</Text>
          <Text style={styles.cardText}>
            {zmanim 
              ? `Allumage : ${formatTime(dayjs(zmanim.sunset).subtract(18, 'minutes').toDate())} · Havdalah : ${formatTime(dayjs(zmanim.tzait_stars).add(35, 'minutes').toDate())}`
              : 'Données de Chabbat'}
          </Text>
          <View style={styles.heroImage}><Text style={styles.heroEmoji}>🕯</Text></View>
          <View style={styles.metaRow}>
            <Text style={styles.metaBadge}>Chabbat</Text>
            <Text style={styles.metaValue}>{calendarSummary?.hebrewDate || 'Cette semaine'}</Text>
          </View>
          <Text style={styles.cardTitle}>{holidays.find(h => h.type === 'holiday' || h.type === 'special_shabbat')?.name || 'Chabbat Chalom'}</Text>
          <Text style={styles.cardText}>
            {holidays.find(h => h.type === 'holiday' || h.type === 'special_shabbat')?.nameHe || 'Préparez-vous pour un moment de paix et de spiritualité.'}
          </Text>
        </View>

        {userLocation && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.metaBadge}>Localisation</Text>
              <Text style={styles.pillText}>Zmanim de Chabbat</Text>
            </View>
            <Text style={styles.cardTitle}>{userLocation.city || 'Localisation actuelle'}</Text>
            <Text style={styles.cardText}>
              {zmanim 
                ? `Allumage : ${formatTime(dayjs(zmanim.sunset).subtract(18, 'minutes').toDate())}\nHavdalah : ${formatTime(dayjs(zmanim.tzait_stars).add(35, 'minutes').toDate())}`
                : 'Horaires basés sur votre position'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: AppTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    color: theme.colors.primary,
    fontSize: 26,
    fontFamily: 'serif',
    fontWeight: '700',
  },
  title: {
    color: theme.colors.text,
    fontSize: 42,
    fontFamily: 'serif',
    fontWeight: '700',
    lineHeight: 46,
  },
  monthText: {
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginTop: 4,
  },
  calendarShell: {
    marginTop: 18,
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 34,
    padding: 18,
    ...theme.shadows.sm,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  day: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    width: 36,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
<<<<<<< HEAD
    justifyContent: 'space-between',
    rowGap: 8,
  },
  dayCard: {
    width: 38,
    height: 38,
    borderRadius: 12,
=======
    gap: 10,
  },
  dayCard: {
    width: '18%',
    minWidth: 54,
    aspectRatio: 0.78,
    borderRadius: 18,
>>>>>>> 9173f91caf7a76f4ff1a09cc678c194f2a736c57
    backgroundColor: theme.colors.highlight,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCardActive: {
    borderColor: theme.colors.secondary,
    backgroundColor: theme.colors.highlight,
    borderWidth: 2,
  },
  dayNum: {
    color: theme.colors.text,
<<<<<<< HEAD
    fontSize: 14,
    fontWeight: '700',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.secondary,
    position: 'absolute',
    bottom: 4,
=======
    fontSize: 16,
    fontWeight: '700',
  },
  daySub: {
    color: theme.colors.textSecondary,
    fontSize: 9,
    marginTop: 4,
    textAlign: 'center',
>>>>>>> 9173f91caf7a76f4ff1a09cc678c194f2a736c57
  },
  sectionTitle: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    letterSpacing: 2,
    marginTop: 22,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 28,
    padding: 18,
    marginBottom: 14,
    ...theme.shadows.sm,
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: 28,
    fontFamily: 'serif',
    marginBottom: 4,
  },
  cardText: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    marginBottom: 10,
    lineHeight: 22,
  },
  heroImage: {
<<<<<<< HEAD
    height: 140,
=======
    height: 170,
>>>>>>> 9173f91caf7a76f4ff1a09cc678c194f2a736c57
    borderRadius: 22,
    backgroundColor: theme.colors.highlight,
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
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  metaLabel: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  metaValue: {
    color: theme.colors.textSecondary,
    fontSize: 15,
  },
  summaryCard: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 28,
    padding: 18,
    marginTop: 14,
    marginBottom: 14,
    ...theme.shadows.sm,
  },
  summaryLabel: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  summaryText: {
    color: theme.colors.text,
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
    backgroundColor: theme.colors.highlight,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  holidayItemTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  holidayItemSub: {
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
});

export default CalendarScreen;

