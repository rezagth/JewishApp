import { Nusach } from '@types/index';

export interface PrayerCategory {
  id: string;
  titleHe: string;
  titleFr: string;
  emoji?: string;
  jsonKey?: string;
  subCategories?: PrayerCategory[]; // Pour la structure hiérarchique
}

export interface PrayerTimeCategory extends PrayerCategory {
  timeOfDay: 'shacharit' | 'mincha' | 'arvit';
  emoji: string;
}

export const getPrayerCategories = (nusach: Nusach = 'sephardic'): PrayerCategory[] => {
  return [
    {
      id: 'tehillim',
      titleHe: 'תהילים',
      titleFr: 'Livre des psaumes',
      emoji: '📖',
      jsonKey: 'tehilim'
    },
    {
      id: 'birkat_hamazon',
      titleHe: 'ברכת המזון',
      titleFr: 'Birkat Hamazon',
      emoji: '🍽️',
      jsonKey: 'berachot'
    },
    {
      id: 'meen_chaloch',
      titleHe: 'מעין שלוש',
      titleFr: 'Meen Chaloch',
      emoji: '🍷'
    },
    {
      id: 'kadich_yehe_shelama',
      titleHe: 'קדיש יהא שלמא',
      titleFr: 'Kadich Yehe Chelama',
      emoji: '🙏'
    },
    {
      id: 'kadich_al_israel',
      titleHe: 'קדיש על ישראל',
      titleFr: 'Kadich Al Israel',
      emoji: '🙏'
    },
    {
      id: 'hallel_moussaf',
      titleHe: 'הלל ומוסף',
      titleFr: 'Hallel et Moussaf',
      emoji: '🎺'
    },
    {
      id: 'perek_chira',
      titleHe: 'פרק שירה',
      titleFr: 'Perek Chira',
      emoji: '🐦'
    },
    {
      id: 'tikoun_haklali',
      titleHe: 'תיקון הכללי',
      titleFr: 'Tikoun Haklali',
      emoji: '✨'
    },
    {
      id: 'kriat_shema_amita',
      titleHe: 'קריאת שמע על המיטה',
      titleFr: 'Kriat Chema au coucher',
      emoji: '🛌'
    },
    {
      id: 'havdala',
      titleHe: 'הבדלה',
      titleFr: 'Havdala',
      emoji: '🕯️',
      jsonKey: 'shabbat'
    },
    {
      id: 'birkat_levana',
      titleHe: 'ברכת הלבנה',
      titleFr: 'Birkat Levana',
      emoji: '🌙'
    },
    {
      id: 'slihot',
      titleHe: 'סליחות',
      titleFr: 'Slihot',
      emoji: '🎺'
    },
    {
      id: 'omer',
      titleHe: 'ספירת העומר',
      titleFr: 'Compte du Omer',
      emoji: '📊'
    },
    {
      id: 'hanoucca_candles',
      titleHe: 'הדלקת נרות חנוכה',
      titleFr: 'Bougies de Hanoucca',
      emoji: '🕎'
    },
    {
      id: 'meguila_esther',
      titleHe: 'מגילת אסתר',
      titleFr: 'Meguila ESTHER',
      emoji: '📜'
    },
    {
      id: 'travel_prayer',
      titleHe: 'תפילת הדרך',
      titleFr: 'Prière du voyage',
      emoji: '✈️'
    },
    {
      id: 'tfila_mezuza',
      titleHe: 'תפילת מזוזה',
      titleFr: 'Tfila Mezuza',
      emoji: '🚪'
    },
    {
      id: 'circumcision',
      titleHe: 'ברית מילה',
      titleFr: 'Circoncision',
      emoji: '👶'
    },
    {
      id: 'rachat_premier_ne',
      titleHe: 'פדיון הבן',
      titleFr: 'Rachat du premier né',
      emoji: '💰'
    },
    {
      id: 'hackava',
      titleHe: 'השכבה',
      titleFr: 'Hackava',
      emoji: '🕊️'
    },
    {
      id: 'sheba_brakhot',
      titleHe: 'שבע ברכות',
      titleFr: '7 bénédictions mariage',
      emoji: '💍'
    },
    {
      id: 'torah_reading',
      titleHe: 'קריאת התורה',
      titleFr: 'Lecture de la Torah',
      emoji: '📜'
    }
  ];
};

