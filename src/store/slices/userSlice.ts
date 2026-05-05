/**
 * Redux Slice: User
 * Gère l'état de l'utilisateur et ses préférences
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserPreferences, Nusach } from '@types/index';

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  preferences: UserPreferences;
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  preferences: {
    language: 'he',
    nusach: 'ashkenazi',
    fontSize: 1,
    isDarkMode: false,
    timezone: 'UTC',
    enableNotifications: true,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    updatePreferences: (
      state,
      action: PayloadAction<Partial<UserPreferences>>
    ) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setLanguage: (state, action: PayloadAction<'he' | 'fr' | 'en'>) => {
      state.preferences.language = action.payload;
    },
    setNusach: (state, action: PayloadAction<Nusach>) => {
      state.preferences.nusach = action.payload;
    },
    setFontSize: (state, action: PayloadAction<number>) => {
      state.preferences.fontSize = Math.max(0.8, Math.min(1.5, action.payload));
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.preferences.isDarkMode = action.payload;
    },
    setTimezone: (state, action: PayloadAction<string>) => {
      state.preferences.timezone = action.payload;
    },
    setNotifications: (state, action: PayloadAction<boolean>) => {
      state.preferences.enableNotifications = action.payload;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setUser,
  updatePreferences,
  setLanguage,
  setNusach,
  setFontSize,
  setDarkMode,
  setTimezone,
  setNotifications,
  clearUser,
  setLoading,
  setError,
} = userSlice.actions;

export default userSlice.reducer;
