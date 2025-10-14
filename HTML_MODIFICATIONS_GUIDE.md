# 🔧 Guide des Modifications HTML pour i18n

## 📋 Vue d'ensemble

Ce document liste toutes les modifications à apporter au fichier `petitbateauRouge.html` pour intégrer le système de traduction.

---

## 🎯 Étape 1 : Ajouter les scripts i18n

### Localisation : Dans la section `<head>` ou avant `</body>`

**AJOUTER après le chargement de `modules/i18n.js` :**

```html
<!-- Système de traduction -->
<script src="modules/i18n.js"></script>
<script src="modules/i18n-apply.js"></script>

<!-- Initialiser les traductions au chargement -->
<script>
document.addEventListener('DOMContentLoaded', async () => {
    // Récupérer la langue sauvegardée ou utiliser français
    const savedLang = localStorage.getItem('petit_bateau_lang') || 'fr';

    // Initialiser i18n
    await window.i18n.init();

    // Créer l'applicateur
    if (!window.i18nApplicator) {
        window.i18nApplicator = new I18nApplicator(window.i18n);
    }

    // Appliquer les traductions
    await window.i18nApplicator.applyAll(savedLang);

    console.log(`🌍 Jeu chargé en ${window.i18n.supportedLanguages[savedLang]}`);
});
</script>
```

---

## 🎯 Étape 2 : Modifier les boutons du formulaire

### Ligne ~6426 et ~6636 : Boutons "Enregistrer" et "Passer"

**AVANT :**
```html
<button id="fin-enregistrer" style="...">
    💾 Enregistrer
</button>
<button id="fin-passer" style="...">
    Passer
</button>
```

**APRÈS :**
```html
<button id="fin-enregistrer" data-i18n="ui.buttons.save" style="...">
    💾 Enregistrer
</button>
<button id="fin-passer" data-i18n="ui.buttons.skip" style="...">
    Passer
</button>
```

---

## 🎯 Étape 3 : Modifier les labels de formulaire

### Ligne ~6323 : Label Email

**AVANT :**
```html
<label style="...">Email * :</label>
```

**APRÈS :**
```html
<label data-i18n="ui.form.email_label" style="...">Email * :</label>
```

### Ligne ~6328 : Label Pseudo

**AVANT :**
```html
<label style="...">Pseudo * :</label>
```

**APRÈS :**
```html
<label data-i18n="ui.form.pseudo_label" style="...">Pseudo * :</label>
```

### Ligne ~6333 : Label Avatar

**AVANT :**
```html
<label style="...">Avatar :</label>
```

**APRÈS :**
```html
<label data-i18n="ui.form.avatar_label" style="...">Avatar :</label>
```

### Ligne ~6397 : Informations optionnelles

**AVANT :**
```html
<summary style="...">Informations optionnelles</summary>
```

**APRÈS :**
```html
<summary data-i18n="ui.form.optional_info" style="...">Informations optionnelles</summary>
```

### Ligne ~6401 : Label Ville

**AVANT :**
```html
<label style="...">Ville :</label>
```

**APRÈS :**
```html
<label data-i18n="ui.form.city_label" style="...">Ville :</label>
```

### Ligne ~6405 : Label Pays

**AVANT :**
```html
<label style="...">Pays :</label>
```

**APRÈS :**
```html
<label data-i18n="ui.form.country_label" style="...">Pays :</label>
```

### Ligne ~6409 : Label Âge

**AVANT :**
```html
<label style="...">Âge :</label>
```

**APRÈS :**
```html
<label data-i18n="ui.form.age_label" style="...">Âge :</label>
```

### Ligne ~6413 : Label Genre

**AVANT :**
```html
<label style="...">Genre :</label>
```

**APRÈS :**
```html
<label data-i18n="ui.form.gender_label" style="...">Genre :</label>
```

---

## 🎯 Étape 4 : Modifier les placeholders

### Ligne ~6324 : Placeholder Email

**AVANT :**
```html
<input type="email" id="fin-email" placeholder="${getTranslatedText('database_form.email_placeholder')}" ...>
```

**APRÈS :**
```html
<input type="email" id="fin-email" data-i18n-placeholder="ui.form.email_placeholder" placeholder="Votre adresse email" ...>
```

### Ligne ~6329 : Placeholder Pseudo

**AVANT :**
```html
<input type="text" id="fin-pseudo" placeholder="${getTranslatedText('database_form.pseudo_placeholder')}" ...>
```

**APRÈS :**
```html
<input type="text" id="fin-pseudo" data-i18n-placeholder="ui.form.pseudo_placeholder" placeholder="Votre pseudo" ...>
```

### Ligne ~6402 : Placeholder Ville

**AVANT :**
```html
<input type="text" id="fin-ville" placeholder="Votre ville" ...>
```

**APRÈS :**
```html
<input type="text" id="fin-ville" data-i18n-placeholder="ui.form.city_placeholder" placeholder="Votre ville" ...>
```

