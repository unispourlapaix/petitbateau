/**
 * Module Supabase Scores - Gestion des scores multi-jeux
 * @author Emmanuel Payet (Dreamer Unisona)
 * @version 1.0.0
 */

class SupabaseScores {
    constructor() {
        // Configuration Supabase
        this.supabaseUrl = 'https://dmszyxowetilvsanqsxm.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtc3p5eG93ZXRpbHZzYW5xc3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NzM0NDUsImV4cCI6MjA3NTM0OTQ0NX0.EukDYFVt0sCrDb0_V4ZPMv5B4gkD43V8Cw7CEuvl0C8';

        // Charger la librairie Supabase
        this.loadSupabaseLibrary();

        // Utilisateur actuel (null si pas connecté)
        this.currentUser = null;

        // ID du jeu actuel (sera défini par le jeu)
        this.currentGameId = null;

        console.log('🎮 SupabaseScores initialisé');
    }

    // Charger la librairie Supabase depuis CDN
    loadSupabaseLibrary() {
        if (window.supabase) {
            this.initSupabase();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload = () => {
            console.log('✅ Librairie Supabase chargée');
            this.initSupabase();
        };
        script.onerror = () => {
            console.error('❌ Erreur chargement Supabase');
        };
        document.head.appendChild(script);
    }

    // Initialiser le client Supabase
    initSupabase() {
        this.client = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);
        console.log('✅ Client Supabase initialisé');
    }

    // Créer ou récupérer un utilisateur
    async getOrCreateUser(email, pseudo, options = {}) {
        try {
            // Chercher si l'utilisateur existe déjà
            const { data: existingUser, error: searchError } = await this.client
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (existingUser) {
                console.log('👤 Utilisateur trouvé:', existingUser.pseudo);
                this.currentUser = existingUser;
                return existingUser;
            }

            // Créer un nouvel utilisateur
            const { data: newUser, error: createError } = await this.client
                .from('users')
                .insert([{
                    email: email,
                    pseudo: pseudo,
                    avatar: options.avatar || null,
                    ville: options.ville || null,
                    pays: options.pays || null,
                    age: options.age || null,
                    genre: options.genre || null
                }])
                .select()
                .single();

            if (createError) throw createError;

            console.log('✅ Nouvel utilisateur créé:', newUser.pseudo);
            this.currentUser = newUser;
            return newUser;

        } catch (error) {
            console.error('❌ Erreur getOrCreateUser:', error);
            return null;
        }
    }

    // Définir le jeu actuel
    async setCurrentGame(gameName) {
        try {
            const { data, error } = await this.client
                .from('games')
                .select('*')
                .eq('nom', gameName)
                .single();

            if (error) throw error;

            this.currentGameId = data.id;
            console.log('🎮 Jeu actuel:', data.nom, data.icone);
            return data;

        } catch (error) {
            console.error('❌ Erreur setCurrentGame:', error);
            return null;
        }
    }

    // Sauvegarder un score
    async saveScore(score, options = {}) {
        if (!this.currentUser) {
            console.error('❌ Aucun utilisateur connecté');
            return null;
        }

        if (!this.currentGameId) {
            console.error('❌ Aucun jeu défini');
            return null;
        }

        try {
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

            console.log('💾 Score sauvegardé:', score);
            return data;

        } catch (error) {
            console.error('❌ Erreur saveScore:', error);
            return null;
        }
    }

    // Récupérer le meilleur score de l'utilisateur pour le jeu actuel
    async getBestScore() {
        if (!this.currentUser || !this.currentGameId) return null;

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
