# 🌍 Système de Traduction - Petit Bateau Rouge

## 📋 Vue d'ensemble

Ce document décrit le système de traduction complet du jeu "Petit Bateau Rouge". Le système utilise des fichiers JSON structurés pour gérer 14+ langues avec plus de 200 textes traduits.

---

## 🗂️ Structure des fichiers

```
modules/
├── i18n.js                    # Moteur de traduction
└── lang/
    ├── fr.json               # Français (référence)
    ├── en.json               # Anglais
    ├── es.json               # Espagnol
    └── [autres langues].json # À créer
```

---

## 🔑 Structure des IDs de traduction

### **Format général**
Les IDs suivent une structure hiérarchique à points :
```
categorie.sous_categorie.identifiant
```

### **Exemple**
```javascript
"ui.buttons.save"          → "💾 Enregistrer"
"game.messages.intro_bonus" → "🌟 +100 Points..."
"enigmes.humanity.name"    → "Humanité"
```

---

## 📚 Catégories principales

### 1️⃣ **UI** - Interface utilisateur
**Préfixe :** `ui.*`

#### Boutons
```javascript
ui.buttons.save         // 💾 Enregistrer
ui.buttons.skip         // Passer
ui.buttons.update       // Mettre à jour
ui.buttons.later        // Plus tard
```

#### Formulaires
```javascript
ui.form.email_label          // Email * :
ui.form.pseudo_label         // Pseudo * :
ui.form.city_placeholder     // Votre ville
ui.form.gender_male          // Homme
```

#### Menu
```javascript
ui.menu.enigmes       // 🧩 Énigmes
ui.menu.artist_info   // 🎨 Info Artiste
ui.menu.credits       // 🎬 Générique
```

#### Onglets
```javascript
ui.tabs.enigmes    // 📋 Énigmes
ui.tabs.scores     // 🏆 Scores
```

---

### 2️⃣ **GAME** - Messages de jeu
**Préfixe :** `game.*`

#### Messages de succès
```javascript
game.messages.intro_bonus        // 🌟 +100 Points...
game.messages.light_victory      // 💡 La lumière chasse la nuit
game.messages.frontiers_broken   // 🌍💕 FRONTIÈRES BRISÉES!
```

#### Erreurs et échecs
```javascript
game.errors.fail_1          // NO GREAT! HAAAH!
game.errors.whale_death     // 💀 Tu as tiré sur une baleine...
game.errors.email_required  // ⚠️ Email et pseudo requis
game.errors.saved           // ✅ Score enregistré !
```

#### Instructions
```javascript
game.instructions.break_frontiers  // 🌍 BRISER LES FRONTIÈRES
game.instructions.click_to_launch  // 🚀 CLIQUEZ POUR LANCER
```

---

### 3️⃣ **NARRATIVE** - Textes narratifs
**Préfixe :** `narrative.*`

#### Phase 1
```javascript
narrative.phase1.title         // L'aube des doutes\nPhase 1
narrative.phase1.intro_short   // On m'a dit qu'ils étaient...
narrative.phase1.intro_full    // Version complète avec \n
narrative.phase1.reaction      // NON on peut pas laisser passer ça !
```

#### Message final
```javascript
narrative.final_message   // L'humanité n'a pas besoin de murs...
```

---

### 4️⃣ **BRICKS** - Briques du jeu (Jour/Nuit)
**Préfixe :** `bricks.*`

#### Briques du jour (positives)
```javascript
bricks.day.told.name           // ON M'A DIT...
bricks.day.told.msg            // 🗣️ Les manipulations s'effacent...
bricks.day.monsters.name       // DES MONSTRES
bricks.day.monsters.msg        // 👨‍👩‍👧‍👦 Non... des humains...
```

**Liste complète (19 briques):**
- `told`, `monsters`, `prejudice`, `fears`, `distrust`
- `who_are_they`, `i_saw`, `father`, `mother`, `children`
- `humanity`, `love`, `compassion`, `hope`, `peace`
- `like_me`, `truth`, `courage`, `precious`

#### Briques de la nuit (négatives)
```javascript
bricks.night.discord.name      // DISCORDES
bricks.night.discord.msg       // ⚡ Des discordes... des haines...
bricks.night.hatred.name       // HAINES
bricks.night.hatred.msg        // 💔 Venues avec les maux...
```

**Liste complète (22 briques):**
- `discord`, `hatred`, `destruction`, `theft`, `lies`
- `manipulation`, `greed`, `avarice`, `chains`, `iron_walls`
- `jealousy`, `pride`, `anger`, `revenge`, `indifference`
- `selfishness`, `ignorance`, `resistance`, `light`
- `hope_reborn`, `inner_strength`, `wisdom`

