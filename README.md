# 🚣 Le Petit Bateau Rouge

> **33 Millions de Raisons de Partager la Paix**
> 
> Les voyages sont notre liberté, notre humanité. Guidez un petit bateau rouge à travers la découverte d'énigmes philosophiques sur la vie, l'espoir et l'amour.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://unispourlapaix.github.io/petitbateau/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PWA Ready](https://img.shields.io/badge/PWA-ready-orange.svg)](manifest.json)

## 🌊 À propos

**Le Petit Bateau Rouge** est un jeu narratif et poétique qui touche le cœur et ouvre l'esprit. À travers 23 phases interactives, découvrez des énigmes philosophiques sur la vie, l'espoir et l'amour. Les voyages sont notre liberté, notre humanité - une quête universelle inspirée par les 33 millions de raisons de partager la paix.

Ce n'est pas qu'un jeu, c'est une expérience émotionnelle qui mêle :
- 🎮 **Gameplay varié** : collecte de cœurs, tir d'étoiles, défis de survie
- 📖 **Narration profonde** : 33 énigmes philosophiques sur la foi, l'espoir et l'amour
- 🎵 **Musique gospel** : compositions originales d'Emmanuel Payet
- 🌍 **14 langues** : accessible mondialement (FR, EN, ES, DE, IT, PT, RU, UK, ZH, JP, KO, AR, HE, RC)

## ✨ Fonctionnalités

### 🚀 Nouveautés v1.2.0
- ⚡ **Optimisation tactile majeure** : Cache getBoundingClientRect (95% ⬇️), Date.now() optimisé (50% ⬇️)
- 🎮 **Contrôle au pouce amélioré** : Sensibilité 1.8x pour déplacements confortables
- 📱 **Performance mobile** : Fluidité améliorée, moins de lag tactile
- 🆔 **App unique ID** : Support multi-jeux sur même domaine
- 🚫 **Mode production** : Logs désactivés, raccourcis test off
- 🔄 **Reset complet** : Retour phase 1 garanti, plus de blocage en phase 23
- 💾 **Sauvegarde auto** : À partir de la phase 2, restauration propre

### 🎮 Gameplay Multi-Phases
- **Phase Intro** : Animation d'introduction cinématique
- **Phase Exploration** : Navigation et collecte de cœurs
- **Phase Révélation** : Tir d'étoiles pour franchir les obstacles
- **Phase Finale** : Confrontation avec "Le Mur"
- **Mode Bonus** : Livre interactif avec poème complet

### 📱 Contrôles Optimisés Mobile
- **Sensibilité tactile 1.8x** : Le bateau bouge plus que le doigt pour un contrôle confortable
- **Cache getBoundingClientRect** : Performance optimale avec 95% de réduction des calculs
- **Contrôle au pouce amélioré** : Déplacements fluides et précis avec amplification intelligente
- **Détection adaptative** : Reconnaissance automatique du type d'appareil (mobile/PC)

### 🌐 Multilingue
Support natif de 14 langues avec système i18n :
```
🇫🇷 Français  🇬🇧 English  🇪🇸 Español  🇩🇪 Deutsch
🇮🇹 Italiano  🇵🇹 Português  🇷🇺 Русский  🇺🇦 Українська
🇨🇳 中文  🇯🇵 日本語  🇰🇷 한국어  🇸🇦 العربية
🇮🇱 עברית  🇨🇩 Lingala
```

### 🎨 Technologies & Optimisations
- **HTML5 Canvas** : Rendu graphique fluide à 60fps
- **Vanilla JavaScript** : Aucune dépendance externe (léger et rapide)
- **PWA** : Installation native sur mobile/desktop
- **Responsive Design** : Adapté à tous les écrans (mobile-first)
- **Service Worker** : Fonctionnement hors ligne
- **Performance Mobile** :
  - Cache getBoundingClientRect (95% réduction calculs)
  - Optimisation Date.now() (50% réduction appels)
  - Gestion tactile avancée avec sensibilité 1.8x
  - Détection adaptative qualité graphique

### 🏆 Système de Score
- Carte de score illustrée en pixel art : bateau rouge et phare
- Décors aléatoires (aube, lagon, nuit étoilée…)
- Partage natif de l’image ou téléchargement PNG, sans compte ni e-mail
- Score du jeu, XP et sagesse sur une carte portrait 1080 × 1350
- Le jeu ne charge plus le client Supabase et n’envoie plus les scores en base
- La sauvegarde locale de progression reste indépendante du partage

## 🚀 Installation

