# 🧪 Jewish Connect - Guide de Test Complet

Guide étape-par-étape pour installer, configurer et tester l'application localement.

---

## 🚀 Phase 1: Setup Initial (5-10 minutes)

### Étape 1.1: Prérequis Système

Vérifiez que vous avez:

```bash
# Node.js >= 18.x
node --version
# → v18.x.x ou plus

# npm >= 9.x
npm --version
# → 9.x.x ou plus

# Xcode (macOS) - pour iOS
xcode-select --install

# Android Studio (optionnel, pour Android)
# Télécharger depuis https://developer.android.com/studio
```

### Étape 1.2: Installation des Dépendances

```bash
# Aller au répertoire du projet
cd /Users/noam/Documents/Jewishapp

# Installer les dépendances
npm install

# ⏳ Attendre 2-3 minutes pour installation complète
```

**Si des erreurs surviennent:**
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Étape 1.3: Configurer les Variables d'Environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Ouvrir avec votre éditeur
code .env
# ou
nano .env
```

**Contenu minimal pour tester (sans fonctionnalités avancées):**
```env
ENV=development
LOG_LEVEL=debug
ENABLE_COMMUNITY=true
ENABLE_NOTIFICATIONS=true
```

Pour Firebase (optionnel pour MVP):
```env
# Si vous avez un projet Firebase
FIREBASE_API_KEY=votre_clé
FIREBASE_AUTH_DOMAIN=votre_projet.firebaseapp.com
FIREBASE_PROJECT_ID=votre_projet_id
# ... autres clés Firebase
```

---

## 🎯 Phase 2: Lancer l'Application (2 minutes)

### Étape 2.1: Démarrer le Serveur Expo

```bash
# Depuis le répertoire /Users/noam/Documents/Jewishapp
npm start
```

**Résultat attendu:**
```
LAN:  exp://192.168.1.x:19000
Tunnel: https://...exp.direct
```

### Étape 2.2: Choisir la Plateforme de Test

**Option A: Web (Plus Rapide - 30 secondes)**
```
Appuyer sur 'w' dans le terminal
→ L'app s'ouvre automatiquement dans votre navigateur
```

**Option B: iOS (macOS seulement)**
```
Appuyer sur 'i' dans le terminal
→ Xcode va compiler (2-3 minutes)
→ L'app se lance sur le simulateur
```

**Option C: Android**
```
Appuyer sur 'a' dans le terminal
→ Android Emulator doit être running
→ L'app se lance sur l'émulateur
```

### Étape 2.3: Scanner avec Téléphone (recommandé)

**Alternative Plus Rapide (vraie expérience utilisateur):**

```
1. Installez l'app "Expo Go" sur votre téléphone
   - iOS: App Store
   - Android: Google Play Store

2. Dans le terminal, appuyez sur 'j'
   → Un QR code s'affiche

3. Scannez le QR code avec votre téléphone
   → L'app charge sur votre vrai device (3-5 secondes)
```

---

## ✅ Phase 3: Tester les Fonctionnalités

### 3.1: Tester l'Écran Siddur (Prières)

```
1. L'app s'ouvre sur l'écran Siddur
2. Vérifier:
   ☐ Tab bar visible en bas (📖 Siddur, 📅 Calendrier, 💬 Communauté)
   ☐ En-tête "Siddur - Prière" affiché
   ☐ Sélecteur de Rite visible (Ashkenazi, Sephardic, etc.)
   ☐ Boutons RTL/LTR en haut (si vous switcheZ les langues)
   
3. Cliquer sur les sélecteurs:
   ☐ Ashkenazi, Sephardic, Mizrahi, Yemenite
   ☐ Chaque changement recharge les prières
```

### 3.2: Tester l'Écran Calendrier

```
1. Appuyer sur "📅 Calendrier" en bas
2. Vérifier:
   ☐ Titre "Calendrier" affiché
   ☐ Section "📍 Localisation" visible
   ☐ Section "🕐 Zmanim du jour" avec horaires:
     - Lever du soleil
     - Fin du Shéma
     - Coucher du soleil
     - Sortie des étoiles
   ☐ Message "Prochainement" pour les fêtes
