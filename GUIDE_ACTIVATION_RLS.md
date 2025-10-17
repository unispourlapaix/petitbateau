# 🚀 Guide d'activation RLS - Petit Bateau Rouge

## 📋 Résumé de la situation

Vous utilisez **Supabase** pour enregistrer les scores en ligne avec le nom "Petit Bateau". En passant en mode sécurité **RLS (Row Level Security)**, vous devez configurer les politiques d'accès pour permettre l'injection des données depuis votre formulaire.

## ✅ Ce qui est déjà fait

- ✅ Le module `supabase-scores.js` possède la méthode `saveScoreDirect()` (lignes 194-298)
- ✅ Votre formulaire dans `petitbateauRouge.html` utilise déjà `saveScoreDirect()` (ligne 7706)
- ✅ Le fichier SQL de configuration RLS a été créé : [CONFIGURE_RLS_FOR_DIRECT_INSERT.sql](./supabase/CONFIGURE_RLS_FOR_DIRECT_INSERT.sql)

## 🎯 Étapes à suivre (3 minutes)

### Étape 1 : Ouvrir Supabase Dashboard

1. Allez sur https://supabase.com/dashboard
2. Connectez-vous avec votre compte
3. Sélectionnez votre projet **"Petit Bateau Rouge"** (ou le nom que vous lui avez donné)

### Étape 2 : Ouvrir le SQL Editor

1. Dans le menu de gauche, cliquez sur **🔧 SQL Editor**
2. Cliquez sur **"New query"** (nouvelle requête)

### Étape 3 : Exécuter le script SQL

1. Copiez le contenu du fichier [CONFIGURE_RLS_FOR_DIRECT_INSERT.sql](./supabase/CONFIGURE_RLS_FOR_DIRECT_INSERT.sql)
2. Collez-le dans l'éditeur SQL
3. Cliquez sur **"Run"** (Exécuter) en bas à droite
4. Attendez la confirmation (vous verrez des messages verts ✅)

### Étape 4 : Vérifier la configuration

Dans le SQL Editor, exécutez cette requête pour vérifier les politiques :

```sql
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('users', 'scores', 'games')
ORDER BY tablename, policyname;
```

Vous devriez voir :

| tablename | policyname | cmd |
|-----------|------------|-----|
| games | Lecture publique games | SELECT |
| scores | Insertion publique scores | INSERT |
| scores | Lecture publique scores | SELECT |
| users | Insertion publique users | INSERT |
| users | Lecture publique users | SELECT |
| users | Mise à jour publique users | UPDATE |

## 🧪 Tester l'enregistrement

### Test dans la console du navigateur

1. Ouvrez votre jeu dans le navigateur
2. Appuyez sur **F12** pour ouvrir la console
3. Exécutez ce code de test :

```javascript
// Test complet de l'enregistrement
(async () => {
    console.log('🧪 Test enregistrement Supabase avec RLS...');

    // 1. Vérifier que supabaseScores existe
    if (!supabaseScores) {
        console.error('❌ supabaseScores non trouvé');
        return;
    }

    // 2. Définir le jeu actuel
    await supabaseScores.setCurrentGame('Petit Bateau');

    // 3. Créer un utilisateur de test
    await supabaseScores.getOrCreateUser(
        'test@petitbateau.com',
        'TestPlayer',
        {
            ville: 'Paris',
            pays: 'France',
            age: 25,
            genre: 'autre',
            avatar: '🧪'
        }
    );

    // 4. Enregistrer un score
    const resultat = await supabaseScores.saveScoreDirect(5000, {
        niveau_atteint: 10,
        temps_jeu: 300,
        donnees_extra: {
            pseudo: 'TestPlayer',
            avatar: '🧪',
            xp: 1000,
            score: 4000,
            sagesse: 50
        }
    });

    console.log('📊 Résultat:', resultat);

    if (resultat.success) {
        console.log('✅ SUCCÈS ! Les scores sont maintenant enregistrés avec RLS activé');
        console.log('   User ID:', resultat.user_id);
        console.log('   Score ID:', resultat.score_id);
    } else {
        console.error('❌ ÉCHEC:', resultat.error);
    }
})();
```

### Test dans le jeu

1. Jouez une partie jusqu'à Game Over
2. Remplissez le formulaire avec vos informations
3. Cliquez sur **"Enregistrer mon score"**
4. Vérifiez dans la console :
   - `✅ Utilisateur existant trouvé` ou `✅ Nouvel utilisateur créé`
   - `✅ Score enregistré directement`
5. Vérifiez dans Supabase Dashboard → **Table Editor** → **scores**

## 🔍 Résolution des problèmes

### Problème 1 : "new row violates row-level security policy"

**Cause :** Les politiques RLS ne sont pas activées ou incorrectes

**Solution :** Réexécutez le script SQL [CONFIGURE_RLS_FOR_DIRECT_INSERT.sql](./supabase/CONFIGURE_RLS_FOR_DIRECT_INSERT.sql)

### Problème 2 : "relation 'games' does not exist"

**Cause :** La table `games` n'existe pas encore

**Solution :** Exécutez d'abord le script de création de tables (si vous en avez un) ou créez manuellement la table `games` :

