# 🔐 Configuration Supabase Edge Function pour Petit Bateau Rouge

## Pourquoi une Edge Function ?

La table `users` a une politique RLS (Row Level Security) activée qui empêche les insertions anonymes directes. L'Edge Function utilise le `service_role_key` côté serveur pour contourner RLS de manière sécurisée.

## ✅ Avantages

- ✅ **Sécurité maintenue** : RLS reste actif
- ✅ **Validation côté serveur** : Email, pseudo, score validés
- ✅ **Pas d'authentification requise** : Les joueurs anonymes peuvent sauvegarder
- ✅ **Protection contre les abus** : Validation des données avant insertion

## 📦 Installation

### 1. Installer Supabase CLI

```bash
npm install -g supabase
```

### 2. Connexion à votre projet Supabase

```bash
supabase login
supabase link --project-ref VOTRE_PROJECT_REF
```

Pour trouver votre `PROJECT_REF` :
- Allez sur https://supabase.com/dashboard
- Sélectionnez votre projet
- L'URL contient votre ref : `https://supabase.com/dashboard/project/VOTRE_PROJECT_REF`

### 3. Déployer la fonction

```bash
# Depuis la racine du projet petitbateau
supabase functions deploy save-game-score
```

### 4. Vérifier le déploiement

```bash
supabase functions list
```

Vous devriez voir :
```
┌─────────────────────┬────────────────────────────────────────┐
│ NAME                │ URL                                     │
├─────────────────────┼────────────────────────────────────────┤
│ save-game-score     │ https://...supabase.co/functions/v1/... │
└─────────────────────┴────────────────────────────────────────┘
```

## 🧪 Test de la fonction

### Via cURL

```bash
curl -X POST https://VOTRE_PROJECT_REF.supabase.co/functions/v1/save-game-score \
  -H "Authorization: Bearer VOTRE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "pseudo": "TestPlayer",
    "score": 15000,
    "niveau_atteint": 23,
    "temps_jeu": 3600,
    "ville": "Paris",
    "pays": "France",
    "age": 25,
    "genre": "Homme",
    "avatar": "⛵"
  }'
```

### Réponse attendue

```json
{
  "success": true,
  "user_id": "uuid-de-lutilisateur",
  "score_id": "uuid-du-score",
  "message": "Score enregistré avec succès"
}
```

## 🔧 Configuration des politiques RLS

Vos politiques RLS actuelles peuvent rester activées. La fonction Edge contourne RLS en utilisant `service_role_key`.

### Politique recommandée pour la table `users` :

```sql
-- Lecture publique (pour le classement)
CREATE POLICY "Lecture publique users" ON users
  FOR SELECT
  USING (true);

-- Aucune insertion/update directe (uniquement via Edge Function)
-- Pas de politique INSERT/UPDATE = tout bloqué sauf service_role
```

### Politique recommandée pour la table `scores` :

```sql
-- Lecture publique (pour le classement)
CREATE POLICY "Lecture publique scores" ON scores
  FOR SELECT
  USING (true);

-- Aucune insertion directe (uniquement via Edge Function)
```

## 🔒 Sécurité

### Ce qui est protégé :

1. ✅ **Validation email** : Format vérifié côté serveur
2. ✅ **Limitation des données** : Seuls les champs autorisés sont acceptés
3. ✅ **CORS configuré** : Seules les origines autorisées peuvent appeler
4. ✅ **Service Role sécurisé** : Clé jamais exposée au client
5. ✅ **Pas de SQL injection** : Utilisation de l'ORM Supabase

### Ce qu'il faut encore faire :

- [ ] **Rate limiting** : Limiter les appels par IP (via Supabase Dashboard)
- [ ] **Validation avancée** : Score maximum, données cohérentes
- [ ] **Logging** : Tracer les insertions suspectes

## 🔑 Variables d'environnement

Les variables sont automatiquement disponibles dans les Edge Functions :

- `SUPABASE_URL` : URL de votre projet
- `SUPABASE_SERVICE_ROLE_KEY` : Clé service (bypass RLS)

**⚠️ IMPORTANT** : Ne jamais exposer `SUPABASE_SERVICE_ROLE_KEY` côté client !

## 📝 Logs et debugging

### Voir les logs en temps réel

```bash
supabase functions logs save-game-score --follow
```

### Voir les derniers logs

```bash
supabase functions logs save-game-score
```

## 🚀 Mise à jour de la fonction

Après modification du code :

```bash
supabase functions deploy save-game-score
```

## 📚 Documentation

- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Service Role Key](https://supabase.com/docs/guides/api/api-keys)

## ❓ Résolution de problèmes

### Erreur "Function not found"

Vérifiez que la fonction est bien déployée :
```bash
supabase functions list
```

### Erreur CORS

Assurez-vous que les headers CORS sont corrects dans `index.ts`.

### Erreur "Invalid API key"

Vérifiez que vous utilisez bien `SUPABASE_ANON_KEY` (pas service_role) côté client.

### Score non enregistré

Vérifiez les logs :
```bash
supabase functions logs save-game-score
```

## 📞 Support

En cas de problème :
1. Vérifiez les logs Edge Function
2. Vérifiez les politiques RLS
3. Testez avec cURL
4. Contactez le support Supabase
