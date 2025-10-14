# 🎯 Séparation des Systèmes de Tir

## 📋 Vue d'ensemble

Le jeu possède maintenant **DEUX systèmes de tir complètement séparés** :

1. **`window.modeTirMur`** → Système progressif phases 17-22 (nouveau)
2. **`window.modeTirStars`** → Système power-up Poxerstart (ancien, conservé)

Cette séparation élimine tous les conflits et permet aux deux systèmes de coexister.

---

## 🆕 Système 1 : Mode Tir MUR (Phases 17-22)

### Variable : `window.modeTirMur`

```javascript
window.modeTirMur = {
    actif: boolean,  // true = mode tir MUR activé
    fin: timestamp   // Date.now() + 600000 (10 minutes)
}
```

### Activation automatique

**Point 1 : `setupMurMode()` (ligne ~4748)**
```javascript
// Activer automatiquement le mode tir MUR pour phases 17-23
if (phase >= 17 && phase <= 23) {
    if (!window.modeTirMur) {
        window.modeTirMur = { actif: false, fin: 0 };
    }
    window.modeTirMur.actif = true;
    window.modeTirMur.fin = Date.now() + 600000; // 10 minutes
    munitions = 9999; // Munitions infinies
    console.log(`🎯 Phase ${phase} - Mode tir MUR activé automatiquement (setupMurMode)`);
}
```

**Point 2 : `goToNextPhaseDirect()` (ligne ~4719)**
```javascript
// Création du mur pour phases 17-22
if(this.currentPhase >= 17 && this.currentPhase <= 22) {
    creerMurDansLaMer();
    
    // Activer mode tir MUR automatiquement
    if (!window.modeTirMur) {
        window.modeTirMur = { actif: false, fin: 0 };
    }
    window.modeTirMur.actif = true;
    window.modeTirMur.fin = Date.now() + 600000; // 10 minutes
    munitions = 9999;
    console.log(`🎯 Phase ${this.currentPhase} - Mode tir MUR activé (via goToNextPhaseDirect)`);
}
```

### Fonction : `tirerProjectile(mouseX, mouseY)` (ligne ~12703)

**Condition d'activation** :
```javascript
const isWallPhase = phaseActuelle >= 17 && phaseActuelle <= 23 
                    && phaseJeu === 'mur' 
                    && window.modeTirMur 
                    && window.modeTirMur.actif;
```

**Projectiles disponibles** :
- Phase 17 : ⭐ Pièces d'or
- Phase 18 : ★ Étoiles 5 branches
- Phase 19 : 💫 Multicolores (5 couleurs aléatoires)
- Phase 20 : 🌈 Arc-en-ciel (couleur changeante)
- Phase 21 : 🔥 Tir rapide (double shot)
- Phase 22 : 💖 Gros cœurs (particules)

### Handler mousedown (ligne ~16162)

```javascript
else if(phaseJeu === 'lanterne' || phaseJeu === 'mur') {
    if(balle.enAttente) {
        // Lancer la balle
    } else if(window.modeTirMur && window.modeTirMur.actif && phaseJeu === 'mur') {
        // 🎯 MODE TIR MUR (système projectiles progressifs phases 17-22)
        if(Date.now() > window.modeTirMur.fin) {
            window.modeTirMur.actif = false;
        } else {
            tirerProjectile(mouseX, mouseY);  // Système progressif dédié
        }
    } else if(window.modeTirStars && window.modeTirStars.actif) {
        // Mode tir étoiles POXERSTART (power-up temporaire 7s)
        tirerStarsProjectile(mouseX, mouseY);
    } else {
        // Tir normal par clic
        tirerProjectile(mouseX, mouseY);
    }
}
```

### Handler mousemove (tir continu) (ligne ~15485)

```javascript
if(tirEnCours && (phaseJeu === 'lanterne' || phaseJeu === 'mur' || phaseJeu === 'stars')) {
    const now = Date.now();
    if(now - dernierTir > delaiTir) {
        const mouseX = ...;
        const mouseY = ...;

        if(phaseJeu === 'stars') {
            tirerStarsProjectile(mouseX, mouseY);
        } else if(phaseJeu === 'mur' && window.modeTirMur && window.modeTirMur.actif) {
            // 🎯 MODE TIR MUR (système projectiles progressifs phases 17-22)
            tirerProjectile(mouseX, mouseY);
        } else if(window.modeTirStars && window.modeTirStars.actif) {
            // Mode tir étoiles POXERSTART (power-up 7s)
            tirerStarsProjectile(mouseX, mouseY);
        } else {
            // Tir normal
            tirerProjectile(mouseX, mouseY);
        }
        dernierTir = now;
    }
}
```

---

## 🌟 Système 2 : Mode Tir STARS / POXERSTART (Power-up)

### Variable : `window.modeTirStars`

```javascript
window.modeTirStars = {
    actif: boolean,  // true = mode tir STARS activé
    fin: timestamp   // Date.now() + 7000 (7 secondes)
}
```

### Activation par power-up (ligne ~10850)

