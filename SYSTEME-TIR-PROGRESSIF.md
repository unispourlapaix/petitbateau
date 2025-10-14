# 🎯 Système de Tir Progressif - Phases 17-22

## 📋 Vue d'ensemble

Le nouveau système de tir progressif remplace l'ancien système pour les **phases 17 à 22**. Chaque phase possède son propre type de projectile avec des caractéristiques visuelles et mécaniques uniques.

---

## 🎮 Configuration par Phase

### Phase 17 : Pièces d'Or ⭐
```javascript
{
    type: 'coin',
    emoji: '⭐',
    color: ['#FFD700', '#FFA500'],
    size: 14,
    trail: false,
    particles: false,
    cadence: 20,
    speed: 8,
    powerup: 'gray_heart'
}
```
- Projectiles dorés brillants
- Taille moyenne (14px)
- Vitesse standard (8)
- Power-up : Cœurs gris

---

### Phase 18 : Étoiles Classiques ★
```javascript
{
    type: 'star',
    emoji: null,  // Pas d'emoji, étoile dessinée en 5 branches
    color: ['#FFFFFF', '#E0E0FF'],
    size: 16,
    trail: false,
    particles: false,
    cadence: 20,
    speed: 8,
    powerup: null
}
```
- Étoiles blanches à 5 branches (forme géométrique)
- Pas d'emoji, dessinées avec Canvas
- Style classique

---

### Phase 19 : Multicolores 💫
```javascript
{
    type: 'multicolor',
    emoji: '💫',
    color: ['#FF6B9D', '#C44569', '#4A69BD', '#60A3BC', '#F8B500'],
    size: 16,
    trail: true,
    trailLength: 15,
    particles: false,
    cadence: 18,
    speed: 9,
    powerup: null
}
```
- 5 couleurs différentes (rose, rouge, bleu, cyan, or)
- Chaque projectile tire UNE couleur aléatoire
- Traînée de 15px
- Cadence plus rapide (18)

---

### Phase 20 : Arc-en-Ciel 🌈
```javascript
{
    type: 'rainbow',
    emoji: '🌈',
    color: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'],
    size: 18,
    trail: true,
    trailLength: 20,
    colorChange: true,  // Couleur change toutes les 100ms
    particles: false,
    cadence: 15,
    speed: 10,
    powerup: null
}
```
- Emoji arc-en-ciel 🌈
- Couleur change dynamiquement pendant le vol
- Traînée arc-en-ciel de 20px
- Plus rapide (speed 10)

---

### Phase 21 : Tir Rapide 🔥
```javascript
{
    type: 'rapid',
    emoji: '🔥',
    color: ['#FFD700', '#FF8C00'],
    size: 14,
    trail: true,
    trailLength: 12,
    particles: false,
    cadence: 8,  // ⚡ Très rapide !
    speed: 12,   // ⚡ Très rapide !
    doubleShot: true,  // 2 projectiles par tir
    powerup: 'double_shot'
}
```
- Emoji flamme 🔥
- **Double shot** : Tire 2 projectiles espacés de 15px
- Cadence ultra-rapide (8 frames)
- Vitesse maximale (12)
- Traînée de feu (12px)

---

### Phase 22 : Gros Cœurs 💖
```javascript
{
    type: 'big_heart',
    emoji: '💖',
    color: ['#FF1493', '#FF69B4'],
    size: 24,  // 🔥 Le plus gros !
    trail: true,
    trailLength: 18,
    particles: true,
    particleCount: 8,  // Explosion de 8 particules
    cadence: 25,
    speed: 7,
    powerup: null
}
```
- Gros cœurs roses (24px - presque 2x la taille normale)
- **Particules** : Explosion de 8 particules roses à l'impact
- Traînée rose de 18px
- Plus lent mais puissant (speed 7)
- Effet visuel maximum

---

## 🔧 Fonctions Principales

### `getProjectileConfig(phase)`
Retourne la configuration du projectile pour une phase donnée.
```javascript
const config = getProjectileConfig(17); // Config phase 17
```

### `tirerProjectile(mouseX, mouseY)`
**Nouvelle fonction** pour tirer avec le système progressif.

**Conditions d'activation** :
```javascript
const phaseActuelle = narrationManager.currentPhase;
const isWallPhase = phaseActuelle >= 17 && phaseActuelle <= 23 
                    && phaseJeu === 'mur' 
                    && window.modeTirStars 
                    && window.modeTirStars.actif;
```

