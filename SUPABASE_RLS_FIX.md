# 📋 Résumé des modifications - Sécurité RLS Supabase

## 🎯 Objectif
Permettre aux joueurs anonymes de sauvegarder leurs scores tout en **gardant la sécurité RLS activée** sur les tables Supabase.

## ✅ Solution implémentée

### Architecture
```
Client (JavaScript)
    ↓
supabase-scores.js (appel Edge Function)
    ↓
Supabase Edge Function (serveur)
    ↓
Supabase Database (bypass RLS avec service_role)
```

### Avantages
- ✅ **RLS reste actif** : Sécurité maximale
- ✅ **Service role sécurisé** : Jamais exposé au client
- ✅ **Validation serveur** : Données vérifiées avant insertion
- ✅ **Pas d'authentification requise** : Joueurs anonymes supportés

## 📁 Fichiers créés

### 1. `/supabase/functions/save-game-score/index.ts`
**Edge Function Supabase** qui gère l'insertion sécurisée :
- Validation de l'email (regex)
- Création/mise à jour utilisateur
- Insertion du score
- Gestion des erreurs complète
- Headers CORS configurés

### 2. `/supabase/functions/save-game-score/config.json`
Configuration de la fonction Edge :
```json
{
  "importMap": "./import_map.json",
  "verify_jwt": false
}
```

### 3. `/supabase/SUPABASE_SETUP.md`
Documentation complète :
- Installation Supabase CLI
- Déploiement de la fonction
- Test avec cURL
- Configuration RLS
- Résolution de problèmes

## 🔧 Fichiers modifiés

### `/modules/supabase-scores.js`

#### Avant
```javascript
// Insertion directe → bloquée par RLS
await this.client.from('users').insert([...])
```

#### Après
```javascript
// Appel à l'Edge Function
await fetch(`${this.client.supabaseUrl}/functions/v1/save-game-score`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${this.client.supabaseKey}`
    },
    body: JSON.stringify({ email, pseudo, score, ... })
})
```

### Changements principaux :

1. **`getOrCreateUser()`** :
   - Ne crée plus directement dans la DB
   - Stocke les infos localement
   - Envoyées ensuite avec `saveScore()`

2. **`saveScore()`** :
   - Appelle l'Edge Function
   - Envoie toutes les données en un seul appel
   - Gère les erreurs réseau

3. **`saveScoreClassic()`** :
   - Méthode de fallback conservée
   - Non utilisée actuellement

## 🚀 Déploiement

### Étapes à suivre :

```bash
# 1. Installer Supabase CLI
npm install -g supabase

# 2. Se connecter
supabase login

# 3. Lier le projet
supabase link --project-ref VOTRE_PROJECT_REF

# 4. Déployer la fonction
supabase functions deploy save-game-score

# 5. Vérifier
supabase functions list
```

### Trouver votre PROJECT_REF :
1. Allez sur https://supabase.com/dashboard
2. Sélectionnez "Petit Bateau Rouge"
3. URL = `https://supabase.com/dashboard/project/[PROJECT_REF]`

## 🧪 Test de la fonction

### Test manuel avec cURL :
```bash
curl -X POST https://VOTRE_PROJECT_REF.supabase.co/functions/v1/save-game-score \
  -H "Authorization: Bearer VOTRE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "pseudo": "TestPlayer",
    "score": 15000,
    "niveau_atteint": 23
  }'
```

### Test dans le jeu :
1. Jouez jusqu'à Game Over
2. Remplissez le formulaire
3. Vérifiez la console : `✅ Score enregistré via Edge Function`
4. Vérifiez dans Supabase Dashboard → Table Editor → scores

## 🔒 Sécurité maintenue

### Tables protégées par RLS :

#### `users`
```sql
-- Lecture publique OK
CREATE POLICY "Lecture publique users" ON users
  FOR SELECT USING (true);

-- Pas de politique INSERT/UPDATE = bloqué (sauf service_role)
```

#### `scores`
```sql
-- Lecture publique OK
CREATE POLICY "Lecture publique scores" ON scores
  FOR SELECT USING (true);

-- Pas de politique INSERT = bloqué (sauf service_role)
```

### Validation Edge Function :
- ✅ Format email vérifié
- ✅ Champs requis (email, pseudo, score)
- ✅ Types de données validés
- ✅ Pas de SQL injection possible

## 📊 Flux de données complet

### Sauvegarde d'un score :

```
1. Joueur perd (Game Over)
   ↓
2. Formulaire affiché (email, pseudo, etc.)
   ↓
3. getOrCreateUser() stocke les infos localement
   ↓
4. saveScore() appelle Edge Function avec toutes les données
   ↓
5. Edge Function valide les données
   ↓
6. Edge Function utilise service_role pour bypass RLS
   ↓
7. Création/update user + insertion score
   ↓
8. Retour succès au client
   ↓
9. Message "✅ Score enregistré !"
```

## ❓ Résolution de problèmes

### "Erreur lors de la sauvegarde"
→ Vérifiez que la fonction est déployée :
```bash
supabase functions list
```

### "CORS error"
→ L'Edge Function inclut les headers CORS, mais vérifiez l'URL

### "Invalid API key"
→ Utilisez bien `SUPABASE_ANON_KEY` côté client (pas service_role)

### Score non visible dans DB
→ Vérifiez les logs :
```bash
supabase functions logs save-game-score --follow
```

## 📈 Améliorations futures

### Court terme :
- [ ] Rate limiting (Supabase Dashboard)
- [ ] Validation score max (pas de triche)
- [ ] Cache local des scores

### Moyen terme :
- [ ] Authentification optionnelle (OAuth)
- [ ] Profils utilisateurs complets
- [ ] Achievements/badges

### Long terme :
- [ ] Classements en temps réel
- [ ] Mode multijoueur
- [ ] Replay des parties

## 📞 Contact

Questions ? Problèmes ?
- 📧 emmanuelpayet888@gmail.com
- 🌐 https://www.emmanuelpayet.art/
- 📖 Voir `SUPABASE_SETUP.md` pour la documentation complète

---

**Date de mise à jour** : 16 octobre 2025  
**Version** : 1.2  
**Auteur** : Emmanuel Payet (avec GitHub Copilot)
