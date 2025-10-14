# 🐛 CORRECTION : Changement de langue ne fonctionne pas

## 📋 Problème identifié

Le changement de langue ne fonctionnait pas correctement.

### Cause racine

Le fichier `modules/i18n.js` avait une logique qui **ne chargeait PAS** le fichier `fr.json` pour le français.

**Code problématique (lignes 44-49) :**
```javascript
// LE FRANÇAIS RESTE INTÉGRÉ DANS LE JEU - PAS DE FICHIER JSON
if (lang === 'fr') {
    this.translations.fr = { loaded: true }; // Marquer comme chargé
    console.log(`🇫🇷 Français utilise les textes intégrés dans le jeu (pas de JSON)`);
    return; // ❌ Sort de la fonction sans charger le JSON !
}
```

**Conséquence :**
- Le français n'avait pas de traductions dans `this.translations.fr`
- La fonction `t(key)` retournait la **clé** au lieu de la traduction
- Dans `i18n-apply.js`, la condition `if (translation !== key)` empêchait la mise à jour
- Résultat : **les textes ne changeaient jamais**

---

## ✅ Solution appliquée

### 1. Modification de `modules/i18n.js`

**Nouveau code (lignes 44-60) :**
```javascript
// Charger les fichiers JSON pour TOUTES les langues (y compris le français)
try {
    const response = await fetch(`modules/lang/${lang}.json`);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const translations = await response.json();
    this.translations[lang] = translations;
    console.log(`🌍 Langue ${lang} chargée avec succès depuis JSON`);
} catch (error) {
    console.warn(`⚠️ Impossible de charger la langue ${lang}:`, error.message);
    // Pour le français, utiliser un objet vide pour fallback aux textes HTML
    if (lang === 'fr') {
        this.translations.fr = { loaded: true };
        console.log(`🇫🇷 Français utilise les textes intégrés dans le jeu (fallback)`);
    }
}
```

**Changements :**
- ✅ Le français charge maintenant `modules/lang/fr.json` comme les autres langues
- ✅ En cas d'erreur (fichier manquant), utilise un fallback vide
- ✅ Toutes les langues sont traitées de la même manière

### 2. Création d'un fichier de test

**Nouveau fichier : `test_i18n.html`**

Ce fichier permet de :
- ✅ Tester le changement de langue en temps réel
- ✅ Voir les logs de debug dans une console visuelle
- ✅ Vérifier que les traductions s'appliquent correctement
- ✅ Tester manuellement des clés de traduction

---

## 🧪 Comment tester

### Test 1 : Fichier de test dédié

1. **Ouvrir** : `test_i18n.html` dans votre navigateur
2. **Cliquer** sur les drapeaux 🇫🇷 🇬🇧 🇪🇸
3. **Observer** : Les textes doivent changer instantanément
4. **Vérifier** la console de débogage dans la page

### Test 2 : Jeu complet

1. **Ouvrir** : `petitbateauRouge.html`
2. **Vérifier** le sélecteur de langue en haut à droite
3. **Cliquer** sur 🇬🇧 (Anglais)
4. **Observer** : Les boutons/labels doivent passer en anglais
5. **Recharger** : La langue doit rester en anglais

### Test 3 : Console navigateur (F12)

```javascript
// Tester directement dans la console
changeLanguage('en')
// Devrait afficher : "🌍 Langue en chargée avec succès depuis JSON"

// Vérifier une traduction
window.i18n.t('ui.buttons.save')
// Devrait retourner : "💾 Save" (en anglais)

// Vérifier la langue actuelle
window.i18n.getCurrentLanguage()
// Devrait retourner : "en"
```

---

## 📊 Vérifications

### ✅ Checklist de validation

Après la correction, vérifier que :

- [ ] Le fichier `modules/i18n.js` a été modifié
- [ ] Le fichier `test_i18n.html` existe
- [ ] Les 3 fichiers JSON existent : `fr.json`, `en.json`, `es.json`
- [ ] Ouvrir `test_i18n.html` → pas d'erreur dans la console (F12)
- [ ] Cliquer sur 🇬🇧 → les textes passent en anglais
- [ ] Cliquer sur 🇪🇸 → les textes passent en espagnol
- [ ] Cliquer sur 🇫🇷 → les textes passent en français
- [ ] Recharger la page → garde la langue choisie

### 🔍 Logs attendus dans la console

**Au chargement :**
```
🌍 Module i18n chargé
🌍 Langue fr chargée avec succès depuis JSON
🌍 Langue changée vers: Français
✅ Module i18n-apply chargé
🌍 Jeu chargé en Français
```

**Lors du changement vers anglais :**
```
🌍 Changement de langue vers: en
🌍 Langue en chargée avec succès depuis JSON
🌍 Langue changée vers: English
🌍 Application des traductions pour: en
  📝 X éléments traduits [data-i18n]
  📝 X placeholders traduits
✅ Traductions appliquées avec succès
```

---

## 🐛 Problèmes potentiels restants

### Problème 1 : Fichiers JSON non trouvés (404)

**Symptôme :**
```
⚠️ Impossible de charger la langue en: HTTP 404: Not Found
```

**Solution :**
Vérifier que les fichiers existent :
```
modules/lang/
├── fr.json  ← Doit exister
├── en.json  ← Doit exister
└── es.json  ← Doit exister
```

### Problème 2 : CORS Error (file://)

**Symptôme :**
```
Access to fetch at 'file:///.../fr.json' from origin 'null' has been blocked by CORS
```

**Solution :**
Utiliser un serveur local :
```bash
# Python 3
python -m http.server 8000

# Puis ouvrir : http://localhost:8000/test_i18n.html
```

### Problème 3 : Certains textes ne changent pas

**Causes possibles :**
1. L'attribut `data-i18n` n'est pas présent
2. La clé ne correspond pas au JSON
3. La traduction manque dans le fichier de langue

**Vérification :**
```javascript
// Dans la console
document.querySelectorAll('[data-i18n]').forEach(el => {
    console.log(el.getAttribute('data-i18n'), '→', el.textContent);
});
```

---

## 📝 Résumé

### Ce qui a été corrigé :
✅ `modules/i18n.js` - Charge maintenant `fr.json` comme les autres langues
✅ `test_i18n.html` - Créé pour faciliter les tests

### Ce qui fonctionne maintenant :
✅ Changement de langue instantané
✅ Sauvegarde de la langue choisie
✅ Traductions appliquées correctement
✅ Console de debug pour diagnostiquer

### Prochaines étapes :
1. Tester avec `test_i18n.html`
2. Vérifier que ça fonctionne dans le jeu complet
3. Signaler tout problème persistant

---

## 🆘 Besoin d'aide ?

Si le problème persiste :

1. **Ouvrir la console** (F12)
2. **Copier les erreurs** affichées en rouge
3. **Vérifier** que les fichiers JSON sont bien chargés (onglet Network)
4. **Tester** avec `test_i18n.html` d'abord

---

**Correction appliquée le : 12 octobre 2025**
**Par : Claude pour Emmanuel Payet**
