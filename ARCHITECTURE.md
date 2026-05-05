# 🚀 Jewish Connect - Architecture & Stratégie de Déploiement

## 📋 Vue d'ensemble

**Jewish Connect** est une application mobile cross-platform qui transforme les pratiques liturgiques juives en une expérience moderne et fluide. L'application intègre un moteur Siddur dynamique, un système de Zmanim géolocalisés, et un espace communautaire collaboratif.

---

## 🏗️ Architecture Technique

### Stack Principal

- **Frontend**: React Native (Expo) pour iOS/Android
- **État Global**: Redux Toolkit + TanStack Query (mise en cache)
- **Navigation**: React Navigation v6 (Tab Bar + Stack)
- **Services**: Modules dédiés (Zmanim, Siddur, Géolocalisation, Notifications)
- **Localisation**: Support complet RTL (Hébreu) + Multi-langue (FR, HE, EN)
- **Styling**: NativeWind + Tailwind CSS

### Structure des Dossiers

```
jewish-connect/
├── src/
│   ├── components/          # Composants React réutilisables
│   │   ├── PrayerDisplay.tsx    # Affichage principal des prières
│   │   ├── ZmanimCard.tsx       # Affichage des horaires
│   │   └── ...
│   ├── screens/             # Écrans principaux (Siddur, Calendrier, Communauté)
│   │   ├── SiddurScreen.tsx
│   │   ├── CalendarScreen.tsx
│   │   └── CommunityScreen.tsx
│   ├── services/            # Services métier (API, géolocalisation, notifications)
│   │   ├── siddur.service.ts
│   │   ├── zmanim.service.ts
│   │   ├── geolocation/
│   │   └── notifications/
│   ├── hooks/               # Custom hooks (usePrayer, useZmanim, useI18n, etc.)
│   ├── store/               # Redux Toolkit (slices, store config)
│   │   ├── slices/
│   │   │   ├── userSlice.ts
│   │   │   ├── prayerSlice.ts
│   │   │   ├── zmanimSlice.ts
│   │   │   └── communitySlice.ts
│   │   └── index.ts
│   ├── types/               # TypeScript interfaces & types
│   ├── constants/           # Constantes (couleurs, horaires, API endpoints)
│   ├── utils/               # Utilitaires (helpers, formatters)
│   ├── App.tsx              # Composant root + navigation
│   └── index.tsx            # Point d'entrée Expo
├── assets/                  # Images, icônes, polices
├── app.json                 # Configuration Expo
├── tsconfig.json            # Configuration TypeScript
├── package.json             # Dépendances NPM
└── README.md
```

---

## 🎯 Modules Principaux

### 1. **Moteur Siddur Dynamique**

#### Caractéristiques:

- ✅ Sélection de rite (Ashkenazi, Sephardic, Mizrahi, Yemenite)
- ✅ Ajustement de taille de police (0.8x à 1.5x)
- ✅ Mode nuit pour lecture en basse lumière
- ✅ Affichage intelligent selon le moment (Shacharit, Mincha, Arvit)
- ✅ Support complet RTL pour l'hébreu

#### Données:

- Source: JSON local (MVP) → Sefaria API (production)
- Cache: TanStack Query avec stratégie de mise en cache 24h
- Structure: Prières organisées par service et nusach

#### Composant Clé:

```typescript
// Affichage conditionnel selon l'heure
<PrayerDisplay>
  - Détecte l'heure actuelle
  - Charge le service approprié
  - Applique les préférences utilisateur (taille police, rite)
  - Affiche le prochain Zman important
```

### 2. **Calendrier & Zmanim**

#### Calculs Astronomiques:

- ✅ Integration avec **KosherZmanim** ou **Hebcal API**
- ✅ Géolocalisation en temps réel (Expo.Location)
- ✅ Calcul des heures limites des prières
- ✅ Horaires de Shabbat (allumage des bougies + Havdalah)
- ✅ Calendrier des fêtes juives annuelles

#### Notifications:

