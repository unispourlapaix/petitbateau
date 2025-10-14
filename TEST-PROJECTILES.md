# Guide de Test - Système de Projectiles Progressifs

## 🎮 Comment Tester

### Accès au Jeu
1. Serveur lancé sur : **http://localhost:8000/petitbateauRouge.html**
2. Ouvrir dans le navigateur
3. Sélectionner une langue

### Atteindre les Phases de Tir

Pour tester rapidement les phases 17-23, vous devez :

#### Option 1 : Jouer normalement
- Compléter les phases 1-16
- Les phases 17-22 sont les phases "mur"
- Phase 23 est la phase finale

#### Option 2 : Mode Debug (recommandé pour test)
Ouvrir la console du navigateur (F12) et taper :
```javascript
// Aller directement à une phase
narrationManager.currentPhase = 17; // ou 18, 19, 20, 21, 22, 23
phaseJeu = 'mur';

// IMPORTANT : Créer des briques pour le mur
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

// Activer le mode tir (OBLIGATOIRE pour phases mur)
window.modeTirStars = { actif: true, fin: Date.now() + 999999 };

// Munitions infinies (déjà actif)
munitions = 999;
```

**IMPORTANT** : Pour les phases 17-23 en mode mur, vous devez :
1. **Cliquer sur une brique** pour activer le mode tir (10s)
2. OU utiliser la console : `window.modeTirStars = { actif: true, fin: Date.now() + 999999 };`

### Tests par Phase

#### 🪙 Phase 17 : Pièces d'Or
```javascript
// Setup phase 17
narrationManager.currentPhase = 17;
phaseJeu = 'mur';

// Créer des briques si nécessaire
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
                couleur: '#FFD700'
            });
        }
    }
}

// OBLIGATOIRE : Activer le mode tir
window.modeTirStars = { actif: true, fin: Date.now() + 999999 };
munitions = 999;
```
**À vérifier :**
- ⭐ Projectiles dorés (pas emoji lanterne!)
- Taille 14px
- Pas de traînée
- Cadence normale (20 frames)

#### ✨ Phase 18 : Étoiles
```javascript
narrationManager.currentPhase = 18;
phaseJeu = 'mur';
window.modeTirStars = { actif: true, fin: Date.now() + 999999 };
```
**À vérifier :**
- ✨ Projectiles blancs
- Scintillement
- Taille 16px

#### 💫 Phase 19 : Multicolore
```javascript
narrationManager.currentPhase = 19;
phaseJeu = 'mur';
window.modeTirStars = { actif: true, fin: Date.now() + 999999 };
```
**À vérifier :**
- 💫 5 couleurs différentes
- **Traînées lumineuses** visibles (15px)
- Vitesse légèrement augmentée
- Cadence plus rapide (18 frames)

#### 🌈 Phase 20 : Arc-en-Ciel
```javascript
narrationManager.currentPhase = 20;
phaseJeu = 'mur';
window.modeTirStars = { actif: true, fin: Date.now() + 999999 };
```
**À vérifier :**
- 🌈 **Couleur change en vol** (7 couleurs)
- Traînées plus longues (20px)
- Transition fluide toutes les 100ms
- Effet hypnotique

#### 🔥 Phase 21 : Tir Rapide
```javascript
narrationManager.currentPhase = 21;
phaseJeu = 'mur';
window.modeTirStars = { actif: true, fin: Date.now() + 999999 };
window.doubleShotActive = true; // Activer le double tir
```
**À vérifier :**
- 🔥 Couleurs jaune-orange vives
- **Cadence ULTRA-rapide** (8 frames)
- Vitesse maximale (12)
- **Double tir** : 2 projectiles avec angle de 30°
- Traînées courtes mais visibles

#### 💖 Phase 22 : Gros Cœurs
```javascript
narrationManager.currentPhase = 22;
phaseJeu = 'mur';
window.modeTirStars = { actif: true, fin: Date.now() + 999999 };
```
**À vérifier :**
- 💖 Projectiles GÉANTS (24px)
- Couleurs rose foncé et rose clair
- Traînées longues (18px)
- **8 PARTICULES** à chaque impact sur brique
- Explosions colorées
- Plus lent mais puissant

#### 💖💛💚💙💜 Phase 23 : FINALE
```javascript
narrationManager.currentPhase = 23;
phaseJeu = 'mur';
window.modeTirStars = { actif: true, fin: Date.now() + 999999 };

// Pour tester le laser immédiatement
laserState.lastFired = 0;
```
**À vérifier :**
- 💖💛💚💙💜 **5 cœurs colorés différents**
- **ROTATION** continue des projectiles
- Traînées maximales (20px)
- **12 particules** multicolores à l'impact
- **⚡ RAYON LASER** :
  - Se déclenche automatiquement toutes les 20 secondes
  - Message "⚡ RAYON LASER ACTIVÉ !"
  - Effet néon cyan horizontal
  - Éclairs électriques blancs
  - Détruit toute une ligne de briques
  - Explosion de 20 particules par brique

