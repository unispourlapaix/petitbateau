-- ============================================
-- ÉTAPE 1 : NETTOYER LES DOUBLONS EXISTANTS
-- ÉTAPE 2 : PROTÉGER CONTRE LES FUTURS DOUBLONS
-- ============================================

-- ÉTAPE 1 : Nettoyer les doublons (garder le meilleur score)
-- Pour chaque (user_id, game_id), on garde uniquement le score le plus élevé

WITH ranked_scores AS (
  SELECT
    id,
    user_id,
    game_id,
    score,
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

-- Vérifier combien de doublons ont été supprimés
-- Le résultat s'affiche dans "Messages"

-- ÉTAPE 2 : Empêcher les futurs doublons
ALTER TABLE scores
ADD CONSTRAINT unique_user_game UNIQUE (user_id, game_id);

-- ÉTAPE 3 : Fonction qui garde automatiquement le meilleur score
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

-- ============================================
-- RÉSULTAT
-- ============================================
-- ✅ Doublons supprimés
-- ✅ Contrainte UNIQUE ajoutée
-- ✅ Fonction save_best_score() créée
-- ✅ Prêt pour 33 millions de joueurs !
-- ============================================