- Push notifications programmées pour les Zmanim critiques
- Rappels personnalisables (30min avant, à l'heure, etc.)
- Synchronisation avec le fuseau horaire de l'utilisateur

#### Service Clé:

```typescript
ZmanService:
  - getZmanim(date, location): ZmanDetails
  - getCurrentService(time): ServiceType
  - getNextZman(): { name, time }
  - isShabbat(date): boolean
  - getShabbatTimes(): { candles, havdalah }
```

### 3. **Module Communautaire (Q&A)**

#### Interface:

- Style moderne type "Stack Overflow" / "Reddit"
- Catégories: Kashrout, Fêtes, Vie quotidienne, Théologie
- Système de votes (upvote/downvote)
- Marquer les meilleures réponses

#### Backend Suggéré:

- **MVP**: Firebase Firestore (temps réel, facile)
- **Production**: Node.js/PostgreSQL (contrôle total)

#### Fonctionnalités:

- Poser des questions avec tags
- Répondre et commenter
- Système de réputation utilisateur
- Modération collaborative

---

## 🔄 Flux de Données avec Redux

```
┌─────────────────────────────────────────┐
│         Redux Store (Root)              │
├─────────────────────────────────────────┤
│ ├── userSlice                           │
│ │   ├── currentUser                     │
│ │   └── preferences (langue, nusach)    │
│ ├── prayerSlice                         │
│ │   ├── currentService                  │
│ │   ├── currentPrayers                  │
│ │   └── favorites                       │
│ ├── zmanimSlice                         │
│ │   ├── zmanim                          │
│ │   ├── userLocation                    │
│ │   └── holidays                        │
│ └── communitySlice                      │
│     ├── questions                       │
│     └── userReputation                  │
└─────────────────────────────────────────┘
        ↓
   Custom Hooks
   ├── usePrayer()         → charge les prières
   ├── useZmanim()         → gère la géolocalisation
   └── useI18n()           → gère la langue + RTL
        ↓
   Composants React Native
   ├── PrayerDisplay
   ├── SiddurScreen
   ├── CalendarScreen
   └── CommunityScreen
```

---

## 🌍 Support Multilingue & RTL

### Configuration:

```typescript
// hooks/useI18n.ts
i18n.locale = 'he' | 'fr' | 'en';
I18nManager.forceRTL(isRTL); // Pour hébreu automatiquement
```

### Traductions:

- Hébreu (RTL): Interface complète + textes liturgiques
- Français: Interface + traductions liturgiques
- Anglais: Fallback par défaut

### Optimisations RTL:

- Flexbox alignement automatique
- Text direction handling
- Mirror icons/images si nécessaire

---

## 📦 Stratégie de Déploiement

### Phase 1: Development

```bash
npm install
npm start                    # Expo dev server
expo android / expo ios      # Tester sur device/émulateur
```

### Phase 2: EAS Build (Expo Application Services)

#### Configuration Initial:

```bash
npm install -g eas-cli
eas init                     # Initialiser EAS
```

#### Build iOS:

```bash
eas build --platform ios --auto-submit
# Génère un fichier .ipa pour TestFlight
```

#### Build Android:

```bash
eas build --platform android
# Génère un fichier .aab pour Google Play Store
```

### Phase 3: Soumission aux Stores

#### App Store (iOS):

```bash
eas submit --platform ios
# Soumet automatiquement via eas
# Acceptation: 1-3 jours (Dieu merci!)
```

#### Google Play Store:

```bash
eas submit --platform android
# Soumet automatiquement via eas
# Acceptation: quelques heures à 1 jour
```

### Configuration Fichiers Clés:

**eas.json**:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "production": {
      "ios": {
        "image": "latest"
      },
      "android": {
        "image": "latest"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com"
      },
      "android": {
        "serviceAccount": "path/to/service-account.json"
      }
    }
  }
}
```

**app.json**:

```json
{
  "expo": {
    "name": "Jewish Connect",
    "slug": "jewish-connect",
    "version": "0.1.0",
    "ios": {
      "bundleIdentifier": "com.jewishconnect.app",
      "supportsRTL": true
    },
    "android": {
      "package": "com.jewishconnect.app",
      "supportsRTL": true
    }
  }
}
```

---

## 🔐 Considérations de Sécurité

- ✅ OAuth2 pour authentification (Firebase Auth)
- ✅ HTTPS obligatoire pour API calls
- ✅ Stockage sécurisé des tokens (Secure Store)
- ✅ Permissions appropriées (géolocalisation)
- ✅ Pas de données sensibles en local storage

---

## 📊 Métriques & Analytics

Intégration recommandée:

- Firebase Analytics
- Sentry pour bug tracking
- AppCenter pour distribution testflight

---

## 🎨 Design System

### Couleurs:

```
Primary: #1B5E87 (Bleu juif)
Secondary: #E8A537 (Or)
Accent: #C41E3A (Rouge)
```

### Typographie:

- Fonts: Roboto (EN/FR), David (HE)
- Tailles: 12px (petit) → 24px (titre)

### Composants:

- Material 3 inspired
- Neumorphic touches
- Accessibilité: WCAG 2.1 AA

---

## 🧪 Testing

```bash
# Unit tests
npm test

# Integration tests
npm run test:watch

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

---

## 📈 Roadmap MVP → Production

### MVP (v0.1):

- [x] Architecture de base
- [ ] Siddur avec 1 nusach
- [ ] Zmanim avec localisation
- [ ] Forum communautaire basique
- [ ] RTL & Multi-langue
- [ ] Build & deploy iOS/Android

### v1.0:

- [ ] Tous les nusach (4)
- [ ] API Sefaria intégrée
- [ ] Calendrier hébraïque complet
- [ ] Notifications Push avancées
- [ ] Synchronisation multi-device

### v2.0:

- [ ] Sync offline
- [ ] Mode social avancé (following, messages)
- [ ] Intégration avec services religieux locaux
- [ ] API public pour intégrateurs

---

## 🔗 Ressources Utiles

- 📖 **Sefaria API**: https://www.sefaria.org/api/
- 📅 **Hebcal API**: https://www.hebcal.com/api/
- 🕐 **KosherZmanim**: https://github.com/Elyahu41/KosherZmanim
- ⚛️ **React Native Docs**: https://reactnative.dev/
- 🚀 **Expo Docs**: https://docs.expo.dev/

---

## 💪 "L'objectif est de transformer un rituel millénaire en une expérience utilisateur fluide du 21ème siècle. Le code doit être aussi pur que l'intention (la Kavana) derrière l'application."

**Baruch Atah, Adonai!** 🕎
