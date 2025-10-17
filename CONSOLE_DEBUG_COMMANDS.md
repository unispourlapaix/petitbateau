# 🔍 Commandes de diagnostic pour la console du navigateur

## 1️⃣ TESTER LE FORMULAIRE IMMÉDIATEMENT

```javascript
// Forcer l'affichage du formulaire
formulaireFinAffiche = false;
afficherFormulaireFinDeJeuAvecResume(1500, 8500, 10000, 100, 'PBTEST' + Date.now());
```

---

## 2️⃣ VÉRIFIER LA CONNEXION SUPABASE

```javascript
// Vérifier que Supabase est chargé
console.log('Supabase chargé ?', window.supabase);
console.log('Client Supabase ?', supabaseScores?.client);
console.log('Game ID ?', supabaseScores?.currentGameId);
```

---

## 3️⃣ TESTER L'ENREGISTREMENT D'UN SCORE MANUELLEMENT

```javascript
// Configurer l'utilisateur
await supabaseScores.getOrCreateUser(
    'test@example.com',
    'TestPlayer',
    {
        ville: 'Paris',
        pays: 'France',
        age: 25,
        avatar: '⛵'
    }
);

// Enregistrer le score
const resultat = await supabaseScores.saveScore(10000, {
    niveau_atteint: 23,
    temps_jeu: Math.floor(Date.now() / 1000),
    donnees_extra: {
        pseudo: 'TestPlayer',
        avatar: '⛵',
        xp: 1500,
        score: 8500,
        sagesse: 100
    }
});

console.log('Résultat enregistrement:', resultat);
```

---

## 4️⃣ VÉRIFIER LES ERREURS DE LA FONCTION EDGE

```javascript
// Voir les détails de la dernière réponse
console.log('Current User:', supabaseScores?.currentUser);
```

---

## 5️⃣ TESTER L'APPEL DIRECT À LA FONCTION EDGE

```javascript
// Test direct de la fonction Edge (remplacez YOUR_PROJECT_REF et YOUR_ANON_KEY)
const testEdgeFunction = async () => {
    const response = await fetch('https://YOUR_PROJECT_REF.supabase.co/functions/v1/save-game-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_ANON_KEY'
        },
        body: JSON.stringify({
            email: 'test@example.com',
            pseudo: 'TestPlayer',
            score: 10000,
            niveau_atteint: 23,
            temps_jeu: Math.floor(Date.now() / 1000),
            donnees_extra: {
                pseudo: 'TestPlayer',
                avatar: '⛵',
                xp: 1500
            },
            ville: 'Paris',
            pays: 'France',
            age: 25,
            avatar: '⛵'
        })
    });
    
    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Résultat:', result);
    
    if (!response.ok) {
        console.error('Erreur:', result);
    }
    
    return result;
};

// Exécuter le test
await testEdgeFunction();
```

---

## 6️⃣ RÉCUPÉRER LE CLASSEMENT

```javascript
// Charger et afficher le classement
const classement = await supabaseScores.getLeaderboard(10);
console.log('Classement:', classement);

// Vérifier les pseudos
classement.forEach((entry, index) => {
    console.log(`${index + 1}. Pseudo:`, entry.users?.pseudo || entry.donnees_extra?.pseudo || 'Anonyme');
    console.log('   Score:', entry.score);
    console.log('   User ID:', entry.user_id);
});
```

---

## 7️⃣ VÉRIFIER LA CONFIGURATION SUPABASE

```javascript
// Afficher la configuration (ATTENTION: masquez les clés avant de partager!)
console.log('Supabase URL:', supabaseScores?.client?.supabaseUrl);
console.log('Has API Key:', !!supabaseScores?.client?.supabaseKey);
```

---

## 8️⃣ TESTER LA REQUÊTE SQL DIRECTE (via client Supabase)

```javascript
// Tester une lecture directe de la table scores
const { data: scores, error } = await supabaseScores.client
    .from('scores')
    .select(`
        score,
        user_id,
        created_at,
        donnees_extra,
        users (pseudo, avatar, pays)
    `)
    .eq('game_id', supabaseScores.currentGameId)
    .order('score', { ascending: false })
    .limit(5);

if (error) {
    console.error('Erreur requête:', error);
} else {
    console.log('Scores récupérés:', scores);
}
```

---

## 9️⃣ VÉRIFIER SI LA TABLE USERS EXISTE

