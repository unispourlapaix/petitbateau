# 🎮 Le Petit Bateau Rouge - Guide itch.io

## 📦 Contenu du Package

Ce package contient l'intégralité du jeu "Le Petit Bateau Rouge" - un voyage poétique et philosophique de 33 millions de kilomètres.

## 🚀 Installation sur itch.io

### Étape 1 : Créer le ZIP
Compresse TOUS les fichiers et dossiers suivants dans un fichier ZIP :

**Fichiers essentiels :**
- `index.html` (point d'entrée)
- `petitbateauRouge.html` (jeu principal)
- `manifest.json` (PWA)
- `sw.js` (Service Worker)
- `favicon.ico`
- `.itch.toml` (configuration itch.io)

**Dossiers essentiels :**
- `modules/` (tous les modules JS, CSS, JSON)
- `icons/` (icônes PWA)
- `supabase/` (configuration base de données)

### Étape 2 : Upload sur itch.io

1. Va sur [itch.io](https://itch.io) et connecte-toi
2. Clique sur **"Upload new project"**
3. Remplis les informations :
   - **Titre** : Le Petit Bateau Rouge
   - **URL** : `petitbateau` ou `petit-bateau-rouge`
   - **Description courte** : Un voyage poétique de 33 millions de km vers la paix
   - **Classification** : HTML
   - **Type de projet** : Game
   - **Genre** : Puzzle, Adventure, Educational

4. Dans la section **"Uploads"** :
   - Upload ton fichier ZIP
   - Coche **"This file will be played in the browser"**
   - Taille d'écran recommandée : **1280x720** (ou fullscreen)
   - Coche **"Fullscreen button"**
   - Coche **"Mobile friendly"** (le jeu est responsive)

5. Configure les métadonnées :
   - **Tags** : puzzle, adventure, philosophical, multilingual, gospel, peace, poetry
   - **Langues** : French, English, Spanish, German, Italian, Portuguese, Russian, Chinese, Korean, Japanese, Arabic, Hebrew, Ukrainian, Creole
   - **Accessibilité** : Configurable font, Subtitles, Interactive tutorial
   - **Prix** : Pay what you want (ou Free)

6. Ajoute des screenshots dans la section **"Screenshots"** (prends des captures du jeu)

7. Publie !

## 🎯 Infos pour la page itch.io

### Description détaillée suggérée :

```
⛵ Le Petit Bateau Rouge - 33 Millions de Raisons de Partager la Paix

Un voyage interactif unique qui combine énigmes philosophiques, poésie et musique gospel originale. 

🌟 CARACTÉRISTIQUES :

✨ 33 énigmes philosophiques sur la foi, l'espoir et l'amour
🌍 14 langues disponibles (FR, EN, ES, DE, IT, PT, RU, ZH, KO, JA, AR, HE, UK, RC)
🎵 Musique gospel originale d'Emmanuel Payet
📖 Histoire poétique immersive
🎮 Gameplay innovant avec système de tir progressif
🏆 Classement mondial avec Supabase
💾 Sauvegarde automatique
📱 Compatible mobile & desktop

🎨 Créé par Emmanuel Payet (Dreamer Unisona)
🔗 Plus d'infos : https://emmanuelpayet.art

Objectif : Atteindre 33 millions de joueurs pour partager un message de paix universel.
```

### Tags recommandés :
- puzzle
- adventure
- philosophical
- story-rich
- multilingual
- gospel
- peace
- poetry
- france
- educational
- meaningful
- atmospheric
- web

## ⚙️ Configuration Technique

**Requis :**
- Connexion internet (pour Supabase scores)
- Navigateur moderne (Chrome, Firefox, Safari, Edge)
- JavaScript activé
- localStorage disponible

**Optimal :**
- Écran 1280x720 ou plus
- Audio activé pour la musique gospel
- Mode plein écran

## 📝 Notes importantes

1. Le jeu utilise Supabase pour les scores - assure-toi que les URLs Supabase dans `modules/supabase-scores.js` sont correctes
2. Le Service Worker (`sw.js`) est configuré pour le caching offline
3. Le jeu est PWA (Progressive Web App) compatible
4. Toutes les traductions sont chargées dynamiquement depuis `modules/lang/`

## 🐛 Dépannage

Si le jeu ne se charge pas :
1. Vérifie que TOUS les fichiers sont dans le ZIP (surtout le dossier `modules/`)
2. Assure-toi que la structure de dossiers est préservée
3. Vérifie que `index.html` est à la racine du ZIP
4. Active "This file will be played in the browser" dans les paramètres itch.io

## 📧 Support

Pour toute question : emmanuelpayet888@gmail.com
GitHub : https://github.com/unispourlapaix/petitbateau
