# 🔧 FIX : Données non envoyées - Diagnostic et Solutions

## 🔍 Problème identifié

Le code utilise une **Edge Function Supabase** (`save-game-score`) qui doit être déployée. Si elle n'est pas déployée ou accessible, les données ne sont pas envoyées.

## 📋 Diagnostic rapide (à faire dans la console)

### 1. Vérifier si l'Edge Function est accessible
```javascript
// Test rapide de l'Edge Function
fetch(`${supabaseScores.client.supabaseUrl}/functions/v1/save-game-score`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseScores.client.supabaseKey}`
    },
    body: JSON.stringify({
        email: 'test@example.com',
        pseudo: 'Test',
        score: 1000
    })
})
.then(r => r.json())
.then(data => console.log('✅ Edge Function répond:', data))
.catch(err => console.error('❌ Edge Function inaccessible:', err));
```

### 2. Vérifier les erreurs réseau
Ouvrir F12 → Onglet "Network" → Tenter d'enregistrer un score → Chercher une requête vers `/functions/v1/save-game-score`

## 🚀 Solution 1 : Déployer l'Edge Function

### Étape 1 : Vérifier que l'Edge Function existe
```powershell
# Dans le terminal PowerShell
cd C:\Users\dream\OneDrive\Documents\GitHub\petitbateau
ls supabase/functions/save-game-score
```

### Étape 2 : Déployer l'Edge Function
```powershell
# Se connecter à Supabase
supabase login

# Lier le projet
supabase link --project-ref VOTRE_PROJECT_REF

# Déployer la fonction
supabase functions deploy save-game-score