```javascript
// Tester la lecture de la table users
const { data: users, error } = await supabaseScores.client
    .from('users')
    .select('*')
    .limit(5);

if (error) {
    console.error('Erreur table users:', error);
    console.log('RLS bloque probablement la lecture');
} else {
    console.log('Users dans la DB:', users);
}
```

---

## 🔟 FORCER LA CRÉATION D'UN USER (via Edge Function)

```javascript
// Appeler directement l'Edge Function avec les bonnes clés
const creerUser = async () => {
    const url = supabaseScores.client.supabaseUrl + '/functions/v1/save-game-score';
    const apiKey = supabaseScores.client.supabaseKey;
    
    console.log('URL:', url);
    console.log('Envoi requête...');
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            email: 'debug@test.com',
            pseudo: 'DebugPlayer',
            score: 99999,
            niveau_atteint: 23,
            temps_jeu: Math.floor(Date.now() / 1000),
            donnees_extra: {
                pseudo: 'DebugPlayer',
                avatar: '🐛',
                debug: true
            },
            ville: 'Debug City',
            pays: 'Test Land',
            age: 99,
            avatar: '🐛'
        })
    });
    
    console.log('Status HTTP:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const result = await response.json();
    console.log('Résultat complet:', result);
    
    if (result.success) {
        console.log('✅ User créé avec ID:', result.user_id);
        console.log('✅ Score créé avec ID:', result.score_id);
    } else {
        console.error('❌ Échec:', result.error);
    }
    
    return result;
};

// Exécuter
await creerUser();
```

---

## 📊 RÉSUMÉ DIAGNOSTIC COMPLET

```javascript
// Exécuter tous les tests d'un coup
const diagnostic = async () => {
    console.log('========================================');
    console.log('🔍 DIAGNOSTIC COMPLET SUPABASE');
    console.log('========================================\n');
    
    // 1. Vérifier Supabase
    console.log('1️⃣ Supabase chargé:', !!window.supabase);
    console.log('   Client initialisé:', !!supabaseScores?.client);
    console.log('   Game ID:', supabaseScores?.currentGameId);
    console.log('   Current User:', supabaseScores?.currentUser);
    console.log('');
    
    // 2. Tester création user
    console.log('2️⃣ Test création utilisateur...');
    await supabaseScores.getOrCreateUser('diag@test.com', 'DiagPlayer', {});
    console.log('   User configuré:', supabaseScores.currentUser);
    console.log('');
    
    // 3. Tester sauvegarde
    console.log('3️⃣ Test sauvegarde score...');
    const resultat = await supabaseScores.saveScore(12345, {
        niveau_atteint: 23,
        donnees_extra: { test: true }
    });
    console.log('   Résultat:', resultat);
    console.log('');
    
    // 4. Vérifier classement
    console.log('4️⃣ Récupération classement...');
    const classement = await supabaseScores.getLeaderboard(5);
    console.log('   Nombre de scores:', classement?.length || 0);
    console.log('   Premier score:', classement?.[0]);
    console.log('');
    
    console.log('========================================');
    console.log('✅ DIAGNOSTIC TERMINÉ');
    console.log('========================================');
};

// Lancer le diagnostic
await diagnostic();
```

---

## 🚨 EN CAS D'ERREUR "Function not found"

Cela signifie que la fonction Edge n'est **pas déployée**. Dans PowerShell :

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

---

## 🚨 EN CAS D'ERREUR CORS

Si vous voyez une erreur CORS, c'est que la fonction Edge bloque votre origine. Vérifiez le fichier `supabase/functions/save-game-score/index.ts` :

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',  // Permet tous les domaines
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

---

## 📝 NOTES IMPORTANTES

- **Remplacez** `YOUR_PROJECT_REF` par votre vrai project ref
- **Remplacez** `YOUR_ANON_KEY` par votre vraie clé anonyme
- **Ne partagez JAMAIS** votre `SERVICE_ROLE_KEY` !
- Les commandes `await` ne fonctionnent que dans la console (pas dans le code)

---

## 🎯 COMMANDE RAPIDE DE TEST

Copiez-collez ceci pour un test rapide :

```javascript
(async () => {
    console.log('🧪 Test rapide...');
    formulaireFinAffiche = false;
    afficherFormulaireFinDeJeuAvecResume(1500, 8500, 10000, 100, 'PBTEST' + Date.now());
    console.log('✅ Formulaire affiché - Remplissez et testez l\'enregistrement');
})();
```
