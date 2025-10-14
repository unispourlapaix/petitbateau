# 🎯 window.modeTirMur - Documentation Complète

## 📋 Définition

`window.modeTirMur` est une **variable globale** qui contrôle le système de tir progressif pour les **phases 17 à 22** du jeu.

### Structure
```javascript
window.modeTirMur = {
    actif: boolean,    // true = mode tir activé
    fin: timestamp     // Date.now() + durée en millisecondes
}
```

---

## 🎯 Rôle Principal

`window.modeTirMur` active le **système de tir progressif avec 6 types de projectiles différents** :

| Phase | Projectile | Caractéristiques |
|-------|-----------|------------------|
| 17 | ⭐ Pièces d'or | Taille 14px, vitesse 8 |
| 18 | ★ Étoiles 5 branches | Forme géométrique, pas d'emoji |
| 19 | 💫 Multicolores | 5 couleurs aléatoires + traînée 15px |
| 20 | 🌈 Arc-en-ciel | Couleur changeante + traînée 20px |
| 21 | 🔥 Tir rapide | Double shot + cadence 8 |
| 22 | 💖 Gros cœurs | 24px + 8 particules à l'impact |

---

## 🔧 Où est-il Utilisé ?

### 1️⃣ **Activation Automatique - goToNextPhaseDirect()** (Ligne 4721-4726)

**Quand** : Lors de la progression narrative de phase en phase

