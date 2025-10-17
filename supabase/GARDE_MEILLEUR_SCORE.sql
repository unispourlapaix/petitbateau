-- ============================================
-- GARDER UNIQUEMENT LE MEILLEUR SCORE
-- Solution simple pour 33 millions de joueurs
-- ============================================

-- 1. Empêcher les doublons (1 user = 1 score par jeu)
ALTER TABLE scores
ADD CONSTRAINT unique_user_game UNIQUE (user_id, game_id);

-- 2. Fonction qui garde automatiquement le meilleur score
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
  -- Chercher le score existant
  SELECT score INTO v_existing_score
  FROM scores
  WHERE user_id = p_user_id AND game_id = p_game_id;

  -- Si pas de score OU nouveau score meilleur
  IF v_existing_score IS NULL OR p_score > v_existing_score THEN
    -- Insérer ou mettre à jour (UPSERT)
    INSERT INTO scores (user_id, game_id, score, niveau_atteint, temps_jeu, donnees_extra)
    VALUES (p_user_id, p_game_id, p_score, p_niveau_atteint, p_temps_jeu, p_donnees_extra)
    ON CONFLICT (user_id, game_id)
    DO UPDATE SET
      score = p_score,
      niveau_atteint = p_niveau_atteint,
      temps_jeu = p_temps_jeu,
      donnees_extra = p_donnees_extra,
      updated_at = NOW();

    -- Retourner succès
    RETURN jsonb_build_object(
      'success', true,
      'is_best', true,
      'old_score', COALESCE(v_existing_score, 0),
      'new_score', p_score
    );
  ELSE
    -- Score existant meilleur, ne rien faire
    RETURN jsonb_build_object(
      'success', false,
      'is_best', false,
      'old_score', v_existing_score,
      'new_score', p_score
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. BONUS : Nettoyer les doublons existants (exécuter UNE FOIS)
-- Décommenter pour nettoyer :
/*
WITH ranked_scores AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id, game_id ORDER BY score DESC, created_at DESC) as rn
  FROM scores
)
DELETE FROM scores WHERE id IN (SELECT id FROM ranked_scores WHERE rn > 1);
*/

-- ============================================
-- COMMENT ÇA MARCHE ?
-- ============================================
-- 1. Un joueur termine avec 10000 points
--    → save_best_score() l'enregistre
--    → Retour : {success: true, is_best: true, old_score: 0, new_score: 10000}
--
-- 2. Le joueur rejoue et fait 8000 points
--    → save_best_score() ne fait RIEN (8000 < 10000)
--    → Retour : {success: false, is_best: false, old_score: 10000, new_score: 8000}
--
-- 3. Le joueur rejoue et fait 15000 points
--    → save_best_score() REMPLACE 10000 par 15000
--    → Retour : {success: true, is_best: true, old_score: 10000, new_score: 15000}
--
-- Résultat : Toujours UN SEUL score par joueur (le meilleur)
-- ============================================