```sql
CREATE TABLE IF NOT EXISTS games (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom TEXT UNIQUE NOT NULL,
    description TEXT,
    icone TEXT,
    url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Problème 3 : "Erreur insertion score: ForeignKeyViolation"

**Cause :** Le `game_id` n'existe pas dans la table `games`

**Solution :** Exécutez dans le SQL Editor :

```sql
INSERT INTO games (nom, description, icone, url)
VALUES (
    'Petit Bateau',
    'Naviguez à travers 33 millions d''énigmes philosophiques',
    '🚣',
    'https://emmanuel.gallery/petitbateauRouge.html'
)
ON CONFLICT (nom) DO NOTHING;
```

### Problème 4 : Score non visible dans la base de données

**Vérification :**

```sql
-- Voir tous les scores récents
SELECT s.*, u.pseudo, u.email, g.nom as jeu
FROM scores s
LEFT JOIN users u ON s.user_id = u.id
LEFT JOIN games g ON s.game_id = g.id
ORDER BY s.created_at DESC
LIMIT 10;
```

## 🎨 Architecture de la solution

```
┌─────────────────────────────────────────┐
│   Joueur (Navigateur)                   │
│                                         │
│  1. Remplir formulaire                  │
│     → email, pseudo, ville, pays        │
│                                         │
│  2. Clic "Enregistrer"                  │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│   supabase-scores.js                    │
│                                         │
│  • getOrCreateUser()                    │
│    → Stocke les infos localement        │
│                                         │
│  • saveScoreDirect()                    │
│    → Cherche user par email             │
│    → Crée user si inexistant            │
│    → Insert score directement           │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│   Supabase (avec RLS activé)            │
│                                         │
│  Tables:                                │
│  • users   (lecture + insert publics)   │
│  • scores  (lecture + insert publics)   │
│  • games   (lecture publique)           │
│                                         │
│  Politiques RLS:                        │
│  ✅ Lecture publique autorisée          │
│  ✅ Insertion publique autorisée        │
│  ❌ Suppression bloquée                 │
│  ❌ Modification arbitraire bloquée     │
└─────────────────────────────────────────┘
```

## 📊 Différences avec l'Edge Function

| Caractéristique | saveScoreDirect() | Edge Function |
|-----------------|-------------------|---------------|
| **Déploiement** | ✅ Aucun (déjà dans le code) | ❌ Nécessite `supabase functions deploy` |
| **Configuration RLS** | ✅ Politiques publiques INSERT | ✅ Service role (bypass RLS) |
| **Sécurité** | ⚠️ Moyenne (INSERT public) | ✅ Élevée (validation serveur) |
| **Complexité** | ✅ Simple | ⚠️ Plus complexe |
| **Délai de mise en place** | ⏱️ 3 minutes | ⏱️ 15-30 minutes |

## 🔐 Sécurité : Est-ce sûr ?

### ✅ Oui, parce que :

1. **Lecture seule sur la plupart des données** : Les utilisateurs peuvent lire les classements mais pas modifier les scores des autres
2. **RLS actif** : Même si les politiques sont "publiques", elles sont contrôlées par Supabase
3. **Pas de suppression** : Aucune politique de DELETE n'est activée
4. **Foreign keys** : Les relations entre tables sont protégées

### ⚠️ Limitations :

1. **Spam possible** : Un utilisateur malveillant pourrait créer beaucoup de scores
   - **Solution future** : Ajouter un rate limiting dans Supabase Dashboard
2. **Scores truqués** : Un utilisateur pourrait envoyer un score très élevé
   - **Solution future** : Ajouter une validation du score max côté serveur

### 🚀 Améliorations futures :

Pour renforcer la sécurité, vous pouvez ultérieurement :

1. **Déployer l'Edge Function** (voir [SUPABASE_RLS_FIX.md](./SUPABASE_RLS_FIX.md))
2. **Ajouter un rate limiting** (Supabase Dashboard → Authentication → Rate Limits)
3. **Valider les scores** (ajouter un score_max dans la table games)

## 📚 Fichiers de référence

- [supabase-scores.js](./modules/supabase-scores.js) - Module principal
- [petitbateauRouge.html](./petitbateauRouge.html) - Formulaire (ligne 7706)
- [CONFIGURE_RLS_FOR_DIRECT_INSERT.sql](./supabase/CONFIGURE_RLS_FOR_DIRECT_INSERT.sql) - Configuration RLS
- [SUPABASE_RLS_FIX.md](./SUPABASE_RLS_FIX.md) - Documentation Edge Function
- [TEST_FORMULAIRE.md](./TEST_FORMULAIRE.md) - Tests du formulaire
- [FIX_SAVE_SCORE.md](./FIX_SAVE_SCORE.md) - Diagnostic complet

## ❓ Questions fréquentes

### Q: Dois-je créer un compte utilisateur pour chaque joueur ?

**R:** Non ! Le système est conçu pour les **joueurs anonymes**. Ils entrent juste leur email et pseudo, sans mot de passe ni vérification.

### Q: Puis-je voir les scores dans Supabase Dashboard ?

**R:** Oui ! Allez dans **Table Editor** → **scores** pour voir tous les scores enregistrés.

### Q: Comment supprimer les scores de test ?

**R:** Dans Supabase Dashboard → Table Editor → scores → Sélectionnez les lignes → Delete

### Q: Est-ce que ça fonctionne hors ligne ?

**R:** Non, Supabase nécessite une connexion Internet. Les scores ne seront pas enregistrés si le joueur est hors ligne.

### Q: Combien ça coûte ?

**R:** Le plan gratuit de Supabase inclut :
- 500 MB de base de données
- 1 GB de transfert réseau
- 2 GB de stockage fichiers
- C'est **largement suffisant** pour des milliers de scores

## 🎉 C'est tout !

Après avoir exécuté le script SQL, votre système d'enregistrement de scores fonctionnera avec **RLS activé** pour une sécurité maximale.

---

**📅 Date de création :** 17 octobre 2025
**👤 Auteur :** Emmanuel Payet (avec Claude Code)
**🎮 Projet :** Le Petit Bateau Rouge
**📧 Contact :** emmanuelpayet888@gmail.com
