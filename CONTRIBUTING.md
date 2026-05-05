# 🤝 Guide de Contribution - Jewish Connect

Merci de contribuer à **Jewish Connect**! Ce document explique comment contribuer de manière efficace et professionnelle.

## 📝 Code of Conduct

Nous nous engageons à une communauté accueillante et inclusive.

### Nos Valeurs

- 🤗 Respecter tous les contributeurs
- 📚 Valider avec sources historiques/halakhiques
- 💪 Priorité à la qualité et la maintenabilité
- 🕎 Respect du contexte culturel/religieux juif

Tout comportement disrespecteux sera traité sérieusement.

---

## 🚀 Getting Started

### 1. Fork & Clone

```bash
# Fork sur GitHub via l'interface web
# Puis cloner votre fork
git clone https://github.com/VOTRE_USERNAME/jewish-connect.git
cd jewish-connect

# Ajouter upstream pour être à jour
git remote add upstream https://github.com/ORIGINAL/jewish-connect.git
```

### 2. Setup Développement

```bash
# Installer les dépendances
npm install

# Créer une branche pour votre feature
git checkout -b feature/amazing-feature

# Démarrer le serveur Expo
npm start
```

### 3. Avant de Coder

```bash
# Mettre à jour votre branche avec upstream
git fetch upstream
git rebase upstream/main

# Créer votre branche locale
git checkout -b feature/your-feature-name
```

---

## 📐 Conventions & Standards

### 1. TypeScript Strict Mode

Tout le code doit être en TypeScript avec `strict: true`:

```typescript
// ✅ BON
const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return <Text>{title}</Text>;
};

interface MyComponentProps {
  title: string;
}

// ❌ MAUVAIS
const MyComponent = (props) => {
  return <Text>{props.title}</Text>;
};
```

### 2. Noms & Variables

```typescript
// ✅ BON - Noms clairs et descriptifs
interface UserPreferences {
  language: 'he' | 'fr' | 'en';
  fontSize: number;
}

const formatZmanTime = (date: Date): string => {
  return dayjs(date).format('HH:mm');
};

// ❌ MAUVAIS - Noms vagues
interface UP {
  lang: string;
  fs: number;
}

const fmt = (d: Date): string => {
  return dayjs(d).format('HH:mm');
};
```

### 3. Commentaires & Documentation

```typescript
/**
 * Récupère les Zmanim pour une date et localisation donnée
 * @param date - Date pour laquelle calculer (format YYYY-MM-DD)
 * @param location - Localisation { latitude, longitude }
 * @returns Promise<ZmanDetails> avec toutes les heures importantes
 * @throws Error si la géolocalisation est indisponible
 */
async getZmanim(date: Dayjs, location: Location): Promise<ZmanDetails> {
  // ...
}
```

### 4. Imports & Aliases

Toujours utiliser les path aliases:

```typescript
// ✅ BON
import { usePrayer } from '@hooks/usePrayer';
import { COLORS } from '@constants/index';
import SiddurService from '@services/siddur.service';

// ❌ MAUVAIS
import { usePrayer } from '../../../hooks/usePrayer';
import { COLORS } from '../constants';
```

### 5. Formatage & Linting

```bash
# Format automatiquement
npm run lint:fix

# Vérifier avant commit
npm run lint
npm run type-check
```

### 6. Traductions (i18n)

Tous les textes UI doivent être traduits:

```typescript
// ✅ BON
const { t } = useI18n();
<Text>{t('prayer.shacharit', 'Morning Prayer')}</Text>

// ❌ MAUVAIS - Texte en dur
<Text>Morning Prayer</Text>
```

Ajouter les traductions dans `src/hooks/useI18n.ts`:

```typescript
const translations = {
  en: {
    'prayer.shacharit': 'Morning Prayer',
  },
  he: {
    'prayer.shacharit': 'שחרית',
  },
  fr: {
    'prayer.shacharit': 'Prière du Matin',
  },
};
```

---

## 🎯 Workflow de Contribution

### Étape 1: Créer une Issue

Avant de coder, créez une issue pour discuter:

- **Bug Report**: Titre clair, étapes de reproduction, comportement attendu vs réel
- **Feature Request**: Description du besoin, cas d'usage, implémentation suggérée

### Étape 2: Créer une Branche

```bash
# Branche pour bug fix
git checkout -b fix/descriptive-bug-name

# Branche pour feature
git checkout -b feature/descriptive-feature-name

# Branche pour docs
git checkout -b docs/descriptive-docs-name
```

### Étape 3: Développer & Tester

```bash
# Écrire le code avec tests
npm run lint:fix  # Format automatique
npm test          # Run tests

# Assurez-vous que tout compile
npm run type-check
```

### Étape 4: Commit avec Message Clair

```bash
# Format du commit
git commit -m "type: description"

# Types: feat, fix, docs, style, refactor, test, chore
git commit -m "feat: add Hebrew RTL support to calendar view"
git commit -m "fix: prayer service detection on hour boundary"
git commit -m "docs: update deployment guide for iOS"
```

### Étape 5: Push & Create Pull Request

