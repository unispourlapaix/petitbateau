# 🧪 TEST RAPIDE - Vérifier que tout fonctionne

Ouvrez la console du navigateur (F12) et exécutez ces commandes :

## 1. Vérifier que le jeu est défini
```javascript
console.log('Game ID:', supabaseScores?.currentGameId);
// Devrait afficher un UUID, pas null ou undefined
```

## 2. Test complet d'enregistrement
```javascript
(async () => {
    console.log('🧪 Test complet d\'enregistrement...');
    
    // 1. Vérifier le client
    if (!supabaseScores || !supabaseScores.client) {
        console.error('❌ Supabase non initialisé');
        return;
    }
    console.log('✅ Client Supabase OK');
    
    // 2. Vérifier le game ID
    if (!supabaseScores.currentGameId) {
        console.error('❌ Game ID manquant, initialisation...');
        await supabaseScores.setCurrentGame('Petit Bateau Rouge');
    }
    console.log('✅ Game ID:', supabaseScores.currentGameId);
    
    // 3. Créer un utilisateur test
    await supabaseScores.getOrCreateUser(
        'montest@example.com',
        'MonTestUser',
        { ville: 'Paris', pays: 'France', avatar: '🎮' }
    );
    console.log('✅ User créé/récupéré');
    
    // 4. Enregistrer un score
    const resultat = await supabaseScores.saveScoreDirect(7777, {
        niveau_atteint: 15,
        temps_jeu: 500,
        donnees_extra: {
            pseudo: 'MonTestUser',
            avatar: '🎮',
            xp: 2000,
            score: 5000,
            sagesse: 77
        }
    });
    
    console.log('📊 Résultat:', resultat);
    
    if (resultat && resultat.success) {
        console.log('🎉 SUCCÈS ! Score enregistré !');
        console.log('User ID:', resultat.user_id);
        console.log('Score ID:', resultat.score_id);
    } else {
        console.error('❌ ÉCHEC:', resultat?.error);
    }
})();
```

## 3. Vérifier dans Supabase Dashboard

1. Ouvrir https://supabase.com/dashboard
2. Table Editor → Table "users"
3. Chercher `montest@example.com`
4. Table Editor → Table "scores"
5. Vérifier que le score 7777 est là avec le bon user_id

## 4. Test du formulaire Game Over

```javascript
// Réinitialiser et afficher le formulaire
formulaireFinAffiche = false;
afficherFormulaireFinDeJeuAvecResume(2000, 8000, 10000, 100, 'TEST456');
```

## Si ça ne marche toujours pas

Vérifier les erreurs dans la console et envoyez-moi :
1. Le message d'erreur complet
2. La réponse de `console.log('Game ID:', supabaseScores?.currentGameId);`
3. La réponse du test complet

## ✅ Si tout fonctionne

Rechargez le jeu (F5) et jouez normalement jusqu'au Game Over. Le formulaire devrait maintenant :
1. S'afficher correctement
2. Enregistrer le score quand vous remplissez le formulaire
3. Afficher votre pseudo dans le classement (pas "Anonyme")

🎉 Bonne chance !