```

**Note**: Les Zmanim affichent des valeurs de test. Pour vraies données, connecter l'API Hebcal.

### 3.3: Tester l'Écran Communauté

```
1. Appuyer sur "💬 Communauté" en bas
2. Vérifier:
   ☐ Titre "Communauté" affiché
   ☐ Barre de recherche visible
   ☐ Filtres par catégorie (Kashrout, Fêtes, etc.)
   ☐ Message "Aucune question trouvée"
   ☐ Bouton FAB (+) en bas à droite
```

### 3.4: Tester la Localisation & Accessibilité

```
1. Vérifier mode sombre:
   ☐ Sur iOS: Settings → Display → Dark Mode
   ☐ Sur Android: Settings → Display → Dark Mode
   ☐ L'app change de thème immédiatement

2. Tester le zoom (sur device réel):
   ☐ Pinch pour zoomer
   ☐ Les textes doivent rester lisibles

3. Tester RTL (si vous changez la langue):
   ☐ Le texte hébreu doit s'afficher RTL
   ☐ Les boutons doivent s'aligner correctement
```

### 3.5: Tester les Hooks & State

```bash
# Dans un autre terminal, vérifier les logs
npm run lint

# Vérifier la compilation TypeScript
npm run type-check

# Lancer les tests (optionnel)
npm test
```

---

## 🔧 Phase 4: Debugging & Troubleshooting

### Problème: "Module not found"

```bash
# Nettoyer et réinstaller
rm -rf node_modules .expo
npm install

# Redémarrer Expo
npm start
```

### Problème: "Cannot find bundle"

```bash
# Nettoyer le cache
npm start --clear

# Ou avec Expo CLI
expo start --clear
```

### Problème: Port 19000 déjà utilisé

```bash
# Trouver le processus
lsof -i :19000

# Tuer le processus
kill -9 <PID>

# Redémarrer
npm start
```

### Problème: iOS Simulator ne se lance pas

```bash
# Vérifier Xcode
xcode-select --install

# Lancer le simulateur manuellement
open -a Simulator

# Puis dans Expo:
npm start
i
```

### Problème: "Expo not installed"

```bash
# Installer Expo CLI globalement
npm install -g expo-cli

# Ou utiliser npx
npx expo start
```

---

## 📊 Phase 5: Tests Détaillés par Fonctionnalité

### Test 1: Affichage Conditionnel des Prières

```
Objectif: Vérifier que le service change selon l'heure

1. Noter l'heure actuelle: 14:30 (exemple)
2. Vérifier que "Mincha" est affiché
3. Modifier l'heure système:
   ☐ Mettre à 7:00 (matin)
   ☐ L'app devrait passer à "Shacharit"
   ☐ Mettre à 20:00 (soir)
   ☐ L'app devrait passer à "Arvit"
```

### Test 2: Taille de Police

```
Objectif: Vérifier l'ajustement de la taille

1. Sur l'écran Siddur
2. Chercher les options de taille (à implémenter dans Settings)
3. Tester avec 0.8x, 1.0x, 1.5x
4. Les textes devraient s'adapter
```

### Test 3: Mode Nuit

```
Objectif: Vérifier que le mode nuit fonctionne

1. Aller dans Settings (si implémenté)
2. Activer/Désactiver Dark Mode
3. Toute l'interface doit changer de couleur
4. Les contrastes doivent rester bons
```

### Test 4: RTL / LTR

```
Objectif: Vérifier le support multi-langue

1. Chercher l'option Language (à implémenter)
2. Changer en Hébreu (he)
3. Les textes doivent s'afficher RTL
4. Les boutons doivent s'aligner à droite
5. Changer en Français/Anglais
6. Vérifier LTR (left-to-right)
```

### Test 5: Navigation

```
Objectif: Vérifier que la navigation fonctionne

