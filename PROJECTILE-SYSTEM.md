# Système Progressif de Projectiles - Phases 17-23

## Vue d'ensemble

Le système de projectiles a été complètement refactorisé pour supporter une progression dynamique à travers les phases 17-23 du mode "mur", culminant avec un spectaculaire système de laser et cœurs multicolores.

## Architecture

### 1. Configuration par Phase (`getProjectileConfig(phase)`)

Chaque phase a une configuration unique qui définit :
- **Type** : coin, star, multicolor, rainbow, rapid, big_heart, rotating_hearts
- **Apparence** : emoji, couleur(s), taille
- **Effets visuels** : traînées lumineuses, particules, rotation
- **Mécanique** : vitesse, cadence de tir, power-ups spéciaux
- **Spécial** : double tir, laser, changement de couleur dynamique

### 2. Progression des Phases

#### Phase 17 : Pièces d'Or ⭐
- **Projectile** : Étoiles dorées (gold)
- **Taille** : 14px
- **Vitesse** : 8
- **Cadence** : 20 frames
- **Power-up** : Petits cœurs gris
- **Description** : Introduction au système avec projectiles classiques

#### Phase 18 : Étoiles ✨
- **Projectile** : Étoiles blanches scintillantes
- **Taille** : 16px
- **Vitesse** : 8
- **Cadence** : 20 frames
- **Description** : Système de base déjà existant

#### Phase 19 : Multicolore 💫
- **Projectile** : Projectiles de 5 couleurs différentes
- **Couleurs** : Rose, Rouge foncé, Bleu, Turquoise, Jaune
- **Taille** : 16px
- **Traînée** : Oui (15px)
- **Vitesse** : 9
- **Cadence** : 18 frames
- **Description** : Premier niveau avec effets visuels élaborés

#### Phase 20 : Arc-en-Ciel 🌈
- **Projectile** : Couleur changeante en vol
- **Couleurs** : 7 couleurs du spectre (Rouge → Violet)
- **Taille** : 18px
- **Traînée** : Oui (20px)
- **Vitesse** : 10
- **Cadence** : 15 frames
- **Effet spécial** : Changement de couleur toutes les 100ms
- **Description** : Arc-en-ciel dynamique avec transition fluide

#### Phase 21 : Tir Rapide 🔥
- **Projectile** : Flammes jaune-orange visibles
- **Couleurs** : Or et Orange
- **Taille** : 14px (plus petit pour rapidité)
- **Traînée** : Oui (12px)
- **Vitesse** : 12 (le plus rapide)
- **Cadence** : 8 frames (super rapide!)
- **Power-up** : Double tir (tire 2 projectiles avec angle de 30°)
- **Description** : Mode "mitraillette" avec tir ultra-rapide

