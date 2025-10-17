-- 🔐 POLITIQUES RLS POUR INSERTION DES DONNÉES
-- Exécutez ce script dans le SQL Editor de Supabase Dashboard
-- OBLIGATOIRE pour que saveScoreDirect() fonctionne

-- ============================================
-- 1. CRÉER LA CONTRAINTE UNIQUE SUR EMAIL (si pas déjà faite)
-- ============================================

-- Vérifier et créer la contrainte UNIQUE sur email
DO $$
BEGIN
    -- Vérifier si la contrainte existe déjà
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'users_email_unique'
    ) THEN
        -- Créer la contrainte UNIQUE
        ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);
        RAISE NOTICE 'Contrainte UNIQUE créée sur users.email';
    ELSE
        RAISE NOTICE 'Contrainte UNIQUE existe déjà sur users.email';
    END IF;
END $$;

-- Vérifier et créer la contrainte UNIQUE sur nom de jeu
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'games_nom_unique'
    ) THEN
        ALTER TABLE games ADD CONSTRAINT games_nom_unique UNIQUE (nom);
        RAISE NOTICE 'Contrainte UNIQUE créée sur games.nom';
    ELSE
        RAISE NOTICE 'Contrainte UNIQUE existe déjà sur games.nom';
    END IF;
END $$;

-- ============================================
-- 2. ACTIVER RLS SUR LES TABLES (si pas déjà fait)
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. SUPPRIMER LES ANCIENNES POLITIQUES
-- ============================================

-- Users
DROP POLICY IF EXISTS "Lecture publique users" ON users;
DROP POLICY IF EXISTS "Insertion publique users" ON users;
DROP POLICY IF EXISTS "Modification propre users" ON users;

-- Scores
DROP POLICY IF EXISTS "Lecture publique scores" ON scores;
DROP POLICY IF EXISTS "Insertion publique scores" ON scores;

-- Games
DROP POLICY IF EXISTS "Lecture publique games" ON games;

-- ============================================
-- 4. CRÉER LES POLITIQUES DE LECTURE (SELECT)
-- ============================================

-- ✅ USERS : Tout le monde peut lire les infos publiques
CREATE POLICY "Lecture publique users"
ON users
FOR SELECT
USING (true);

-- ✅ SCORES : Tout le monde peut lire les scores (pour le classement)
CREATE POLICY "Lecture publique scores"
ON scores
FOR SELECT
USING (true);

-- ✅ GAMES : Tout le monde peut lire la liste des jeux
CREATE POLICY "Lecture publique games"
ON games
FOR SELECT
USING (true);

-- ============================================
-- 5. CRÉER LES POLITIQUES D'INSERTION (INSERT)
-- ============================================

-- ✅ USERS : Tout le monde peut créer un compte
-- (nécessaire pour les nouveaux joueurs)
CREATE POLICY "Insertion publique users"
ON users
FOR INSERT
WITH CHECK (true);

-- ✅ SCORES : Tout le monde peut enregistrer un score
-- (on pourrait restreindre aux users authentifiés plus tard)
CREATE POLICY "Insertion publique scores"
ON scores
FOR INSERT
WITH CHECK (true);

-- ============================================
-- 6. CRÉER LES POLITIQUES DE MODIFICATION (UPDATE)
-- ============================================

-- ✅ USERS : Un utilisateur peut modifier ses propres données
-- (basé sur l'email car on n'a pas d'auth Supabase pour l'instant)
CREATE POLICY "Modification propre users"
ON users
FOR UPDATE
USING (true)  -- Temporairement permissif pour les tests
WITH CHECK (true);

-- Note : En production, vous devriez restreindre avec :
-- USING (email = current_setting('request.jwt.claims', true)::json->>'email')