### Option 1 : Jouer en ligne
Visitez simplement : [https://unispourlapaix.github.io/petitbateau/](https://unispourlapaix.github.io/petitbateau/)

### Option 2 : Installation locale

```bash
# Cloner le dépôt
git clone https://github.com/unispourlapaix/petitbateau.git

# Entrer dans le dossier
cd petitbateau

# Lancer un serveur local (Python)
python -m http.server 8000

# Ou avec Node.js
npx http-server -p 8000

# Ouvrir dans le navigateur
http://localhost:8000/petitbateauRouge.html
```

### Option 3 : PWA
Sur mobile/desktop, cliquez sur "Installer l'application" lors de votre première visite.

## 📂 Structure du Projet

```
petitbateau/
├── petitbateauRouge.html          # Fichier principal
├── manifest.json                   # Configuration PWA
├── sw.js                          # Service Worker
├── icons/                         # Icônes PWA (72px à 512px)
│   └── icon-*.png
└── modules/
    ├── audio-manager.js           # Gestion audio
    ├── game-manager.js            # Logique du jeu
    ├── i18n.js                    # Système de traduction
    ├── narration-manager.js       # Narration interactive
    ├── supabase-scores.js         # Classement en ligne
    ├── config/
    │   └── game-config.js         # Configuration globale
    ├── graphics/
    │   ├── boat-renderer.js       # Rendu du bateau
    │   ├── environment-renderer.js # Environnement
    │   ├── heart-renderer.js      # Système de cœurs
    │   └── lantern-renderer.js    # Lanterne finale
    ├── lang/
    │   ├── fr.json                # Traductions françaises
    │   ├── en.json                # Traductions anglaises
    │   └── ...                    # 12 autres langues
    ├── systems/
    │   ├── chapter-manager.js     # Gestion des chapitres
    │   ├── particle-system.js     # Particules visuelles
    │   └── scoring-system.js      # Système de score
    └── sound/
        └── ...                    # Effets sonores
```

## 🎯 Objectif du Jeu

Parcourir **33 millions de kilomètres** en collectant des cœurs, résolvant des énigmes philosophiques et surmontant les obstacles symboliques du voyage migratoire.

### Les 33 Énigmes

Chaque énigme explore un thème profond :
- 💖 **Amour** : "L'amour véritable ne connaît pas de frontières"
- 🕊️ **Foi** : "Dans l'incertitude, la foi est l'ancre invisible"
- ⭐ **Espoir** : "L'espoir est la lumière qui guide dans la nuit"
- 🌊 **Courage** : "Le courage n'est pas l'absence de peur"
- 🌍 **Humanité** : "Nous sommes tous des voyageurs"

## 🎵 Musique

Compositions gospel originales d'**Emmanuel Payet** :
- 🎼 "Pouring Light"
- 🎼 "N'aie pas peur"
- 🎼 "Un Vent d'Espoir"
- 🎼 "Il est Amour"
- 🎼 "Un Cœur Immigré"
- 🎼 "Voyage Fragile"

## 👨‍🎨 Auteur

**Emmanuel Payet** - Artiste, développeur et compositeur

- 🎨 [emmanuel.gallery](https://emmanuel.gallery) - Créations visuelles
- 📚 [emmanuelpayet.art](https://emmanuelpayet.art) - Œuvres littéraires
- 🎵 [AudioMack](https://audiomack.com/emmanuelpayet888) - Musique gospel gratuite
- 🐦 [TikTok](https://www.tiktok.com/@emmanuelpayet888)
- 🛍️ [Redbubble](https://www.redbubble.com/fr/people/DreamerUnisona/shop)

## 🤝 Contribution

Les contributions sont les bienvenues ! Si vous souhaitez :
- 🌍 Ajouter une nouvelle langue
- 🐛 Corriger un bug
- ✨ Proposer une amélioration

Ouvrez une **issue** ou soumettez une **pull request**.

## 📜 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 💝 Soutenir le Projet

Si ce jeu vous touche, vous pouvez :
- ⭐ Mettre une étoile sur GitHub
- 🔄 Partager avec vos amis
- 💬 Laisser un commentaire
- 🎵 Écouter la musique sur AudioMack
- 🛍️ Découvrir les créations sur Redbubble

## 🌟 Message de l'Auteur

> **"Le Petit Bateau Rouge – 33 Millions de Raisons de Partager la Paix"**
>
> "Ce jeu est dédié à tous ceux qui ont dû quitter leur terre natale en quête de liberté, de paix et d'espoir. Que leur voyage trouve un sens, et que leur cœur trouve un port."

---

**🚣 Embarquez dans cette aventure poétique et humaine.**

*Fait avec ❤️ par Emmanuel Payet - Dreamer Unisona*
