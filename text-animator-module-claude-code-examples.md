# 🎬 TextAnimator Module - Guide Complet et Exemples

## 📋 Table des matières
- [Installation Rapide](#-installation-rapide)
- [API Complète](#-api-complète)
- [Exemples Pratiques](#-exemples-pratiques)
- [Référence Complète](#-référence-complète)

---

## 🚀 Installation Rapide

### Méthode Simple
```html
<!DOCTYPE html>
<html>
<head>
    <title>Mon Projet</title>
</head>
<body>
    <div id="monTexte"></div>

    <!-- Inclure le module -->
    <script src="text-animator.js"></script>

    <script>
        // Utilisation immédiate
        const anim = new TextAnimator('monTexte');
        anim.typewriter('Hello Emmanuel !');
    </script>
</body>
</html>
```

---

## 🎯 API Complète

### 🎬 Animations Texte

#### 💻 Typewriter (Machine à écrire)
```javascript
anim.typewriter(texte, vitesse, callback)
```

**Exemple :**
```javascript
const anim = new TextAnimator('demo');
anim.typewriter('Hello Emmanuel !', 50, () => {
    console.log('Animation terminée !');
});
```

#### 🔢 Digital (Style Matrix)
```javascript
anim.digital(texte, vitesse, callback)
```

**Exemple :**
```javascript
const anim = new TextAnimator('demo');
anim.digital('SYSTÈME ACTIVÉ', 30, () => {
    console.log('Digital terminé !');
});
```

#### ⚡ Glitch (Effet corruption)
```javascript
anim.glitch(texte, durée, callback)
```

**Exemple :**
```javascript
const anim = new TextAnimator('demo');
anim.glitch('ERREUR SYSTÈME', 2000, () => {
    console.log('Glitch terminé !');
});
```

### 🎨 Effets Visuels

#### 🌑 Shadow 3D
```javascript
anim.shadow3d(texte, profondeur, couleur, callback)
```

**Exemple :**
```javascript
const anim = new TextAnimator('demo');
anim.shadow3d('Texte avec Relief', 8, '#333333');
```

#### 💡 Neon
```javascript
anim.neon(texte, couleur, intensité, callback)
```

**Exemple :**
```javascript
const anim = new TextAnimator('demo');
anim.neon('NEON GLOW', '#00ffff', 4);
```

#### 🏔️ Emboss
```javascript
anim.emboss(texte, couleurClaire, couleurSombre, callback)
```

**Exemple :**
```javascript
const anim = new TextAnimator('demo');
anim.emboss('Texte Gravé', '#ffffff', '#666666');
```

#### ⭕ Outline
```javascript
anim.outline(texte, couleurContour, épaisseur, callback)
```

**Exemple :**
```javascript
const anim = new TextAnimator('demo');
anim.outline('Contour Net', '#000000', 3);
```

#### 🔥 Fire
```javascript
anim.fire(texte, durée, callback)
```

**Exemple :**
```javascript
const anim = new TextAnimator('demo');
anim.fire('Texte Enflammé', 4000);
```

#### ❄️ Ice
```javascript
anim.ice(texte, durée, callback)
```

**Exemple :**
```javascript
const anim = new TextAnimator('demo');
anim.ice('Cristal Gelé', 3000);
```

### 🛠️ Méthodes Utilitaires

#### 🎨 Personnaliser Couleurs
```javascript
anim.setColors(couleurTexte, couleurEffet)
```

#### ⏹️ Arrêter Animation
```javascript
anim.stop()
```

#### ❓ Vérifier État
```javascript
anim.isAnimating() // retourne true/false
```

---

## 🎯 Exemples Complets {#exemples}

### 🎮 Interface de Jeu
```javascript
class GameInterface {
    constructor() {
        this.titleAnim = new TextAnimator('gameTitle');
        this.messageAnim = new TextAnimator('gameMessage');
        this.statusAnim = new TextAnimator('gameStatus');
    }

    showTitle() {
        this.titleAnim.neon('🎮 VOIR LA VÉRITÉ', '#64ffda', 5);
    }

    showMessage(text) {
        this.messageAnim.typewriter(text, 40);
    }

    showAlert(text) {
        this.statusAnim.glitch('⚠️ ' + text, 1500);
    }

    showSuccess(text) {
        this.statusAnim.fire('✅ ' + text, 2000);
    }
}

const game = new GameInterface();
game.showTitle();
game.showMessage('Bienvenue dans l\'aventure...');
```

### 💻 Simulation Terminal
```javascript
class TerminalSimulator {
    constructor(elementId) {
        this.anim = new TextAnimator(elementId);
        this.anim.setColors('#00ff00', '#64ffda');
    }

    executeCommand(command, output, delay = 0) {
        setTimeout(() => {
            this.anim.typewriter(`$ ${command}\n`, 30, () => {
                setTimeout(() => {
                    this.anim.typewriter(output + '\n\n', 20);
                }, 500);
            });
        }, delay);
    }

    boot() {
        const commands = [
            ['ls -la', 'total 42\ndrwxr-xr-x  5 user  staff  160 Jan 01 12:00 .'],
            ['npm start', 'Server running on port 3000'],
            ['git status', 'On branch main\nnothing to commit, working tree clean']
        ];

        commands.forEach((cmd, index) => {
            this.executeCommand(cmd[0], cmd[1], index * 3000);
        });
    }
}

const terminal = new TerminalSimulator('terminal');
terminal.boot();
```

### 🎬 Générique de Film
```javascript
class MovieCredits {
    constructor() {
        this.credits = new TextAnimator('credits');
    }

    async playCredits() {
        // Titre principal avec effet neon
        this.credits.neon('🎬 VOIR LA VÉRITÉ', '#ffd700', 6);

        await this.wait(3000);

        // Réalisateur avec effet emboss
        this.credits.emboss('Réalisé par Emmanuel', '#ffffff', '#333333');

        await this.wait(2500);

        // Acteurs avec typewriter
        this.credits.typewriter('Avec :\nClaude AI\nTextAnimator Module\nJavaScript Engine');

        await this.wait(4000);

        // Fin avec effet ice
        this.credits.ice('❄️ FIN ❄️', 2000);
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

const credits = new MovieCredits();
credits.playCredits();
```

### 🚨 Système d'Alertes
```javascript
class AlertSystem {
    constructor() {
        this.alertBox = new TextAnimator('alertBox');
    }

    info(message) {
        this.alertBox.setColors('#17a2b8', '#64ffda');
        this.alertBox.digital('ℹ️ ' + message);
    }

    success(message) {
        this.alertBox.setColors('#28a745', '#64ffda');
        this.alertBox.fire('✅ ' + message, 2000);
    }

    warning(message) {
        this.alertBox.setColors('#ffc107', '#ff8c00');
        this.alertBox.outline('⚠️ ' + message, '#ff8c00', 2);
    }

    error(message) {
        this.alertBox.setColors('#dc3545', '#ff6b6b');
        this.alertBox.glitch('❌ ' + message, 1500);
    }

    critical(message) {
        this.alertBox.setColors('#ff0000', '#ffffff');
        this.alertBox.shadow3d('🔴 CRITIQUE: ' + message, 10, '#ff0000');
    }
}

const alerts = new AlertSystem();
alerts.success('Opération réussie !');
setTimeout(() => alerts.warning('Attention requise'), 3000);
setTimeout(() => alerts.error('Erreur détectée'), 6000);
```

### 📺 Show de Texte
```javascript
class TextShow {
    constructor() {
        this.stage = new TextAnimator('stage');
        this.currentEffect = 0;
        this.effects = [
            () => this.stage.typewriter('🎪 Bienvenue au TextShow !'),
            () => this.stage.digital('🤖 Mode Digital'),
            () => this.stage.glitch('⚡ Glitch Effect'),
            () => this.stage.neon('💡 Neon Lights', '#ff00ff'),
            () => this.stage.fire('🔥 Texte en Feu'),
            () => this.stage.ice('❄️ Gel Cristallin'),
            () => this.stage.shadow3d('🌑 Relief 3D'),
            () => this.stage.emboss('🏔️ Gravure'),
            () => this.stage.outline('⭕ Contour Net')
        ];
    }

    nextEffect() {
        if (this.currentEffect < this.effects.length) {
            this.effects[this.currentEffect]();
            this.currentEffect++;
        } else {
            this.currentEffect = 0;
            this.stage.neon('🎉 Show Terminé !', '#64ffda');
        }
    }

    autoPlay() {
        this.nextEffect();
        const interval = setInterval(() => {
            this.nextEffect();
            if (this.currentEffect === 0) {
                clearInterval(interval);
            }
        }, 3000);
    }
}

const show = new TextShow();
show.autoPlay();
```

---

## 📊 Référence Complète

| Méthode | Type | Paramètres | Description |
|---------|------|------------|-------------|
| `typewriter()` | Animation | `(text, speed=50, callback)` | Machine à écrire, caractère par caractère |
| `digital()` | Animation | `(text, speed=30, callback)` | Effet Matrix, stabilisation progressive |
| `glitch()` | Animation | `(text, duration=2000, callback)` | Corruption temporaire |
| `shadow3d()` | Effet | `(text, depth=5, color='#333', callback)` | Ombre 3D avec profondeur |
| `neon()` | Effet | `(text, color='#00ffff', intensity=3, callback)` | Éclat néon lumineux |
| `emboss()` | Effet | `(text, light='#fff', dark='#666', callback)` | Relief gravé |
| `outline()` | Effet | `(text, color='#000', thickness=2, callback)` | Contour épais |
| `fire()` | Effet | `(text, duration=3000, callback)` | Flammes animées |
| `ice()` | Effet | `(text, duration=2000, callback)` | Cristaux scintillants |
| `setColors()` | Utilitaire | `(textColor, effectColor)` | Personnaliser couleurs |
| `stop()` | Utilitaire | `()` | Arrêter animation |
| `isAnimating()` | Utilitaire | `()` | Vérifier état |

### 🎨 Codes Couleur Recommandés

**Couleurs Neon :**
- Cyan: `#00ffff`
- Magenta: `#ff00ff`
- Vert: `#00ff00`
- Orange: `#ff8c00`

**Couleurs Fire :**
- Rouge: `#ff4444`
- Orange: `#ff8800`
- Jaune: `#ffff00`

**Couleurs Ice :**
- Bleu clair: `#87ceeb`
- Cyan: `#00ffff`
- Blanc: `#ffffff`

### ⚡ Vitesses Recommandées

- **Typewriter lent :** 100ms
- **Typewriter normal :** 50ms
- **Typewriter rapide :** 20ms
- **Digital lent :** 50ms
- **Digital normal :** 30ms
- **Digital rapide :** 10ms

### 🔧 Conseils d'Optimisation

1. **Gestion mémoire :** Toujours appeler `stop()` avant de changer d'animation
2. **Performance :** Éviter les animations simultanées sur trop d'éléments
3. **UX :** Utiliser les callbacks pour enchaîner les animations
4. **Accessibilité :** Prévoir une option pour désactiver les animations

---

**TextAnimator Module v1.0** - Animation de texte JavaScript
Créé avec ❤️ pour des interfaces utilisateur exceptionnelles !