#### Phase 22 : Gros Cœurs 💖
- **Projectile** : Cœurs roses géants
- **Couleurs** : Rose foncé et Rose clair
- **Taille** : 24px (le plus gros)
- **Traînée** : Oui (18px)
- **Particules** : Oui (8 particules à l'impact)
- **Vitesse** : 7 (plus lent mais puissant)
- **Cadence** : 25 frames
- **Description** : Projectiles massifs avec explosion de particules

#### Phase 23 : FINALE - Cœurs Rotatifs + Laser
- **Projectiles** : Cœurs multicolores tournants
- **Emojis** : 💖💛💚💙💜 (5 cœurs colorés)
- **Couleurs** : Rose, Or, Vert, Bleu, Violet
- **Taille** : 20px
- **Traînée** : Oui (20px)
- **Particules** : Oui (12 particules)
- **Rotation** : Oui (rotation continue)
- **Vitesse** : 9
- **Cadence** : 15 frames
- **RAYON LASER** :
  - Se déclenche automatiquement toutes les 20 secondes
  - Détruit toute une ligne horizontale de briques
  - Effet néon électrique cyan
  - Éclairs électriques blancs
  - Durée : 1 seconde
  - Explosion de particules multicolores (20 par brique)
- **Description** : Apothéose visuelle avec mécaniques ultimes

## Fonctionnalités Techniques

### Système de Traînées Lumineuses
```javascript
if (config.trail && projectile.dx && projectile.dy) {
    // Calcul de la traînée basée sur la vélocité
    const trailX = posX - projectile.dx * (trailLength / config.speed);
    const trailY = posY - projectile.dy * (trailLength / config.speed);
    // Rendu avec transparence et glow
}
```

### Changement de Couleur Dynamique (Phase 20)
```javascript
if (proj.config.colorChange) {
    const elapsed = Date.now() - proj.creationTime;
    proj.colorIndex = Math.floor(elapsed / 100) % proj.config.color.length;
}
```

### Système de Rotation (Phase 23)
```javascript
if (proj.config.rotation) {
    proj.rotation += 0.1;
}
ctx.rotate(rotation);
```

### Double Tir (Phase 21)
```javascript
if (config.doubleShot && window.doubleShotActive) {
    const angle = Math.atan2(velY, velX);
    const offset = 0.3; // 30 degrés
    // Créer projectile secondaire avec angle décalé
}
```

### Explosion de Particules (Phases 22-23)
```javascript
if (proj.config && proj.config.particles) {
    const particleCount = proj.config.particleCount || 8;
    for (let p = 0; p < particleCount; p++) {
        const angle = (Math.PI * 2 * p) / particleCount;
        // Créer particules dans toutes les directions
    }
}
```

### Rayon Laser (Phase 23)
- **Déclenchement** : Automatique toutes les 20 secondes
- **Ciblage** : Ligne horizontale au niveau `C.H * 0.3`
- **Hauteur** : ±40px autour du centre
- **Effet visuel** :
  - Gradient cyan vertical avec fade in/out
  - ShadowBlur 30px pour effet néon
  - 5 éclairs électriques blancs animés aléatoirement
  - Transparence pulsante avec `Math.sin()`
- **Destruction** :
  - Toutes les briques dans la zone laser
  - 20 particules multicolores par brique
  - +100 points par brique
- **Durée** : 1000ms (1 seconde)

## Intégration dans le Jeu

### Variables Globales Ajoutées
```javascript
let laserState = { 
    lastFired: 0,      // Dernier tir (timestamp)
    active: false,      // Laser actif?
    startTime: 0,       // Début du tir
    duration: 1000      // Durée totale
};
```

### Structure des Projectiles
```javascript
{
    x: number,              // Position X
    y: number,              // Position Y
    dx: number,             // Vélocité X
    dy: number,             // Vélocité Y
    phase: number,          // Phase actuelle (17-23)
    config: object,         // Configuration de la phase
    colorIndex: number,     // Index couleur courante
    rotation: number,       // Rotation actuelle (radians)
    creationTime: number    // Timestamp de création
}
```

### Fonctions Principales

1. **`getProjectileConfig(phase)`**
   - Retourne la configuration pour une phase donnée
   - Fallback sur phase 18 (étoiles) si phase inconnue

2. **`tirerProjectile(mouseX, mouseY)`**
   - Modifié pour supporter phases 17-23
   - Vérifie `narrationManager.currentPhase`
   - Crée projectiles avec propriétés étendues
   - Gère le double tir (phase 21)

3. **`mettreAJourProjectiles()`**
   - Supporte phases mur (17-23)
   - Met à jour rotation (phase 23)
   - Met à jour colorIndex (phase 20)
   - Gère collisions et particules

4. **`dessinerProjectiles()`**
   - Rendu des traînées lumineuses
   - Gradient dynamique par couleur
   - Rotation et emojis
   - Support multi-phases

5. **`activerLaser()`**
   - Vérifie interval de 20 secondes
   - Détruit briques dans zone laser
   - Crée explosions de particules
   - Affiche message d'activation

6. **`mettreAJourLaser()`**
   - Dessine rayon cyan néon
   - Éclairs électriques animés
   - Gestion fade in/out
   - Désactivation automatique

### Boucle Principale
```javascript
if(jeu) {
    mettreAJourStarsProjectiles();
    mettreAJourProjectiles();
    mettreAJourBulle();
    mettreAJourLaser();
    
    // Auto-activation laser phase 23
    if (phaseActuelle === 23 && phaseJeu === 'mur') {
        activerLaser();
    }
}
```

## Messages Traduits Requis

Ajouter dans les fichiers de langue (`fr.json`, `en.json`, etc.) :

```json
{
  "game": {
    "messages": {
      "laser_activated": "⚡ RAYON LASER ACTIVÉ !",
      "shooting_mode_activated": "🪔 Mode Tir activé ! (10s)"
    }
  }
}
```

## Performance

- **Projectiles** : Illimités, nettoyés hors écran
- **Particules** : Recyclées automatiquement
- **Laser** : Seulement actif 1s toutes les 20s
- **Traînées** : Optimisées avec `lineCap: 'round'`

## Évolution Future

### Idées d'Amélioration
1. **Phase 17** : Apparition aléatoire de cœurs gris power-up
2. **Phase 21** : Activation manuelle du double tir (touche)
3. **Phase 23** : Laser contrôlable (viser avec souris)
4. **Général** : Combo system (tirs rapides = bonus)
5. **Général** : Projectiles rebondissants (ricochet)

### Power-Ups Potentiels
- 🔥 **Triple Tir** : 3 projectiles en éventail
- ⚡ **Super Vitesse** : Cadence x2 pendant 10s
- 💎 **Perçant** : Traverse plusieurs briques
- 🌟 **Explosion** : Dégâts zone à l'impact
- 🎯 **Guidé** : Projectiles cherchent les briques

## Résumé

Le système progressif de projectiles transforme les phases 17-23 en une montée en puissance spectaculaire :
- **17-18** : Apprentissage (coins & stars)
- **19-20** : Effets visuels (multicolor & rainbow)
- **21** : Puissance brute (rapid fire)
- **22** : Impact massif (big hearts)
- **23** : FINALE ULTIME (rotating hearts + LASER)

Chaque phase apporte de nouvelles mécaniques tout en conservant la fluidité du gameplay. Le laser final représente le point culminant avec une destruction massive synchronisée.

---

**Date de création** : Janvier 2025
**Statut** : ✅ Implémenté et fonctionnel
**Fichier principal** : `petitbateauRouge.html`
**Lignes modifiées** : ~300 lignes ajoutées/modifiées
