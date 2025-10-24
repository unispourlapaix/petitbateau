/**
 * Module Supabase Scores - Gestion des scores multi-jeux
 * @author Emmanuel Payet (Dreamer Unisona)
 * @version 1.1.0 - Ajout fallback localStorage
 */

class SupabaseScores {
    constructor() {
        // � MODE PRODUCTION - Logs désactivés
        this.debugMode = false;
        
        // Configuration Supabase
        this.supabaseUrl = 'https://dmszyxowetilvsanqsxm.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtc3p5eG93ZXRpbHZzYW5xc3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NzM0NDUsImV4cCI6MjA3NTM0OTQ0NX0.EukDYFVt0sCrDb0_V4ZPMv5B4gkD43V8Cw7CEuvl0C8';

        // 💾 Clés localStorage pour fallback
        this.LOCAL_SCORES_KEY = 'petit_bateau_local_scores';
        this.LOCAL_USER_KEY = 'petit_bateau_local_user';

        if (this.debugMode) {
            console.log('🔧 MODE DEBUG ACTIVÉ');
            console.log('📡 Supabase URL:', this.supabaseUrl);
            console.log('🔑 API Key (20 premiers chars):', this.supabaseKey.substring(0, 20) + '...');
            console.log('💾 Fallback localStorage activé');
        }

        // Charger la librairie Supabase
        this.loadSupabaseLibrary();

        // Utilisateur actuel (null si pas connecté)
        this.currentUser = null;

        // ID du jeu actuel (sera défini par le jeu)
        this.currentGameId = null;

        if (!window.PRODUCTION_MODE) {
            console.log('🎮 SupabaseScores initialisé avec fallback localStorage');
        }
    }

    log(...args) {
        if (this.debugMode && !window.PRODUCTION_MODE) {
            console.log('🔧 [DEBUG]', ...args);
        }
    }

    error(...args) {
        if (this.debugMode && !window.PRODUCTION_MODE) {
            console.error('❌ [DEBUG]', ...args);
        }
    }

    // Charger la librairie Supabase depuis CDN
    loadSupabaseLibrary() {
        if (window.supabase) {
            this.initSupabase();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/dist/umd/supabase.js';
        script.onload = () => {
            if (!window.PRODUCTION_MODE) {
                console.log('✅ Librairie Supabase chargée');
            }
            this.initSupabase();
        };
        script.onerror = () => {
            if (!window.PRODUCTION_MODE) {
                console.error('❌ Erreur chargement Supabase - Mode hors ligne activé');
            }
            this.isOffline = true;
        };
        document.head.appendChild(script);
    }

    // Initialiser le client Supabase
    initSupabase() {
        if (!window.PRODUCTION_MODE) {
            console.log('🔧 [DEBUG] Création du client Supabase...');
        }
        this.client = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);
        if (!window.PRODUCTION_MODE) {
            console.log('🔧 [DEBUG] Client créé:', !!this.client);
            console.log('✅ Client Supabase initialisé');
        }
        
        // Test de connexion immédiat
        if (this.debugMode && !window.PRODUCTION_MODE) {
            this.testConnection();
        }

        // 🔄 Tenter de synchroniser les scores locaux en arrière-plan
        this.attemptSync();
    }

    // Tenter une synchronisation en arrière-plan
    async attemptSync() {
        // Attendre 2 secondes pour laisser le jeu démarrer
        setTimeout(async () => {
            const localScores = this.getLocalScores().filter(s => !s.synced);
            if (localScores.length > 0 && !window.PRODUCTION_MODE) {
                console.log(`🔄 ${localScores.length} scores locaux non synchronisés détectés`);
                console.log('💡 Utilisez supabaseScores.syncLocalScores() pour synchroniser');
            }
        }, 2000);
    }

    // Test de connexion (mode debug)
    async testConnection() {
        if (!window.PRODUCTION_MODE) {
            console.log('🔧 [DEBUG] 🧪 Test de connexion à la base de données...');
        }
        try {
            const { data, error } = await this.client
                .from('games')
                .select('count');
            
            if (error) {
                if (!window.PRODUCTION_MODE) {
                    console.error('❌ [DEBUG] Erreur connexion:', error);
                }
            } else {
                if (!window.PRODUCTION_MODE) {
                    console.log('✅ [DEBUG] Connexion à la base réussie');
                }
            }
        } catch (e) {
            if (!window.PRODUCTION_MODE) {
                console.error('❌ [DEBUG] Exception connexion:', e);
            }
        }
    }

