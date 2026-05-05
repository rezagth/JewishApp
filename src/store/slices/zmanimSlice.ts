/**
 * Redux Slice: Zmanim
 * Gère l'état du calendrier et des horaires des prières
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ZmanDetails, JewishHoliday } from '@types/index';

interface ZmanimState {
  zmanim: ZmanDetails | null;
  holidays: JewishHoliday[];
  userLocation: {
    latitude: number;
    longitude: number;
    city?: string;
    timezone?: string;
  } | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: ZmanimState = {
  zmanim: null,
  holidays: [],
  userLocation: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
};

const zmanimSlice = createSlice({
  name: 'zmanim',
  initialState,
  reducers: {
    setZmanim: (state, action: PayloadAction<ZmanDetails>) => {
      state.zmanim = action.payload;
      state.lastUpdated = new Date().toISOString();
      state.error = null;
    },
    setHolidays: (state, action: PayloadAction<JewishHoliday[]>) => {
      state.holidays = action.payload;
    },
    setUserLocation: (
      state,
      action: PayloadAction<{
        latitude: number;
        longitude: number;
        city?: string;
        timezone?: string;
      }>
    ) => {
      state.userLocation = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearZmanim: (state) => {
      state.zmanim = null;
      state.holidays = [];
    },
  },
});

export const {
  setZmanim,
  setHolidays,
  setUserLocation,
  setLoading,
  setError,
  clearZmanim,
} = zmanimSlice.actions;

export default zmanimSlice.reducer;