### Ligne ~6406 : Placeholder Pays

**AVANT :**
```html
<input type="text" id="fin-pays" placeholder="Votre pays" ...>
```

**APRÈS :**
```html
<input type="text" id="fin-pays" data-i18n-placeholder="ui.form.country_placeholder" placeholder="Votre pays" ...>
```

### Ligne ~6410 : Placeholder Âge

**AVANT :**
```html
<input type="number" id="fin-age" placeholder="Votre âge" ...>
```

**APRÈS :**
```html
<input type="number" id="fin-age" data-i18n-placeholder="ui.form.age_placeholder" placeholder="Votre âge" ...>
```

---

## 🎯 Étape 5 : Modifier les options du select Genre

### Ligne ~6415-6418 : Options genre

**AVANT :**
```html
<select id="fin-genre" style="...">
    <option value="">Non spécifié</option>
    <option value="homme">Homme</option>
    <option value="femme">Femme</option>
    <option value="autre">Autre</option>
</select>
```

**APRÈS :**
```html
<select id="fin-genre" style="...">
    <option value="" data-i18n="ui.form.gender_not_specified">Non spécifié</option>
    <option value="homme" data-i18n="ui.form.gender_male">Homme</option>
    <option value="femme" data-i18n="ui.form.gender_female">Femme</option>
    <option value="autre" data-i18n="ui.form.gender_other">Autre</option>
</select>
```

---

## 🎯 Étape 6 : Créer un sélecteur de langue

### À ajouter : Menu de sélection de langue

**Localisation suggérée :** En haut à droite du canvas ou dans un menu

