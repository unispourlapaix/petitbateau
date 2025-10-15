# 📱 Optimisations Mobile - Petit Bateau Rouge

## ✅ Améliorations Implémentées

### 1. **Viewport Optimisé**
- `viewport-fit=cover` pour utiliser tout l'écran (notch inclus)
- `maximum-scale=1.0` pour empêcher le zoom
- Support des viewports dynamiques (`dvw`, `dvh`) pour iOS

### 2. **Résolution Adaptative**
- Détection automatique du `devicePixelRatio` 
- Canvas haute résolution sur écrans Retina/AMOLED
- Scaling automatique du contexte pour qualité optimale
- Adaptation aux dimensions physiques de l'écran

### 3. **Mode Portrait Forcé**
- Détection de l'orientation du téléphone
- Message d'avertissement automatique en mode paysage
- Blocage du jeu jusqu'au retour en mode portrait
- Traductions multilingues du message (fr, en, es)

### 4. **Gestion Tactile Améliorée**
- Support complet des événements `touchstart`, `touchmove`, `touchend`
- Calcul précis des positions tactiles avec pixel ratio
- Prévention du scroll et du zoom (`touch-action: none`)
- Fonction `obtenirPosition()` unifiée souris/tactile

### 5. **Détection Mobile**
- Identification automatique des appareils mobiles
- Support iPhone, iPad, Android, etc.
- Détection des capacités tactiles
- Comportement adaptatif PC vs Mobile

### 6. **Responsive Layout**
```css
/* Mobile : Plein écran */
@media (max-width: 499px) {
    - Utilisation de 100% de l'écran
    - Pas de bordures/marges
    - Height avec -webkit-fill-available (iOS)
}

/* PC : Format portrait fixe 450x800 */
@media (min-width: 500px) {
    - Ratio 9:16 maintenu
    - Bordures arrondies
    - Ombres et effets visuels
}
```

### 7. **Gestion des Orientations**
- Event listener `orientationchange`
- Redimensionnement automatique du canvas
- Recalcul des constantes de jeu (C.W, C.H, etc.)
- Debounce pour éviter les appels multiples

### 8. **Optimisations Performance**
- `position: fixed` sur body pour éviter le scroll
- Canvas mis à l'échelle selon pixel ratio
- Throttle sur les événements resize (100ms)
- Délai après changement d'orientation (300ms)

## 🎮 Constantes Adaptatives

Le système recalcule automatiquement :
- `C.W` / `C.H` : Largeur/hauteur du canvas
- `C.PW` / `C.PH` : Dimensions de la raquette (bateau)
- `C.BS` : Taille de la balle
- `C.SP` : Vitesse de base

## 🌍 Traductions Ajoutées

### FR
- `portrait_required`: "Mode Portrait Requis"
- `rotate_device`: "Veuillez tourner votre appareil en mode portrait"

### EN
- `portrait_required`: "Portrait Mode Required"
- `rotate_device`: "Please rotate your device to portrait mode"

### ES
- `portrait_required`: "Modo Retrato Requerido"
- `rotate_device`: "Por favor, gira tu dispositivo al modo vertical"

## 📋 Checklist de Test Mobile

- [ ] Tester sur iPhone (Safari)
- [ ] Tester sur Android (Chrome)
- [ ] Vérifier rotation portrait → paysage → portrait
- [ ] Tester contrôles tactiles (précision)
- [ ] Vérifier performance (60 FPS)
- [ ] Tester avec différentes tailles d'écran
- [ ] Vérifier message d'orientation multilingue
- [ ] Tester fullscreen iOS (barre d'adresse)

## 🔧 Code Clé

### Détection Mobile
```javascript
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                 || (window.innerWidth < 500);
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
```

### Setup Canvas Mobile
```javascript
if (isMobile) {
    const pixelRatio = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    
    ctx.scale(pixelRatio, pixelRatio);
}
```

### Position Tactile Précise
```javascript
function obtenirPosition(e) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    const x = (touch.clientX - rect.left) * (isMobile ? 1 : scaleX / (window.devicePixelRatio || 1));
    const y = (touch.clientY - rect.top) * (isMobile ? 1 : scaleY / (window.devicePixelRatio || 1));
    return { x, y };
}
```

## 🎯 Résultat Attendu

✅ **Mobile** : Plein écran natif, haute résolution, contrôles tactiles précis, mode portrait forcé
✅ **PC** : Format portrait 450x800, bordures esthétiques, contrôles souris
✅ **Universel** : Traductions, performance, expérience fluide

---

**Date de mise à jour** : 15 octobre 2025
**Version** : 2.0 - Mobile Optimized