---

### 5️⃣ **ENIGMES** - 23 énigmes complètes
**Préfixe :** `enigmes.*`

#### Structure par énigme (5 champs)
```javascript
enigmes.[id].name          // Nom de l'énigme
enigmes.[id].description   // Description courte
enigmes.[id].mystery       // Question mystérieuse
enigmes.[id].revelation    // Révélation (texte long)
enigmes.[id].wisdom        // Sagesse (conclusion)
```

#### Liste des 23 énigmes
```javascript
1.  enigmes.humanity              // Humanité
2.  enigmes.wall_of_fear          // Mur de Peur
3.  enigmes.peace                 // Paix
4.  enigmes.diversity             // Diversité
5.  enigmes.freedom               // Liberté
6.  enigmes.faith                 // Foi
7.  enigmes.respect               // Respect
8.  enigmes.mutual_aid            // Entraide
9.  enigmes.healing               // Guérison
10. enigmes.restoration           // Restauration
11. enigmes.avarice               // Avarice
12. enigmes.prison_freedom        // Prison de Liberté
13. enigmes.refusal               // Refus
14. enigmes.pride                 // Orgueil
15. enigmes.inequality            // Inégalités
16. enigmes.hope                  // Espoir
17. enigmes.lighthouse            // Le Phare dans la Nuit
18. enigmes.lamp                  // La Lampe Remplie d'Huile
19. enigmes.heart                 // Le Cœur de l'Humanité
20. enigmes.humanity_no_borders   // Humanité Sans Frontières
21. enigmes.right_to_happiness    // Droit au Bonheur
22. enigmes.precious_life         // Vie Précieuse
23. enigmes.communitarianism      // Communautarisme
```

---

### 6️⃣ **LEVELS** - Niveaux de sagesse (15)
**Préfixe :** `levels.*`

```javascript
levels.robe_blanche.name      // Robe Blanche
levels.robe_blanche.points    // 300
levels.saint_navigator.name   // Saint Navigateur
levels.saint_navigator.points // 250
// ... etc
```

**Liste complète (15 niveaux):**
- `robe_blanche` (300+), `saint_navigator` (250+), `prophet` (200+)
- `illuminated` (175+), `disciple` (150+), `contemplative` (125+)
- `guardian` (100+), `meditating` (80+), `captain` (60+)
- `navigator` (45+), `enlightened_sailor` (30+), `initiate` (20+)
- `apprentice` (10+), `cabin_boy` (5+), `pilgrim` (0+)

---

### 7️⃣ **BADGES** - 3 badges
**Préfixe :** `badges.*`

```javascript
badges.champion.name          // Badge Champion
badges.champion.desc          // Top 1
badges.perfectionist.name     // Badge Perfectionniste
badges.perfectionist.desc     // toutes énigmes collectées
badges.contemplative.name     // Badge Contemplatif
badges.contemplative.desc     // temps de jeu > 1h
```

---

### 8️⃣ **SOCIAL** - Partages réseaux sociaux (4 variantes)
**Préfixe :** `social.*`

```javascript
social.share_1   // 🌟 J'ai voyagé à travers...
social.share_2   // 🕊️ Un voyage vers la vérité...
social.share_3   // 🌍 De mur en pont...
social.share_4   // 👁️ J'ai vu la vérité...
```

**Variables disponibles dans les textes:**
- `{name}` - Nom du joueur
- `{city}` - Ville du joueur
- `{country}` - Pays du joueur
- `{wisdom}` - Score de sagesse
- `{score}` - Score total

---

### 9️⃣ **END_FORM** - Formulaire de fin
**Préfixe :** `end_form.*`

```javascript
end_form.title              // Votre Voyage est Complet
end_form.your_progress      // Votre progression
end_form.xp_label           // 💡 XP
end_form.score_label        // 🎯 Score
end_form.total_label        // Total (XP + Score)
end_form.wisdom_score       // Score de Sagesse
end_form.wisdom_level       // Niveau de sagesse
end_form.progress_to_next   // {current}/{next} vers le prochain niveau
end_form.save_question      // Enregistrer votre score...
end_form.congrats           // 🎉 Félicitations !
end_form.journey_complete   // Votre voyage est terminé
end_form.points             // points
```

---

### 🔟 **ARTIST** - Informations artiste
**Préfixe :** `artist.*`

```javascript
artist.name                 // Emmanuel Payet
artist.subtitle             // Artiste Chrétien • Créateur • Inspirateur
artist.platform1_title      // Jeux & Déco
artist.platform1_desc       // Découvre mes créations...
artist.platform1_link       // emmanuel.gallery
// ... platform2, platform3, platform4
artist.quote                // L'art chrétien unit les cœurs...
artist.credits              // Codé par Claude • Idée originale...
```

