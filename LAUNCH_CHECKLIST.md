# 🚀 Checklist de Lancement - Jewish Connect

Utiliser cette checklist avant de soumettre l'application aux App Stores.

## 📋 Pré-Développement

- [ ] Architecture validée par l'équipe
- [ ] Figma/Design System complet
- [ ] API Contracts définies (Firebase, Sefaria, Hebcal)
- [ ] Plan de test établi

---

## 🛠️ Développement

### Fonctionnalités Siddur

- [ ] Chargement des prières depuis API/JSON
- [ ] Affichage conditionnel par heure (Shacharit/Mincha/Arvit)
- [ ] Sélecteur de Nusach (Ashkenazi, Sephardic, Mizrahi, Yemenite)
- [ ] Ajustement taille police (0.8x → 1.5x)
- [ ] Mode nuit (dark mode)
- [ ] Traductions (HE/FR/EN)
- [ ] RTL complet pour l'hébreu

### Fonctionnalités Zmanim

- [ ] Intégration géolocalisation (Expo.Location)
- [ ] Calculs Zmanim (KosherZmanim / Hebcal API)
- [ ] Affichage horaires prière
- [ ] Notifications programmées pour Zmanim
- [ ] Détection Shabbat
- [ ] Calculs heures allumage bougies/Havdalah
- [ ] Fuseau horaire automatique

### Fonctionnalités Communauté

- [ ] Page listing questions
- [ ] Création question
- [ ] Système de réponses
- [ ] Votes (upvote/downvote)
- [ ] Filtre par catégorie
- [ ] Recherche questions
- [ ] Système de réputation
- [ ] Modération

### Navigation & UX

- [ ] Tab bar (Siddur / Calendrier / Communauté)
- [ ] Navigation fluide
- [ ] Back button handling
- [ ] Deep linking (optionnel)

---

## 🧪 Qualité & Testing

### Code Quality

- [ ] Pas d'erreurs TypeScript (`npm run type-check`)
- [ ] Pas d'erreurs ESLint (`npm run lint`)
- [ ] Pas de console.error/warnings
- [ ] Code formaté avec Prettier

### Tests

- [ ] Tests unitaires pour hooks (`npm test`)
- [ ] Tests d'intégration pour écrans
- [ ] Coverage > 50%
- [ ] Pas de erreurs de test

### Performance

- [ ] Bundle size < 50MB (iOS), < 100MB (Android)
- [ ] Startup time < 3s
- [ ] Pas de memory leaks
- [ ] Images optimisées

### Accessibilité

- [ ] Support lecteurs d'écran (iOS VoiceOver, Android TalkBack)
- [ ] Contraste des couleurs WCAG AA minimum
- [ ] Textes alt pour images
- [ ] Tailles touch targets >= 44x44 points

---

## 📱 Configuration App Stores

### iOS (App Store)

- [ ] Apple Developer Account créé
- [ ] Bundle ID unique: `com.jewishconnect.app`
- [ ] App ID créé sur Apple Developer Portal
- [ ] Certificate de signature généré
- [ ] Provisioning profiles créés
- [ ] Screenshots 5.5" (6) et 6.5" (5)
- [ ] App Icon 1024x1024 (sans transparence)
- [ ] Privacy Policy URL valide
- [ ] Description app rédigée (en, he, fr)
- [ ] Catégorie sélectionnée (Lifestyle)
- [ ] Politique de confidentialité acceptée

### Android (Google Play)

- [ ] Google Developer Account créé
- [ ] Package Name unique: `com.jewishconnect.app`
- [ ] Keystore créé et configuré
- [ ] Screenshots (1280x720) pour tous les devices
- [ ] Feature graphic (1024x500)
- [ ] Icon (512x512, PNG)
- [ ] Privacy Policy URL valide
- [ ] Description app rédigée
- [ ] Catégorie sélectionnée (Lifestyle)
- [ ] Content Rating questionnaire rempli

---

## 🔒 Sécurité & Privacy

- [ ] Aucune clé API hardcodée en code
- [ ] Variables d'environnement utilisées (.env)
- [ ] HTTPS enforced pour API calls
- [ ] Secure Storage pour tokens/données sensibles
- [ ] Privacy Policy rédigée et acceptée
- [ ] Terms of Service rédigés
- [ ] Permissions expliquées à l'utilisateur
- [ ] Pas de tracking sans consentement
- [ ] GDPR compliant (delete user data, export, etc.)

---

## 🌍 Localisation

- [ ] Hébreu (RTL) - Interface 100%
- [ ] Français - Interface 100%
- [ ] Anglais - Interface 100% (fallback)
- [ ] Textes liturgiques en hébreu
- [ ] Pas de textes en dur (tous traduits)
- [ ] Formatage dates/heures selon locale

---

## 📊 Analytics & Monitoring

