# 🚀 Serveurs de Développement - Petit Bateau Rouge

## 📋 Options disponibles

### Option 1 : Node.js (Recommandé) ⭐

**Fichier**: `dev.bat`

**Prérequis**: Node.js installé ([télécharger ici](https://nodejs.org/))

**Utilisation**:
```bash
.\dev.bat
```

**Fonctionnalités**:
- ✅ Serveur HTTP avec CORS activé
- ✅ Cache désactivé (mode développement)
- ✅ Ouverture automatique du navigateur
- ✅ Port: 3000
- ✅ URL: http://localhost:3000

---

### Option 2 : Python (Alternative)

**Fichier**: `dev-python.bat`

**Prérequis**: Python 3.x installé ([télécharger ici](https://www.python.org/downloads/))

**Utilisation**:
```bash
.\dev-python.bat
```

**Fonctionnalités**:
- ✅ Serveur HTTP simple
- ⚠️ Ouverture manuelle requise
- ✅ Port: 8000
- ✅ URL: http://localhost:8000/petitbateauRouge.html

---

## 🎯 Que choisir ?

| Critère | Node.js | Python |
|---------|---------|--------|
| **Vitesse** | ⚡ Rapide | 🐌 Moyen |
| **CORS** | ✅ Oui | ⚠️ Limité |
| **Auto-open** | ✅ Oui | ❌ Non |
| **Facilité** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

**Recommandation**: Utilisez `dev.bat` (Node.js) pour la meilleure expérience.

---

## 🔧 Commandes NPM

Si vous préférez utiliser npm directement:

```bash
# Démarrer le serveur (port 3000)
npm start

# Ou version alternative
npm run dev

# Serveur sur port 8080
npm run serve
```

---

## 🐛 Résolution de problèmes

### "Node.js n'est pas installé"
👉 Installez Node.js: https://nodejs.org/

### "Python n'est pas installé"
👉 Installez Python: https://www.python.org/downloads/

### Le port 3000 est déjà utilisé
👉 Tuez le processus:
```bash
taskkill /f /im node.exe
```

### Le jeu ne charge pas
1. Vérifiez que vous êtes dans le bon dossier
2. Vérifiez que `petitbateauRouge.html` existe
3. Essayez de vider le cache du navigateur (Ctrl+F5)

---

## ⚡ Optimisations Actives

Les serveurs de développement utilisent automatiquement:

- 📱 **Résolution adaptative mobile** (0.35× à 1.5× max)
- 🎨 **Qualité automatique** selon le device
- 🚀 **Cache désactivé** pour voir les changements instantanément
- 🌐 **CORS activé** pour Supabase et APIs externes

---

## 📝 Notes

- Les scripts vérifient automatiquement si Node.js/Python est installé
- Le serveur s'arrête avec `Ctrl+C`
- Les anciens processus sont nettoyés automatiquement
- Le navigateur s'ouvre automatiquement avec `dev.bat`

---

**Créé par**: Emmanuel Payet - Petit Bateau Rouge Team  
**Version**: 1.0  
**Date**: Novembre 2025
