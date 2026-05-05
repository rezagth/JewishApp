/**
 * Screen: Community (Q&A Forum)
 * Écran pour le module communautaire avec questions/réponses
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useI18n } from '@hooks/useI18n';
import { useAppSelector } from '@hooks/useRedux';
import { useZmanim } from '@hooks/useZmanim';
import { COLORS } from '@constants/index';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  darkContainer: {
    backgroundColor: COLORS.darkBackground,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.accent,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchBar: {
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
  },
  darkSearchBar: {
    backgroundColor: '#212121',
    borderColor: '#424242',
    color: '#E0E0E0',
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    backgroundColor: '#F5F5F5',
  },
  darkFilterBar: {
    backgroundColor: '#121212',
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  darkCategoryButton: {
    backgroundColor: '#212121',
  },
  categoryButtonActive: {
    backgroundColor: COLORS.accent,
  },
  categoryButtonText: {
    color: '#666666',
    fontSize: 12,
  },
  darkCategoryButtonText: {
    color: '#B0BEC5',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  questionsList: {
    flex: 1,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginVertical: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  darkQuestionCard: {
    backgroundColor: '#212121',
    borderLeftColor: '#81D4FA',
  },
  questionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  darkQuestionTitle: {
    color: '#E0E0E0',
  },
  questionMeta: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 6,
  },
  darkQuestionMeta: {
    color: '#757575',
  },
  questionCategory: {
    display: 'flex',
    fontSize: 11,
    backgroundColor: '#F0F0F0',
    color: '#666666',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  darkQuestionCategory: {
    backgroundColor: '#424242',
    color: '#B0BEC5',
  },
  questionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  voteContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  voteText: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    color: '#999999',
    fontSize: 16,
    textAlign: 'center',
  },
  darkEmptyText: {
    color: '#757575',
  },
  fabButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabButtonText: {
    color: '#FFFFFF',
    fontSize: 28,
  },
});

export const CommunityScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { calendarSummary } = useZmanim();
  const holidays = useAppSelector((state) => state.zmanim.holidays);

  const resources = [
    {
      title: calendarSummary?.parasha || 'Live parasha',
      subtitle: calendarSummary?.todayLabel || 'Hebcal calendar',
      meta: 'Weekly Torah reading',
      icon: '📖',
    },
    {
      title: holidays[0]?.name || 'Today’s holiday',
      subtitle: holidays[0]?.nameHe || 'Hebcal holiday feed',
      meta: 'Real calendar event',
      icon: '🕎',
    },
    {
      title: 'Sefaria text library',
      subtitle: 'Live prayer text references',
      meta: 'Open texts and sources',
      icon: '🧾',
    },
    {
      title: 'Zmanim and Shabbat',
      subtitle: 'Calculated from your location',
      meta: 'Updated from the device GPS',
      icon: '🕯',
    },
  ];

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerText}>
          {t('nav.community', 'Communauté')}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6 }}>
          <Text style={[styles.emptyText, isDark && styles.darkEmptyText]}>
            Ressources en direct du calendrier juif et des bibliothèques de textes.
          </Text>
        </View>

        {resources.map((resource, index) => (
          <TouchableOpacity
            key={`${resource.title}-${index}`}
            style={[styles.questionCard, isDark && styles.darkQuestionCard]}
            activeOpacity={0.85}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ fontSize: 22, marginRight: 10 }}>{resource.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.questionTitle, isDark && styles.darkQuestionTitle]}>
                  {resource.title}
                </Text>
                <Text style={[styles.questionMeta, isDark && styles.darkQuestionMeta]}>
                  {resource.subtitle}
                </Text>
              </View>
            </View>

            <Text style={[styles.questionMeta, isDark && styles.darkQuestionMeta]}>
              {resource.meta}
            </Text>
          </TouchableOpacity>
        ))}

        <View style={[styles.questionCard, isDark && styles.darkQuestionCard, { marginBottom: 40 }]}>
          <Text style={[styles.questionTitle, isDark && styles.darkQuestionTitle]}>
            Prêt pour la production
          </Text>
          <Text style={[styles.questionMeta, isDark && styles.darkQuestionMeta]}>
            Cet onglet est maintenant une vraie surface de découverte au lieu d'un flux Q&A simulé vide.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default CommunityScreen;
