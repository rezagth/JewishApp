/**
 * Redux Store Configuration
 * Utilise Redux Toolkit pour la gestion de l'état
 */

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import prayerReducer from './slices/prayerSlice';
import zmanimReducer from './slices/zmanimSlice';
import communityReducer from './slices/communitySlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    prayer: prayerReducer,
    zmanim: zmanimReducer,
    community: communityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
