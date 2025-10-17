# 🧪 TEST DU FORMULAIRE - Diagnostic

## Commandes à exécuter dans la console du navigateur

### 1. Tester l'affichage du formulaire directement
```javascript
// Forcer l'affichage du formulaire
afficherFormulaireFinDeJeuAvecResume(1000, 5000, 6000, 60, 'TEST123');
```

### 2. Vérifier que la fonction existe
```javascript
console.log('Fonction existe ?', typeof afficherFormulaireFinDeJeuAvecResume);
```

### 3. Tester perdreVie() et Game Over
```javascript
// Mettre les vies à 1 puis perdre une vie
vies = 1;
perdreVie();
```

### 4. Forcer finDuVoyage()
```javascript
finDuVoyage();
```

### 5. Vérifier le flag formulaireFinAffiche
```javascript
console.log('Flag formulaire:', formulaireFinAffiche);
// Si true, réinitialiser:
formulaireFinAffiche = false;
```

### 6. Vérifier les erreurs JavaScript
```javascript
// Ouvrir la console (F12) et chercher les erreurs en rouge
```

### 7. Test complet avec logs
```javascript
// Réinitialiser le flag
formulaireFinAffiche = false;

// Tester avec des valeurs réalistes
console.log('🧪 Test formulaire...');
afficherFormulaireFinDeJeuAvecResume(
    1500,    // xp
    8000,    // scoreJeu
    9500,    // scoreTotal
    95,      // scoreSagesse
    'PB123TEST'  // idUnique
);

// Vérifier après 1 seconde
setTimeout(() => {
    const overlay = document.getElementById('formulaire-fin-overlay');
    console.log('Overlay trouvé ?', overlay ? '✅ OUI' : '❌ NON');
    if (overlay) {
        console.log('Overlay style:', overlay.style.cssText);
    }
}, 1000);
```

## Problèmes possibles et solutions

### Problème 1 : Le formulaire ne s'affiche pas du tout
**Cause possible :** Erreur JavaScript avant l'affichage

**Solution :** Ouvrir la console (F12) et chercher les erreurs en rouge

### Problème 2 : formulaireFinAffiche est déjà true
**Cause possible :** Le flag n'a pas été réinitialisé

**Solution :**
```javascript
formulaireFinAffiche = false;
finDuVoyage();
```

### Problème 3 : Le canvas n'est pas trouvé
**Cause possible :** getElementById('gameCanvas') retourne null

**Solution :** Vérifier
```javascript
console.log('Canvas:', document.getElementById('gameCanvas'));
```

### Problème 4 : getTranslatedText n'existe pas
**Cause possible :** Fonction de traduction manquante

**Solution :**
```javascript
console.log('getTranslatedText existe ?', typeof getTranslatedText);
```

### Problème 5 : Le z-index est trop bas
**Cause possible :** Un autre élément est au-dessus

**Solution :** Vérifier dans l'inspecteur (F12 → Elements)

### Problème 6 : Supabase bloque l'affichage
**Cause possible :** Erreur dans la sauvegarde du score

**Solution :** Désactiver temporairement Supabase pour tester

## Test de Game Over rapide

```javascript
// Test complet de Game Over
console.log('🎮 Test Game Over...');

// 1. Réinitialiser
formulaireFinAffiche = false;

// 2. Mettre à 0 vies
vies = 0;

// 3. Déclencher Game Over
finDuVoyage();

// 4. Vérifier après 2 secondes
setTimeout(() => {
    const overlay = document.getElementById('formulaire-fin-overlay');
    if (overlay) {
        console.log('✅ FORMULAIRE AFFICHÉ !');
    } else {
        console.error('❌ FORMULAIRE NON AFFICHÉ');
        console.log('Flag:', formulaireFinAffiche);
        console.log('Jeu actif:', jeu);
    }
}, 2000);
```

## Si rien ne marche : Version simplifiée

```javascript
// Créer un overlay simple pour tester
const testOverlay = document.createElement('div');
testOverlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.9); z-index: 99999; display: flex; align-items: center; justify-content: center;';
testOverlay.innerHTML = '<div style="background: white; padding: 50px; border-radius: 20px; color: black; font-size: 24px;">TEST FORMULAIRE OK ✅</div>';
document.body.appendChild(testOverlay);

// Cliquer n'importe où pour fermer
testOverlay.onclick = () => testOverlay.remove();
```

Si cette version simplifiée fonctionne, le problème vient du contenu HTML du formulaire.