-- ============================================
-- 7. VÉRIFIER LES POLITIQUES CRÉÉES
-- ============================================

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    CASE 
        WHEN cmd = 'SELECT' THEN '👁️ Lecture'
        WHEN cmd = 'INSERT' THEN '➕ Insertion'
        WHEN cmd = 'UPDATE' THEN '✏️ Modification'
        WHEN cmd = 'DELETE' THEN '🗑️ Suppression'
    END as type_politique
FROM pg_policies
WHERE tablename IN ('users', 'scores', 'games')
ORDER BY tablename, cmd;

-- ============================================
-- 8. TESTER L'INSERTION D'UN UTILISATEUR
-- ============================================

-- Cette requête devrait réussir maintenant
INSERT INTO users (email, pseudo, ville, pays, avatar)
VALUES ('test@example.com', 'TestUser', 'Paris', 'France', '🧪')
ON CONFLICT (email) DO NOTHING
RETURNING *;

-- ============================================
-- 8. CRÉER L'ENTRÉE DU JEU (si pas déjà faite)
-- ============================================

-- Créer ou vérifier que le jeu "Petit Bateau Rouge" existe
INSERT INTO games (nom, icone, description)
VALUES (
    'Petit Bateau Rouge',
    '⛵',
    'Un voyage initiatique à travers les frontières de l''humanité'
)
ON CONFLICT (nom) DO UPDATE 
SET icone = EXCLUDED.icone,
    description = EXCLUDED.description
RETURNING id, nom, icone;

-- ============================================
-- 9. TESTER L'INSERTION D'UN SCORE
-- ============================================

-- Insérer un score de test
DO $$
DECLARE
    test_user_id UUID;
    test_game_id UUID;
BEGIN
    -- Récupérer l'ID du user test
    SELECT id INTO test_user_id FROM users WHERE email = 'test@example.com';
    
    IF test_user_id IS NULL THEN
        RAISE EXCEPTION 'User test non trouvé. Exécutez d''abord l''étape 7.';
    END IF;
    
    -- Récupérer l'ID du jeu
    SELECT id INTO test_game_id FROM games WHERE nom = 'Petit Bateau Rouge';
    
    IF test_game_id IS NULL THEN
        RAISE EXCEPTION 'Jeu "Petit Bateau Rouge" non trouvé. Exécutez d''abord l''étape 8.';
    END IF;
    
    RAISE NOTICE 'User ID: %', test_user_id;
    RAISE NOTICE 'Game ID: %', test_game_id;
    
    -- Insérer un score test
    INSERT INTO scores (user_id, game_id, score, niveau_atteint, donnees_extra)
    VALUES (
        test_user_id,
        test_game_id,
        5000,
        10,
        jsonb_build_object(
            'pseudo', 'TestUser',
            'avatar', '🧪',
            'xp', 1000,
            'score', 4000,
            'sagesse', 50
        )
    );
    
    RAISE NOTICE '✅ Score test inséré avec succès !';
END $$;

-- ============================================
-- 10. VÉRIFIER LES DONNÉES INSÉRÉES
-- ============================================

SELECT 
    s.id,
    s.score,
    s.niveau_atteint,
    s.created_at,
    u.pseudo,
    u.avatar,
    u.email,
    s.donnees_extra->>'pseudo' as pseudo_from_extra
FROM scores s
LEFT JOIN users u ON s.user_id = u.id
WHERE u.email = 'test@example.com'
ORDER BY s.created_at DESC
LIMIT 5;

-- ============================================
-- ✅ RÉSUMÉ
-- ============================================

-- Ce script a créé :
-- ✅ 3 politiques SELECT (lecture publique)
-- ✅ 2 politiques INSERT (insertion publique)
-- ✅ 1 politique UPDATE (modification)
-- ✅ Test d'insertion user
-- ✅ Test d'insertion score

-- Maintenant votre jeu devrait pouvoir :
-- 1. Créer de nouveaux utilisateurs
-- 2. Enregistrer leurs scores
-- 3. Afficher le classement avec les pseudos

-- 🎉 Rechargez votre jeu et testez l'enregistrement !