```html
<!-- Sélecteur de langue (à positionner selon vos besoins) -->
<div id="language-selector" style="
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    padding: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    max-width: 200px;
">
    <button onclick="changeLanguage('fr')" class="lang-btn" data-lang="fr" title="Français">
        🇫🇷
    </button>
    <button onclick="changeLanguage('en')" class="lang-btn" data-lang="en" title="English">
        🇬🇧
    </button>
    <button onclick="changeLanguage('es')" class="lang-btn" data-lang="es" title="Español">
        🇪🇸
    </button>
    <button onclick="changeLanguage('de')" class="lang-btn" data-lang="de" title="Deutsch">
        🇩🇪
    </button>
    <button onclick="changeLanguage('it')" class="lang-btn" data-lang="it" title="Italiano">
        🇮🇹
    </button>
    <button onclick="changeLanguage('pt')" class="lang-btn" data-lang="pt" title="Português">
        🇵🇹
    </button>
    <button onclick="changeLanguage('zh')" class="lang-btn" data-lang="zh" title="中文">
        🇨🇳
    </button>
    <button onclick="changeLanguage('jp')" class="lang-btn" data-lang="jp" title="日本語">
        🇯🇵
    </button>
    <button onclick="changeLanguage('ko')" class="lang-btn" data-lang="ko" title="한국어">
        🇰🇷
    </button>
    <button onclick="changeLanguage('ar')" class="lang-btn" data-lang="ar" title="العربية">
        🇸🇦
    </button>
    <button onclick="changeLanguage('ru')" class="lang-btn" data-lang="ru" title="Русский">
        🇷🇺
    </button>
    <button onclick="changeLanguage('uk')" class="lang-btn" data-lang="uk" title="Українська">
        🇺🇦
    </button>
    <button onclick="changeLanguage('he')" class="lang-btn" data-lang="he" title="עברית">
        🇮🇱
    </button>
    <button onclick="changeLanguage('rc')" class="lang-btn" data-lang="rc" title="Kréol Rényoné">
        🇷🇪
    </button>
</div>

<style>
.lang-btn {
    background: transparent;
    border: 2px solid transparent;
    cursor: pointer;
    font-size: 24px;
    padding: 6px;
    border-radius: 8px;
    transition: all 0.3s ease;
    line-height: 1;
}

.lang-btn:hover {
    background: rgba(59, 130, 246, 0.1);
    border-color: #3b82f6;
    transform: scale(1.15);
}

.lang-btn.active {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.2);
}

/* Version mobile - plus compacte */
@media (max-width: 500px) {
    #language-selector {
        top: 10px;
        right: 10px;
        max-width: 150px;
        padding: 6px;
        gap: 4px;
    }

    .lang-btn {
        font-size: 20px;
        padding: 4px;
    }
}
</style>

<script>
// Fonction pour marquer la langue active
function updateActiveLangButton(lang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`.lang-btn[data-lang="${lang}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// Mettre à jour au chargement
document.addEventListener('DOMContentLoaded', () => {
    const currentLang = localStorage.getItem('petit_bateau_lang') || 'fr';
    updateActiveLangButton(currentLang);
});

// Wrapper pour changeLanguage avec mise à jour visuelle
const originalChangeLanguage = window.changeLanguage;
window.changeLanguage = async function(lang) {
    const result = await originalChangeLanguage(lang);
    if (result) {
        updateActiveLangButton(lang);
    }
    return result;
};
</script>
```

---

## 🎯 Étape 7 : Modifier les objets JavaScript (briques, énigmes)

### Option A : Modification manuelle

Localiser les arrays des briques et énigmes et leur ajouter des commentaires pour faciliter la traduction automatique.

### Option B : Laisser le système i18n-apply.js gérer automatiquement

Le module `i18n-apply.js` contient déjà la logique pour mettre à jour :
- `window.brickTexts.day` (19 briques)
- `window.brickTexts.night` (22 briques)
- `window.enigmes` ou `window.enigmesData` (23 énigmes)
- `window.niveauxSagesse` (15 niveaux)

**✅ RECOMMANDÉ : Option B - Pas de modification nécessaire**

Le système détectera automatiquement ces objets et appliquera les traductions.

---

## 🎯 Étape 8 : Répéter pour le second formulaire

**⚠️ IMPORTANT :** Le HTML contient **2 formulaires identiques** (lignes ~6323 et ~6583)

Appliquer **TOUTES les modifications ci-dessus** aux deux endroits :
- Premier formulaire : lignes ~6320-6430
- Second formulaire : lignes ~6580-6640

---

## 📊 Récapitulatif des modifications

| Élément | Type de modification | Nombre d'occurrences |
|---------|---------------------|---------------------|
| Scripts i18n | Ajout | 2 scripts |
| Boutons | Attribut `data-i18n` | 4 (2×2 formulaires) |
| Labels | Attribut `data-i18n` | 16 (8×2 formulaires) |
| Placeholders | Attribut `data-i18n-placeholder` | 10 (5×2 formulaires) |
| Options select | Attribut `data-i18n` | 8 (4×2 formulaires) |
| Sélecteur langue | Ajout complet | 1 nouveau composant |
| **TOTAL** | | **~40 modifications** |

---

## ✅ Checklist de validation

Après modifications, vérifier :

- [ ] Les 2 scripts sont chargés (`i18n.js` + `i18n-apply.js`)
- [ ] Le script d'initialisation est présent
- [ ] Les 2 boutons "Enregistrer" ont `data-i18n="ui.buttons.save"`
- [ ] Les 2 boutons "Passer" ont `data-i18n="ui.buttons.skip"`
- [ ] Tous les labels ont leur attribut `data-i18n`
- [ ] Tous les placeholders ont `data-i18n-placeholder`
- [ ] Les options du select ont `data-i18n`
- [ ] Le sélecteur de langue est visible
- [ ] La fonction `changeLanguage()` est disponible
- [ ] Les traductions s'appliquent au chargement
- [ ] Le changement de langue fonctionne en direct

---

## 🧪 Tests recommandés

### Test 1 : Chargement initial
1. Ouvrir le jeu
2. Vérifier que la langue par défaut (FR) s'affiche
3. Vérifier dans la console : `✅ Traductions appliquées avec succès`

### Test 2 : Changement de langue
1. Cliquer sur le drapeau anglais 🇬🇧
2. Vérifier que tous les textes passent en anglais
3. Vérifier que le bouton devient actif (bordure bleue)
4. Recharger la page → doit rester en anglais

### Test 3 : Formulaire
1. Ouvrir le formulaire de fin
2. Vérifier que les labels sont traduits
3. Vérifier que les placeholders sont traduits
4. Vérifier que les boutons sont traduits

### Test 4 : Énigmes et briques
1. Changer de langue
2. Ouvrir une énigme
3. Vérifier que le contenu est traduit
4. Collecter une brique
5. Vérifier que le message est traduit

---

## 🔧 Dépannage

### Problème : Les traductions ne s'appliquent pas

**Solutions :**
1. Vérifier que les fichiers JSON sont bien dans `modules/lang/`
2. Vérifier la console pour des erreurs
3. Vérifier que `i18n.js` est chargé avant `i18n-apply.js`
4. Vérifier l'orthographe des IDs de traduction

### Problème : Certains textes restent en français

**Solutions :**
1. Vérifier que l'attribut `data-i18n` est bien présent
2. Vérifier que l'ID correspond exactement à celui du JSON
3. Pour les objets JS, vérifier que les variables globales existent

### Problème : Le sélecteur de langue n'apparaît pas

**Solutions :**
1. Vérifier le `z-index: 9999`
2. Vérifier la position `fixed`
3. Vérifier qu'il n'y a pas de conflit de style

---

## 📝 Notes finales

1. **Performance** : Le système charge les traductions à la demande
2. **Cache** : Les traductions sont mises en cache dans `localStorage`
3. **Fallback** : Si une traduction manque, le texte français s'affiche
4. **Extensibilité** : Facile d'ajouter de nouvelles langues

---

🌍 **Système créé par Claude pour Emmanuel Payet**
📅 **Date : 12 octobre 2025**
⛵ **Petit Bateau Rouge**
