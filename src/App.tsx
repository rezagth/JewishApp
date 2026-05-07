/**
 * App.tsx - Point d'entrée principal
 * Configure la navigation, Redux store et les services principaux
 */

import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Text, View, StyleSheet } from 'react-native';

import store from '@store/index';
import HomeScreen from '@screens/HomeScreen';
import SiddurScreen from '@screens/SiddurScreen';
import CalendarScreen from '@screens/CalendarScreen';
import SettingsScreen from '@screens/SettingsScreen';
import NotificationService from '@services/notifications';
import { THEME } from '@constants/theme';
import { useAppSelector } from '@hooks/useRedux';

// Configuration navigation
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Garder la splash screen visible jusqu'au chargement
SplashScreen.preventAutoHideAsync();

// ─── Icône d'onglet personnalisée ─────────────────────────────────────────────
interface TabIconProps {
  label: string;
  icon: string;
  focused: boolean;
  isDarkMode: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ label, icon, focused, isDarkMode }) => {
  const theme = isDarkMode ? THEME.dark : THEME.light;
  
  return (
    <View style={[
      tabStyles.iconWrap, 
      focused && { backgroundColor: theme.colors.highlight, borderColor: theme.colors.border, borderWidth: 1 }
    ]}>
      <Text style={[
        tabStyles.iconEmoji, 
        { color: focused ? theme.colors.primary : theme.colors.textSecondary }
      ]}>{icon}</Text>
      <Text style={[
        tabStyles.iconLabel, 
        { color: focused ? theme.colors.primary : theme.colors.textSecondary }
      ]}>{label}</Text>
    </View>
  );
};

const tabStyles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 54,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 18,
  },
  iconEmoji: {
    fontSize: 20,
  },
  iconLabel: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});

/**
 * Barre de navigation du bas - style cohérent avec l'app
 */
const HomeTabs = () => {
  const isDarkMode = useAppSelector((state) => state.user.preferences.isDarkMode);
  const theme = isDarkMode ? THEME.dark : THEME.light;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          left: 14,
          right: 14,
          bottom: 14,
          height: 76,
          paddingBottom: 10,
          paddingTop: 8,
          backgroundColor: isDarkMode ? 'rgba(12, 19, 34, 0.96)' : 'rgba(255, 255, 255, 0.94)',
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: 26,
          elevation: 18,
          shadowColor: '#000',
          shadowOpacity: isDarkMode ? 0.28 : 0.1,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          overflow: 'hidden',
        },
        tabBarItemStyle: {
          paddingTop: 4,
          paddingBottom: 0,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="Accueil"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Accueil" icon="⌂" focused={focused} isDarkMode={isDarkMode} />
          ),
        }}
      />

      <Tab.Screen
        name="Siddur"
        component={SiddurScreen}
        options={{
          tabBarLabel: 'Siddur',
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Siddur" icon="✡" focused={focused} isDarkMode={isDarkMode} />
          ),
        }}
      />

      <Tab.Screen
        component={CalendarScreen}
        name="Calendrier"
        options={{
          tabBarLabel: 'Calendrier',
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Calendrier" icon="🗓" focused={focused} isDarkMode={isDarkMode} />
          ),
        }}
      />

      <Tab.Screen
        component={SettingsScreen}
        name="Réglages"
        options={{
          tabBarLabel: 'Réglages',
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Réglages" icon="⚙" focused={focused} isDarkMode={isDarkMode} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * Composant de navigation principal
 */
const AppNavigator = () => {
  const isDarkMode = useAppSelector((state) => state.user.preferences.isDarkMode);
  const theme = isDarkMode ? THEME.dark : THEME.light;

  const NavigationTheme = {
    ...(isDarkMode ? NavigationDarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? NavigationDarkTheme.colors : DefaultTheme.colors),
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.accent,
    },
  };

  return (
    <NavigationContainer theme={NavigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={HomeTabs} />
      </Stack.Navigator>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </NavigationContainer>
  );
};

/**
 * Composant App principal
 */
const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // await Font.loadAsync({}); // Add fonts here if needed
        await NotificationService.initialize();
        setAppIsReady(true);
      } catch (e) {
        console.warn('Erreur préparation app:', e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;