export const getPrayerTimeCategories = (nusach: Nusach = 'sephardic'): PrayerTimeCategory[] => {
  return [
    {
      id: 'shacharit',
      titleHe: 'שחרית',
      titleFr: 'Chaharith',
      emoji: '🌅',
      timeOfDay: 'shacharit',
      subCategories: [
        { id: 'shach_1', titleHe: 'ברכות השחר', titleFr: 'Bénédiction du matin' },
        { id: 'shach_2', titleHe: 'פתח אליהו', titleFr: 'Patah Eliahou' },
        { id: 'shach_3', titleHe: 'עטיפת טלית והנחת תפילין', titleFr: 'Mise du Talit et Téphilines' },
        { id: 'shach_4', titleHe: 'קדש לי כל בכור', titleFr: 'Kadech Li Kol Bekhor' },
        { id: 'shach_5', titleHe: 'תפילת השחר', titleFr: 'Prière du matin' },
        { id: 'shach_6', titleHe: 'הודו', titleFr: 'Cantique-Odou' },
        { id: 'shach_7', titleHe: 'ברוך שאמר / פסוקי דזמרה', titleFr: 'Baroukh Céamar / Psouké dé zimra' },
        { id: 'shach_8', titleHe: 'ברכות קריאת שמע', titleFr: 'Les bénédictions du Chéma' },
        { id: 'shach_9', titleHe: 'עמידה', titleFr: 'Amida' },
        { id: 'shach_10', titleHe: 'תחנונים', titleFr: 'Supplications/Tahanounim' },
        { id: 'shach_11', titleHe: 'מזמור של יום', titleFr: 'Psaume du jour' },
        { id: 'shach_12', titleHe: 'קטורת הסמים', titleFr: 'Ketoret' },
        { id: 'shach_13', titleHe: 'עלינו לשבח', titleFr: "Alénou Léchabéa'h" },
      ]
    },
    {
      id: 'mincha',
      titleHe: 'מנחה',
      titleFr: 'Mincha',
      emoji: '☀️',
      timeOfDay: 'mincha',
      subCategories: [
        { id: 'min_1', titleHe: 'קטורת', titleFr: 'Ketoret' },
        { id: 'min_2', titleHe: 'אשרי', titleFr: 'Achré' },
        { id: 'min_3', titleHe: 'קדיש', titleFr: 'Kadich' },
        { id: 'min_4', titleHe: 'עמידה', titleFr: 'Amida' },
        { id: 'min_5', titleHe: 'תחנונים', titleFr: 'Supplications' },
        { id: 'min_6', titleHe: 'עלינו לשבח', titleFr: "Alénou Léchabéa'h" },
        { id: 'min_7', titleHe: 'קדיש', titleFr: 'Kadich' },
      ]
    },
    {
      id: 'arvit',
      titleHe: 'ערבית',
      titleFr: 'Arvit',
      emoji: '🌙',
      timeOfDay: 'arvit',
      subCategories: [
        { id: 'arv_1', titleHe: 'לשם יחוד', titleFr: 'Lechem Yihoud' },
        { id: 'arv_2', titleHe: 'קדיש', titleFr: 'Kadich' },
        { id: 'arv_3', titleHe: 'ברכות קריאת שמע', titleFr: 'Bénédiction du Chéma' },
        { id: 'arv_4', titleHe: 'עמידה', titleFr: 'Amida' },
        { id: 'arv_5', titleHe: 'מזמור', titleFr: 'Psaume' },
        { id: 'arv_6', titleHe: 'עלינו לשבח', titleFr: "Alénou Léchabéa'h" },
      ]
    },
  ];
};
