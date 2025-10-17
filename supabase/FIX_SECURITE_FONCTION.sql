-- ============================================
-- FIX SÉCURITÉ : Function Search Path Mutable
-- ============================================
-- Supabase signale que la fonction save_best_score()
-- a un "search_path" mutable qui peut être un risque de sécurité.
-- On doit recréer la fonction avec SET search_path = ''

DROP FUNCTION IF EXISTS save_best_score(UUID, UUID, INTEGER, INTEGER, INTEGER, JSONB);

CREATE OR REPLACE FUNCTION save_best_score(
  p_user_id UUID,
  p_game_id UUID,
  p_score INTEGER,
  p_niveau_atteint INTEGER DEFAULT NULL,
  p_temps_jeu INTEGER DEFAULT NULL,
  p_donnees_extra JSONB DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_existing_score INTEGER;
BEGIN
  -- Chercher le score existant (avec schema qualifié)
  SELECT score INTO v_existing_score
  FROM public.scores
  WHERE user_id = p_user_id AND game_id = p_game_id;

  -- Si pas de score OU nouveau score meilleur
  IF v_existing_score IS NULL OR p_score > v_existing_score THEN
    -- Insérer ou mettre à jour (UPSERT)
    INSERT INTO public.scores (user_id, game_id, score, niveau_atteint, temps_jeu, donnees_extra)
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
$$;

-- Vérifier que la fonction est bien créée
SELECT routine_name, security_type
FROM information_schema.routines
WHERE routine_name = 'save_best_score';

-- ============================================
-- ✅ RÉSULTAT
-- ============================================
-- La fonction est maintenant sécurisée avec :
-- - SET search_path = ''
-- - Références qualifiées (public.scores)
-- L'avertissement Supabase devrait disparaître
-- ============================================
