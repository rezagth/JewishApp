/**
 * App.tsx - Point d'entrée principal
 * Configure la navigation, Redux store et les services principaux
 */

import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import {
  NavigationContainer,
  DefaultTheme,
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
}

const TabIcon: React.FC<TabIconProps> = ({ label, icon, focused }) => (
  <View style={[tabStyles.iconWrap, focused && tabStyles.iconWrapFocused]}>
    <Text style={[tabStyles.iconEmoji, focused && tabStyles.iconFocused]}>{icon}</Text>
    <Text style={[tabStyles.iconLabel, focused && tabStyles.iconLabelFocused]}>{label}</Text>
  </View>
);

const tabStyles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 54,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 18,
  },
  iconWrapFocused: {
    backgroundColor: 'rgba(233, 195, 73, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(233, 195, 73, 0.24)',
  },
  iconEmoji: {
    fontSize: 20,
    color: '#96A0B6',
  },
  iconFocused: {
    color: '#F1D77A',
  },
  iconLabel: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#96A0B6',
  },
  iconLabelFocused: {
    color: '#F1D77A',
  },
});

// ─── Thème navigation de l'app ────────────────────────────────────────────────
const WhiteTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#F1D77A',
    background: '#0C1322',
    card: '#0C1322',
    text: '#DCE2F7',
    border: 'rgba(255,255,255,0.08)',
    notification: '#F1D77A',
  },
};

/**
 * Barre de navigation du bas - style cohérent avec l'app
 */
const HomeTabs = () => {
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
          backgroundColor: 'rgba(12, 19, 34, 0.96)',
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.08)',
          borderRadius: 26,
          elevation: 18,
          shadowColor: '#000',
          shadowOpacity: 0.28,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          overflow: 'hidden',
        },
        tabBarItemStyle: {
          paddingTop: 4,
          paddingBottom: 0,
        },
        tabBarActiveTintColor: '#F1D77A',
        tabBarInactiveTintColor: '#96A0B6',
      }}
    >
      <Tab.Screen
        name="Accueil"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Accueil" icon="⌂" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="Siddur"
        component={SiddurScreen}
        options={{
          tabBarLabel: 'Siddur',
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Siddur" icon="✡" focused={focused} />
          ),
        }}
      />

      {/* ── Calendrier ── */}
      <Tab.Screen
        component={CalendarScreen}
        name="Calendrier"
        options={{
          tabBarLabel: 'Calendrier',
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Calendrier" icon="🗓" focused={focused} />
          ),
        }}
      />

      {/* ── Réglages ── */}
      <Tab.Screen
        component={SettingsScreen}
        name="Réglages"
        options={{
          tabBarLabel: 'Réglages',
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Réglages" icon="⚙" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
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
        await Font.loadAsync({});
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
      <NavigationContainer theme={WhiteTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainTabs" component={HomeTabs} />
        </Stack.Navigator>
        <StatusBar style="dark" />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