    // === 💾 SYSTÈME DE FALLBACK LOCALSTORAGE ===

    // Sauvegarder un score en localStorage
    saveScoreLocal(score, options = {}) {
        try {
            const scores = this.getLocalScores();
            const newScore = {
                id: `local_${Date.now()}`,
                score: score,
                game_id: this.currentGameId || 'Petit Bateau',
                user: this.currentUser || { pseudo: 'Anonyme', avatar: '👤' },
                niveau_atteint: options.niveau_atteint || 1,
                temps_jeu: options.temps_jeu || Math.floor(Date.now() / 1000),
                donnees_extra: options.donnees_extra || {},
                created_at: new Date().toISOString(),
                synced: false // Marqueur pour synchronisation future
            };

            scores.push(newScore);
            
            // Garder seulement les 100 meilleurs scores locaux
            scores.sort((a, b) => b.score - a.score);
            const topScores = scores.slice(0, 100);
            
            localStorage.setItem(this.LOCAL_SCORES_KEY, JSON.stringify(topScores));
            if (!window.PRODUCTION_MODE) {
                console.log('💾 Score sauvegardé en localStorage:', score);
            }
            
            return { success: true, local: true, score: newScore };
        } catch (e) {
            if (!window.PRODUCTION_MODE) {
                console.error('❌ Erreur sauvegarde localStorage:', e);
            }
            return { success: false, error: e.message };
        }
    }