```javascript
case 'poxerstart':
    // Active le mode tir étoiles POXERSTART pendant 7 secondes
    // Système séparé du mode tir MUR (phases 17-22)
    if(!window.modeTirStars || !window.modeTirStars.actif) {
        const finTirStars = Date.now() + 7000;
        window.modeTirStars = { actif: true, fin: finTirStars };
        ajouterParticules(power.x + power.w/2, power.y + power.h/2, '#FF69B4', 8);
        console.log('🌟 Mode tir étoiles POXERSTART activé (7s)');

        // 🔊 Son de collecte power-up
        AudioSystem.playCollect();

        // Message
        const message = getTranslatedText('powerups.poxerstart', '🌟 Poxerstart activé - 7 secondes');
        afficherMessagePowerupSimple(message);

        // Indicateur visuel
        raquette.poxerstart = true;
        raquette.poxerstartFin = finTirStars;
    } else {
        console.log('⚠️ Poxerstart déjà actif');
    }
    break;
```

### Fonction : `tirerStarsProjectile(mouseX, mouseY)` (ligne ~9017)

**Utilisé pour** :
- Phase stars (phase 3) - tir d'étoiles dorées basiques
- Power-up Poxerstart (toutes phases) - 7 secondes de tir temporaire

**Projectile** : Étoile dorée filante avec traînée

### Handler mousedown (ligne ~16162)

```javascript
else if(window.modeTirStars && window.modeTirStars.actif) {
    // 🌟 MODE TIR ÉTOILES POXERSTART (power-up temporaire 7s)
    if(Date.now() > window.modeTirStars.fin) {
        window.modeTirStars.actif = false;
    } else {
        tirerStarsProjectile(mouseX, mouseY);  // Ancien système stars (Poxerstart)
    }
}
```

### Handler mousemove (ligne ~15485)

```javascript
else if(window.modeTirStars && window.modeTirStars.actif) {
    // Mode tir étoiles POXERSTART (power-up 7s)
    tirerStarsProjectile(mouseX, mouseY);
}
```

---

## 🔄 Priorité d'Exécution

### Ordre de vérification dans mousedown/mousemove :

1. **Balle en attente** → Lancer la balle
2. **`modeTirMur` actif** ET `phaseJeu === 'mur'` → `tirerProjectile()` (système progressif)
3. **`modeTirStars` actif** → `tirerStarsProjectile()` (Poxerstart)
4. **Défaut** → `tirerProjectile()` (tir normal)

Cette hiérarchie garantit :
- ✅ Mode MUR prioritaire en phases 17-22
- ✅ Poxerstart fonctionne dans les autres phases
- ✅ Pas de conflit entre les deux systèmes

---

## 📊 Comparaison des Deux Systèmes

| Critère | Mode Tir MUR | Mode Tir STARS |
|---------|--------------|----------------|
| **Variable** | `window.modeTirMur` | `window.modeTirStars` |
| **Activation** | Automatique (phases 17-22) | Power-up Poxerstart |
| **Durée** | 10 minutes (600 000 ms) | 7 secondes (7000 ms) |
| **Phases** | 17-22 uniquement | Toutes phases |
| **Fonction tir** | `tirerProjectile()` | `tirerStarsProjectile()` |
| **Projectiles** | 6 types progressifs | Étoiles dorées |
| **Munitions** | Infinies (9999) | Infinies pendant durée |
| **Condition** | `phaseJeu === 'mur'` | Toutes phases jeu |
| **Désactivation** | Après 10 min | Après 7s |

---

## ✅ Avantages de la Séparation

### 1. **Aucun conflit** 🎯
- Deux variables distinctes
- Deux fonctions distinctes
- Deux contextes distincts

### 2. **Coexistence possible** 🤝
- Poxerstart peut s'activer hors phases 17-22
- Mode MUR n'interfère pas avec l'ancien système
- Les deux peuvent exister dans le code simultanément

### 3. **Clarté du code** 📖
```javascript
// Avant (confus)
if(window.modeTirStars && window.modeTirStars.actif) {
    if(phase >= 17 && phase <= 23) {
        tirerProjectile();  // Nouveau système
    } else {
        tirerStarsProjectile();  // Ancien système
    }
}

// Après (clair)
if(window.modeTirMur && window.modeTirMur.actif) {
    tirerProjectile();  // Système MUR dédié
} else if(window.modeTirStars && window.modeTirStars.actif) {
    tirerStarsProjectile();  // Système STARS dédié
}
```

### 4. **Maintenance facilitée** 🔧
- Modifier le mode MUR n'affecte pas le mode STARS
- Ajouter des phases au mode MUR = simple extension
- Power-ups restent indépendants

### 5. **Logs distincts** 📝
```javascript
// Mode MUR
console.log('🎯 Phase X - Mode tir MUR activé automatiquement (setupMurMode)');
console.log('🎯 Phase X - Mode tir MUR activé (via goToNextPhaseDirect)');

// Mode STARS
console.log('🌟 Mode tir étoiles POXERSTART activé (7s)');
console.log('⚠️ Poxerstart déjà actif');
```

---

