-- ============================================
-- ÉTAPE 1 : VOIR LES DOUBLONS (SANS RIEN SUPPRIMER)
-- ============================================

-- Combien de doublons au total ?
SELECT
  COUNT(*) - COUNT(DISTINCT (user_id, game_id)) as nombre_doublons
FROM scores;

-- Détail des utilisateurs qui ont des doublons
SELECT
  user_id,
  game_id,
  COUNT(*) as nb_scores,
  array_agg(score ORDER BY score DESC) as tous_les_scores,
  MAX(score) as meilleur_score
FROM scores
GROUP BY user_id, game_id
HAVING COUNT(*) > 1
ORDER BY COUNT(*) DESC;

-- Exemple de doublons pour un utilisateur spécifique
-- (décommenter et mettre votre user_id)
/*
SELECT * FROM scores
WHERE user_id = 'e8f502e0-fe32-43cd-8fd3-3af0b92e0154'
ORDER BY score DESC;
*/
