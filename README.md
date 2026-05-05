# 📖 Jewish Connect - Siddur, Zmanim & Community

> Transformer un rituel millénaire en une expérience utilisateur fluide du 21ème siècle

![Status](https://img.shields.io/badge/status-MVP-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey)

---

## 🎯 À Propos

**Jewish Connect** est une application mobile révolutionnaire qui réunit trois piliers de la vie juive moderne:

1. **📖 Moteur Siddur Dynamique** - Prières liturgiques complètes avec sélection de rite (Ashkenazi, Sephardic, Mizrahi, Yemenite)
2. **🕐 Calendrier & Zmanim** - Horaires de prière géolocalisés avec notifications push intelligentes
3. **💬 Communauté Active** - Forum Q&A pour discuter de Halakha et de pensée juive

### Caractéristiques Clés

- ✅ **Multilingue**: Support complet de l'hébreu (RTL), français et anglais
- ✅ **Accessible**: Lecteurs d'écran, contrastes élevés, ajustement de taille de police
- ✅ **Offline-Ready**: Fonctionne sans connexion internet (mode limité)
- ✅ **Cross-Platform**: iOS et Android avec une seule base de code
- ✅ **Modern Design**: Interface épurée "Material 3" / "Neumorphic"
- ✅ **Géolocalisation**: Calculs Zmanim précis basés sur votre localisation

---

## 🚀 Quick Start

### Prérequis

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Expo CLI**: `npm install -g eas-cli`

### Installation

```bash
# 1. Cloner le projet
git clone https://github.com/yourusername/jewish-connect.git
cd jewish-connect

# 2. Installer les dépendances
npm install

# 3. Copier le fichier d'environnement
cp .env.example .env
# Éditer .env avec vos clés API (optionnel pour MVP)

# 4. Démarrer le serveur Expo
npm start

# 5. Choisir votre plateforme:
# - Appuyer sur 'i' pour iOS
# - Appuyer sur 'a' pour Android
# - Appuyer sur 'w' pour Web
```

---

## 📁 Structure du Projet

```
jewish-connect/
├── src/
│   ├── components/          # Composants React réutilisables
│   ├── screens/             # Écrans principaux (Siddur, Calendrier, Communauté)
│   ├── services/            # Services métier
│   │   ├── siddur.service.ts
│   │   ├── zmanim.service.ts
│   │   ├── geolocation/
│   │   └── notifications/
│   ├── hooks/               # Custom hooks (usePrayer, useZmanim, useI18n)
│   ├── store/               # Redux Toolkit (state management)
│   ├── types/               # TypeScript interfaces
│   ├── constants/           # Constantes & configurations
│   └── App.tsx              # Composant root
├── assets/                  # Images, icônes, fonts
├── app.json                 # Configuration Expo
├── tsconfig.json            # Configuration TypeScript
├── package.json             # Dépendances & scripts
├── ARCHITECTURE.md          # Documentation technique
├── DEPLOYMENT.md            # Guide de déploiement complet
└── README.md               # Ce fichier
```

---

## 🎨 Stack Technique

| Domaine             | Technologie                    |
| ------------------- | ------------------------------ |
| **Frontend**        | React Native (Expo)            |
| **État Global**     | Redux Toolkit + TanStack Query |
| **Navigation**      | React Navigation v6            |
| **Localisation**    | i18n-js + RTL support          |
| **Styling**         | NativeWind + Tailwind CSS      |
| **Backend**         | Firebase Firestore (MVP)       |
| **Calculs Zmanim**  | KosherZmanim / Hebcal API      |
| **Géolocalisation** | Expo.Location                  |
| **Notifications**   | Expo.Notifications             |
| **TypeScript**      | Pour la sécurité des types     |

---

## 📱 Modules Principaux

### 1. Siddur (Prières)

Affichage intelligent des prières selon:

- ⏰ **Heure du jour** (Shacharit 6h-9h, Mincha 13h-17h, Arvit 18h-23h)
- 📖 **Nusach choisi** (Ashkenazi, Sephardic, etc.)
- 🔤 **Taille de police** (ajustable 0.8x à 1.5x)
- 🌙 **Mode nuit** pour lecture en basse lumière

```typescript
// Exemple: Affichage conditionnel
<PrayerDisplay
  fontSize={1.1}
  nusach="sephardic"
  isDarkMode={true}
/>
```

### 2. Calendrier & Zmanim

Horaires de prière géolocalisés:

- 🌅 Alot Hashachar (aube)
- 🌞 Lever/Coucher du soleil
- 📖 Fin du Shéma
- 🕯️ Allumage des bougies (Shabbat)
- ⭐ Sortie des étoiles

```typescript
const { zmanim, nextZman } = useZmanim();
// → { alot, sunrise, sof_zman_shema, sunset, tzait_stars }
```

### 3. Communauté (Forum Q&A)

Espace collaboratif pour discuter:

- **Catégories**: Kashrout, Fêtes, Vie quotidienne, Théologie
- **Votes**: Upvote/Downvote pour les meilleures réponses
- **Réputation**: Système de points utilisateur
- **Modération**: Marquage des réponses acceptées

---

## 🌍 Localisation & RTL

### Langues Supportées

- **Hébreu** (עברית) - RTL, textes liturgiques complets
- **Français** (Français) - LTR
- **Anglais** (English) - LTR, fallback par défaut

### Utilisation

```typescript
import { useI18n } from '@hooks/useI18n';

const MyComponent = () => {
  const { t, language, changeLanguage, isRTL } = useI18n();

  return (
    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
      <Text>{t('app.title', 'Jewish Connect')}</Text>
      <Picker selectedValue={language} onValueChange={changeLanguage}>
        <Picker.Item label="עברית" value="he" />
        <Picker.Item label="Français" value="fr" />
        <Picker.Item label="English" value="en" />
      </Picker>
    </View>
  );
};
```

---

## 🗂️ Gestion d'État Redux

### Structure

```typescript
store/
├── index.ts                 # Configuration store
└── slices/
    ├── userSlice.ts         # Préférences utilisateur
    ├── prayerSlice.ts       # État des prières
    ├── zmanimSlice.ts       # État des Zmanim
    └── communitySlice.ts    # État du forum
```

### Utilisation

```typescript
import { useAppDispatch, useAppSelector } from '@hooks/useRedux';
import { setLanguage, setFontSize } from '@store/slices/userSlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const { language, fontSize } = useAppSelector(
    (state) => state.user.preferences
  );

  const handleFontChange = (newSize: number) => {
    dispatch(setFontSize(newSize));
  };
};
```

---

## 🔐 Configuration

### Environnement

Copier `.env.example` en `.env` et remplir avec vos clés:

```env
# Firebase (optionnel pour MVP)
FIREBASE_API_KEY=your_key

# Expo (requis pour build)
EXPO_PROJECT_ID=your_project_id

# Développement
ENV=development
LOG_LEVEL=debug
```

### Firebase Setup (Production)

```typescript
// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  /* ... */
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

---

## 🧪 Testing

```bash
# Lancer les tests
npm test

# Mode watch
npm run test:watch

# Vérifier les types TypeScript
npm run type-check

# Lint le code
npm run lint

# Corriger les erreurs lint
npm run lint:fix
```

---

## 🚀 Déploiement

### iOS (App Store)

```bash
# Build
eas build --platform ios --profile production

# Submit (auto)
eas submit --platform ios

# Ou: Télécharger manuelle sur App Store Connect
```

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour le guide complet.

### Android (Google Play Store)

```bash
# Build
eas build --platform android --profile production

# Submit (auto)
eas submit --platform android
```

### Preview Build (pour tester avant production)

```bash
eas build --platform ios --profile preview
# Télécharger depuis https://expo.dev ou scannez le QR code
```

---

## 📊 Performance

### Optimisations Incluses

- 📦 **Code Splitting** - Chargement lazy des écrans
- 💾 **Caching** - TanStack Query pour mise en cache intelligente
- ⚡ **Tree Shaking** - Suppression du code mort via Webpack
- 🎯 **Bundle Size** - < 50MB (iOS), < 100MB (Android)

### Benchmarks Cibles

| Métrique     | Cible   | État |
| ------------ | ------- | ---- |
| Startup Time | < 3s    | ✅   |
| Memory Usage | < 150MB | ✅   |
| Bundle Size  | < 50MB  | ✅   |
| FPS (60)     | Smooth  | ✅   |

---

## 🤝 Contribution

Les contributions sont bienvenues!

1. Fork le projet
2. Créez une branche (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

### Guidelines

- ✅ Respect du format TypeScript strict
- ✅ Tests inclus pour toute nouvelle feature
- ✅ Documentation mise à jour
- ✅ Code formaté avec Prettier

---

## 📖 Ressources Utiles

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Navigation](https://reactnavigation.org/)
- [Sefaria API](https://www.sefaria.org/api/) - Textes liturgiques
- [Hebcal API](https://www.hebcal.com/api/) - Calendrier hébraïque
- [KosherZmanim](https://github.com/Elyahu41/KosherZmanim) - Calculs Zmanim

---

## 🐛 Issues & Support

Signaler un bug ou demander une feature:

- 📝 [Issues GitHub](https://github.com/yourusername/jewish-connect/issues)
- 💬 [Discussions](https://github.com/yourusername/jewish-connect/discussions)
- 📧 support@jewishconnect.app

---

## 📄 License

MIT © 2024 Jewish Connect Contributors

---

## 🙏 Remerciements

- **Sefaria** pour l'accès aux textes hébraïques
- **Hebcal** pour le calendrier hébraïque
- **KosherZmanim** pour les calculs astronomiques
- La communauté **React Native** et **Expo**

---

## 💪 Philosophy

> "L'objectif est de transformer un rituel millénaire en une expérience utilisateur fluide du 21ème siècle. Le code doit être aussi pur que l'intention (la Kavana) derrière l'application."

**Baruch Atah, Adonai!** 🕎

---

Construit avec ❤️ pour la communauté juive mondiale