- [ ] Firebase Analytics intégré
- [ ] Sentry pour crash reporting
- [ ] Events principaux trackés
  - [ ] App opened
  - [ ] Service viewed (shacharit/mincha/arvit)
  - [ ] Location requested
  - [ ] Question posted
  - [ ] Answer posted

---

## 📦 Build & Deployment

### Pré-Build

- [ ] `npm run lint` ✅
- [ ] `npm run type-check` ✅
- [ ] `npm test` ✅
- [ ] Toutes les dépendances à jour
- [ ] Build local testé

### EAS Build

- [ ] eas.json configuré correctement
- [ ] app.json avec bonnes versions/ids
- [ ] Build profiles (preview/production)

### iOS Build

```bash
eas build --platform ios --profile production
```

- [ ] Build successful
- [ ] IPA généré
- [ ] Testflight build créé

### Android Build

```bash
eas build --platform android --profile production
```

- [ ] Build successful
- [ ] AAB généré
- [ ] Internal testing build créé

---

## 🧪 Testing Stores

### Testflight (iOS)

- [ ] Build soumis à Testflight
- [ ] Testeurs internes invités
- [ ] 24h d'attente pour traitement
- [ ] Testeurs externes invités
- [ ] Pas d'erreurs/crashes en testing

### Google Play Internal Testing

- [ ] Build soumis
- [ ] Internal testers invités
- [ ] Testé sur multiple devices/versions Android
- [ ] Pas d'erreurs/crashes

### Manual Testing Checklist

- [ ] [ ] App se lance sans erreur
- [ ] [ ] Splash screen affichée correctement
- [ ] [ ] Permissions demandées (location, notifications)
- [ ] [ ] Tab bar fonctionne
- [ ] [ ] Siddur charge et affiche les prières
- [ ] [ ] Heure affichée correctement
- [ ] [ ] Nuit/jour détecté
- [ ] [ ] RTL appliqué pour hébreu
- [ ] [ ] Zoom font fonctionne
- [ ] [ ] Dark mode toggle fonctionne
- [ ] [ ] Calendrier affiche Zmanim
- [ ] [ ] Location demandée et utilisée
- [ ] [ ] Notifications programmées
- [ ] [ ] Communauté affiche les questions
- [ ] [ ] Recherche fonctionne
- [ ] [ ] Filtres catégorie fonctionnent
- [ ] [ ] Votes fonctionnent
- [ ] [ ] Pas de crash on rotate
- [ ] [ ] Pas de crash on return from background

---

## 🎉 Production Release

### Final Checks

- [ ] Toutes les checklist précédentes ✅
- [ ] Numéro de version incrementé (v0.1.0 → v0.2.0)
- [ ] Release Notes rédigées
- [ ] Changelog mis à jour
- [ ] Documentation mise à jour

### App Store Submission

**iOS**

```bash
eas submit --platform ios --profile production
```

- [ ] Soumission réussie
- [ ] Attendre approx. 1-3 jours
- [ ] Vérifier email Apple pour statut

**Android**

```bash
eas submit --platform android --profile production
```

- [ ] Soumission réussie
- [ ] Attendre approx. 2-4 heures
- [ ] App publiée sur Google Play

### Post-Release

- [ ] Monitoring des erreurs (Sentry)
- [ ] Analytics des utilisateurs
- [ ] Reviews clients surveillées
- [ ] Bug fixes en attente pour v0.2.0

---

## 📈 Métriques de Succès

- [ ] > 1,000 téléchargements (première semaine)
- [ ] Rating > 4.0/5 stars (50+ avis)
- [ ] < 1% crash rate
- [ ] Daily Active Users > 100
- [ ] Engagement > 50% MAU

---

## 🔄 Versionning & Releases

### Versioning Scheme: MAJOR.MINOR.PATCH

- **0.1.0** - MVP avec Siddur basique
- **0.2.0** - Ajout tous les nusach
- **1.0.0** - Version stable production-ready

### Release Schedule

- [ ] v0.1.0 - Release MVP
- [ ] v0.2.0 - Planifié pour 4 semaines après MVP
- [ ] v1.0.0 - Planifié pour 12 semaines après MVP

---

## 📞 Support Post-Launch

- [ ] Email support configuré
- [ ] FAQ rédigée
- [ ] Système de bug reporting
- [ ] Community Discord/Slack (optionnel)

---

## ✅ Sign Off

- [ ] Product Owner: ********\_******** Date: **\_\_\_**
- [ ] Tech Lead: ********\_******** Date: **\_\_\_**
- [ ] QA Lead: ********\_******** Date: **\_\_\_**

---

**Status**: 🟡 In Progress  
**Last Updated**: 2024-05-04  
**Next Milestone**: v0.1.0 MVP Release

Baruch Atah, Adonai! 🕎
