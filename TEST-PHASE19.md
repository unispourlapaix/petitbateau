# Test Rapide - Phase 19 Multicolore

## Configuration Phase 19

```javascript
// Phase 19 - Projectiles Multicolores
narrationManager.currentPhase = 19;
phaseJeu = 'mur';

// Créer des briques
if (briques.length === 0) {
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 8; col++) {
            briques.push({
                x: 50 + col * 90,
                y: 50 + row * 40,
                w: 80,
                h: 35,
                visible: true,
                vie: 3,
                couleur: '#FF6B9D'
            });
        }
    }
}

// Activer le mode tir
window.modeTirStars = { actif: true, fin: Date.now() + 999999 };
munitions = 999;
```

## Ce Que Vous Devriez Voir

### Projectiles
- **Emoji** : 💫 (étoile filante)
- **Couleurs** : Chaque tir a une couleur DIFFÉRENTE parmi :
  - 🔴 Rose vif (#FF6B9D)
  - 🔴 Rouge foncé (#C44569)
  - 🔵 Bleu (#4A69BD)
  - 🔵 Turquoise (#60A3BC)
  - 🟡 Jaune doré (#F8B500)

### Traînées Lumineuses
- **Longueur** : 15px
- **Couleur** : Même couleur que le projectile
- **Opacité** : 60%
- **Effet** : Ligne qui suit le projectile

### Caractéristiques
- **Taille** : 16px
- **Vitesse** : 9 (légèrement plus rapide que phase 17-18)
- **Cadence** : 18 frames (plus rapide)

## Visuellement

Chaque tir devrait ressembler à :
```
💫 ═══
```

Avec des couleurs différentes :
```
💫 ═══  (rose)
💫 ═══  (rouge)
💫 ═══  (bleu)
💫 ═══  (turquoise)
💫 ═══  (jaune)
```

## Différences avec Phase 20 (Arc-en-ciel)

**Phase 19 (Multicolor)** :
- Couleur FIXE par projectile (choisie au hasard à la création)
- 5 couleurs possibles
- Traînée 15px

**Phase 20 (Rainbow)** :
- Couleur CHANGE en vol (toutes les 100ms)
- 7 couleurs du spectre
- Traînée 20px (plus longue)

## Vérification

1. ✅ Tirez plusieurs projectiles
2. ✅ Chaque projectile devrait avoir une couleur différente (aléatoire)
3. ✅ La traînée doit être visible et de la même couleur
4. ✅ L'emoji 💫 doit être clairement visible (pas d'étoile à 5 branches derrière)
5. ✅ Glow coloré autour de l'emoji

## Debug

Pour voir la couleur d'un projectile :
```javascript
// Afficher les projectiles actuels
projectiles.forEach((p, i) => {
    console.log(`Projectile ${i}: colorIndex=${p.colorIndex}, couleur=${p.config.color[p.colorIndex]}`);
});
```

---

**Résultat attendu** : Un feu d'artifice multicolore avec traînées lumineuses ! 🎆