### Tester le Laser Manuellement

```javascript
// Forcer le tir du laser
narrationManager.currentPhase = 23;
phaseJeu = 'mur';
laserState.lastFired = 0; // Reset timer
activerLaser(); // Tir immédiat
```

### Checklist Complète

#### Visuel
- [ ] Projectiles de la bonne taille par phase
- [ ] Couleurs correctes et variées
- [ ] Traînées lumineuses visibles (phases 19-23)
- [ ] Rotation visible (phase 23)
- [ ] Changement de couleur fluide (phase 20)
- [ ] Emojis affichés correctement

#### Mécanique
- [ ] Cadence différente par phase
- [ ] Vitesse augmente progressivement
- [ ] Double tir fonctionne (phase 21)
- [ ] Rechargement respecté

#### Effets Spéciaux
- [ ] Particules à l'impact (phases 22-23)
- [ ] Nombre correct de particules (8 ou 12)
- [ ] Couleurs des particules variées
- [ ] Laser se déclenche toutes les 20s (phase 23)
- [ ] Effet néon du laser visible
- [ ] Éclairs électriques animés
- [ ] Briques détruites sur la ligne laser

#### Performance
- [ ] Pas de lag avec beaucoup de projectiles
- [ ] Projectiles hors écran supprimés
- [ ] Traînées ne ralentissent pas le jeu
- [ ] Particules recyclées correctement

### Problèmes Connus / À Vérifier

1. **Si les projectiles ne tirent pas :**
   - Vérifier que `window.modeTirStars.actif = true`
   - Vérifier que `munitions > 0`
   - Vérifier que `phaseJeu === 'mur'`

2. **Si les couleurs ne changent pas (phase 20) :**
   - Vérifier dans la console : `projectiles[0].colorIndex`
   - Doit changer toutes les 100ms

3. **Si le laser ne tire pas (phase 23) :**
   - Vérifier `laserState.lastFired`
   - Reset avec : `laserState.lastFired = 0;`
   - Attendre 20 secondes ou forcer : `activerLaser();`

4. **Si le double tir ne fonctionne pas (phase 21) :**
   - Activer manuellement : `window.doubleShotActive = true;`

### Console Debug Utiles

```javascript
// Voir la config actuelle
getProjectileConfig(narrationManager.currentPhase)

// Voir tous les projectiles
projectiles

// Voir l'état du laser
laserState

// Compter les projectiles
projectiles.length

// Voir les particules
particules.length

// Reset tout
projectiles = [];
particules = [];
laserState = { lastFired: 0, active: false, startTime: 0, duration: 1000 };
```

### Commandes Rapides de Test

```javascript
// Tester toutes les phases rapidement
for(let phase = 17; phase <= 23; phase++) {
    setTimeout(() => {
        narrationManager.currentPhase = phase;
        console.log(`🎮 Phase ${phase} activée`);
    }, (phase - 17) * 5000); // 5 secondes par phase
}
```

## 🎯 Résultats Attendus

### Progression Visuelle
Phase 17 → 18 → 19 → 20 → 21 → 22 → 23
Simple → Classique → Coloré → Arc-en-ciel → Rapide → Massif → ULTIME

### Progression Mécanique
- **Cadence** : 20 → 20 → 18 → 15 → 8 → 25 → 15
- **Vitesse** : 8 → 8 → 9 → 10 → 12 → 7 → 9
- **Taille** : 14 → 16 → 16 → 18 → 14 → 24 → 20

### Impact Joueur
Le joueur doit sentir une **montée en puissance** claire :
1. Apprentissage (17-18)
2. Découverte visuelle (19-20)
3. Puissance brute (21)
4. Impact massif (22)
5. Apothéose (23 + laser)

## 📊 Métriques de Succès

- ✅ Toutes les phases affichent des projectiles différents
- ✅ Traînées visibles et fluides
- ✅ Changement de couleur smooth (phase 20)
- ✅ Rotation visible (phase 23)
- ✅ Double tir fonctionnel (phase 21)
- ✅ Particules explosent à l'impact (22-23)
- ✅ Laser tire toutes les 20s (phase 23)
- ✅ Performance maintenue (60 FPS)

---

**Note** : Le système est conçu pour être progressif et satisfaisant. Chaque phase doit apporter un "wow moment" sans être overwhelming.

**Bon test ! 🚀**
