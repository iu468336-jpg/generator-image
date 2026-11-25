# Generator Image

Application mobile Android de génération d'images par intelligence artificielle. Décrivez une idée en quelques mots, l'application génère une image unique en haute qualité, que vous pouvez télécharger directement dans la galerie de votre téléphone.

Développée en **React Native + Expo (SDK 58)**, **TypeScript strict**.

## ✨ Fonctionnalités

- Génération d'images à partir d'un texte (prompt), avec enrichissement automatique du prompt (mots-clés qualité : haute définition, éclairage professionnel, 4K...)
- Deux fournisseurs de génération :
  - **Replicate FLUX 1.1 Pro** (qualité premium) si une clé API est fournie
  - **Pollinations.ai** (gratuit, sans clé) en secours automatique
- Retry automatique (2 tentatives) et délai maximal de 90s par tentative
- Téléchargement de l'image dans la galerie du téléphone (`expo-media-library`)
- Partage de l'image (`expo-sharing`)
- Galerie « Mes créations » avec historique local (prompts, dates, styles)
- Réglages : format d'image (1:1, 3:4, 16:9), style artistique (Photo, Cinématique, Anime, 3D, Peinture)
- Retours haptiques légers (`expo-haptics`)
- Design sombre, dégradés violet → bleu → rose, effet glassmorphism

## 🎨 Design

Thème sombre (`#0B0620` → `#1A0B3D`), dégradés `#7C3AED → #3B82F6 → #EC4899`, cartes en verre dépoli (`rgba(255,255,255,0.05)`, bordure `rgba(167,139,250,0.25)`), typographie blanche extra-bold, coins arrondis 20-24px.

## 📱 Écrans

1. **Démarrage** : logo, titre « Créez vos images », exemples de créations
2. **Génération** : zone d'aperçu plein écran, barre de prompt, génération avec animation (étoiles + shimmer)
3. **Mes créations** : galerie en grille, aperçu plein écran, téléchargement
4. **Paramètres** : format, style, thème, à propos

## 🛠️ Installation (développement)

Prérequis : Node.js 20+, npm, l'application **Expo Go** sur votre téléphone (ou un émulateur Android).

```bash
git clone https://github.com/<votre-compte>/generator-image.git
cd generator-image
npm install
npx expo start
```

Scannez le QR code avec Expo Go pour lancer l'application sur votre téléphone.

### Variable d'environnement optionnelle

Pour utiliser Replicate FLUX 1.1 Pro (qualité premium) au lieu du fournisseur gratuit par défaut :

```bash
cp .env.example .env
# puis renseignez :
# EXPO_PUBLIC_REPLICATE_KEY=votre_clé_replicate
```

Sans clé, l'application fonctionne automatiquement avec Pollinations.ai (gratuit, aucune configuration requise).

## 📦 Obtenir l'APK Android

### Option 1 — GitHub Actions (automatique)

Un workflow (`.github/workflows/build-apk.yml`) compile automatiquement l'APK à chaque `push` sur `main` :

1. Poussez le code sur votre dépôt GitHub
2. Allez dans l'onglet **Actions** du dépôt
3. Ouvrez le run le plus récent de « Build APK »
4. Téléchargez l'artifact **generator-image.apk**

### Option 2 — EAS Build (cloud Expo)

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

Le lien de téléchargement de l'APK est fourni à la fin du build.

## 📲 Installer l'APK sur votre téléphone Android

1. Téléchargez le fichier `generator-image.apk` (depuis GitHub Actions ou EAS)
2. Transférez-le sur votre téléphone (ou téléchargez-le directement depuis le téléphone)
3. Ouvrez le fichier APK : Android affichera un avertissement car l'app ne vient pas du Play Store
4. Autorisez **« Installer des applications inconnues »** pour l'application utilisée (navigateur ou gestionnaire de fichiers) dans les paramètres proposés
5. Appuyez sur **Installer**
6. Lancez **Generator Image** depuis le menu des applications

Compatible Android 10 et supérieur.

## 🧱 Stack technique

- React Native 0.88 + Expo SDK 58
- TypeScript strict
- React Navigation (bottom tabs + native stack)
- expo-linear-gradient, expo-blur (glassmorphism)
- expo-file-system (téléchargement des images générées)
- expo-media-library (enregistrement dans la galerie)
- expo-sharing (partage)
- expo-haptics (retours haptiques)
- @react-native-async-storage/async-storage (historique local)

## 📁 Structure du projet

```
src/
  components/   Composants réutilisables (boutons dégradés, cartes glass, étoiles, skeleton...)
  context/      Contexte des réglages (format, style)
  navigation/   Stack racine + barre d'onglets
  screens/      Écrans de l'application
  services/     Génération d'images, téléchargement, stockage local
  theme/        Couleurs et dégradés
  types/        Types TypeScript partagés
```

## ⚖️ Note

Ce projet utilise Pollinations.ai comme fournisseur de génération gratuit par défaut. Pour une qualité de génération supérieure, fournissez une clé API Replicate.
