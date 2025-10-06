# 📊 Documentation des Systèmes de Score et Progression

## Vue d'ensemble
Le jeu "Voir la Vérité" utilise **plusieurs systèmes de mesure** pour suivre la progression du joueur :

---

## 🌟 1. Système XP (Points de Connaissance)
**Variable :** `pointsConnaissance`
**Affichage :** `⭐ XP: ${pointsConnaissance}`
**Contexte :** Phase `tir_coeurs_haut` (début du jeu)

### Utilisation
- **Objectif :** Mesurer la progression de connaissance et apprentissage du joueur
- **Phase active :** Phase d'introduction et d'apprentissage
- **Icône :** ⭐ (étoile)

### Sources de points XP
```javascript
// Interactions d'apprentissage
pointsConnaissance += 50;  // Cœurs touchés (apprentissage majeur)
pointsConnaissance += 10;  // Interactions diverses
pointsConnaissance += 100; // Bonus d'introduction
```

### Exemples de gains
- **50 XP** : Toucher des cœurs pendant la phase d'apprentissage
- **10 XP** : Petites interactions d'apprentissage
- **100 XP** : Bonus de complétion de l'introduction

---

## 🕊️ 2. Système Score d'Ange (Points de Jeu)
**Variable :** `score` (synchronisé avec `window.score`)
**Affichage :** `🕊️ ${score}`
**Contexte :** Toutes les phases sauf `tir_coeurs_haut`

### Utilisation
- **Objectif :** Score de performance de jeu principal
- **Phase active :** Toutes les phases de gameplay
- **Icône :** 🕊️ (colombe)

### Sources de points Score d'Ange
```javascript
// Actions de jeu principales
score += 1000;  // Découverte mode secret, étoiles montantes
score += 500;   // Briques spéciales, projectiles étoiles
score += 300;   // Éliminations diverses
score += 50;    // Touches standard, coups réussis
```

### Exemples de gains
- **1000 points** : Mode secret découvert, étoiles montantes touchées
- **500 points** : Briques spéciales détruites, projectiles étoiles
- **300 points** : Éliminations d'éléments spéciaux
- **50 points** : Touches de routine, casse-briques standard

---

## 🔄 Synchronisation
```javascript
// Le score d'ange est synchronisé globalement
score += points;
window.score = score; // Synchronisation avec le score global
```

---

## 🎯 Mode Secret
Le **mode secret utilise le système Score d'Ange** :
- Les points gagnés en mode secret s'ajoutent directement au `window.score`
- Bonus de découverte : +100 XP puis passage au système Score d'Ange
- Bonus de victoire mode secret : +5000 points Score d'Ange

---

## 📱 Affichage dans l'Interface
```javascript
// Logique d'affichage conditionnelle
if(phaseJeu === 'tir_coeurs_haut') {
    ctx.fillText(`⭐ XP: ${pointsConnaissance}`, 15, statsY);
} else {
    ctx.fillText(`🕊️ ${score}`, 15, statsY);
}
```

### Interface
- **Coin supérieur gauche** : Affichage du score actuel selon la phase
- **Transition automatique** : Passage de XP à Score d'Ange lors du changement de phase

---

## 🛠️ Pour les Développeurs

### Variables clés
```javascript
let pointsConnaissance = 0; // Système XP (apprentissage)
let score = 0;              // Système Score d'Ange (gameplay)
window.score = score;       // Score global synchronisé
```

### Modification des scores
```javascript
// XP - Phase d'apprentissage
pointsConnaissance += valeur;

// Score d'Ange - Gameplay principal
score += valeur;
window.score = score; // N'oubliez pas la synchronisation !
```

---

## ❤️ 3. Système de Vies
**Variable :** `vies`
**Affichage :** `❤️❤️❤️` (cœurs) ou `💔` (si plus de vies)
**Valeur initiale :** 3 vies

### Utilisation
- **Objectif :** Gestion des échecs et game over
- **Perte de vie :** Balle qui sort de l'écran
- **Régénération :** Remise à 3 vies à chaque nouveau jeu

---

## 🧱 4. Compteur de Briques Brisées
**Variable :** `brises`
**Affichage :** `🧱 ${brises}/${VOYAGE.length}`
**Contexte :** Suivi de progression dans les niveaux

### Utilisation
- **Objectif :** Mesurer la progression dans le niveau actuel
- **Affichage :** Nombre de briques cassées / Total de briques
- **Condition de victoire :** `brises >= VOYAGE.length`

### Exemple
```javascript
brises++; // Incrémenter à chaque brique cassée
if(brises >= VOYAGE.length) {
    // Niveau terminé !
}
```

---

## 🗄️ 5. Système d'Énigmes Collectées
**Context :** Menu des énigmes
**Affichage :** `Collectées: ${collected}/${total} (${percent}%)`

### Utilisation
- **Objectif :** Suivi de la collection d'énigmes découvertes
- **Base de données :** `ENIGMES_DATABASE`
- **Progression :** Pourcentage de complétion

### Calcul
```javascript
const total = Object.keys(ENIGMES_DATABASE).length;
const percent = Math.round((collected / total) * 100);
```

---

## 🎯 6. Progression de Voyage
**Context :** Système de progression générale
**Fonctions :** `chargerProgression()`, `sauvegarderProgression()`

### Utilisation
- **Objectif :** Sauvegarde locale de la progression
- **Stockage :** `localStorage`
- **Fonctionnalités :** Reprise de partie, suivi des niveaux

---

## 📈 Résumé Complet
- **⭐ XP (pointsConnaissance)** = Apprentissage et introduction
- **🕊️ Score d'Ange (score)** = Performance de jeu principal
- **❤️ Vies (vies)** = Gestion des échecs
- **🧱 Briques (brises)** = Progression niveau
- **📜 Énigmes** = Collection et découverte
- **💾 Progression** = Sauvegarde et continuité
- **Transition automatique** selon `phaseJeu`
- **Mode secret** contribue au Score d'Ange