1. Cliquer sur "📖 Siddur" → Affiche SiddurScreen ✓
2. Cliquer sur "📅 Calendrier" → Affiche CalendarScreen ✓
3. Cliquer sur "💬 Communauté" → Affiche CommunityScreen ✓
4. Revenir en arrière → Tab bar doit rester visible
```

---

## 🎬 Phase 6: Tests avec Données Réelles

### Étape 6.1: Ajouter des Prières de Test

Éditer `src/services/siddur.service.ts`:

```typescript
// Ajouter quelques prières de test
const PRAYERS_DATABASE: Record<ServiceType, Record<Nusach, Prayer[]>> = {
  shacharit: {
    ashkenazi: [
      {
        id: 'modeh-ani',
        title: 'Modeh Ani',
        titleHe: 'מודה אני',
        content: 'I am grateful...',
        contentHe: 'מודה אני לפניך...',
        serviceType: 'shacharit',
        nusach: 'ashkenazi',
      },
      // Ajouter plus...
    ],
    // ...
  },
  // ...
};
```

Puis tester:
```bash
npm start
w
# L'app doit afficher les prières
```

### Étape 6.2: Connecter Hebcal API (optionnel)

Éditer `.env`:
```env
HEBCAL_API_URL=https://www.hebcal.com/api/
```

Puis utiliser dans `zmanim.service.ts`:
```typescript
// Intégrer l'API réelle pour les calculs Zmanim
```

---

## 🚦 Phase 7: Checklist de Test

Cocher chaque case après vérification:

### Installation & Setup
- [ ] Node.js >= 18.x installé
- [ ] npm install réussi (pas d'erreurs)
- [ ] .env configuré
- [ ] npm start fonctionne

### Écrans
- [ ] Siddur Screen affiche correctement
- [ ] Calendrier Screen affiche correctement
- [ ] Communauté Screen affiche correctement
- [ ] Tab bar fonctionne
- [ ] Navigation fluide entre écrans

### Fonctionnalités
- [ ] Affichage conditionnel des prières
- [ ] Sélecteur Nusach fonctionne
- [ ] Dark mode toggle fonctionne
- [ ] Zmanim s'affichent
- [ ] Search/filters communauté fonctionnent

### Localisation
- [ ] Hébreu (RTL) s'affiche correctement
- [ ] Français (LTR) s'affiche correctement
- [ ] Anglais (fallback) fonctionne

### Performance
- [ ] App se lance en < 3 secondes
- [ ] Pas de lag lors du scroll
- [ ] Pas de memory leaks
- [ ] Interface reste réactive

### Accessibility
- [ ] Lecteur d'écran détecte le contenu
- [ ] Contraste suffisant (WCAG AA)
- [ ] Touch targets >= 44x44
- [ ] Textes clairs et lisibles

---

## 📱 Phase 8: Tester sur Device Réel

### Pour iPhone/iPad

```bash
# 1. Installer Expo Go depuis App Store
# 2. Dans le terminal, appuyer sur 'j'
# 3. Scannez le QR code
# 4. L'app charge sur votre device

# L'app fonctionne exactement comme sur simulator
# Vous pouvez tester:
# - Géolocalisation réelle
# - Notifications push
# - Caméra (si ajoutée)
# - Microphone (si ajouté)
```

### Pour Android

```bash
# 1. Installer Expo Go depuis Google Play Store
# 2. Même processus que iOS
# 3. Scannez le QR code
```

### Tester Permissions (Device Réel)

```bash
# Quand l'app demande les permissions:
# ☐ Location - Accepter (pour Zmanim)
# ☐ Notifications - Accepter
# ☐ Camera/Microphone - Selon features

# L'app doit respecter les réponses
```

---

## 🎯 Résumé: Commandes Essentielles

```bash
# Installation
npm install

# Développement
npm start              # Démarrer Expo
npm run lint          # Vérifier le code
npm run type-check    # Vérifier TypeScript
npm test              # Lancer les tests

# Build (pour plus tard)
eas build --platform ios
eas build --platform android

# Nettoyage
npm start --clear     # Clear cache
rm -rf node_modules   # Réinstaller complet
```

---

## 🆘 Support & Ressources

- **Expo Docs**: https://docs.expo.dev/
- **React Native Docs**: https://reactnative.dev/
- **Issue GitHub**: Créer une issue avec logs
- **Documentation interne**: Voir `ARCHITECTURE.md`

---

## ✅ Prochaines Étapes Après Test

1. ✅ Tests réussis
2. → Connecter base de données réelle (Firebase/API)
3. → Ajouter plus de prières
4. → Intégrer Sefaria API
5. → Tester en production
6. → Soumettre aux stores

---

**Bon testing!** 🎉

Pour des questions: Consultez `README.md` ou `ARCHITECTURE.md`