**Logique** :
1. Vérifie les conditions (phase, mode mur, modeTirStars actif)
2. Obtient la config via `getProjectileConfig()`
3. Crée le(s) projectile(s) selon la config
4. Gère les cas spéciaux :
   - **Phase 19** : Couleur aléatoire parmi les 5
   - **Phase 21** : Double shot (2 projectiles)

### `dessinerProjectiles()`
Rend les projectiles à l'écran.

**Logique de rendu** :
```javascript
if(config.emoji) {
    // Rendu EMOJI SEULEMENT (pas d'étoile derrière)
    ctx.font = `${config.size}px Arial`;
    ctx.fillText(config.emoji, 0, config.size/2);
} else {
    // Rendu étoile 5 branches (phase 18)
    // ... dessin géométrique
}
```

**Effets visuels** :
- Traînée (si `config.trail`)
- Rotation (si `config.rotation`)
- Changement de couleur (si `config.colorChange`)

### `mettreAJourProjectiles()`
Met à jour la position et les effets des projectiles.

**Gestion** :
- Déplacement selon `dx`, `dy`
- Rotation automatique
- Changement de couleur (phase 20, toutes les 100ms)
- Suppression hors écran

---

## 🔄 Activation Automatique

### Lors de l'initialisation du mode mur (`setupMurMode()`)
```javascript
setupMurMode() {
    const phase = this.getCurrentPhase();
    
    // ... setup du mode mur ...
    
    // Auto-activation pour phases 17-23
    if (phase >= 17 && phase <= 23) {
        if (!window.modeTirStars) {
            window.modeTirStars = { actif: false, fin: 0 };
        }
        window.modeTirStars.actif = true;
        window.modeTirStars.fin = Date.now() + 600000; // 10 minutes
        munitions = 9999;
        console.log(`🎯 Phase ${phase} - Mode tir activé (via setupMurMode)`);
    }
}
```

### Lors de la progression narrative (`goToNextPhaseDirect()`)
```javascript
goToNextPhaseDirect() {
    // ... progression de phase ...
    
    // Création du mur pour phases 17-22
    if(this.currentPhase >= 17 && this.currentPhase <= 22) {
        creerMurDansLaMer();
        
        // Activer mode tir automatiquement
        if (!window.modeTirStars) {
            window.modeTirStars = { actif: false, fin: 0 };
        }
        window.modeTirStars.actif = true;
        window.modeTirStars.fin = Date.now() + 600000; // 10 minutes
        munitions = 9999;
        console.log(`🎯 Phase ${this.currentPhase} - Mode tir activé (via goToNextPhaseDirect)`);
    }
}
```

**Caractéristiques** :
- ✅ Activation automatique dès l'entrée en phase 17-22
- ✅ Durée : 10 minutes (600 000 ms)
- ✅ Munitions infinies (9999)
- ✅ Pas besoin de commandes console

---

## ⛔ Désactivation de l'Ancien Système

### Ancien système : `tirerStarsProjectile()`
**Utilisé avant** pour :
- Phase stars (phase 3) - tir d'étoiles dorées basiques
- Power-up "Poxerstart" - 7 secondes de tir temporaire

**Problème** : Utilisait la même variable `window.modeTirStars` → **CONFLIT**

### Solution 1 : Power-up Poxerstart désactivé en phases 17-22
```javascript
case 'poxerstart':
    // Vérifier la phase actuelle
    const phaseActuelle = narrationManager ? narrationManager.currentPhase : 0;
    if(phaseActuelle >= 17 && phaseActuelle <= 22) {
        // En phases 17-22, ignorer ce power-up
        console.log('⚠️ Poxerstart ignoré - Mode tir progressif déjà actif (phase ' + phaseActuelle + ')');
        break;
    }
    
    // Activation normale pour les autres phases
    // ...
```

**Résultat** :
- ✅ Power-up Poxerstart fonctionne normalement hors phases 17-22
- ✅ Ignoré silencieusement en phases 17-22 (nouveau système prioritaire)
- ✅ Message console pour debug

### Solution 2 : Handler mousedown intelligent
```javascript
canvas.addEventListener('mousedown', function(e) {
    // ...
    
    else if(phaseJeu === 'lanterne' || phaseJeu === 'mur') {
        if(balle.enAttente) {
            // Lancer la balle
        } else if(window.modeTirStars && window.modeTirStars.actif) {
            // Mode tir actif
            const phaseActuelle = narrationManager ? narrationManager.currentPhase : 0;
            if(phaseActuelle >= 17 && phaseActuelle <= 23 && phaseJeu === 'mur') {
                tirerProjectile(mouseX, mouseY);  // ✅ NOUVEAU système
            } else {
                tirerStarsProjectile(mouseX, mouseY);  // Ancien système
            }
        } else {
            // Tir normal
            tirerProjectile(mouseX, mouseY);
        }
    }
});
```

