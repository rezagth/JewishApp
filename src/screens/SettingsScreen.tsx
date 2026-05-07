import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector, useAppDispatch } from '@hooks/useRedux';
import { useI18n } from '@hooks/useI18n';
import { useTheme } from '@hooks/useTheme';
import { setDarkMode } from '@store/slices/userSlice';

const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { t } = useI18n();
  const preferences = useAppSelector((state) => state.user.preferences);
  const isDarkMode = preferences.isDarkMode;

  const styles = createStyles(theme);

  const toggleTheme = (dark: boolean) => {
    dispatch(setDarkMode(dark));
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 8 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.brand}>SIDDUR</Text>
          <Text style={{ color: theme.colors.secondary, fontSize: 22 }}>☰</Text>
        </View>

        <Text style={styles.title}>Paramètres</Text>
        <Text style={styles.subtitle}>
          Personnalisez votre expérience spirituelle et vos calculs de zmanim.
        </Text>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>Active</Text>
            <Text style={styles.pillText}>Location</Text>
          </View>
          <Text style={styles.cardTitle}>Jerusalem, Israel</Text>
          <Text style={styles.cardText}>Localisation actuelle et atmosphère locale</Text>
          <TouchableOpacity style={styles.button} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Changer de localisation</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>Selected</Text>
            <Text style={styles.pillText}>Appearance</Text>
          </View>
          <Text style={styles.cardTitle}>{isDarkMode ? 'Liquid Glass Dark' : 'Crystal Light'}</Text>
          <Text style={styles.cardText}>
            {isDarkMode 
              ? 'Un thème sombre à contraste élevé adapté à la lecture nocturne'
              : 'Un thème clair et épuré pour une lecture diurne optimale'}
          </Text>
          <View style={{ marginTop: 16 }}>
            <View style={styles.segmented}>
              <TouchableOpacity 
                style={[styles.segmentedItem, isDarkMode && styles.segmentedItemActive]}
                onPress={() => toggleTheme(true)}
              >
                <Text style={[styles.segmentedText, isDarkMode && styles.segmentedTextActive]}>Sombre</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.segmentedItem, !isDarkMode && styles.segmentedItemActive]}
                onPress={() => toggleTheme(false)}
              >
                <Text style={[styles.segmentedText, !isDarkMode && styles.segmentedTextActive]}>Clair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notifications de prière</Text>
          <View style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
              <Text style={styles.toggleIcon}>☼</Text>
              <View>
                <Text style={styles.toggleTitle}>Shacharit</Text>
                <Text style={styles.toggleSub}>Prière du matin</Text>
              </View>
            </View>
            <View style={styles.pill}><Text style={styles.pillText}>{preferences.enableNotifications ? 'ACTIVÉ' : 'DÉSACTIVÉ'}</Text></View>
          </View>
          <View style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
              <Text style={styles.toggleIcon}>◔</Text>
              <View>
                <Text style={styles.toggleTitle}>Mincha</Text>
                <Text style={styles.toggleSub}>Prière de l'après-midi</Text>
              </View>
            </View>
            <View style={styles.pill}><Text style={styles.pillText}>ACTIVÉ</Text></View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Préférences Halachiques</Text>
          <Text style={styles.cardText}>Choisissez votre méthode de calcul préférée pour les zmanim.</Text>
          <View style={{ marginTop: 16, gap: 12 }}>
            <View style={styles.pill}><Text style={styles.pillText}>Magen Avraham · 72 minutes</Text></View>
            <View style={[styles.pill, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}><Text style={{ color: theme.colors.textSecondary, fontWeight: '700' }}>Gra / Baal HaTanya · Heures égales</Text></View>
          </View>
        </View>

        <View style={styles.banner}>
          <View style={styles.bannerOverlay} />
          <Text style={styles.bannerText}>Synchronisation directe active</Text>
          <Text style={styles.bannerSub}>{t('calendar.updatedAt', 'Mis à jour en direct depuis votre localisation')}</Text>
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
  content: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
  },
  brand: {
    color: theme.colors.primary,
    fontSize: 26,
    letterSpacing: 1.6,
    fontWeight: '800',
    fontFamily: 'serif',
  },
  title: {
    color: theme.colors.text,
    fontSize: 42,
    fontFamily: 'serif',
    fontWeight: '700',
    marginTop: 10,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 18,
    lineHeight: 26,
    marginTop: 8,
    marginBottom: 24,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 28,
    padding: 18,
    marginBottom: 16,
    ...theme.shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    color: theme.colors.primary,
    fontSize: 12,
    letterSpacing: 1.8,
    fontWeight: '800',
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: 26,
    fontFamily: 'serif',
    marginBottom: 4,
  },
  cardText: {
    color: theme.colors.textSecondary,
    fontSize: 15,
  },
  button: {
    marginTop: 16,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: theme.colors.background,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  toggleIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colors.primary,
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 42,
  },
  toggleTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  toggleSub: {
    color: theme.colors.textSecondary,
    marginTop: 3,
    fontSize: 13,
  },
  pill: {
    backgroundColor: theme.colors.highlight,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  pillText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: theme.colors.highlight,
    borderRadius: 999,
    padding: 4,
  },
  segmentedItem: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
  },
  segmentedItemActive: {
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
  },
  segmentedText: {
    color: theme.colors.textSecondary,
    fontWeight: '700',
  },
  segmentedTextActive: {
    color: theme.colors.primary,
  },
  banner: {
    marginTop: 14,
    height: 180,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    justifyContent: 'flex-end',
    padding: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  bannerText: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  bannerSub: {
    color: theme.colors.textSecondary,
    marginTop: 6,
  },
});

export default SettingsScreen;