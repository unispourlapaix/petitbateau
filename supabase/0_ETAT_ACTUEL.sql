-- ============================================
-- VÉRIFIER L'ÉTAT ACTUEL DE LA BASE
-- ============================================

-- 1. Est-ce que la contrainte UNIQUE existe ?
SELECT conname, contype
FROM pg_constraint
WHERE conrelid = 'scores'::regclass
AND conname = 'unique_user_game';
-- Si résultat vide → contrainte n'existe pas
-- Si résultat affiché → contrainte existe déjà

-- 2. Est-ce que la fonction save_best_score existe ?
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name = 'save_best_score';
-- Si résultat vide → fonction n'existe pas
-- Si résultat affiché → fonction existe déjà

-- 3. Combien de doublons restants ?
SELECT
  COUNT(*) as total_scores,
  COUNT(DISTINCT (user_id, game_id)) as scores_uniques,
  COUNT(*) - COUNT(DISTINCT (user_id, game_id)) as doublons
FROM scores;

-- 4. Liste des doublons (s'il y en a)
SELECT
  user_id,
  game_id,
  COUNT(*) as nb_scores,
  array_agg(score ORDER BY score DESC) as tous_les_scores
FROM scores
GROUP BY user_id, game_id
HAVING COUNT(*) > 1;

-- ============================================
-- INTERPRÉTATION
-- ============================================
-- Si contrainte existe MAIS doublons > 0
--   → La contrainte a été créée MAIS il y avait déjà des doublons
--   → Il faut SUPPRIMER la contrainte, nettoyer, puis la recréer
--
-- Si contrainte existe ET doublons = 0
--   → Tout est OK ! Juste créer la fonction save_best_score
--
-- Si contrainte n'existe pas
--   → Suivre les étapes 1, 2, 3 normalement
-- ============================================
