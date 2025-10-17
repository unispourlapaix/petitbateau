-- ============================================
-- FIX : LA CONTRAINTE EXISTE MAIS IL Y A DES DOUBLONS
-- ============================================
-- Ce script corrige le problème quand on a essayé d'ajouter
-- la contrainte UNIQUE alors qu'il y avait déjà des doublons

-- ÉTAPE 1 : Supprimer temporairement la contrainte
ALTER TABLE scores
DROP CONSTRAINT IF EXISTS unique_user_game;

-- ÉTAPE 2 : Nettoyer les doublons (garder le meilleur score)
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

-- ÉTAPE 3 : Remettre la contrainte (maintenant ça va marcher)
ALTER TABLE scores
ADD CONSTRAINT unique_user_game UNIQUE (user_id, game_id);

-- ÉTAPE 4 : Créer la fonction save_best_score
CREATE OR REPLACE FUNCTION save_best_score(
  p_user_id UUID,
  p_game_id UUID,
  p_score INTEGER,
  p_niveau_atteint INTEGER DEFAULT NULL,
  p_temps_jeu INTEGER DEFAULT NULL,
  p_donnees_extra JSONB DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  v_existing_score INTEGER;
BEGIN
  SELECT score INTO v_existing_score
  FROM scores
  WHERE user_id = p_user_id AND game_id = p_game_id;

  IF v_existing_score IS NULL OR p_score > v_existing_score THEN
    INSERT INTO scores (user_id, game_id, score, niveau_atteint, temps_jeu, donnees_extra)
    VALUES (p_user_id, p_game_id, p_score, p_niveau_atteint, p_temps_jeu, p_donnees_extra)
    ON CONFLICT (user_id, game_id)
    DO UPDATE SET
      score = p_score,
      niveau_atteint = p_niveau_atteint,
      temps_jeu = p_temps_jeu,
      donnees_extra = p_donnees_extra,
      updated_at = NOW();

    RETURN jsonb_build_object(
      'success', true,
      'is_best', true,
      'old_score', COALESCE(v_existing_score, 0),
      'new_score', p_score
    );
  ELSE
    RETURN jsonb_build_object(
      'success', false,
      'is_best', false,
      'old_score', v_existing_score,
      'new_score', p_score
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ÉTAPE 5 : Vérifier que tout est OK
SELECT
  COUNT(*) as total_scores,
  COUNT(DISTINCT (user_id, game_id)) as scores_uniques,
  COUNT(*) - COUNT(DISTINCT (user_id, game_id)) as doublons_restants
FROM scores;
-- Si doublons_restants = 0 → PARFAIT ! ✅

-- ============================================
-- ✅ RÉSULTAT
-- ============================================
-- - Contrainte supprimée temporairement
-- - Doublons nettoyés
-- - Contrainte recréée
-- - Fonction save_best_score créée
-- - Prêt pour 33M de joueurs !
-- ============================================
