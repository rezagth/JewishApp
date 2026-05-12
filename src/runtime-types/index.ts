// Runtime compatibility types for app-wide imports that still use @types/index.
// Keep this broader than src/types/index.ts so the copied siddur files can stay exact.

export interface Prayer {
  id: string;
  title: string;
  titleHe: string;
  content: string;
  contentHe: string;
  serviceType: ServiceType;
  nusach: Nusach;
  brachot?: Bracha[];
  alternates?: Prayer[];
}

export type ServiceType = 'shacharit' | 'mincha' | 'arvit' | "ma'ariv";
export type Nusach = 'ashkenazi' | 'sefardi' | 'chabad' | 'sephardi' | 'sephardic' | 'mizrahi' | 'teimani';

export interface Bracha {
  id: string;
  type: 'before' | 'after';
  content: string;
  contentHe: string;
}

export interface ZmanDetails {
  alot: string;
  sunrise: string;
  sof_zman_shema: string;
  sof_zman_tefilla: string;
  midday: string;
  sunset: string;
  tzait_stars: string;
}

export interface JewishHoliday {
  id: string;
  name: string;
  nameHe: string;
  hebrewDate: string;
  gregorianDate: string;
  type: 'holiday' | 'fast' | 'special_shabbat';
  torah_portion?: string;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  category: QuestionCategory;
  author: User;
  createdAt: Date;
  answers: Answer[];
  votes: number;
  tags: string[];
}

export interface Answer {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  votes: number;
  isAccepted: boolean;
}

export type QuestionCategory =
  | 'kashrut'
  | 'holidays'
  | 'daily_life'
  | 'theology'
  | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  reputation: number;
  joinedAt: Date;
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
  };
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: 'he' | 'fr' | 'en';
  nusach: Nusach;
  fontSize: number;
  isDarkMode: boolean;
  timezone: string;
  notifications: {
    shacharit: boolean;
    mincha: boolean;
    arvit: boolean;
  };
}

export interface NotificationPayload {
  title: string;
  body: string;
  data: {
    type: 'zman' | 'holiday' | 'community' | 'prayer';
    actionId?: string;
  };
}
