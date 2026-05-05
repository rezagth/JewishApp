#!/bin/bash

# Jewish Connect - Setup & Deployment Guide
# Guide complet pour configurer et déployer l'application

set -e

echo "🚀 Jewish Connect - Setup Guide"
echo "================================"
echo ""

# Vérifier les dépendances système
echo "✓ Vérification des prérequis..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Installez Node.js 18+"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé."
    exit 1
fi

NODE_VERSION=$(node --version)
echo "  • Node: $NODE_VERSION"
echo "  • npm: $(npm --version)"

# Installation des dépendances
echo ""
echo "📦 Installation des dépendances..."
npm install

# Installation de EAS CLI
echo ""
echo "🔧 Installation de EAS CLI..."
npm install -g eas-cli

# Configuration initiale EAS
echo ""
echo "⚙️  Configuration EAS..."
read -p "Avez-vous un compte Expo? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    eas login
    eas init
else
    echo "  ℹ️  Créez un compte sur https://expo.dev"
fi

# Build local pour tester
echo ""
echo "📱 Test du build local..."
read -p "Voulez-vous tester l'app localement? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Lancement du développement..."
    echo "  • iOS: npm run ios"
    echo "  • Android: npm run android"
    echo "  • Web: npm run web"
fi

echo ""
echo "✅ Setup complet!"
echo ""
echo "Prochaines étapes:"
echo "1. Configurez les variables d'environnement dans .env"
echo "2. Ajoutez vos clés de services (Firebase, Sefaria, etc.)"
echo "3. Testez localement: npm start"
echo "4. Build et deploy: eas build --platform ios/android"
echo ""
echo "Documentation: voir ARCHITECTURE.md et DEPLOYMENT.md"
