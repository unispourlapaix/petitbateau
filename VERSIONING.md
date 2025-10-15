# 🔄 Guide de Versioning Automatisé - Petit Bateau Rouge

## 📋 Comment déployer une nouvelle version

### Étape 1 : Modifier VERSION.json

```json
{
  "version": "2.3.0",  // ← CHANGE ICI
  "date": "2025-10-16", // ← DATE DU JOUR
  "changelog": {
    "2.3.0": {  // ← NOUVELLE VERSION
      "title": "✨ Titre de la mise à jour",
      "date": "2025-10-16",
      "changes": [
        "✅ Correction 1",
        "✅ Correction 2",
        "🎨 Nouvelle fonctionnalité",
        "⚡ Optimisation performance"
      ]
    },
    // ... anciennes versions (garder l'historique)
  }
}
```

### Étape 2 : Mettre à jour sw.js

```javascript
// Ligne 3 dans sw.js
const CACHE_NAME = 'petit-bateau-v2.3.0'; // ← SYNCHRONISER AVEC VERSION.json
```

### Étape 3 : Commit et Push

```bash
git add VERSION.json sw.js petitbateauRouge.html
git commit -m "🚀 Version 2.3.0 - Description"
git push origin main
```

### Étape 4 : Déploiement automatique

- GitHub Pages déploie automatiquement (1-2 minutes)
- Les utilisateurs reçoivent le popup de mise à jour
- Le changelog s'affiche automatiquement

---

## 📊 Système Actuel

### ✅ Ce qui se passe automatiquement :

1. **Détection** : Service Worker détecte nouvelle version
2. **Popup** : Affiche le changelog complet :
   ```
   🎮 [Titre de la mise à jour]
   
   📦 Version 2.3.0
   📅 2025-10-16
   
   ✅ Correction 1
   ✅ Correction 2
   🎨 Nouvelle fonctionnalité
   ⚡ Optimisation performance
   ... et X autres améliorations
   
   Voulez-vous mettre à jour maintenant ?
   ```

3. **Choix utilisateur** :
   - **OUI** → Mise à jour immédiate + reload
   - **NON** → Bannière en haut de page avec détails

### 🎯 Avantages :

- ✅ **Changelog automatique** depuis VERSION.json
- ✅ **Versioning centralisé** (un seul fichier à modifier)
- ✅ **Historique complet** des versions
- ✅ **UX améliorée** (utilisateurs voient ce qui change)
- ✅ **Fallback** si VERSION.json indisponible

---

## 🔧 Fichiers modifiés

- `VERSION.json` - Versioning centralisé et changelog
- `sw.js` - Service Worker avec cache versioning
- `petitbateauRouge.html` - Popup de mise à jour intelligent

---

## 📝 Template de Changelog

Utilise ces emojis pour une meilleure lisibilité :

- ✅ Corrections de bugs
- 🎨 Améliorations visuelles
- ⚡ Optimisations performance
- 🚀 Nouvelles fonctionnalités
- 🐛 Bugs critiques corrigés
- 🧹 Nettoyage de code
- 📱 Améliorations mobile
- 🌍 Traductions/Langues
- 🔧 Corrections techniques
- 💖 Améliorations UX

---

## 🎯 Workflow Recommandé

1. **Développement** : Code normalement
2. **Tests** : Vérifie sur localhost
3. **Version Mineure** (2.2.X) : Corrections bugs
   - Change `VERSION.json` version
   - Change `sw.js` CACHE_NAME
   - Commit & Push
   
4. **Version Majeure** (2.X.0) : Nouvelles fonctionnalités
   - Change `VERSION.json` version
   - Change `sw.js` CACHE_NAME
   - Ajoute changelog détaillé
   - Commit & Push

---

## 💡 Conseils

- **Sémantique** : Utilise versioning sémantique (MAJOR.MINOR.PATCH)
- **Changelog** : Limite à 5-7 changements principaux dans le popup
- **Tests** : Teste toujours en localhost avant de push
- **Cache** : Change TOUJOURS `CACHE_NAME` pour forcer la mise à jour

---

**Créé le** : 15 octobre 2025  
**Version actuelle** : 2.2.1  
**Prochaine version** : À toi de décider ! 🚀
