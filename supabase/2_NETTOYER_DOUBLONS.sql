-- ============================================
-- ÉTAPE 2 : NETTOYER LES DOUBLONS
-- (Exécuter après avoir vu les doublons avec 1_VOIR_DOUBLONS.sql)
-- ============================================

-- Supprimer tous les doublons SAUF le meilleur score
WITH ranked_scores AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY user_id, game_id
      ORDER BY score DESC, created_at DESC
    ) as rn
  FROM scores
)
DELETE FROM scores
WHERE id IN (
  SELECT id FROM ranked_scores WHERE rn > 1
);

-- Vérifier que c'est bon
SELECT
  COUNT(*) - COUNT(DISTINCT (user_id, game_id)) as doublons_restants
FROM scores;
-- Si résultat = 0 → PARFAIT, plus de doublons !
