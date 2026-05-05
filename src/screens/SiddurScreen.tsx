/**
 * Screen: Siddur (Prières)
 * Vue lecture premium inspirée de la maquette fournie
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector } from '@hooks/useRedux';
import { useI18n } from '@hooks/useI18n';
import { usePrayer } from '@hooks/usePrayer';

const styles = StyleSheet.create({
  screen: {
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
    paddingBottom: 18,
  },
  brand: {
    color: '#F1D77A',
    fontSize: 30,
    fontFamily: 'serif',
    fontWeight: '800',
    letterSpacing: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  readerShell: {
    marginTop: 18,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: 22,
    minHeight: 520,
  },
  prayerLabel: {
    alignSelf: 'flex-end',
    color: '#F1D77A',
    fontSize: 26,
    fontFamily: 'serif',
    fontWeight: '700',
  },
  prayerMeta: {
    alignSelf: 'flex-end',
    color: '#8F97A8',
    letterSpacing: 1.2,
    fontSize: 12,
    marginTop: 2,
    marginBottom: 24,
  },
  readerBody: {
    color: '#E6EBF8',
    fontSize: 28,
    lineHeight: 62,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  faded: {
    color: 'rgba(230, 235, 248, 0.4)',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 18,
  },
  controls: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  controlButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#E9C349',
  },
  controlButtonText: {
    color: '#0C1322',
    fontWeight: '800',
    fontSize: 12,
  },
  controlItem: {
    color: '#DCE2F7',
    fontWeight: '700',
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
    backgroundColor: '#E9C349',
  },
});

const SiddurScreen = () => {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { currentService } = usePrayer();
  const nusach = useAppSelector((state) => state.user.preferences.nusach);
  const fontSize = useAppSelector((state) => state.user.preferences.fontSize);
  const [selectedNusach, setSelectedNusach] = useState(nusach);
  useColorScheme();

  const serviceTitle =
    currentService === 'shacharit'
      ? 'אַשְׁרֵי'
      : currentService === 'mincha'
        ? 'מִנְחָה'
        : 'עַרְבִית';

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 8 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Text style={styles.brand}>Siddur</Text>
          <View style={styles.iconCircle}>
            <Text style={{ color: '#E9C349', fontSize: 20 }}>☰</Text>
          </View>
        </View>

        <View style={styles.readerShell}>
          <Text style={styles.prayerLabel}>{serviceTitle}</Text>
          <Text style={styles.prayerMeta}>PSAUME 145</Text>

          <Text style={styles.readerBody}>
            אֲשְׁרֵי יוֹשְׁבֵי בֵיתֶךָ עוֹד יְהַלְלוּךָ סֶּלָה:{'\n\n'}
            אֲשְׁרֵי הָעָם שֶׁכָּכָה לּוֹ{' '}
            {selectedNusach === 'teimani' ? 'אַשְׁרֵי הָעָם שֶׁיְהֹוָה אֱלֹהָיו' : 'אֲשְׁרֵי הָעָם שֶׁיְהֹוָה אֱלֹהָיו'}
          </Text>

          <Text style={styles.faded}>תְּהִלָּה לְדָוִד</Text>

          <Text style={[styles.readerBody, { fontSize: 24 * fontSize, lineHeight: 52 }]}>גָּדוֹל יְהֹוָה וּמְהֻלָּל מְאֹד</Text>

          <View style={styles.progressWrap}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabel}>Ashrei</Text>
              <Text style={styles.progressLabel}>Tachnun</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={() => setSelectedNusach(nusach)}>
          <Text style={styles.controlButtonText}>FINISH</Text>
        </TouchableOpacity>
        <Text style={styles.controlItem}>◐</Text>
        <Text style={styles.controlItem}>tT</Text>
        <Text style={styles.controlItem}>t</Text>
        <Text style={styles.controlItem}>Tt</Text>
        <Text style={styles.controlItem}>▥</Text>
      </View>
    </View>
  );
};

export default SiddurScreen;