```javascript
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

**Résultat** :
- ✅ Activation automatique dès l'entrée en phases 17-22
- ✅ Durée : 10 minutes (600 000 ms)
- ✅ Munitions infinies (9999)

---

### 2️⃣ **Activation Automatique - setupMurMode()** (Ligne 4751-4757)

**Quand** : Lors de l'initialisation du mode mur

```javascript
// Activer automatiquement le mode tir MUR pour phases 17-22
if (phase >= 17 && phase <= 22) {
    if (!window.modeTirMur) {
        window.modeTirMur = { actif: false, fin: 0 };
    }
    window.modeTirMur.actif = true;
    window.modeTirMur.fin = Date.now() + 600000; // 10 minutes
    munitions = 9999;
    console.log(`🎯 Phase ${phase} - Mode tir MUR activé automatiquement (setupMurMode)`);
}
```

**Résultat** :
- ✅ Activation lors du setup du mode mur
- ✅ Durée : 10 minutes
- ✅ Munitions infinies

---

### 3️⃣ **Activation Manuelle - Clic sur Brique** (Ligne 16044-16049)

**Quand** : Lorsque le joueur clique sur une brique du mur

```javascript
if (phaseActuelle >= 17 && phaseActuelle <= 22 && phaseJeu === 'mur') {
    const briqueCliquee = briques.find(b =>
        b.visible &&
        x >= b.x && x <= b.x + b.w &&
        y >= b.y && y <= b.y + b.h
    );

    if (briqueCliquee) {
        // Activer le mode tir MUR temporairement
        if (!window.modeTirMur) {
            window.modeTirMur = { actif: false, fin: 0 };
        }
        window.modeTirMur.actif = true;
        window.modeTirMur.fin = Date.now() + 10000; // 10 secondes
        afficherMessagePowerupSimple('🎯 Mode Tir MUR activé ! (10s)');
        return;
    }
}
```

**Résultat** :
- ✅ Activation manuelle par interaction
- ✅ Durée : 10 secondes (10 000 ms)
- ✅ Message affiché au joueur

---

### 4️⃣ **Vérification Tir - tirerProjectile()** (Ligne 12702)

**Quand** : À chaque tentative de tir

```javascript
function tirerProjectile(mouseX, mouseY) {
    const phaseActuelle = narrationManager ? narrationManager.currentPhase : 0;
    const isWallPhase = phaseActuelle >= 17 && phaseActuelle <= 22 
                        && phaseJeu === 'mur' 
                        && window.modeTirMur 
                        && window.modeTirMur.actif;
    
    if (rechargement > 0 || (phaseJeu !== 'lanterne' && !isWallPhase)) return;
    
    // ... créer projectile avec config selon phase
}
```

**Résultat** :
- ✅ Empêche le tir si `modeTirMur.actif === false`
- ✅ Vérifie phase 17-22 + mode mur
- ✅ Bloque les tirs hors conditions

---

### 5️⃣ **Handler Mousedown** (Ligne 16167-16172)

**Quand** : Clic sur le canvas

```javascript
else if(window.modeTirMur && window.modeTirMur.actif && phaseJeu === 'mur') {
    // Mode tir MUR activé
    if(Date.now() > window.modeTirMur.fin) {
        window.modeTirMur.actif = false;  // Désactiver si expiré
    } else {
        const rect = canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
        const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
        tirerProjectile(mouseX, mouseY);  // Tirer avec système progressif
    }
}
```

**Résultat** :
- ✅ Gère les clics quand mode MUR actif
- ✅ Désactive automatiquement si expiré
- ✅ Appelle `tirerProjectile()` avec position souris

---

### 6️⃣ **Handler Mousemove** (Ligne 15490-15492)

**Quand** : Mouvement souris avec bouton maintenu (tir continu)

```javascript
if(tirEnCours && (phaseJeu === 'lanterne' || phaseJeu === 'mur' || phaseJeu === 'stars')) {
    const now = Date.now();
    if(now - dernierTir > delaiTir) {
        const mouseX = ...;
        const mouseY = ...;

        if(phaseJeu === 'stars') {
            tirerStarsProjectile(mouseX, mouseY);
        } else if(phaseJeu === 'mur' && window.modeTirMur && window.modeTirMur.actif) {
            // Mode tir MUR (système projectiles progressifs phases 17-22)
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

**Résultat** :
- ✅ Tir continu en maintenant le clic
- ✅ Priorité au mode MUR si actif
- ✅ Fallback sur autres systèmes

---

## ⏱️ Durées d'Activation

| Méthode | Durée | Contexte |
|---------|-------|----------|
| **goToNextPhaseDirect()** | 10 minutes | Progression narrative |
| **setupMurMode()** | 10 minutes | Initialisation mode mur |
| **Clic sur brique** | 10 secondes | Activation manuelle |

---

## 🔄 Cycle de Vie

```
┌─────────────────────────────────────────────┐
│  1. Entrée en phase 17-22                   │
│     → goToNextPhaseDirect() OU setupMurMode()│
│     → window.modeTirMur.actif = true         │
│     → window.modeTirMur.fin = Date.now() + 600000│
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  2. Joueur peut tirer (clic ou maintien)    │
│     → Handler mousedown/mousemove vérifie   │
│     → Si modeTirMur.actif === true          │
│     → Appelle tirerProjectile()             │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  3. tirerProjectile() vérifie conditions    │
│     → Phase 17-22 ?                         │
│     → phaseJeu === 'mur' ?                  │
│     → modeTirMur.actif === true ?           │
│     → Si OUI : créer projectile avec config │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  4. Vérification expiration                 │
│     → Handler vérifie Date.now() > fin ?    │
│     → Si expiré : modeTirMur.actif = false  │
│     → Sinon : continuer à tirer             │
└─────────────────────────────────────────────┘
```

---

## 🎮 Différence avec window.modeTirStars

| Critère | `window.modeTirMur` | `window.modeTirStars` |
|---------|---------------------|----------------------|
| **Usage** | Système progressif phases 17-22 | Power-up Poxerstart |
| **Activation** | Automatique (entrée phase) | Power-up (collecte) |
| **Durée** | 10 minutes (auto) / 10s (manuel) | 7 secondes |
| **Phases** | 17-22 uniquement | Toutes phases |
| **Projectiles** | 6 types progressifs | Étoiles dorées |
| **Fonction** | `tirerProjectile()` | `tirerStarsProjectile()` |
| **Contexte** | `phaseJeu === 'mur'` | Tous modes |

---

## 🧪 Tests Console

### Vérifier l'état actuel
```javascript
console.log("Mode tir MUR:", window.modeTirMur);
console.log("Actif:", window.modeTirMur?.actif);
console.log("Expire:", new Date(window.modeTirMur?.fin));
console.log("Phase:", narrationManager?.currentPhase);
console.log("Mode jeu:", phaseJeu);
```

### Activer manuellement
```javascript
window.modeTirMur = { actif: true, fin: Date.now() + 600000 };
munitions = 9999;
console.log("✅ Mode tir MUR activé manuellement");
```

### Désactiver
```javascript
if(window.modeTirMur) {
    window.modeTirMur.actif = false;
}
console.log("❌ Mode tir MUR désactivé");
```

### Tester avec phase spécifique
```javascript
// Aller en phase 19 (multicolores 💫)
narrationManager.currentPhase = 19;
phaseJeu = 'mur';
creerMurDansLaMer();
window.modeTirMur = { actif: true, fin: Date.now() + 999999 };
munitions = 9999;

// Cliquer sur le canvas → devrait tirer 💫 multicolores
```

---

## 📊 Résumé

**`window.modeTirMur`** est le **contrôleur central** du système de tir progressif :

1. ✅ **Active/Désactive** le mode tir pour phases 17-22
2. ✅ **Contrôle la durée** d'activation (timestamp `fin`)
3. ✅ **Vérifié** par toutes les fonctions de tir
4. ✅ **Séparé** du système Poxerstart (`modeTirStars`)
5. ✅ **Automatique** via progression narrative
6. ✅ **Manuel** via clic sur brique (10s)

**Sans `window.modeTirMur.actif === true`, aucun tir n'est possible en phases 17-22 !**

---

**Dernière mise à jour** : 13 octobre 2025  
**Système** : Complètement opérationnel ✅  
**Phases concernées** : 17-22 (6 types de projectiles)
