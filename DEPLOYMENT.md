# 📦 Jewish Connect - Guide de Déploiement Détaillé

## 🎯 Prérequis

### Systèmes & Outils

- **macOS** (pour build iOS) ou **Linux**
- **Node.js** >= 18.x
- **npm** >= 9.x ou **yarn**
- **Xcode** >= 14 (pour iOS)
- **Android Studio** (pour Android)
- **Expo CLI** et **EAS CLI**

### Comptes Requis

- **Expo Account** (https://expo.dev)
- **Apple Developer Account** ($99/an)
- **Google Developer Account** ($25 one-time)
- **Firebase Project** (gratuit)

---

## 🚀 Phase 1: Setup Initial

### 1.1 Installation Locale

```bash
# Cloner le projet
git clone <repo-url>
cd jewish-connect

# Installer les dépendances
npm install

# Installer EAS CLI globalement
npm install -g eas-cli

# Se connecter à Expo
eas login

# Initialiser EAS (créer un projet Expo)
eas init
```

### 1.2 Configuration d'Environnement

Créer un fichier `.env` à la racine:

```env
# Firebase
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Sefaria API (optionnel - gratuit)
SEFARIA_API_URL=https://www.sefaria.org/api/

# Hebcal API (optionnel - gratuit)
HEBCAL_API_URL=https://www.hebcal.com/api/

# Environnement
ENV=development
LOG_LEVEL=debug
```

Créer `src/config/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
```

### 1.3 Test Local

```bash
# Démarrer le serveur de développement
npm start

# Tester sur iOS (nécessite macOS)
npm run ios

# Tester sur Android
npm run android

# Tester sur web
npm run web
```

---

## 📱 Phase 2: Configuration des Stores (iOS & Android)

### 2.1 Configuration iOS (App Store)

#### Étape 1: Créer un App ID sur Developer.apple.com

```
1. Aller sur https://developer.apple.com/account/resources/identifiers/list
2. Cliquer sur "+"
3. Sélectionner "App IDs"
4. Remplir:
   - Name: "Jewish Connect"
   - Bundle ID: "com.jewishconnect.app"
   - Capabilities: Push Notifications, HomeKit (optionnel)
5. Confirmer
```

#### Étape 2: Créer un Certificate pour Signing

```bash
# Expo peut gérer cela automatiquement:
eas build --platform ios --auto-submit

# Ou manuellement:
# 1. Ouvrir Xcode
# 2. Accounts → Add Account → Sign in avec Apple ID
# 3. Xcode handle les certificates automatiquement
```

#### Étape 3: Créer un App sur App Store Connect

```
1. Aller sur https://appstoreconnect.apple.com
2. Cliquer sur "My Apps"
3. Cliquer sur "+"
4. Créer une nouvelle app:
   - Name: "Jewish Connect"
   - Bundle ID: "com.jewishconnect.app"
   - SKU: "jewishconnect-001"
5. Remplir les informations:
   - Description
   - Screenshots (en plusieurs langues)
   - Icon (1024x1024)
   - Catégorie: Lifestyle / Reference
6. Soumettre pour examen
```

### 2.2 Configuration Android (Google Play Store)

#### Étape 1: Créer un Keystore

```bash
# EAS génère cela automatiquement:
eas build --platform android

# Ou générer manuellement:
keytool -genkey -v -keystore jewish-connect.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias jewish-connect-key
```

#### Étape 2: Configurer eas.json

Ajouter à `eas.json`:

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk",
        "image": "latest"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccount": "path/to/service-account.json"
      }
    }
  }
}
```

#### Étape 3: Créer un App sur Google Play Console

```
1. Aller sur https://play.google.com/console
2. Créer une nouvelle application:
   - Name: "Jewish Connect"
   - Default language: Hébreu
3. Remplir les informations de l'app:
   - Description
   - Screenshots
   - Icon (512x512)
   - Catégorie: Lifestyle
