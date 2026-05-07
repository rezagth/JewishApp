import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector, useAppDispatch } from '@hooks/useRedux';
import { useI18n } from '@hooks/useI18n';
import { useTheme } from '@hooks/useTheme';
import { setDarkMode, setNusach, setNotifications } from '@store/slices/userSlice';
import { setUserLocation } from '@store/slices/zmanimSlice';
import GeolocationService from '@services/geolocation';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { t } = useI18n();
  const preferences = useAppSelector((state) => state.user.preferences);
  const userLocation = useAppSelector((state) => state.zmanim.userLocation);
  const isDarkMode = preferences.isDarkMode;

  // État pour la recherche de localisation
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const styles = createStyles(theme);

  const toggleTheme = (dark: boolean) => {
    dispatch(setDarkMode(dark));
  };

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    if (text.length > 2) {
      setIsSearching(true);
      try {
        const results = await GeolocationService.searchCities(text);
        setSearchResults(results);
      } catch (err) {
        console.warn('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const selectLocation = (item: any) => {
    dispatch(setUserLocation({
      latitude: item.latitude,
      longitude: item.longitude,
      city: item.city,
    }));
    setShowLocationModal(false);
    setSearchQuery('');
    setSearchResults([]);
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
            <Text style={styles.cardLabel}>Actif</Text>
            <Text style={styles.pillText}>Localisation</Text>
          </View>
          <Text style={styles.cardTitle}>{userLocation?.city || 'Jérusalem, Israël'}</Text>
          <Text style={styles.cardText}>Localisation actuelle et atmosphère locale</Text>
          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.85}
            onPress={() => setShowLocationModal(true)}
          >
            <Text style={styles.buttonText}>Changer de localisation</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>Sélectionné</Text>
            <Text style={styles.pillText}>Apparence</Text>
          </View>
          <Text style={styles.cardTitle}>{isDarkMode ? 'Verre Liquide Sombre' : 'Cristal Clair'}</Text>
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
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>Sélectionné</Text>
            <Text style={styles.pillText}>Rite (Noussach)</Text>
          </View>
          <Text style={styles.cardTitle}>{preferences.nusach === 'sephardic' ? 'Rite Séfarade' : 'Rite Ashkénaze'}</Text>
          <Text style={styles.cardText}>
            Adaptez les textes des prières et les coutumes liturgiques selon votre tradition.
          </Text>
          <View style={{ marginTop: 16 }}>
            <View style={styles.segmented}>
              <TouchableOpacity 
                style={[styles.segmentedItem, preferences.nusach === 'sephardic' && styles.segmentedItemActive]}
                onPress={() => dispatch(setNusach('sephardic'))}
              >
                <Text style={[styles.segmentedText, preferences.nusach === 'sephardic' && styles.segmentedTextActive]}>Séfarade</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.segmentedItem, preferences.nusach === 'ashkenazi' && styles.segmentedItemActive]}
                onPress={() => dispatch(setNusach('ashkenazi'))}
              >
                <Text style={[styles.segmentedText, preferences.nusach === 'ashkenazi' && styles.segmentedTextActive]}>Ashkénaze</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notifications de prière</Text>
          
          <TouchableOpacity 
            style={styles.toggleRow} 
            activeOpacity={0.7}
            onPress={() => dispatch(setNotifications({ key: 'shacharit', value: !preferences.notifications.shacharit }))}
          >
            <View style={styles.toggleLeft}>
              <Text style={styles.toggleIcon}>☼</Text>
              <View>
                <Text style={styles.toggleTitle}>Cha'harith</Text>
                <Text style={styles.toggleSub}>Prière du matin</Text>
              </View>
            </View>
            <View style={[styles.pill, !preferences.notifications.shacharit && { opacity: 0.5, backgroundColor: theme.colors.border }]}>
              <Text style={[styles.pillText, !preferences.notifications.shacharit && { color: theme.colors.textSecondary }]}>
                {preferences.notifications.shacharit ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.toggleRow}
            activeOpacity={0.7}
            onPress={() => dispatch(setNotifications({ key: 'mincha', value: !preferences.notifications.mincha }))}
          >
            <View style={styles.toggleLeft}>
              <Text style={styles.toggleIcon}>◔</Text>
              <View>
                <Text style={styles.toggleTitle}>Min'hah</Text>
                <Text style={styles.toggleSub}>Prière de l'après-midi</Text>
              </View>
            </View>
            <View style={[styles.pill, !preferences.notifications.mincha && { opacity: 0.5, backgroundColor: theme.colors.border }]}>
              <Text style={[styles.pillText, !preferences.notifications.mincha && { color: theme.colors.textSecondary }]}>
                {preferences.notifications.mincha ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.toggleRow}
            activeOpacity={0.7}
            onPress={() => dispatch(setNotifications({ key: 'arvit', value: !preferences.notifications.arvit }))}
          >
            <View style={styles.toggleLeft}>
              <Text style={styles.toggleIcon}>☾</Text>
              <View>
                <Text style={styles.toggleTitle}>Arvith</Text>
                <Text style={styles.toggleSub}>Prière du soir</Text>
              </View>
            </View>
            <View style={[styles.pill, !preferences.notifications.arvit && { opacity: 0.5, backgroundColor: theme.colors.border }]}>
              <Text style={[styles.pillText, !preferences.notifications.arvit && { color: theme.colors.textSecondary }]}>
                {preferences.notifications.arvit ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
              </Text>
            </View>
          </TouchableOpacity>
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

      {/* Modal de recherche de localisation */}
      <Modal
        visible={showLocationModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Localisation</Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                <Ionicons name="close" size={28} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Ville, Pays..."
                placeholderTextColor={theme.colors.textSecondary}
                value={searchQuery}
                onChangeText={handleSearch}
                autoFocus
              />
              {isSearching && <ActivityIndicator size="small" color={theme.colors.primary} />}
            </View>

            <FlatList
              data={searchResults}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.resultItem}
                  onPress={() => selectLocation(item)}
                >
                  <Ionicons name="location-outline" size={20} color={theme.colors.primary} />
                  <View style={styles.resultTextContainer}>
                    <Text style={styles.resultCity}>{item.city}</Text>
                    <Text style={styles.resultFullName} numberOfLines={1}>{item.display_name}</Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                searchQuery.length > 2 && !isSearching ? (
                  <Text style={styles.emptyResults}>Aucun résultat trouvé</Text>
                ) : null
              }
            />
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'serif',
    fontWeight: '700',
    color: theme.colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.highlight,
    borderRadius: 16,
    paddingHorizontal: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: theme.colors.text,
    fontSize: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  resultTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  resultCity: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  resultFullName: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  emptyResults: {
    textAlign: 'center',
    marginTop: 40,
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
});

export default SettingsScreen;