# 💾 Système de Sauvegarde/Reprise - Petit Bateau Rouge

## 🎯 Vue d'ensemble

Le jeu sauvegarde automatiquement votre progression pour vous permettre de reprendre exactement où vous vous êtes arrêté.

---

## 📦 Données Sauvegardées

### Variables de Jeu
- **Chapitre** actuel (1 ou 2)
- **Période** (jour/nuit)
- **Phase de jeu** (tir_coeurs_haut, lanterne, mur, etc.)
- **Score** actuel
- **Vies** restantes
- **Briques** brisées
- **Points de connaissance**
- **Mode secret** (actif/inactif)

### Progression Narrative
- **Phase actuelle** (1-23)
- **Historique des phases** parcourues
- **Énigmes collectées** (via enigmaCollector)

### ⏱️ **NOUVEAU v2.4.2** : Timings de Narration
- **Message narratif actif**
  - Texte complet du message
  - Temps restant d'affichage
  - Temps total du message
  - Niveau d'alpha (transparence)
  - Flags spéciaux (restart, partage, lien livre)
- **Message power-up actif**
  - Texte du power-up
  - Temps restant d'affichage
  - Niveau d'alpha
- **Animation du bateau**
  - État actif/inactif
  - Phase de l'animation (arrivée, arrêt, départ)
  - Temps écoulé depuis le début
- **Phase intro**
  - État actif/inactif
  - Étape de l'intro
  - Temps écoulé

---

## ⚙️ Fonctionnement

### 🔄 Sauvegarde Automatique

1. **Toutes les 30 secondes** pendant le jeu (en mode non-production)
2. **À chaque changement de phase** (transition narrative)
3. **Avant fermeture** de la page/navigateur
4. **Lors du game over** (sauvegarde du score)

### 📂 Chargement Automatique

Au démarrage du jeu :
- ✅ Détection automatique d'une sauvegarde
- 📊 Affichage des informations (date, phase, score, vies)
- ❓ Confirmation utilisateur pour charger ou recommencer
- ⚡ Restauration complète de l'état du jeu

---

## ⌨️ Raccourcis Clavier

| Touche | Action |
|--------|--------|
| **K** | 💾 Sauvegarder manuellement la partie |
| **L** | 📂 Charger la dernière sauvegarde |

Message de confirmation affiché à l'écran après chaque action.

---

## 🛠️ API Console (Développeurs)

### Sauvegarder
```javascript
window.saveGame()
// ou
GameSaveSystem.save()
```

### Charger
```javascript
window.loadGame()
// ou
GameSaveSystem.restore(GameSaveSystem.load())
```

### Obtenir les infos de sauvegarde
```javascript
window.getSaveInfo()
// Retourne: { date, phase, score, vies }
```

### Vérifier l'existence d'une sauvegarde
```javascript
GameSaveSystem.hasSave()
// Retourne: true/false
```

### Effacer la sauvegarde
```javascript
GameSaveSystem.clear()
```

---

## 💽 Stockage