```bash
# Push votre branche
git push origin feature/your-feature-name

# Créer une PR sur GitHub
# Remplir la template PR avec:
# - Description claire
# - Issue #123 resolved
# - Type de change (Bug, Feature, Breaking)
# - Screenshots si UI change
# - Testing steps
```

---

## 🧪 Écrire des Tests

### Structure des Tests

```typescript
// src/__tests__/services/siddur.service.test.ts
import SiddurService from '@services/siddur.service';
import { mockPrayers } from '@/__tests__/mocks/prayers';

describe('SiddurService', () => {
  describe('getPrayers', () => {
    it('should return prayers for given service and nusach', async () => {
      const prayers = await SiddurService.getPrayers('shacharit', 'ashkenazi');
      expect(prayers).toBeDefined();
      expect(prayers.length).toBeGreaterThan(0);
    });

    it('should filter prayers correctly', async () => {
      const prayers = await SiddurService.getPrayers('mincha', 'sephardic');
      expect(prayers.every((p) => p.serviceType === 'mincha')).toBe(true);
    });
  });
});
```

### Couverture de Test

Minimum **50%** couverture:

```bash
npm test -- --coverage
```

---

## 📚 Documentation

Toute nouvelle feature doit être documentée:

1. **Inline Comments** - Pourquoi, pas quoi
2. **JSDoc** - Pour toutes les fonctions publiques
3. **ARCHITECTURE.md** - Mises à jour pour changements architecturaux majeurs
4. **README.md** - Si affecte usage général

### Template de Doc

````typescript
/**
 * Hook pour gérer les Zmanim (heures de prière)
 *
 * Récupère la localisation actuelle et calcule les Zmanim.
 * Met à jour toutes les 24h automatiquement.
 *
 * @returns Object avec:
 *   - zmanim: ZmanDetails
 *   - userLocation: LocationCoords
 *   - isLoading: boolean
 *   - nextZman: { name, time } | null
 *
 * @example
 * ```typescript
 * const { zmanim, nextZman } = useZmanim();
 * console.log(`Prochain Zman: ${nextZman.name} à ${nextZman.time}`);
 * ```
 */
export const useZmanim = () => { ... }
````

---

## 🔒 Sécurité & Privacy

Quelques règles essentielles:

- ✅ Jamais de clés API en dur
- ✅ HTTPS pour tous les API calls
- ✅ Valider les inputs utilisateur
- ✅ Pas de données sensibles en localStorage
- ✅ Respecter la privacy utilisateur

```typescript
// ✅ BON - Variables d'environnement
const API_KEY = process.env.FIREBASE_API_KEY;

// ❌ MAUVAIS - Clé hardcodée!
const API_KEY = 'AIzaSyD...'; // NEVER!
```

---

## 🎨 Design & Accessibility

### Couleurs

- Utiliser les constantes `src/constants/index.ts`
- Tester le contraste WCAG AA minimum

### Tailles

- Touch targets minimum: 44x44 points
- Texte minimum: 12pt (iOS), 14sp (Android)

### Accessibilité

```typescript
// ✅ BON - Accessible
<TouchableOpacity
  accessible
  accessibilityLabel="Ajouter une question"
  accessibilityHint="Double-tap pour ouvrir le formulaire"
>
  <Text>+</Text>
</TouchableOpacity>

// ❌ MAUVAIS - Non accessible
<TouchableOpacity><Text>+</Text></TouchableOpacity>
```

---

## 🌍 Localisation (i18n)

Tous les textes doivent supporter:

- **Hébreu** (עברית) - RTL
- **Français** (Français) - LTR
- **Anglais** (English) - Fallback

```typescript
// ✅ BON
const { t, isRTL } = useI18n();
<View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
  <Text>{t('community.title', 'Community')}</Text>
</View>

// ❌ MAUVAIS - Hardcoded text
<Text>Community</Text>
```

---

## 📊 Performance

- **Bundle Size**: < 50MB (iOS), < 100MB (Android)
- **Startup Time**: < 3s
- **Memory**: < 150MB
- **Utiliser React DevTools Profiler**

```bash
# Vérifier bundle size
npm run build:android  # Voir output
```

---

## 🚨 Avant de Soumettre une PR

Checklist finale:

- [ ] Code compilé sans erreurs
- [ ] `npm run lint` ✅
- [ ] `npm run type-check` ✅
- [ ] `npm test` ✅ (ou au moins le test pertinent)
- [ ] Tests ajoutés pour nouvelles fonctionnalités
- [ ] Traductions ajoutées (HE/FR/EN)
- [ ] Accessibilité vérifiée
- [ ] Documentation mise à jour
- [ ] Pas de secrets/clés hardcodées
- [ ] Commit messages clairs

---

## 📖 Ressources Utiles

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Navigation](https://reactnavigation.org/)

---

## 🤔 Questions?

- 💬 Créez une [GitHub Discussion](https://github.com/yourusername/jewish-connect/discussions)
- 📧 Email: dev@jewishconnect.app
- 🕎 Rejoignez notre [Discord Community](https://discord.gg/jewishconnect)

---

## 🙏 Merci!

Baruch Atah, Adonai! Merci d'aider à transformer les pratiques juives millénaires en expérience moderne. 🕎

**Chaque contribution compte!** 💪
