# 🚢 Générateur d'icônes Petit Bateau

Ce projet contient un générateur d'icônes modernes pour l'application PWA "Petit Bateau".

## 🎨 Caractéristiques des icônes

- **Design moderne** avec bords arrondis (18% de rayon)
- **Ciel bleu clair** avec nuages doux
- **Bateau rouge** avec effets 3D détaillés
- **Voile blanche triangulaire** avec ombres réalistes
- **Texte "Petit Bateau"** en bold blanc en haut
- **Effets de lumière** et reflets professionnels

## 📁 Structure des fichiers

```
📦 petitbateau/
├── 🎨 generate-icons.html    # Générateur web interactif
├── 🛠️ generate-icons.js      # Version Node.js (nécessite Canvas)
├── 📦 package.json           # Dépendances NPM
├── 🔧 organize-icons.bat     # Script pour organiser les icônes
├── 📁 icons/                 # Dossier de destination des icônes
└── 📋 ICONS-README.md        # Ce fichier
```

## 🚀 Utilisation rapide

### Méthode 1: Générateur web (Recommandé)

1. **Ouvrir le générateur** :
   ```bash
   # Démarrer un serveur local
   python -m http.server 8080
   ```

2. **Aller à** : `http://localhost:8080/generate-icons.html`

3. **Générer et télécharger** :
   - Cliquez sur "✨ Générer toutes les icônes PWA"
   - Cliquez sur "⬇️ Télécharger toutes les icônes"
   - Ou téléchargez chaque icône individuellement

4. **Organiser les icônes** :
   ```bash
   # Exécuter le script d'organisation
   organize-icons.bat
   ```

### Méthode 2: Script Node.js

```bash
# Installer les dépendances (peut nécessiter des outils de build)
npm install canvas

# Générer toutes les icônes
node generate-icons.js
```

## 📏 Tailles d'icônes générées

| Taille | Usage |
|--------|-------|
| 72×72 | Icône de base |
| 96×96 | Icône mobile standard |
| 128×128 | Icône desktop |
| 144×144 | Haute résolution mobile |
| 152×152 | iOS/iPad |
| 192×192 | Android standard |
| 384×384 | Haute résolution |
| 512×512 | Splash screen/Store |

## 🔧 Configuration manifest.json

Assurez-vous que votre `manifest.json` référence correctement les icônes :

```json
{
  "icons": [
    {
      "src": "icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🎨 Personnalisation

Pour modifier le design des icônes, éditez la fonction `createIcon()` dans :
- `generate-icons.html` (version web)
- `generate-icons.js` (version Node.js)

### Éléments modifiables :
- Couleurs du ciel et de l'eau
- Forme et couleur du bateau
- Style de la voile
- Position et style du texte
- Effets de lumière et ombres

## 🐛 Résolution de problèmes

### Canvas ne s'installe pas (Windows)
La bibliothèque Canvas nécessite des outils de build. Utilisez plutôt la version web HTML.

### Les icônes ne se téléchargent pas
- Vérifiez que votre navigateur autorise les téléchargements multiples
- Essayez de télécharger chaque icône individuellement

### Le script organize-icons.bat ne trouve pas les icônes
- Vérifiez que les icônes sont dans le dossier `Téléchargements`
- Déplacez manuellement les fichiers `icon-*.png` vers le dossier `icons/`

## 📱 Test PWA

Après avoir placé les icônes dans le dossier `icons/`, testez votre PWA :

1. Servez votre application via HTTPS
2. Ouvrez les DevTools → Application → Manifest
3. Vérifiez que toutes les icônes sont correctement chargées
4. Testez l'installation de la PWA sur mobile et desktop

---

🚢 **Bon voyage avec Petit Bateau !** ⛵