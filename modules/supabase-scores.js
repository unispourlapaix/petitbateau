/**
 * Module Supabase Scores - Gestion des scores multi-jeux
 * @author Emmanuel Payet (Dreamer Unisona)
 * @version 1.0.0
 */

class SupabaseScores {
    constructor() {
        // 🔧 MODE DEBUG ACTIVÉ
        this.debugMode = true;
        
        // Configuration Supabase
        this.supabaseUrl = 'https://dmszyxowetilvsanqsxm.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtc3p5eG93ZXRpbHZzYW5xc3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NzM0NDUsImV4cCI6MjA3NTM0OTQ0NX0.EukDYFVt0sCrDb0_V4ZPMv5B4gkD43V8Cw7CEuvl0C8';

        if (this.debugMode) {
            console.log('🔧 MODE DEBUG ACTIVÉ');
            console.log('📡 Supabase URL:', this.supabaseUrl);
            console.log('🔑 API Key (20 premiers chars):', this.supabaseKey.substring(0, 20) + '...');
        }

        // Charger la librairie Supabase
        this.loadSupabaseLibrary();

        // Utilisateur actuel (null si pas connecté)
        this.currentUser = null;

        // ID du jeu actuel (sera défini par le jeu)
        this.currentGameId = null;

        console.log('🎮 SupabaseScores initialisé');
    }

    log(...args) {
        if (this.debugMode) {
            console.log('🔧 [DEBUG]', ...args);
        }
    }

    error(...args) {
        if (this.debugMode) {
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
            console.log('✅ Librairie Supabase chargée');
            this.initSupabase();
        };
        script.onerror = () => {
            console.error('❌ Erreur chargement Supabase - Mode hors ligne activé');
            this.isOffline = true;
        };
        document.head.appendChild(script);
    }

    // Initialiser le client Supabase
    initSupabase() {
        console.log('🔧 [DEBUG] Création du client Supabase...');
        this.client = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);
        console.log('🔧 [DEBUG] Client créé:', !!this.client);
        console.log('✅ Client Supabase initialisé');
        
        // Test de connexion immédiat
        if (this.debugMode) {
            this.testConnection();
        }
    }

    // Test de connexion (mode debug)
    async testConnection() {
        console.log('🔧 [DEBUG] 🧪 Test de connexion à la base de données...');
        try {
            const { data, error } = await this.client
                .from('games')
                .select('count');
            
            if (error) {
                console.error('❌ [DEBUG] Erreur connexion:', error);
            } else {
                console.log('🔧 [DEBUG] ✅ Connexion OK - Nombre de jeux:', data);
            }
        } catch (e) {
            console.error('❌ [DEBUG] Exception connexion:', e);
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

            // 2. Insérer le score
            this.log('💾 Insertion score pour user_id:', userId);
            console.log('💾 Insertion score pour user_id:', userId);
            const { data, error } = await this.client
                .from('scores')
                .insert({
                    user_id: userId,
                    game_id: this.currentGameId,
                    score: score,
                    niveau_atteint: options.niveau_atteint || null,
                    temps_jeu: options.temps_jeu || null,
                    donnees_extra: options.donnees_extra || null
                })
                .select()
                .single();

            if (error) {
                this.error('Erreur insertion score:', error);
                throw error;
            }

            this.log('✅ Score enregistré:', data);
            console.log('✅ Score enregistré directement:', data);
            return {
                success: true,
                user_id: userId,
                score_id: data.id
            };

        } catch (error) {
            this.error('Exception saveScoreDirect:', error);
            console.error('❌ Erreur saveScoreDirect:', error);
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

            console.log('🏆 Classement récupéré:', data.length, 'scores');
            return data;

        } catch (error) {
            console.error('❌ Erreur getLeaderboard:', error);
            return [];
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