**Résultat** :
- ✅ Phases 17-23 en mode mur → `tirerProjectile()` (nouveau)
- ✅ Autres phases/modes → `tirerStarsProjectile()` (ancien)
- ✅ Pas de conflit entre les deux systèmes

---

## 🛡️ Prévention des Conflits

### Conflits désactivés :
1. ✅ **Petits cœurs décoratifs** : Désactivés en phases 17-23
   ```javascript
   if(!(phaseActuelle >= 17 && phaseActuelle <= 23 && phaseJeu === 'mur')) {
       dessinerPetitsCoeurs();
   }
   ```

2. ✅ **Power-up Poxerstart** : Ignoré en phases 17-22

3. ✅ **Ancien tirerStarsProjectile()** : Pas appelé en phases 17-23 mode mur

### Variable partagée : `window.modeTirStars`
**Format** :
```javascript
window.modeTirStars = {
    actif: boolean,  // true = mode tir activé
    fin: timestamp   // Date.now() + durée
}
```

**Usage** :
- **Phases 17-22** : Activé automatiquement pour 10 minutes
- **Autres phases** : Activé temporairement par power-up (7s)
- **Phase 23** : Désactivé (fin du jeu)

---

## 🧪 Tests et Débogage

### Commandes console (si besoin de forcer) :
```javascript
// Forcer l'activation
window.modeTirStars = { actif: true, fin: Date.now() + 999999 };
munitions = 9999;

// Vérifier l'état
console.log("Mode tir actif:", window.modeTirStars.actif);
console.log("Phase:", narrationManager.currentPhase);
console.log("Mode jeu:", phaseJeu);

// Aller à une phase spécifique
narrationManager.currentPhase = 19;
creerMurDansLaMer();
```

### Logs automatiques :
- `🎯 Phase X - Mode tir activé (via setupMurMode)` - Activation lors de l'init
- `🎯 Phase X - Mode tir activé (via goToNextPhaseDirect)` - Activation lors progression
- `⚠️ Poxerstart ignoré - Mode tir progressif déjà actif (phase X)` - Power-up désactivé

---

## 📊 Résumé Technique

| Phase | Projectile | Emoji | Taille | Vitesse | Cadence | Spécial |
|-------|-----------|-------|--------|---------|---------|---------|
| 17 | Pièce d'or | ⭐ | 14px | 8 | 20 | - |
| 18 | Étoile 5 branches | ★ (dessiné) | 16px | 8 | 20 | Forme géométrique |
| 19 | Multicolore | 💫 | 16px | 9 | 18 | 5 couleurs aléatoires + traînée 15px |
| 20 | Arc-en-ciel | 🌈 | 18px | 10 | 15 | Couleur change + traînée 20px |
| 21 | Tir rapide | 🔥 | 14px | 12 | 8 | Double shot + traînée 12px |
| 22 | Gros cœur | 💖 | 24px | 7 | 25 | 8 particules + traînée 18px |

**Activation** : Automatique en phases 17-22 (10 minutes, munitions infinies)  
**Ancien système** : Désactivé pour éviter conflits  
**Power-ups** : Poxerstart ignoré en phases 17-22

---

## 🎓 Notes Importantes

1. **Phase 23** : Pas de tir (fin narrative du jeu)
2. **Munitions** : Infinies (9999) en mode progressif
3. **Durée** : 10 minutes auto-renouvelées à chaque phase
4. **Compatibilité** : Ancien système reste fonctionnel pour phases 1-16
5. **Performance** : Optimisé avec mise à jour par frame et suppression hors écran

---

## 🚀 Prochaines Améliorations Possibles

- [ ] Système de combo pour tirs rapides consécutifs
- [ ] Power-ups spécifiques par phase (gray_heart, double_shot)
- [ ] Laser pour phase 23 (si réintroduit)
- [ ] Effets sonores par type de projectile
- [ ] Animation de transition entre phases
- [ ] Indicateur visuel du type de projectile actif

---

**Dernière mise à jour** : 13 octobre 2025  
**Statut** : ✅ Système complet et opérationnel  
**Phases actives** : 17-22 (6 types différents)
