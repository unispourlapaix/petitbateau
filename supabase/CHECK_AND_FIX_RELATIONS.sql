-- 🔍 Vérifier et réparer les relations Supabase pour Petit Bateau Rouge
-- Exécutez ce script dans le SQL Editor de Supabase Dashboard

-- ============================================
-- 1. VÉRIFIER LA STRUCTURE DES TABLES
-- ============================================

-- Vérifier la table users
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Vérifier la table scores
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'scores'
ORDER BY ordinal_position;

-- ============================================
-- 2. VÉRIFIER LES FOREIGN KEYS EXISTANTES
-- ============================================

SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name IN ('scores', 'users');

-- ============================================
-- 3. CRÉER/RÉPARER LA FOREIGN KEY (si manquante)
-- ============================================

-- Vérifier si la foreign key existe déjà
DO $$
BEGIN
    -- Si la foreign key n'existe pas, la créer
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'scores_user_id_fkey'
            AND table_name = 'scores'
    ) THEN
        -- Créer la foreign key
        ALTER TABLE scores
        ADD CONSTRAINT scores_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE;  -- Si un user est supprimé, ses scores sont supprimés aussi
        
        RAISE NOTICE 'Foreign key créée : scores_user_id_fkey';
    ELSE
        RAISE NOTICE 'Foreign key existe déjà : scores_user_id_fkey';
    END IF;
END $$;

-- ============================================
-- 4. VÉRIFIER LES POLITIQUES RLS
-- ============================================

-- Voir toutes les politiques sur users
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'users';

-- Voir toutes les politiques sur scores
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'scores';

-- ============================================
-- 5. CRÉER LES POLITIQUES RLS CORRECTES
-- ============================================

-- ⚠️ SUPPRIMER LES ANCIENNES POLITIQUES RESTRICTIVES (si elles existent)
DROP POLICY IF EXISTS "Lecture publique users" ON users;
DROP POLICY IF EXISTS "Lecture publique scores" ON scores;

-- ✅ CRÉER LA POLITIQUE DE LECTURE POUR USERS (permet la relation)
CREATE POLICY "Lecture publique users"
ON users
FOR SELECT
USING (true);  -- Tout le monde peut lire les infos publiques des users

-- ✅ CRÉER LA POLITIQUE DE LECTURE POUR SCORES (permet le classement)
CREATE POLICY "Lecture publique scores"
ON scores
FOR SELECT
USING (true);  -- Tout le monde peut lire les scores

-- ============================================
-- 6. TESTER LA RELATION
-- ============================================

-- Cette requête devrait retourner les scores AVEC les infos users
SELECT 
    s.id as score_id,
    s.score,
    s.niveau_atteint,
    s.created_at,
    s.user_id,
    u.pseudo,
    u.avatar,
    u.pays
FROM scores s
LEFT JOIN users u ON s.user_id = u.id
WHERE s.game_id = (SELECT id FROM games WHERE nom = 'Petit Bateau Rouge')
ORDER BY s.score DESC
LIMIT 10;

-- ============================================
-- 7. TESTER LA RELATION COMME SUPABASE JS
-- ============================================

-- Cette requête simule ce que fait supabaseScores.getLeaderboard()
-- Elle devrait retourner un JSON avec les users imbriqués

EXPLAIN (FORMAT JSON)
SELECT 
    json_build_object(
        'score', s.score,
        'niveau_atteint', s.niveau_atteint,
        'temps_jeu', s.temps_jeu,
        'created_at', s.created_at,
        'donnees_extra', s.donnees_extra,
        'users', json_build_object(
            'pseudo', u.pseudo,
            'avatar', u.avatar,
            'pays', u.pays
        )
    ) as entry
FROM scores s
LEFT JOIN users u ON s.user_id = u.id
WHERE s.game_id = (SELECT id FROM games WHERE nom = 'Petit Bateau Rouge')
ORDER BY s.score DESC
LIMIT 10;

-- ============================================
-- 8. RÉSUMÉ DU DIAGNOSTIC
-- ============================================

SELECT 
    '✅ Tables' as check_type,
    COUNT(*) as count
FROM information_schema.tables
WHERE table_name IN ('users', 'scores', 'games')

UNION ALL

SELECT 
    '✅ Foreign Keys' as check_type,
    COUNT(*) as count
FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY'
    AND table_name = 'scores'
    AND constraint_name LIKE '%user_id%'

UNION ALL

SELECT 
    '✅ RLS Policies (users)' as check_type,
    COUNT(*) as count
FROM pg_policies
WHERE tablename = 'users'

UNION ALL

SELECT 
    '✅ RLS Policies (scores)' as check_type,
    COUNT(*) as count
FROM pg_policies
WHERE tablename = 'scores'

UNION ALL

SELECT 
    '✅ Users enregistrés' as check_type,
    COUNT(*) as count
FROM users

UNION ALL

SELECT 
    '✅ Scores enregistrés' as check_type,
    COUNT(*) as count
FROM scores;

-- ============================================
-- 9. CORRIGER LES SCORES ORPHELINS (si nécessaire)
-- ============================================

-- Voir les scores sans user_id valide
SELECT 
    s.id,
    s.score,
    s.user_id,
    s.created_at,
    CASE 
        WHEN u.id IS NULL THEN '❌ User manquant'
        ELSE '✅ User existe'
    END as status
FROM scores s
LEFT JOIN users u ON s.user_id = u.id
WHERE s.game_id = (SELECT id FROM games WHERE nom = 'Petit Bateau Rouge')
ORDER BY s.created_at DESC
LIMIT 20;

-- Si vous avez des scores orphelins, vous pouvez les supprimer :
-- ⚠️ ATTENTION : Décommentez uniquement si vous voulez SUPPRIMER les scores orphelins !
-- DELETE FROM scores
-- WHERE user_id NOT IN (SELECT id FROM users);

-- ============================================
-- ✅ FIN DU DIAGNOSTIC
-- ============================================

-- Une fois ce script exécuté :
-- 1. Vérifiez que la foreign key existe
-- 2. Vérifiez que les politiques RLS permettent la lecture
-- 3. Testez la requête de jointure (étape 6)
-- 4. Rechargez votre jeu et enregistrez un nouveau score
-- 5. Le classement devrait maintenant afficher les bons pseudos ! 🎉
