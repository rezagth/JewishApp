/**
 * Redux Slice: Prayer (Siddur)
 * Gère l'état des prières et du Siddur
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Prayer, ServiceType } from '@types/index';

interface PrayerState {
  currentService: ServiceType;
  currentPrayers: Prayer[];
  selectedPrayerId: string | null;
  isLoading: boolean;
  error: string | null;
  favorites: string[];
  searchResults: Prayer[];
}

const initialState: PrayerState = {
  currentService: 'shacharit',
  currentPrayers: [],
  selectedPrayerId: null,
  isLoading: false,
  error: null,
  favorites: [],
  searchResults: [],
};

const prayerSlice = createSlice({
  name: 'prayer',
  initialState,
  reducers: {
    setCurrentService: (state, action: PayloadAction<ServiceType>) => {
      state.currentService = action.payload;
    },
    setPrayers: (state, action: PayloadAction<Prayer[]>) => {
      state.currentPrayers = action.payload;
      state.error = null;
    },
    selectPrayer: (state, action: PayloadAction<string>) => {
      state.selectedPrayerId = action.payload;
    },
    addFavorite: (state, action: PayloadAction<string>) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter((id) => id !== action.payload);
    },
    setSearchResults: (state, action: PayloadAction<Prayer[]>) => {
      state.searchResults = action.payload;
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
  setCurrentService,
  setPrayers,
  selectPrayer,
  addFavorite,
  removeFavorite,
  setSearchResults,
  setLoading,
  setError,
} = prayerSlice.actions;

export default prayerSlice.reducer;