    // Récupérer les scores locaux
    getLocalScores() {
        try {
            const data = localStorage.getItem(this.LOCAL_SCORES_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('❌ Erreur lecture localStorage:', e);
            return [];
        }
    }

    // Récupérer les scores locaux pour un jeu spécifique
    getLocalLeaderboard(limit = 10) {
        try {
            const allScores = this.getLocalScores();
            const gameScores = this.currentGameId 
                ? allScores.filter(s => s.game_id === this.currentGameId)
                : allScores;
            
            return gameScores
                .sort((a, b) => b.score - a.score)
                .slice(0, limit)
                .map(s => ({
                    score: s.score,
                    niveau_atteint: s.niveau_atteint,
                    temps_jeu: s.temps_jeu,
                    created_at: s.created_at,
                    donnees_extra: s.donnees_extra,
                    users: {
                        pseudo: s.user?.pseudo || 'Anonyme',
                        avatar: s.user?.avatar || '👤',
                        pays: s.user?.pays || null
                    },
                    _isLocal: true // Marqueur pour identifier les scores locaux
                }));
        } catch (e) {
            console.error('❌ Erreur récupération leaderboard local:', e);
            return [];
        }
    }

    // Synchroniser les scores locaux avec Supabase
    async syncLocalScores() {
        try {
            const localScores = this.getLocalScores().filter(s => !s.synced);
            
            if (localScores.length === 0) {
                console.log('✅ Aucun score local à synchroniser');
                return { success: true, synced: 0 };
            }

            console.log(`🔄 Synchronisation de ${localScores.length} scores locaux...`);
            let syncedCount = 0;

            for (const localScore of localScores) {
                try {
                    // Restaurer le contexte utilisateur
                    this.currentUser = localScore.user;
                    this.currentGameId = localScore.game_id;

                    // Sauvegarder dans Supabase
                    const result = await this.saveScoreDirect(localScore.score, {
                        niveau_atteint: localScore.niveau_atteint,
                        temps_jeu: localScore.temps_jeu,
                        donnees_extra: localScore.donnees_extra
                    });

                    if (result.success) {
                        // Marquer comme synchronisé
                        localScore.synced = true;
                        syncedCount++;
                    }
                } catch (e) {
                    console.error('❌ Erreur sync score:', e);
                }
            }

            // Sauvegarder les changements
            localStorage.setItem(this.LOCAL_SCORES_KEY, JSON.stringify(this.getLocalScores()));
            console.log(`✅ ${syncedCount}/${localScores.length} scores synchronisés`);
            
            return { success: true, synced: syncedCount };
        } catch (e) {
            console.error('❌ Erreur synchronisation:', e);
            return { success: false, error: e.message };
        }
    }

    // Créer ou récupérer un utilisateur (stocke localement pour saveScore Edge Function)
    async getOrCreateUser(email, pseudo, options = {}) {
        try {
            // Stocker les informations localement pour la fonction Edge
            this.currentUser = {
                email: email,
                pseudo: pseudo,
                avatar: options.avatar || null,
                ville: options.ville || null,
                pays: options.pays || null,
                age: options.age || null,
                genre: options.genre || null
            };

            console.log('👤 Utilisateur configuré localement pour Edge Function:', pseudo);
            return this.currentUser;

        } catch (error) {
            console.error('❌ Erreur getOrCreateUser:', error);
            return null;
        }
    }

    // Définir le jeu actuel
    async setCurrentGame(gameName) {
        console.log('🔧 [DEBUG] setCurrentGame appelé avec:', gameName);
        try {
            const { data, error } = await this.client
                .from('games')
                .select('*')
                .eq('nom', gameName)
                .single();

            if (error) {
                console.error('❌ [DEBUG] Erreur setCurrentGame:', error);
                throw error;
            }

            this.currentGameId = data.id;
            console.log('🔧 [DEBUG] ✅ Game ID défini:', this.currentGameId);
            console.log('🎮 Jeu actuel:', data.nom, data.icone);
            return data;

        } catch (error) {
            console.error('❌ [DEBUG] Exception setCurrentGame:', error);
            console.error('❌ Erreur setCurrentGame:', error);
            return null;
        }
    }

    // Sauvegarder un score via la fonction Edge (sécurisé avec RLS)
    async saveScore(score, options = {}) {
        try {
            // Utiliser la fonction Edge au lieu de l'insertion directe
            const response = await fetch(`${this.client.supabaseUrl}/functions/v1/save-game-score`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.client.supabaseKey}`
                },
                body: JSON.stringify({
                    email: this.currentUser?.email,
                    pseudo: this.currentUser?.pseudo,
                    score: score,
                    niveau_atteint: options.niveau_atteint || null,
                    temps_jeu: options.temps_jeu || null,
                    donnees_extra: options.donnees_extra || null,
                    ville: this.currentUser?.ville,
                    pays: this.currentUser?.pays,
                    age: this.currentUser?.age,
                    genre: this.currentUser?.genre,
                    avatar: this.currentUser?.avatar
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erreur lors de la sauvegarde');
            }

            // Stocker le user_id retourné par la fonction Edge
            if (result.user_id && this.currentUser) {
                this.currentUser.id = result.user_id;
                console.log('✅ user_id stocké:', result.user_id);
            }

            console.log('✅ Score enregistré via Edge Function:', result);
            return result;

        } catch (error) {
            console.error('❌ Erreur saveScore:', error);
            return null;
        }
    }

    // Méthode directe (sans Edge Function) - Fonctionne immédiatement
    async saveScoreDirect(score, options = {}) {
        this.log('=== saveScoreDirect DÉBUT ===');
        this.log('Score:', score);
        this.log('Options:', options);
        this.log('currentUser:', this.currentUser);
        this.log('currentGameId:', this.currentGameId);
        
        // ✅ Vérifier que le client est initialisé
        if (!this.client) {
            this.error('Client Supabase non initialisé');
            console.error('❌ Client Supabase non initialisé, sauvegarde locale...');
            
            // 💾 FALLBACK immédiat vers localStorage
            const localResult = this.saveScoreLocal(score, options);
            if (localResult.success) {
                return {
                    success: true,
                    local: true,
                    message: 'Score sauvegardé localement (client non initialisé)',
                    score: localResult.score
                };
            }
            return { success: false, error: 'Client non initialisé et localStorage échoué' };
        }
        
        if (!this.currentUser) {
            this.error('Aucun utilisateur connecté');
            console.error('❌ Aucun utilisateur connecté');
            return { success: false, error: 'Aucun utilisateur' };
        }

        if (!this.currentGameId) {
            this.error('Aucun jeu sélectionné');
            console.error('❌ Aucun jeu sélectionné');
            return { success: false, error: 'Aucun jeu sélectionné' };
        }

        try {
            // 1. Créer ou récupérer l'utilisateur
            let userId = this.currentUser.id;
            
            if (!userId) {
                this.log('🔍 Recherche utilisateur par email:', this.currentUser.email);
                console.log('🔍 Recherche utilisateur par email:', this.currentUser.email);
                // Chercher par email
                const { data: existingUser, error: searchError } = await this.client
                    .from('users')
                    .select('id')
                    .eq('email', this.currentUser.email)
                    .maybeSingle();

                if (existingUser) {
                    userId = existingUser.id;
                    this.currentUser.id = userId;
                    this.log('✅ Utilisateur existant trouvé:', userId);
                    console.log('✅ Utilisateur existant trouvé:', userId);
                } else {
                    // Créer le user
                    this.log('➕ Création nouvel utilisateur...');
                    console.log('➕ Création nouvel utilisateur...');
                    const { data: newUser, error: createError } = await this.client
                        .from('users')
                        .insert({
                            email: this.currentUser.email,
                            pseudo: this.currentUser.pseudo,
                            ville: this.currentUser.ville,
                            pays: this.currentUser.pays,
                            age: this.currentUser.age,
                            genre: this.currentUser.genre,
                            avatar: this.currentUser.avatar
                        })
                        .select()
                        .single();

                    if (createError) {
                        this.error('Erreur création user:', createError);
                        throw createError;
                    }
                    userId = newUser.id;
                    this.currentUser.id = userId;
                    this.log('✅ Nouvel utilisateur créé:', userId);
                    console.log('✅ Nouvel utilisateur créé:', userId);
                }
            }

            // 2. Appeler la fonction PostgreSQL qui garde le meilleur score
            this.log('💾 Sauvegarde meilleur score pour user_id:', userId);
            console.log('💾 Sauvegarde meilleur score pour user_id:', userId);

            const { data, error } = await this.client
                .rpc('save_best_score', {
                    p_user_id: userId,
                    p_game_id: this.currentGameId,
                    p_score: score,
                    p_niveau_atteint: options.niveau_atteint || null,
                    p_temps_jeu: options.temps_jeu || null,
                    p_donnees_extra: options.donnees_extra || null
                });

            if (error) {
                this.error('Erreur save_best_score:', error);
                throw error;
            }

            // La fonction retourne un objet JSONB
            const result = data;

            // ✅ Vérifier que result existe et est valide
            if (!result) {
                this.error('Résultat null de save_best_score');
                throw new Error('La fonction save_best_score n\'a pas retourné de résultat');
            }

            if (result.is_best) {
                this.log('🏆 Nouveau record !', score, '(ancien:', result.old_score, ')');
                console.log('🏆 Nouveau record !', score, '(ancien:', result.old_score, ')');
            } else {
                this.log('ℹ️ Score existant meilleur:', result.old_score, '(nouveau:', score, ')');
                console.log('ℹ️ Score existant meilleur:', result.old_score, '(nouveau:', score, ')');
            }

            return {
                success: true, // ✅ Si on arrive ici, la sauvegarde a fonctionné (record ou pas)
                is_best: result.is_best,
                old_score: result.old_score,
                new_score: result.new_score,
                user_id: userId
            };

        } catch (error) {
            this.error('Exception saveScoreDirect:', error);
            console.error('❌ Erreur saveScoreDirect:', error);
            
            // 💾 FALLBACK: Sauvegarder en localStorage
            console.warn('⚠️ Supabase échoué, sauvegarde en localStorage...');
            const localResult = this.saveScoreLocal(score, options);
            
            if (localResult.success) {
                return {
                    success: true,
                    local: true,
                    message: 'Score sauvegardé localement (sera synchronisé plus tard)',
                    score: localResult.score
                };
            }
            
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Méthode de sauvegarde classique (fallback si Edge Function indisponible)
    async saveScoreClassic(score, options = {}) {
        if (!this.currentUser) {
            console.error('❌ Aucun utilisateur connecté');
            return null;
        }

        if (!this.currentGameId) {
            console.error('❌ Aucun jeu défini');
            return null;
        }

        try {
            // Vérifier si un score existe déjà
            const { data: existingScore, error: searchError } = await this.client
                .from('scores')
                .select('*')
                .eq('user_id', this.currentUser.id)
                .eq('game_id', this.currentGameId)
                .single();

            // Si un score existe
            if (existingScore) {
                // Mettre à jour seulement si le nouveau score est meilleur
                if (score > existingScore.score) {
                    const { data, error } = await this.client
                        .from('scores')
                        .update({
                            score: score,
                            niveau_atteint: options.niveau_atteint || null,
                            temps_jeu: options.temps_jeu || null,
                            donnees_extra: options.donnees_extra || null
                        })
                        .eq('user_id', this.currentUser.id)
                        .eq('game_id', this.currentGameId)
                        .select()
                        .single();

                    if (error) throw error;

                    console.log('✅ Score mis à jour:', score, '(ancien:', existingScore.score, ')');
                    return data;
                } else {
                    console.log('ℹ️ Score existant meilleur:', existingScore.score, '(nouveau:', score, ')');
                    return existingScore;
                }
            }

            // Sinon, créer un nouveau score
            const { data, error } = await this.client
                .from('scores')
                .insert([{
                    user_id: this.currentUser.id,
                    game_id: this.currentGameId,
                    score: score,
                    niveau_atteint: options.niveau_atteint || null,
                    temps_jeu: options.temps_jeu || null,
                    donnees_extra: options.donnees_extra || null
                }])
                .select()
                .single();

            if (error) throw error;

            console.log('💾 Premier score sauvegardé:', score);
            return data;

        } catch (error) {
            console.error('❌ Erreur saveScore:', error);
            return null;
        }
    }

    // Récupérer le meilleur score de l'utilisateur pour le jeu actuel
    async getBestScore() {
        if (!this.currentUser || !this.currentGameId) return null;
        
        // Si on n'a pas de user_id, essayer de chercher via l'email (fallback)
        if (!this.currentUser.id) {
            return await this.getBestScoreByEmail();
        }

        try {
            const { data, error } = await this.client
                .from('scores')
                .select('*')
                .eq('user_id', this.currentUser.id)
                .eq('game_id', this.currentGameId)
                .order('score', { ascending: false })
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            return data;

        } catch (error) {
            console.error('❌ Erreur getBestScore:', error);
            return null;
        }
    }

    // Récupérer le meilleur score via email (quand user_id n'est pas encore connu)
    async getBestScoreByEmail() {
        if (!this.currentUser?.email || !this.currentGameId) return null;

        try {
            // Joindre avec users pour trouver via email
            const { data, error } = await this.client
                .from('scores')
                .select(`
                    *,
                    users!inner(email)
                `)
                .eq('users.email', this.currentUser.email)
                .eq('game_id', this.currentGameId)
                .order('score', { ascending: false })
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            console.log('✅ Meilleur score trouvé via email:', data?.score);
            return data;

        } catch (error) {
            console.error('❌ Erreur getBestScoreByEmail:', error);
            return null;
        }
    }

    // Supprimer les doublons en gardant le meilleur score pour chaque utilisateur
    async removeDuplicates() {
        if (!this.currentGameId) {
            console.error('❌ Aucun jeu défini');
            return null;
        }

        try {
            console.log('🧹 Nettoyage des doublons...');

            // Récupérer tous les scores du jeu
            const { data: allScores, error: fetchError } = await this.client
                .from('scores')
                .select('*')
                .eq('game_id', this.currentGameId)
                .order('score', { ascending: false });

            if (fetchError) throw fetchError;

            console.log('📊 Scores trouvés:', allScores.length);

            // Grouper par utilisateur
            const scoresByUser = {};
            allScores.forEach(score => {
                if (!scoresByUser[score.user_id]) {
                    scoresByUser[score.user_id] = [];
                }
                scoresByUser[score.user_id].push(score);
            });

            // Pour chaque utilisateur, garder le meilleur et supprimer les autres
            let totalDeleted = 0;
            for (const userId in scoresByUser) {
                const userScores = scoresByUser[userId];

                if (userScores.length > 1) {
                    // Le premier est le meilleur (déjà trié par score DESC)
                    const bestScore = userScores[0];
                    const duplicates = userScores.slice(1);

                    console.log(`👤 Utilisateur ${userId}: ${userScores.length} scores, meilleur: ${bestScore.score}`);

                    // Supprimer les doublons
                    for (const duplicate of duplicates) {
                        const { error: deleteError } = await this.client
                            .from('scores')
                            .delete()
                            .eq('id', duplicate.id);

                        if (deleteError) {
                            console.error('❌ Erreur suppression:', deleteError);
                        } else {
                            totalDeleted++;
                            console.log(`  🗑️ Supprimé: ${duplicate.score} (ID: ${duplicate.id})`);
                        }
                    }
                }
            }

            console.log(`✅ Nettoyage terminé: ${totalDeleted} doublons supprimés`);
            return { deleted: totalDeleted, total: allScores.length };

        } catch (error) {
            console.error('❌ Erreur removeDuplicates:', error);
            return null;
        }
    }

    // Récupérer le classement du jeu actuel (top 10)
    async getLeaderboard(limit = 10) {
        if (!this.currentGameId) return [];

        try {
            // Récupérer les scores Supabase
            const { data, error } = await this.client
                .from('scores')
                .select(`
                    score,
                    niveau_atteint,
                    temps_jeu,
                    created_at,
                    donnees_extra,
                    users (pseudo, avatar, pays)
                `)
                .eq('game_id', this.currentGameId)
                .order('score', { ascending: false })
                .limit(limit);

            if (error) throw error;

            console.log('🏆 Classement Supabase récupéré:', data.length, 'scores');
            
            // 💾 Fusionner avec les scores locaux
            const localScores = this.getLocalLeaderboard(limit);
            console.log('💾 Scores locaux récupérés:', localScores.length, 'scores');
            
            // Combiner et trier
            const allScores = [...data, ...localScores];
            allScores.sort((a, b) => b.score - a.score);
            
            // Retourner les meilleurs
            const topScores = allScores.slice(0, limit);
            console.log('✅ Classement fusionné:', topScores.length, 'scores');
            
            return topScores;

        } catch (error) {
            console.error('❌ Erreur getLeaderboard Supabase, fallback localStorage...');
            
            // 💾 FALLBACK: Utiliser uniquement localStorage
            const localScores = this.getLocalLeaderboard(limit);
            console.log('💾 Classement local uniquement:', localScores.length, 'scores');
            return localScores;
        }
    }

    // Récupérer tous les scores d'un utilisateur (tous jeux confondus)
    async getUserAllScores() {
        if (!this.currentUser) return [];

        try {
            const { data, error } = await this.client
                .from('scores')
                .select(`
                    score,
                    niveau_atteint,
                    temps_jeu,
                    created_at,
                    games (nom, icone, url)
                `)
                .eq('user_id', this.currentUser.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            console.log('📊 Scores de l\'utilisateur:', data.length);
            return data;

        } catch (error) {
            console.error('❌ Erreur getUserAllScores:', error);
            return [];
        }
    }

    // Afficher un formulaire de connexion simple
    showLoginForm(callback) {
        const html = `
            <div id="supabase-login" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); z-index: 10000;">
                <h2 style="margin: 0 0 20px 0; text-align: center;">🚢 Connexion</h2>
                <input type="email" id="supabase-email" placeholder="Email" style="width: 100%; padding: 10px; margin: 10px 0; border: 2px solid #ddd; border-radius: 8px;">
                <input type="text" id="supabase-pseudo" placeholder="Pseudo" style="width: 100%; padding: 10px; margin: 10px 0; border: 2px solid #ddd; border-radius: 8px;">
                <button id="supabase-login-btn" style="width: 100%; padding: 12px; margin: 10px 0; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
                    Se connecter
                </button>
                <button id="supabase-cancel-btn" style="width: 100%; padding: 12px; margin: 10px 0; background: #666; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
                    Annuler
                </button>
            </div>
            <div id="supabase-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999;"></div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);

        document.getElementById('supabase-login-btn').onclick = async () => {
            const email = document.getElementById('supabase-email').value;
            const pseudo = document.getElementById('supabase-pseudo').value;

            if (!email || !pseudo) {
                alert('Email et pseudo requis !');
                return;
            }

            const user = await this.getOrCreateUser(email, pseudo);

            document.getElementById('supabase-login').remove();
            document.getElementById('supabase-overlay').remove();

            if (callback) callback(user);
        };

        document.getElementById('supabase-cancel-btn').onclick = () => {
            document.getElementById('supabase-login').remove();
            document.getElementById('supabase-overlay').remove();
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SupabaseScores;
}
