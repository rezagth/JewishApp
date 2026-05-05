/**
 * App.tsx - Point d'entrée principal
 * Configure la navigation, Redux store et les services principaux
 */

import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Text, useColorScheme } from 'react-native';

import store from '@store/index';
import HomeScreen from '@screens/HomeScreen';
import SiddurScreen from '@screens/SiddurScreen';
import CalendarScreen from '@screens/CalendarScreen';
import SettingsScreen from '@screens/SettingsScreen';
import NotificationService from '@services/notifications';
import { COLORS } from '@constants/index';

// Configuration navigation
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Garder la splash screen visible jusqu'au chargement
SplashScreen.preventAutoHideAsync();

/**
 * Composant de navigation au niveau du Tab Bar
 */
const HomeTabs = () => {
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 18,
          height: 74,
          borderTopWidth: 0,
          borderRadius: 28,
          backgroundColor: 'rgba(20, 27, 43, 0.96)',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          shadowColor: '#000000',
          shadowOpacity: 0.28,
          shadowRadius: 30,
          shadowOffset: { width: 0, height: 18 },
          elevation: 18,
          paddingTop: 10,
          paddingBottom: 10,
          paddingHorizontal: 14,
        },
        tabBarActiveTintColor: COLORS.secondary,
        tabBarInactiveTintColor: '#6E7A92',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.3,
        },
        tabBarItemStyle: {
          paddingTop: 2,
          paddingBottom: 2,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>◫</Text>
          ),
        }}
      />

      {/* Onglet Siddur */}
      <Tab.Screen
        name="Siddur"
        component={SiddurScreen}
        options={{
          tabBarLabel: 'Siddur',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>☰</Text>
          ),
        }}
      />

      {/* Onglet Calendrier */}
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarLabel: 'Calendrier',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>▣</Text>
          ),
        }}
      />

      {/* Onglet Paramètres */}
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Paramètres',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>⚙</Text>
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
  const colorScheme = useColorScheme();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Charger les ressources
        await Font.loadAsync({
          // Ajouter les polices personnalisées si nécessaire
        });

        // Initialiser les services
        await NotificationService.initialize();

        // Imprimer que l'app est prête
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

  const MyLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: COLORS.primary,
      background: COLORS.background,
      card: '#FFFFFF',
      text: '#212121',
      border: COLORS.border,
    },
  };

  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: COLORS.primary,
      background: COLORS.darkBackground,
      card: '#212121',
      text: '#FFFFFF',
      border: '#424242',
    },
  };

  return (
    <Provider store={store}>
      <NavigationContainer
        theme={MyDarkTheme}
      >
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="MainTabs" component={HomeTabs} />
        </Stack.Navigator>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