## 🧪 Tests

### Test Mode MUR (Phases 17-22)

**Console** :
```javascript
// Aller en phase 17
narrationManager.currentPhase = 17;
creerMurDansLaMer();

// Vérifier l'état
console.log("Mode MUR actif:", window.modeTirMur?.actif);
console.log("Fin:", new Date(window.modeTirMur?.fin));
console.log("Munitions:", munitions);

// Tirer
// Cliquer sur le canvas → devrait tirer ⭐ pièces d'or
```

**Résultat attendu** :
- ✅ `window.modeTirMur.actif === true`
- ✅ Fin dans 10 minutes
- ✅ Munitions = 9999
- ✅ Projectiles ⭐ apparaissent au clic

---

### Test Mode STARS (Poxerstart)

**Console** :
```javascript
// Activer Poxerstart manuellement
window.modeTirStars = { actif: true, fin: Date.now() + 7000 };

// Vérifier l'état
console.log("Mode STARS actif:", window.modeTirStars?.actif);
console.log("Fin:", new Date(window.modeTirStars?.fin));

// Tirer
// Cliquer sur le canvas → devrait tirer étoiles dorées filantes
```

**Résultat attendu** :
- ✅ `window.modeTirStars.actif === true`
- ✅ Fin dans 7 secondes
- ✅ Étoiles dorées avec traînée apparaissent

---

### Test Coexistence (Phase lanterne + Poxerstart)

**Console** :
```javascript
// Aller en phase lanterne (hors 17-22)
narrationManager.currentPhase = 10;
phaseJeu = 'lanterne';

// Activer Poxerstart
window.modeTirStars = { actif: true, fin: Date.now() + 7000 };

// Vérifier
console.log("Mode MUR:", window.modeTirMur?.actif);  // false ou undefined
console.log("Mode STARS:", window.modeTirStars?.actif);  // true

// Tirer
// Cliquer sur le canvas → devrait utiliser tirerStarsProjectile()
```

**Résultat attendu** :
- ✅ Mode MUR non actif (hors phases 17-22)
- ✅ Mode STARS actif via Poxerstart
- ✅ Étoiles dorées tirées correctement

---

## 🚀 Commandes Console Utiles

### Activer mode MUR manuellement
```javascript
window.modeTirMur = { actif: true, fin: Date.now() + 600000 };
munitions = 9999;
narrationManager.currentPhase = 19; // Phase multicolore 💫
phaseJeu = 'mur';
creerMurDansLaMer();
```

### Activer mode STARS manuellement
```javascript
window.modeTirStars = { actif: true, fin: Date.now() + 7000 };
```

### Désactiver tous les modes
```javascript
if(window.modeTirMur) window.modeTirMur.actif = false;
if(window.modeTirStars) window.modeTirStars.actif = false;
```

### Vérifier l'état
```javascript
console.log("État des modes de tir:");
console.log("  MUR:", window.modeTirMur?.actif ? "✅ ACTIF" : "❌ Inactif");
console.log("  STARS:", window.modeTirStars?.actif ? "✅ ACTIF" : "❌ Inactif");
console.log("  Phase:", narrationManager?.currentPhase);
console.log("  Mode jeu:", phaseJeu);
```

---

## 📝 Modifications Apportées

### Fichier : `petitbateauRouge.html`

1. **Ligne ~12703** : `tirerProjectile()` utilise `window.modeTirMur`
2. **Ligne ~4719** : `goToNextPhaseDirect()` active `window.modeTirMur`
3. **Ligne ~4748** : `setupMurMode()` active `window.modeTirMur`
4. **Ligne ~16162** : Handler `mousedown` sépare MUR et STARS
5. **Ligne ~15485** : Handler `mousemove` sépare MUR et STARS
6. **Ligne ~10850** : Power-up Poxerstart réactivé (utilise `modeTirStars`)

### Logs ajoutés

```javascript
// Activation mode MUR
'🎯 Phase X - Mode tir MUR activé automatiquement (setupMurMode)'
'🎯 Phase X - Mode tir MUR activé (via goToNextPhaseDirect)'

// Activation mode STARS
'🌟 Mode tir étoiles POXERSTART activé (7s)'
'⚠️ Poxerstart déjà actif'
```

---

## 🎓 Résumé

### Variables
- **`window.modeTirMur`** → Phases 17-22, 10 minutes, `tirerProjectile()`
- **`window.modeTirStars`** → Power-up Poxerstart, 7 secondes, `tirerStarsProjectile()`

### Séparation complète
- ✅ Deux variables distinctes
- ✅ Deux fonctions de tir distinctes
- ✅ Deux contextes d'utilisation distincts
- ✅ Aucun conflit possible
- ✅ Coexistence harmonieuse

### Avantages
- Code plus clair et maintenable
- Logs distincts pour debug
- Systèmes indépendants
- Extension facilitée
- Tests isolés possibles

---

**Dernière mise à jour** : 13 octobre 2025  
**Statut** : ✅ Systèmes complètement séparés et opérationnels  
**Conflits** : ❌ Aucun (séparation totale)