4. Accepter les politiques de confidentialité
```

---

## 🏗️ Phase 3: Build & Déploiement

### 3.1 Configuration du Build

Éditer `eas.json`:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "preview": {
      "ios": {
        "image": "latest",
        "distribution": "internal"
      },
      "android": {
        "image": "latest",
        "buildType": "apk"
      }
    },
    "production": {
      "ios": {
        "image": "latest",
        "distribution": "app-store"
      },
      "android": {
        "image": "latest",
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-email@apple.com",
        "ascAppId": "1234567890"
      },
      "android": {
        "serviceAccountJson": "path/to/google-play-key.json"
      }
    }
  }
}
```

### 3.2 Building

```bash
# Preview Build (pour tester)
eas build --platform ios --profile preview
eas build --platform android --profile preview

# Production Build
eas build --platform ios --profile production
eas build --platform android --profile production
```

### 3.3 Submission Automatique

```bash
# Soumettre directement
eas submit --platform ios --profile production
eas submit --platform android --profile production

# Ou manuellement après export
eas build --platform ios --profile production
# Télécharger le .ipa dans App Store Connect manuellement
```

---

## 📊 Vérifications Pré-Déploiement

### Checklist Before Shipping

- [ ] **Code Quality**

  ```bash
  npm run lint
  npm run type-check
  npm test
  ```

- [ ] **Performance**
  - Bundle size < 50MB (iOS), < 100MB (Android)
  - Startup time < 3s
  - Memory usage < 150MB

- [ ] **Localisation**
  - [x] Hébreu complet avec RTL
  - [x] Français traduit
  - [x] Anglais comme fallback

- [ ] **Privacy & Security**
  - [x] HTTPS enforced
  - [x] No hardcoded credentials
  - [x] Privacy Policy publié
  - [x] Terms of Service

- [ ] **Permissions**
  - [x] Location request (optionnel mais important)
  - [x] Notifications request
  - [x] Privacy manifest

### Fichier Privacy Manifest (iOS)

Créer `ios/PrivacyInfo.xcprivacy`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSPrivacyTracking</key>
    <false/>
    <key>NSPrivacyTrackingDomains</key>
    <array/>
</dict>
</plist>
```

---

## 🔄 Post-Déploiement

### Monitoring

```bash
# Configurer Sentry pour crash reporting
npm install @sentry/react-native

# Configurer Firebase Analytics
# (Automatique via expo config)
```

### Updates Over-The-Air (OTA)

```bash
# Avec EAS Updates (payant)
eas update --platform ios
eas update --platform android

# Ou publier avec Expo:
eas publish
```

### Versioning

```json
{
  "version": "0.1.0",
  "buildVersion": "1"
}
```

Incrémenter à chaque release:

- Patch: 0.1.0 → 0.1.1
- Minor: 0.1.0 → 0.2.0
- Major: 0.1.0 → 1.0.0

---

## 🐛 Troubleshooting

### Build Fails sur iOS

```bash
# Nettoyer le cache
eas build --platform ios --clean

# Vérifier la version Xcode
xcode-select --install

# Vérifier les provisioning profiles
eas device:list
```

### Build Fails sur Android

```bash
# Vérifier gradle
./gradlew clean build

# Augmenter la mémoire heap
export GRADLE_OPTS="-Xmx1024m"
```

### Sumbmission Fails

```bash
# Vérifier les logs détaillés
eas build --logs

# Vérifier le bundle ID
grep "package\|bundleIdentifier" app.json

# Vérifier les icons & screenshots
identify assets/icon.png
identify assets/splash.png
```

---

## 📞 Support & Ressources

- **Expo Docs**: https://docs.expo.dev/
- **React Native**: https://reactnative.dev/
- **App Store Guide**: https://developer.apple.com/
- **Google Play Guide**: https://developer.android.com/

---

**Baruch Atah, Adonai!** 🕎

L'application est prête pour transformer les pratiques juives millénaires en expérience moderne.
