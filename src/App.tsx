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
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

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
  const iconColor = isDarkMode ? '#FFFFFF' : '#000000';
  
  return (
    <View style={tabStyles.iconWrap}>
      <Ionicons 
        name={icon as any} 
        size={24} 
        color={focused ? iconColor : (isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)')} 
      />
      <Text style={[
        tabStyles.iconLabel, 
        { color: focused ? iconColor : (isDarkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)') }
      ]}>{label}</Text>
    </View>
  );
};

const tabStyles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
  },
  iconEmoji: {
    fontSize: 20,
  },
  iconLabel: {
    marginTop: 2,
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
          left: 20,
          right: 20,
          bottom: 24,
          height: 64,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)',
          borderRadius: 32,
          elevation: 0,
          shadowColor: '#000',
          shadowOpacity: isDarkMode ? 0.4 : 0.1,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 10 },
          overflow: 'hidden',
          paddingBottom: 0, // Désactive le padding par défaut pour centrer manuellement
        },
        tabBarBackground: () => (
          <BlurView
            tint={isDarkMode ? 'dark' : 'light'}
            intensity={isDarkMode ? 80 : 90}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarItemStyle: {
          height: 64,
          paddingTop: 0,
          paddingBottom: 0,
          justifyContent: 'center',
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
            <TabIcon label="Accueil" icon={focused ? "home" : "home-outline"} focused={focused} isDarkMode={isDarkMode} />
          ),
        }}
      />

      <Tab.Screen
        name="Siddur"
        component={SiddurScreen}
        options={{
          tabBarLabel: 'Siddur',
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Siddur" icon={focused ? "book" : "book-outline"} focused={focused} isDarkMode={isDarkMode} />
          ),
        }}
      />

      <Tab.Screen
        component={CalendarScreen}
        name="Calendrier"
        options={{
          tabBarLabel: 'Calendrier',
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Calendrier" icon={focused ? "calendar" : "calendar-outline"} focused={focused} isDarkMode={isDarkMode} />
          ),
        }}
      />

      <Tab.Screen
        component={SettingsScreen}
        name="Réglages"
        options={{
          tabBarLabel: 'Réglages',
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Réglages" icon={focused ? "settings" : "settings-outline"} focused={focused} isDarkMode={isDarkMode} />
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
