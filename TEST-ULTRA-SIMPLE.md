# TEST ULTRA-SIMPLE - Copier/Coller dans la Console

## Étape 1 : Recharger la page
- Appuyez sur **F5** ou **Ctrl+R** pour recharger
- Attendez que le jeu soit chargé

## Étape 2 : Ouvrir la console
- Appuyez sur **F12**
- Cliquez sur l'onglet "Console"

## Étape 3 : Copier-coller CE CODE EXACTEMENT

```javascript
// ============================================
// TEST PHASE 17 - PIÈCES D'OR
// ============================================

// 1. Configuration phase
console.log("🔧 Configuration phase 17...");
narrationManager.currentPhase = 17;
phaseJeu = 'mur';

// 2. Créer briques
console.log("🧱 Création briques...");
briques = [];
for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 8; col++) {
        briques.push({
            x: 50 + col * 90,
            y: 50 + row * 40,
            w: 80,
            h: 35,
            visible: true,
            vie: 3,
            couleur: '#FFD700',
            clignotement: 0
        });
    }
}

// 3. Activer tir
console.log("🎯 Activation mode tir...");
window.modeTirStars = { actif: true, fin: Date.now() + 999999 };
munitions = 999;
projectiles = [];

// 4. Vérification
console.log("✅ SETUP TERMINÉ!");
console.log("📊 État actuel:");
console.log("   - Phase:", narrationManager.currentPhase);
console.log("   - Mode:", phaseJeu);
console.log("   - Tir actif:", window.modeTirStars.actif);
console.log("   - Briques:", briques.length);
console.log("   - Config phase 17:", getProjectileConfig(17));
console.log("");
console.log("🎮 CLIQUEZ MAINTENANT SUR LE CANVAS!");
console.log("   Vous devriez voir: ⭐ (pièces d'or)");
console.log("   PAS: ★ (étoiles classiques)");
```

## Étape 4 : CLIQUEZ sur le canvas

Vous devriez voir des **⭐ pièces d'or** apparaître et voler vers où vous avez cliqué.

## Si Ça Ne Marche Toujours Pas

Tapez dans la console :

```javascript
// Vérifier que la fonction est appelée
tirerProjectile(400, 300);
console.log("Projectiles après tir:", projectiles.length);
if (projectiles.length > 0) {
    console.log("Premier projectile:", projectiles[0]);
}
```

## Ce Que Vous Devriez Voir

### ✅ BON (nouveau système)
```
⭐ ← Emoji pièce d'or avec glow doré
```

### ❌ MAUVAIS (ancien système)
```
★ ← Étoile à 5 branches dessinée
```

## Tests Autres Phases

### Phase 19 - Multicolore
```javascript
narrationManager.currentPhase = 19;
window.modeTirStars.actif = true;
// Cliquez → 💫 de 5 couleurs différentes avec traînées
```

### Phase 20 - Arc-en-ciel
```javascript
narrationManager.currentPhase = 20;
window.modeTirStars.actif = true;
// Cliquez → 🌈 qui change de couleur en vol
```

### Phase 23 - Finale
```javascript
narrationManager.currentPhase = 23;
window.modeTirStars.actif = true;
laserState.lastFired = 0;
// Cliquez → 💖💛💚💙💜 rotatifs
// Attendez 20s → ⚡ LASER
```

---

**Si après ce test vous voyez ENCORE des étoiles classiques ★, faites-moi savoir et je vérifierai le code plus en profondeur.**