---

### 1️⃣1️⃣ **LANGUAGES** - Liste des langues (29)
**Préfixe :** `languages.*`

```javascript
languages.fr    // Français
languages.en    // English
languages.jp    // 日本語
languages.uk    // Українська
languages.es    // Español
// ... etc (29 langues au total)
```

---

### 1️⃣2️⃣ **PWA** - Messages Progressive Web App
**Préfixe :** `pwa.*`

```javascript
pwa.update_message     // 🎨 Nouvelle version disponible...
pwa.update_banner      // 🎨 Nouvelle version avec icônes...
pwa.update_button      // Mettre à jour
pwa.later_button       // Plus tard
```

---

## 🛠️ Utilisation dans le code

### Méthode 1 : JavaScript
```javascript
// Utiliser la fonction t() globale
const text = t('ui.buttons.save');
// → "💾 Enregistrer"

// Avec paramètres
const share = t('social.share_1', {
    name: 'Jean',
    city: 'Paris',
    country: 'France',
    wisdom: '150',
    score: '2500'
});
```

### Méthode 2 : HTML (à implémenter)
```html
<!-- Attribut data-i18n -->
<button data-i18n="ui.buttons.save">Texte par défaut</button>

<!-- Attribut data-i18n-placeholder -->
<input data-i18n-placeholder="ui.form.email_placeholder" />
```

---

## 📊 Statistiques

- **Total de clés de traduction :** ~400+
- **Catégories principales :** 12
- **Énigmes complètes :** 23 (×5 champs = 115 textes)
- **Briques jour/nuit :** 41 (×2 champs = 82 textes)
- **Niveaux de sagesse :** 15 (×2 champs = 30 textes)
- **Langues supportées :** 14+ (29 listées)

---

## ✅ Fichiers créés

### Fichiers de langue
- ✅ `modules/lang/fr.json` - Français (référence complète)
- ✅ `modules/lang/en.json` - Anglais (traductions complètes)
- ✅ `modules/lang/es.json` - Espagnol (traductions complètes)

### Fichiers de documentation
- ✅ `extracted_french_texts.txt` - Extraction brute des textes
- ✅ `TRANSLATION_SYSTEM.md` - Ce document

---

## 🎯 Prochaines étapes

### Phase 1 : Intégration dans le HTML
1. Ajouter les attributs `data-i18n` aux éléments HTML
2. Créer une fonction d'application des traductions au chargement
3. Tester le changement de langue dynamique

### Phase 2 : Traductions supplémentaires
4. Créer les fichiers pour les 11 autres langues :
   - `de.json` (Allemand)
   - `it.json` (Italien)
   - `pt.json` (Portugais)
   - `ru.json` (Russe)
   - `zh.json` (Chinois)
   - `ko.json` (Coréen)
   - `ar.json` (Arabe)
   - `he.json` (Hébreu)
   - `jp.json` (Japonais)
   - `uk.json` (Ukrainien)
   - `rc.json` (Créole Réunionnais)

### Phase 3 : Optimisations
5. Ajouter le chargement lazy des traductions
6. Mettre en cache les traductions
7. Tester la performance sur mobile

---

## 🔍 Exemples d'utilisation

### Exemple 1 : Bouton simple
```javascript
// JavaScript
button.textContent = t('ui.buttons.save');
```
```html
<!-- HTML avec data-i18n -->
<button data-i18n="ui.buttons.save">💾 Enregistrer</button>
```

### Exemple 2 : Message avec paramètres
```javascript
const message = t('end_form.progress_to_next', {
    current: player.currentXP,
    next: nextLevelXP
});
// → "150/200 vers le prochain niveau"
```

### Exemple 3 : Énigme complète
```javascript
const enigme = {
    nom: t('enigmes.humanity.name'),
    desc: t('enigmes.humanity.description'),
    mystere: t('enigmes.humanity.mystery'),
    revelation: t('enigmes.humanity.revelation'),
    sagesse: t('enigmes.humanity.wisdom')
};
```

---

## 📝 Notes importantes

1. **Le français reste en dur dans le HTML** - Les fichiers JSON servent uniquement aux autres langues
2. **IDs immuables** - Ne jamais changer les IDs, seulement les traductions
3. **Cohérence des emojis** - Garder les mêmes emojis dans toutes les langues pour la cohérence visuelle
4. **Variables** - Utiliser le format `{variable}` pour l'interpolation
5. **Retours à la ligne** - Utiliser `\n` dans les JSON pour les sauts de ligne

---

## 🌟 Créé par Emmanuel Payet
**Système de traduction codé par Claude**
**Date de création : 12 octobre 2025**
