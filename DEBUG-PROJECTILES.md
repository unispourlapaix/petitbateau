# DEBUG - Vérifier l'État Actuel

Ouvrez la console (F12) et tapez :

```javascript
// Vérifier l'état actuel
console.log("Phase actuelle:", narrationManager ? narrationManager.currentPhase : "N/A");
console.log("Phase jeu:", phaseJeu);
console.log("Mode tir actif:", window.modeTirStars);
console.log("Nombre de projectiles:", projectiles.length);
console.log("Munitions:", munitions);
```

## Diagnostic

### Si vous voyez "Phase actuelle: 6" (ou autre < 17)
→ Vous n'êtes PAS encore aux phases avec nouveaux projectiles
→ C'est NORMAL de voir les vieilles étoiles

### Si vous voyez "phaseJeu: lanterne"
→ Vous êtes en mode casse-briques classique
→ Les nouveaux projectiles ne s'activent qu'en mode "mur" (phases 17-23)

### Si vous voyez "Mode tir actif: undefined" ou "actif: false"
→ Le mode tir n'est pas activé
→ Il faut cliquer sur une brique du mur OU activer manuellement

## Solution : Forcer Phase 17 avec Nouveau Système

```javascript
// SETUP COMPLET pour phase 17
narrationManager.currentPhase = 17;
phaseJeu = 'mur';

// Créer un mur de briques
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

// Activer le mode tir
if (!window.modeTirStars) {
    window.modeTirStars = { actif: false, fin: 0 };
}
window.modeTirStars.actif = true;
window.modeTirStars.fin = Date.now() + 999999;

// Munitions infinies
munitions = 999;

// Nettoyer les anciens projectiles
projectiles = [];

// Vérifier que tout est bon
console.log("✅ Setup terminé!");
console.log("Phase:", narrationManager.currentPhase);
console.log("Mode jeu:", phaseJeu);
console.log("Tir actif:", window.modeTirStars.actif);
console.log("Briques:", briques.length);

// MAINTENANT CLIQUEZ SUR LE CANVAS POUR TIRER!
```

## Si Ça Ne Marche Toujours Pas

Vérifiez que `tirerProjectile()` est bien appelé :

```javascript
// Ajouter un log dans la fonction
// Modifiez temporairement le code ou testez :
tirerProjectile = (function() {
    const original = tirerProjectile;
    return function(mouseX, mouseY) {
        console.log("🎯 tirerProjectile appelé! Phase:", narrationManager.currentPhase);
        return original.call(this, mouseX, mouseY);
    };
})();
```

Puis cliquez et regardez la console.

## Configuration par Phase

Rappelez-vous :

- **Phases 0-16** : Système classique (lanternes/étoiles simples)
- **Phases 17-23** : NOUVEAU système avec projectiles progressifs
- **Mode 'mur'** : Obligatoire pour phases 17-23
- **modeTirStars.actif** : Doit être true

Si vous êtes en phase < 17, c'est NORMAL de ne pas voir les nouveaux projectiles!
