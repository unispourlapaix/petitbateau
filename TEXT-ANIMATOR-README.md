# 🎬 TextAnimator - Guide d'utilisation

## 📋 Table des matières
- [Installation](#-installation)
- [Démarrage rapide](#-démarrage-rapide)
- [Animations disponibles](#-animations-disponibles)
- [Méthodes utilitaires](#%EF%B8%8F-méthodes-utilitaires)
- [Exemples avancés](#-exemples-avancés)
- [Support et compatibilité](#-support-et-compatibilité)

---

## 🔧 Installation

### Méthode 1 : Inclusion directe
```html
<!DOCTYPE html>
<html>
<head>
    <title>Mon site</title>
</head>
<body>
    <div id="monTexte"></div>

    <!-- Inclure le module -->
    <script src="text-animator.js"></script>

    <script>
        // Votre code ici
        const anim = new TextAnimator('monTexte');
        anim.typewriter('Hello Emmanuel !');
    </script>
</body>
</html>
```

### Méthode 2 : Import ES6 (si configuré)
```javascript
import TextAnimator from './text-animator.js';

const anim = new TextAnimator('monTexte');
anim.typewriter('Hello Emmanuel !');
```

---

## 🚀 Démarrage rapide

### Étape 1 : Créer l'élément HTML
```html
<div id="titre"></div>
<div id="message"></div>
<div id="erreur"></div>
```

### Étape 2 : Initialiser l'animateur
```javascript
// Créer une instance pour chaque élément
const animTitre = new TextAnimator('titre');
const animMessage = new TextAnimator('message');
const animErreur = new TextAnimator('erreur');
```

### Étape 3 : Lancer une animation
```javascript
animTitre.typewriter('Bienvenue sur mon site !');
```

---

## 🎬 Animations disponibles

### 💻 Animation Typewriter (Machine à écrire)

Affiche le texte caractère par caractère, comme une machine à écrire.

```javascript
anim.typewriter(texte, vitesse, callback)
```

**Paramètres :**
- `texte` (string) : Le texte à afficher
- `vitesse` (number, optionnel) : Millisecondes entre chaque caractère (défaut: 50)
- `callback` (function, optionnel) : Fonction appelée à la fin

**Exemples :**
```javascript
// Animation simple
anim.typewriter('Hello Emmanuel !');

// Avec vitesse personnalisée
anim.typewriter('Texte lent...', 100);

// Avec callback
anim.typewriter('Chargement...', 50, () => {
    console.log('Animation terminée !');
    anim.typewriter('\\nTerminé !', 30);
});

// Support HTML
anim.typewriter('<strong>Titre</strong>\\nTexte normal');
```

### 🔢 Animation Digital (Style Matrix)

Affiche le texte avec un effet de stabilisation progressive, style Matrix.

```javascript
anim.digital(texte, vitesse, callback)
```

**Paramètres :**
- `texte` (string) : Le texte à afficher
- `vitesse` (number, optionnel) : Millisecondes entre chaque caractère (défaut: 30)
- `callback` (function, optionnel) : Fonction appelée à la fin

**Exemples :**
```javascript
// Animation digital simple
anim.digital('Système activé...');

// Avec vitesse rapide
anim.digital('ACCÈS AUTORISÉ', 20);

// Avec callback
anim.digital('Scanning...', 40, () => {
    anim.typewriter('\\nScan terminé !');
});
```

### ⚡ Animation Glitch (Effet de corruption)

Crée un effet de corruption/glitch temporaire sur le texte.

```javascript
anim.glitch(texte, durée, callback)
```

**Paramètres :**
- `texte` (string) : Le texte à afficher
- `durée` (number, optionnel) : Durée de l'effet en millisecondes (défaut: 2000)
- `callback` (function, optionnel) : Fonction appelée à la fin

**Exemples :**
```javascript
// Glitch simple
anim.glitch('ERREUR SYSTÈME !!!');

// Glitch long
anim.glitch('Corruption détectée...', 5000);

// Avec callback
anim.glitch('ALERTE !', 1500, () => {
    anim.typewriter('\\nSystème restauré.');
});
```

---

## 🛠️ Méthodes utilitaires

### 🎨 Personnaliser les couleurs

```javascript
anim.setColors(couleurTexte, couleurEffet)
```

**Paramètres :**
- `couleurTexte` (string) : Couleur du texte principal (CSS color)
- `couleurEffet` (string) : Couleur des effets (curseur, ombres, etc.)

**Exemples :**
```javascript
// Couleurs personnalisées
anim.setColors('#ff6b6b', '#64ffda');

// Chaînage avec animation
anim.setColors('#00ff00', '#ffffff')
    .typewriter('Texte vert !');

// Différents formats de couleur
anim.setColors('red', 'blue');
anim.setColors('rgb(255, 0, 0)', 'rgba(0, 255, 0, 0.5)');
anim.setColors('#ff0000', 'hsl(120, 100%, 50%)');
```

### ⏹️ Arrêter une animation

```javascript
anim.stop()
```

**Exemple :**
```javascript
// Démarrer une animation
anim.typewriter('Texte très long qui prend du temps...');

// L'arrêter après 2 secondes
setTimeout(() => {
    anim.stop();
}, 2000);
```

### ❓ Vérifier l'état de l'animation

```javascript
if (anim.isAnimating()) {
    console.log('Animation en cours...');
} else {
    console.log('Pas d\\'animation en cours.');
}
```

---

## 💡 Exemples avancés

### Séquence d'animations

```javascript
const anim = new TextAnimator('demo');

// Séquence : digital → typewriter → glitch
anim.digital('Initialisation...', 30, () => {
    anim.typewriter('\\nSystème prêt !', 50, () => {
        setTimeout(() => {
            anim.glitch('ERREUR CRITIQUE !', 2000, () => {
                anim.typewriter('\\nRedémarrage...');
            });
        }, 1000);
    });
});
```

### Interface de chat simulée

```javascript
const chat = new TextAnimator('chatBox');

function simulateMessage(user, message, delay = 0) {
    setTimeout(() => {
        chat.typewriter(`<strong>${user}:</strong> ${message}\\n`, 30);
    }, delay);
}

simulateMessage('Emmanuel', 'Salut ! Comment ça va ?', 0);
simulateMessage('Bot', 'Très bien merci ! Et toi ?', 2000);
simulateMessage('Emmanuel', 'Parfait ! 😊', 4000);
```

### Effet de terminal

```javascript
const terminal = new TextAnimator('terminal');
terminal.setColors('#00ff00', '#64ffda');

const commands = [
    '$ npm install text-animator',
    'Installation en cours...',
    '✓ text-animator@1.0.0 installé',
    '$ node app.js',
    'Serveur démarré sur le port 3000'
];

function executeCommand(index = 0) {
    if (index < commands.length) {
        terminal.typewriter(commands[index] + '\\n', 40, () => {
            setTimeout(() => executeCommand(index + 1), 500);
        });
    }
}

executeCommand();
```

### Système de notifications

```javascript
class NotificationSystem {
    constructor(elementId) {
        this.anim = new TextAnimator(elementId);
    }

    success(message) {
        this.anim.setColors('#28a745', '#64ffda')
                 .typewriter('✅ ' + message);
    }

    error(message) {
        this.anim.setColors('#dc3545', '#ff6b6b')
                 .glitch('❌ ' + message, 1500);
    }

    info(message) {
        this.anim.setColors('#17a2b8', '#64ffda')
                 .digital('ℹ️ ' + message);
    }
}

const notify = new NotificationSystem('notifications');
notify.success('Opération réussie !');
setTimeout(() => notify.error('Erreur détectée !'), 3000);
setTimeout(() => notify.info('Information importante'), 6000);
```

---

## 🔧 Support et compatibilité

### Navigateurs supportés
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### Formats de texte supportés
- ✅ **HTML** : `<strong>`, `<em>`, `<span>`, etc.
- ✅ **Sauts de ligne** : `\\n` automatiquement converti en `<br>`
- ✅ **Émojis** : 😊 🎉 🚀 ⚡ 💻
- ✅ **Caractères spéciaux** : àáâäèéêë, çñü, etc.
- ✅ **Multilingue** : Français, Anglais, Espagnol, etc.

### Bonnes pratiques

#### ✅ À faire
```javascript
// Utiliser des IDs uniques
const anim1 = new TextAnimator('titre');
const anim2 = new TextAnimator('contenu');

// Gérer les callbacks pour les séquences
anim.typewriter('Premier texte', 50, () => {
    anim.digital('Deuxième texte');
});

// Utiliser stop() avant de changer d'animation
anim.stop();
anim.typewriter('Nouveau texte');
```

#### ❌ À éviter
```javascript
// Ne pas réutiliser la même instance sur différents éléments
const anim = new TextAnimator('element1');
anim.element = document.getElementById('element2'); // ❌

// Ne pas oublier les callbacks pour les séquences
anim.typewriter('Premier texte');
anim.typewriter('Deuxième texte'); // ❌ va interrompre le premier
```

### Dépannage

#### L'animation ne démarre pas
- Vérifiez que l'élément HTML existe
- Vérifiez que l'ID est correct
- Vérifiez la console pour les erreurs

#### L'animation s'arrête brusquement
- Une autre animation a probablement été lancée
- Utilisez `stop()` avant de lancer une nouvelle animation

#### Les couleurs ne s'appliquent pas
- Vérifiez le format CSS des couleurs
- Essayez avec des couleurs de base : 'red', 'blue', etc.

---

## 📞 Support

Pour des questions ou des rapports de bugs :
- Consultez les exemples dans `test-text-animator.html`
- Vérifiez la console de votre navigateur (F12)
- Testez avec des exemples simples d'abord

---

**TextAnimator v1.0** - Module d'animation de texte pour JavaScript
Créé avec ❤️ pour des expériences utilisateur engageantes !