### LocalStorage
- **Clé** : `petit_bateau_save`
- **Format** : JSON stringifié
- **Taille** : ~1-2 KB
- **Persistance** : Permanente (jusqu'à effacement manuel ou hard reset)

### Structure JSON
```json
{
  "version": "1.0",
  "timestamp": 1697385600000,
  "gameState": {
    "chapitre": 1,
    "periode": "jour",
    "phaseJeu": "tir_coeurs_haut",
    "score": 12500,
    "vies": 2,
    "brises": 45,
    "currentPhase": 8,
    "phaseHistory": [1, 2, 3, 4, 5, 6, 7, 8],
    "pointsConnaissance": 230,
    "jeu": true,
    "modeSecret": false,
    "messageNarratifActif": {
      "texte": "On m'a dit qu'ils étaient tous des monstres...",
      "tempsRestant": 8500,
      "tempsTotal": 12000,
      "alpha": 1.0,
      "avecRestart": false,
      "lienLivre": null,
      "avecPartage": false,
      "textePartage": null
    },
    "messagePowerupActif": {
      "texte": "+100 XP !",
      "tempsRestant": 2000,
      "alpha": 0.8
    },
    "animationBateau": {
      "active": true,
      "phase": "arrivee",
      "tempsEcoule": 5000
    },
    "phaseIntro": {
      "active": true,
      "etape": "arrivee_bateau",
      "tempsEcoule": 3000
    }
  }
}
```

---

## 🔒 Sécurité & Validations

### Vérifications au Chargement
1. ✅ Existence de la sauvegarde
2. ✅ Version compatible (v1.0)
3. ✅ Intégrité JSON
4. ✅ Valeurs valides (vies > 0, phase existante, etc.)

### Gestion d'Erreurs
- **Sauvegarde corrompue** → Ignore et démarre nouvelle partie
- **Version incompatible** → Ignore et démarre nouvelle partie
- **Erreur localStorage** → Continue sans sauvegarder (navigation privée)

---

## 🔥 Hard Reset vs Sauvegarde

### Hard Reset (`window.hardReset()`)
- ❌ **EFFACE TOUT** : sauvegarde + localStorage + cache
- ⚠️ Double confirmation requise
- 🔄 Rechargement complet de la page
- 💀 **IRRÉVERSIBLE**

### Nouvelle Partie (refus de charger)
- ✅ **GARDE** : sauvegarde existante (écrasée ensuite)
- ✅ **GARDE** : localStorage (langue, énigmes)
- ✅ Démarre phase 1 normalement

---

## 📊 Exemple d'Utilisation

### Scénario Typique

1. **Joueur joue** jusqu'à la phase 15
2. **Ferme le navigateur** → Sauvegarde auto
3. **Revient 2 jours plus tard**
4. **Popup de chargement** :
   ```
   💾 Partie sauvegardée trouvée !
   
   📅 Date: 13/10/2025 14:32:15
   🎯 Phase: 15
   ⭐ Score: 28450
   ❤️ Vies: 2
   
   Voulez-vous reprendre cette partie ?
   ```
5. **Clique OK** → Reprend exactement à la phase 15

---

## 🐛 Dépannage

### La sauvegarde ne fonctionne pas
```javascript
// Vérifier le localStorage
localStorage.getItem('petit_bateau_save')

// Tester manuellement
GameSaveSystem.save()
GameSaveSystem.load()
```

### Effacer une sauvegarde bloquée
```javascript
// Console navigateur
localStorage.removeItem('petit_bateau_save')
// ou
GameSaveSystem.clear()
```

### Restaurer manuellement un état spécifique
```javascript
const customState = {
  chapitre: 1,
  periode: 'jour',
  phaseJeu: 'tir_coeurs_haut',
  score: 10000,
  vies: 3,
  brises: 0,
  currentPhase: 10,
  phaseHistory: [1,2,3,4,5,6,7,8,9,10],
  pointsConnaissance: 150,
  jeu: true,
  modeSecret: false
};

GameSaveSystem.restore(customState);
```

---

## 📝 Notes Techniques

### Limites
- **Pas de versions multiples** : Une seule sauvegarde à la fois
- **Pas de slots** : Écrasement automatique
- **Pas de cloud** : Sauvegarde locale uniquement
- **Pas d'historique** : Pas d'annulation possible

### Performance
- ⚡ Sauvegarde : ~5-10ms
- ⚡ Chargement : ~15-20ms
- 💾 Taille : ~2-4 KB (avec timings)
- 🔋 Impact CPU : Négligeable

---

## 🚀 Version

**Système de sauvegarde v1.0**  
Implémenté dans la version **2.4.0** du jeu  
**Timings de narration** ajoutés en version **2.4.2**

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifier la console (`F12`)
2. Essayer `window.hardReset()` en dernier recours
3. Ouvrir une issue GitHub si le bug persiste

---

**🎮 Bon jeu et bonnes sauvegardes ! 💾**
