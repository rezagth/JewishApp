// Jest Setup File
import '@testing-library/jest-native/extend-expect';

// Mock Expo modules
jest.mock('expo', () => ({
  registerRootComponent: jest.fn(),
}));

jest.mock('expo-constants', () => ({
  expoConfig: {},
  Constants: {
    manifest: {},
  },
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
  getCurrentPositionAsync: jest.fn(() =>
    Promise.resolve({
      coords: {
        latitude: 32.0853,
        longitude: 34.7818,
        altitude: 0,
        accuracy: 10,
      },
    })
  ),
  reverseGeocodeAsync: jest.fn(() =>
    Promise.resolve([
      {
        city: 'Tel Aviv',
        country: 'Israel',
      },
    ])
  ),
  watchPositionAsync: jest.fn(() => Promise.resolve('123')),
  removeWatchAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
  requestPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
  getExpoPushTokenAsync: jest.fn(() =>
    Promise.resolve({ data: 'fake-token' })
  ),
  setNotificationHandler: jest.fn(),
  scheduleNotificationAsync: jest.fn(() =>
    Promise.resolve('123')
  ),
  cancelScheduledNotificationAsync: jest.fn(() =>
    Promise.resolve()
  ),
  cancelAllScheduledNotificationsAsync: jest.fn(() =>
    Promise.resolve()
  ),
  addNotificationResponseReceivedListener: jest.fn(() =>
    ({
      remove: jest.fn(),
    } as any)
  ),
  addNotificationReceivedListener: jest.fn(() =>
    ({
      remove: jest.fn(),
    } as any)
  ),
}));

// Suppress console errors in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Non-serializable values') ||
        args[0].includes('Each child in a list'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
