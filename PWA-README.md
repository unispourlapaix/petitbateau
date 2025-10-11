# 🚢 Petit Bateau - Progressive Web App

## 🌟 Installation

### Sur Mobile (Android/iOS)
1. Ouvrir le lien dans votre navigateur mobile
2. Aller dans le menu du navigateur
3. Sélectionner "Ajouter à l'écran d'accueil" ou "Installer l'application"
4. L'icône apparaîtra sur votre écran d'accueil

### Sur Desktop (Chrome/Edge)
1. Ouvrir le jeu dans le navigateur
2. Cliquer sur l'icône d'installation dans la barre d'adresse
3. Ou aller dans Menu > Installer "Petit Bateau"

## 🎮 Fonctionnalités PWA

- ✅ **Fonctionne hors ligne** une fois installé
- ✅ **Expérience plein écran** sans interface de navigateur
- ✅ **Démarrage rapide** depuis l'écran d'accueil
- ✅ **Mises à jour automatiques** en arrière-plan
- ✅ **Installation facile** sur tous les appareils

## 📱 Compatibilité

- **Android**: Chrome, Samsung Internet, Firefox
- **iOS**: Safari 11.3+
- **Desktop**: Chrome 67+, Edge 79+, Safari 13.1+

## 🔧 Développement

### Fichiers PWA ajoutés :
- `manifest.json` - Configuration de l'application
- `sw.js` - Service Worker pour le cache et fonctionnement hors ligne
- `icons/` - Icônes de différentes tailles
- `generate-icons.html` - Générateur d'icônes temporaires

### Génération des icônes :
1. Ouvrir `generate-icons.html` dans un navigateur
2. Télécharger toutes les icônes générées
3. Les placer dans le dossier `icons/`

### Test local :
```bash
# Serveur local simple avec Python
python -m http.server 8000

# Ou avec Node.js
npx serve .
```

### Cache et mises à jour :
- Modifier la version dans `sw.js` (CACHE_NAME) pour forcer une mise à jour
- Les utilisateurs recevront une notification de mise à jour

## 🎯 Optimisations

### Performance :
- Tous les fichiers sont mis en cache
- Démarrage instantané après installation
- Chargement optimisé des ressources

### UX :
- Mode plein écran pour une expérience immersive
- Orientation paysage recommandée
- Gestion des écrans de différentes tailles

## 📊 Analytics PWA

Le Service Worker peut être étendu pour inclure :
- Tracking des installations
- Mesure de l'engagement hors ligne
- Statistiques d'utilisation

## 🚀 Déploiement

Pour déployer la PWA :

1. **GitHub Pages** (gratuit)
2. **Netlify** (gratuit)
3. **Vercel** (gratuit)
4. **Serveur personnel avec HTTPS**

⚠️ **Important** : HTTPS est requis pour les Service Workers (sauf localhost)

## 🔍 Debug

### Console développeur :
- Ouvrir F12 > Application > Service Workers
- Vérifier le statut et les erreurs
- Tester la mise en cache

### Test d'installation :
- Chrome DevTools > Application > Manifest
- Lighthouse pour audit PWA
- Application installée visible dans chrome://apps/