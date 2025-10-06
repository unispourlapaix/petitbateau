# 🎮 Voir la Vérité - Architecture Modulaire

## 📁 Structure des Modules

```
modules/
├── 🎨 graphics/               # Modules de rendu graphique
│   ├── boat-renderer.js      # Rendu du bateau
│   ├── heart-renderer.js     # Rendu des cœurs et formes d'amour
│   ├── lantern-renderer.js   # Rendu de la lanterne magique
│   └── environment-renderer.js # Rendu de l'environnement (ciel, mer)
│
├── ⚙️ systems/                # Systèmes de jeu
│   └── particle-system.js    # Système de particules réutilisable
│
├── 🔧 config/                 # Configuration centralisée
│   └── game-config.js        # Configuration complète du jeu
│
├── 🎨 styles/                 # Styles modulaires
│   └── ui-styles.css         # Styles UI réutilisables
│
└── 📦 index.js               # Point d'entrée des modules
```

## 🚀 Utilisation

### Version Modulaire
```html
<!-- Utiliser la version modulaire -->
<link rel="stylesheet" href="modules/styles/ui-styles.css">
<script type="module" src="modules/index.js"></script>
```

### Import Spécifique
```javascript
// Import d'un module spécifique
import BoatRenderer from './modules/graphics/boat-renderer.js';
import GameConfig from './modules/config/game-config.js';

// Utilisation
BoatRenderer.render(ctx, raquette, C, modeSecret);
```

### Gestionnaire de Modules
```javascript
// Utiliser le gestionnaire central
import ModuleManager from './modules/index.js';

// Accès aux modules
ModuleManager.graphics.boat.render(ctx, raquette, C);
ModuleManager.systems.particles.addHeartParticles(x, y, color);
```

## 📋 Modules Disponibles

### 🎨 Graphics

#### **BoatRenderer**
- `render(ctx, raquette, C, modeSecret)` - Rendu complet du bateau
- Support bateau normal et militaire
- Ombre, coque, mât, voile, hublots

#### **HeartRenderer**
- `drawPixelHeart(ctx, x, y, taille, couleur)` - Cœur pixel art
- `drawPolygonalHeart(ctx, x, y, taille, couleur, rotation, intensite)` - Cœur polygonal
- `drawSmallHeart(ctx, x, y, taille, couleur)` - Petit cœur pour particules
- `generateHeartPositions(nbBriques, ...)` - Positions mathématiques en forme de cœur

#### **LanternRenderer**
- `render(ctx, balle, lanterne, C, animationBateau, phaseJeu)` - Lanterne complète
- Halo lumineux, corps cylindrique, flamme animée
- Système de suspension réaliste

#### **EnvironmentRenderer**
- `drawSky(ctx, C, chapitre, brises, VOYAGE, soleil, animationBateau)` - Ciel complet
- `drawSea(ctx, C, chapitre)` - Mer avec vagues et requins
- Support chapitre 1 (jour) et chapitre 2 (nuit orageuse)

### ⚙️ Systems

#### **ParticleSystem**
- `addParticles(x, y, couleur, nombre, collection)` - Particules normales
- `addHeartParticles(x, y, couleur, nombre)` - Particules cœur
- `createFireworks(x, y, couleur, nombre)` - Feux d'artifice
- `update(animationBateau)` - Mise à jour automatique
- `render(ctx, animationBateau)` - Rendu optimisé
- Collections séparées : main, hearts, explosions, floating

### 🔧 Config

#### **GameConfig**
- `CHAPITRE1` / `CHAPITRE2` - Données des voyages narratifs
- `MESSAGES_INTRO` - Messages d'introduction
- `COLORS` - Palettes de couleurs
- `GAMEPLAY` - Paramètres de jeu
- `RESPONSIVE.calculateConstants(w, h)` - Calculs responsifs

## ✨ Avantages de l'Architecture Modulaire

### 🔄 **Réutilisabilité**
- Chaque module peut être utilisé dans d'autres projets
- Code découplé et indépendant
- Tests unitaires facilités

### 🎯 **Maintenabilité**
- Séparation claire des responsabilités
- Modifications isolées sans impact sur le reste
- Documentation centralisée

### ⚡ **Performance**
- Import sélectif des modules nécessaires
- Optimisations spécifiques par module
- Gestion mémoire améliorée

### 🔧 **Extensibilité**
- Ajout facile de nouveaux modules
- Override et personnalisation simple
- Architecture plug-and-play

## 🎮 Fichiers de Démonstration

- **`voir-la-verite-responsive.html`** - Version originale complète
- **`voir-la-verite-modular.html`** - Version modulaire de démonstration
- **`version-stable.html`** - Version de secours

## 🔗 Intégration

### Dans un Projet Existant
```javascript
// 1. Import du gestionnaire
import ModuleManager from './modules/index.js';

// 2. Utilisation
const boat = ModuleManager.graphics.boat;
const particles = ModuleManager.systems.particles;
const config = ModuleManager.config;
```

### Création d'un Nouveau Module
```javascript
// modules/graphics/mon-module.js
const MonModule = {
    render(ctx, ...params) {
        // Logique de rendu
    }
};

export default MonModule;
```

## 📊 Statistiques des Modules

Le gestionnaire fournit des statistiques en temps réel :
- Nombre de modules graphiques chargés
- Nombre de systèmes actifs
- Nombre total de particules
- État de la configuration

Accès via `ModuleManager.getStats()`

---

*Cette architecture modulaire permet une maintenance facilitée et une réutilisation optimale du code pour "Voir la Vérité" et futurs projets similaires.*