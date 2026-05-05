import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector } from '@hooks/useRedux';
import { useI18n } from '@hooks/useI18n';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0C1322',
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
    color: '#F1D77A',
    fontSize: 26,
    letterSpacing: 1.6,
    fontWeight: '800',
    fontFamily: 'serif',
  },
  title: {
    color: '#DCE2F7',
    fontSize: 42,
    fontFamily: 'serif',
    fontWeight: '700',
    marginTop: 10,
  },
  subtitle: {
    color: '#A7B0C4',
    fontSize: 18,
    lineHeight: 26,
    marginTop: 8,
    marginBottom: 24,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 28,
    padding: 18,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    color: '#F1D77A',
    fontSize: 12,
    letterSpacing: 1.8,
    fontWeight: '800',
  },
  cardTitle: {
    color: '#DCE2F7',
    fontSize: 26,
    fontFamily: 'serif',
    marginBottom: 4,
  },
  cardText: {
    color: '#A7B0C4',
    fontSize: 15,
  },
  button: {
    marginTop: 16,
    borderRadius: 18,
    backgroundColor: '#E9C349',
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#0C1322',
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
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
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#F1D77A',
    fontSize: 18,
  },
  toggleTitle: {
    color: '#DCE2F7',
    fontSize: 16,
    fontWeight: '700',
  },
  toggleSub: {
    color: '#7F879A',
    marginTop: 3,
  },
  pill: {
    backgroundColor: 'rgba(233, 195, 73, 0.12)',
    borderColor: 'rgba(233, 195, 73, 0.28)',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  pillText: {
    color: '#F1D77A',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
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
    backgroundColor: '#303746',
  },
  segmentedText: {
    color: '#A7B0C4',
    fontWeight: '700',
  },
  segmentedTextActive: {
    color: '#E8EAEE',
  },
  banner: {
    marginTop: 14,
    height: 180,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#1A2233',
    justifyContent: 'flex-end',
    padding: 18,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12, 19, 34, 0.15)',
  },
  bannerText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  bannerSub: {
    color: '#DCE2F7',
    marginTop: 6,
  },
});

const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  useColorScheme();
  const { t } = useI18n();
  const preferences = useAppSelector((state) => state.user.preferences);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 8 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.brand}>SIDDUR</Text>
          <Text style={{ color: '#E9C349', fontSize: 22 }}>☰</Text>
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
          <Text style={styles.cardTitle}>Liquid Glass Dark</Text>
          <Text style={styles.cardText}>Un thème sombre à contraste élevé adapté à la lecture nocturne</Text>
          <View style={{ marginTop: 16 }}>
            <View style={styles.segmented}>
              <View style={[styles.segmentedItem, styles.segmentedItemActive]}>
                <Text style={styles.segmentedTextActive}>Sombre</Text>
              </View>
              <View style={styles.segmentedItem}>
                <Text style={styles.segmentedText}>Clair</Text>
              </View>
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
          <View style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
              <Text style={styles.toggleIcon}>☾</Text>
              <View>
                <Text style={styles.toggleTitle}>Arvit</Text>
                <Text style={styles.toggleSub}>Prière du soir</Text>
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
            <View style={[styles.pill, { backgroundColor: 'rgba(255,255,255,0.04)' }]}><Text style={{ color: '#A7B0C4', fontWeight: '700' }}>Gra / Baal HaTanya · Heures égales</Text></View>
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

export default SettingsScreen;