# Vérifier le déploiement
supabase functions list
```

### Étape 3 : Tester après déploiement
Recharger le jeu et tenter d'enregistrer un score.

## 🔧 Solution 2 : Utiliser la méthode classique (sans Edge Function)

Si vous ne pouvez pas déployer l'Edge Function immédiatement, utilisez la méthode classique :

### Créer la fonction saveScoreDirecte dans supabase-scores.js

Ajouter après la fonction `saveScore()` :

```javascript
// Méthode directe (sans Edge Function) - À utiliser temporairement
async saveScoreDirect(score, options = {}) {
    if (!this.currentUser) {
        console.error('❌ Aucun utilisateur connecté');
        return { success: false, error: 'Aucun utilisateur' };
    }

    if (!this.currentGameId) {
        console.error('❌ Aucun jeu sélectionné');
        return { success: false, error: 'Aucun jeu sélectionné' };
    }

    try {
        // 1. Créer ou récupérer l'utilisateur
        let userId = this.currentUser.id;
        
        if (!userId) {
            // Chercher par email
            const { data: existingUser, error: searchError } = await this.client
                .from('users')
                .select('id')
                .eq('email', this.currentUser.email)
                .single();

            if (existingUser) {
                userId = existingUser.id;
                this.currentUser.id = userId;
            } else {
                // Créer le user
                const { data: newUser, error: createError } = await this.client
                    .from('users')
                    .insert({
                        email: this.currentUser.email,
                        pseudo: this.currentUser.pseudo,
                        ville: this.currentUser.ville,
                        pays: this.currentUser.pays,
                        age: this.currentUser.age,
                        genre: this.currentUser.genre,
                        avatar: this.currentUser.avatar
                    })
                    .select()
                    .single();

                if (createError) throw createError;
                userId = newUser.id;
                this.currentUser.id = userId;
                console.log('✅ Nouvel utilisateur créé:', userId);
            }
        }

        // 2. Insérer le score
        const { data, error } = await this.client
            .from('scores')
            .insert({
                user_id: userId,
                game_id: this.currentGameId,
                score: score,
                niveau_atteint: options.niveau_atteint || null,
                temps_jeu: options.temps_jeu || null,
                donnees_extra: options.donnees_extra || null
            })
            .select()
            .single();

        if (error) throw error;

        console.log('✅ Score enregistré directement:', data);
        return {
            success: true,
            user_id: userId,
            score_id: data.id
        };

    } catch (error) {
        console.error('❌ Erreur saveScoreDirect:', error);
        return {
            success: false,
            error: error.message
        };
    }
}
```

### Modifier petitbateauRouge.html pour utiliser saveScoreDirect

Dans le gestionnaire du bouton "Enregistrer", remplacer :
```javascript
const resultat = await supabaseScores.saveScore(scoreTotal, {
```

Par :
```javascript
const resultat = await supabaseScores.saveScoreDirect(scoreTotal, {
```

## 🔑 Solution 3 : Vérifier les RLS Policies

L'Edge Function peut échouer si les politiques RLS bloquent les insertions.

### Exécuter le script SQL dans Supabase Dashboard

1. Ouvrir https://supabase.com/dashboard
2. SQL Editor
3. Coller le contenu de `CHECK_AND_FIX_RELATIONS.sql`
4. Exécuter (Run)

Cela va :
- Créer les foreign keys
- Créer les politiques RLS de lecture publique
- Créer les politiques RLS d'insertion (nécessaire pour saveScoreDirect)

### Ajouter les politiques d'insertion manquantes

Si le script ne les crée pas, ajouter manuellement dans le SQL Editor :

```sql
-- Permettre l'insertion de nouveaux users
CREATE POLICY "Insertion publique users"
ON users
FOR INSERT
WITH CHECK (true);

-- Permettre l'insertion de scores pour les users authentifiés
CREATE POLICY "Insertion scores authentifiés"
ON scores
FOR INSERT
WITH CHECK (
    user_id IN (SELECT id FROM users WHERE email = current_setting('request.jwt.claims', true)::json->>'email')
);

-- OU plus permissif pour test (à restreindre ensuite) :
CREATE POLICY "Insertion publique scores"
ON scores
FOR INSERT
WITH CHECK (true);
```

## ✅ Test final

### Dans la console du navigateur :

```javascript
// Réinitialiser
formulaireFinAffiche = false;

// Tester l'enregistrement complet
(async () => {
    console.log('🧪 Test enregistrement complet...');
    
    // 1. Créer un utilisateur de test
    await supabaseScores.getOrCreateUser(
        'test@example.com',
        'TestUser',
        { ville: 'Paris', pays: 'France', avatar: '🧪' }
    );
    
    // 2. Enregistrer un score
    const resultat = await supabaseScores.saveScoreDirect(5000, {
        niveau_atteint: 10,
        temps_jeu: 300,
        donnees_extra: {
            pseudo: 'TestUser',
            avatar: '🧪',
            xp: 1000,
            score: 4000,
            sagesse: 50
        }
    });
    
    console.log('📊 Résultat:', resultat);
    
    if (resultat.success) {
        console.log('✅ SUCCÈS ! Les données sont bien envoyées');
    } else {
        console.error('❌ ÉCHEC:', resultat.error);
    }
})();
```

## 📝 Résumé des étapes

1. **Diagnostic** : Tester l'Edge Function dans la console
2. **Option A** : Déployer l'Edge Function (`supabase functions deploy save-game-score`)
3. **Option B** : Utiliser `saveScoreDirect` temporairement
4. **Toujours** : Exécuter `CHECK_AND_FIX_RELATIONS.sql` pour les RLS policies
5. **Test** : Vérifier que les scores s'enregistrent dans Supabase Dashboard

## 🎯 Quelle solution préférez-vous ?

- **Solution 1** (Edge Function) = Plus sécurisé, recommandé en production
- **Solution 2** (Direct) = Plus simple, fonctionne immédiatement
- **Solution 3** (RLS) = Nécessaire dans tous les cas

Je recommande de commencer par la **Solution 2 + 3** pour tester rapidement, puis passer à la **Solution 1** ensuite.
