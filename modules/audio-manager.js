/**
 * AudioManager - Gestionnaire audio unifié
 * Combine la gestion de la musique et des effets sonores
 * @version 2.0.0
 * @author Emmanuel Payet (Dreamer Unisa)
 */

class AudioManager {
    constructor() {
        if (window.audioManager) {
            return window.audioManager;
        }

        // ✅ AudioContext différé (créé après interaction utilisateur)
        this.ctx = null;
        this.audioContextInitialized = false;
        
        // Lecteur de musique
        this.musicPlayer = new Audio();
        
        // État
        this.volume = {
            master: 0.5,    // Volume général (0, 0.5, 1)
            music: 0.7,     // Volume relatif de la musique
            sfx: 0.5        // Volume relatif des effets sonores
        };
        this.isMuted = false;
        this.currentTrack = null;
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.currentPhase = 'normal';
        this.playedTracks = [];
        this.autoPlayNext = true;
        this.fadeInterval = null; // Tracker l'intervalle de fade en cours
        this.randomMode = false; // Mode lecture aléatoire ou séquentielle

        // Cache pour les effets sonores
        this.effectsCache = new Map();

        // Configuration
        this.basePath = 'modules/gospel/';
        this.playlist = [
            // Playlist complète avec phases
            { file: 'Pouring Light.mp3', phases: ['normal'] },
            { file: 'Un vent Espoir.mp3', phases: ['normal'] },
            { file: 'Naie pas peur.mp3', phases: ['normal'] },
            { file: 'Il est Amour.mp3', phases: ['normal'] },
            { file: 'Triste.mp3', phases: ['normal'] },
            { file: 'Un coeur immigre.mp3', phases: ['normal'] },
            { file: 'Le drame.mp3', phases: ['normal'] },
            { file: 'Voyage fragile.mp3', phases: ['normal'] },
            { file: 'Wesh le monde est fou.mp3', phases: ['normal'] },
            { file: 'The Presidents Blindness.mp3', phases: ['normal'] },
            { file: 'Impunis Non.mp3', phases: ['normal'] },
            { file: 'forteresses de peur xT.mp3', phases: ['normal'] },
            { file: 'Sur des mauvaises voies.mp3', phases: ['normal'] },
            { file: 'Coupables.mp3', phases: ['normal'] },
            { file: 'La haine gangrene.mp3', phases: ['normal'] },
            { file: 'Jai poursuivi la Paix.mp3', phases: ['normal'] },
            { file: 'Un ti farine amour.mp3', phases: ['normal'] },
            { file: 'Wesh le monde est fou 2.mp3', phases: ['normal'] },
            { file: 'On a bouge.mp3', phases: ['normal'] },
            { file: 'Tiens bon, tiens bon.mp3', phases: ['normal'] },
            { file: 'Mise a jour de mon coeur.mp3', phases: ['normal'] },
            
            // Mode secret uniquement
            { file: 'Consommateur.mp3', phases: ['secret'] },
            { file: 'Comprendre.mp3', phases: ['secret'] }
        ];

        // Rendre l'instance accessible globalement
        window.audioManager = this;
        window.musicManager = this; // Pour la compatibilité

        this.init();
    }

    init() {
        // Configuration du lecteur de musique
        this.musicPlayer.volume = this.volume.master * this.volume.music;
        this.musicPlayer.loop = false;
        
        // ⚡ FIX: Un seul event listener (doublon supprimé)
        this.musicPlayer.addEventListener('ended', () => {
            if (this.autoPlayNext) {
                this.playNext();
            }
        });

        // ✅ AudioContext sera créé lors de la première interaction
        this.masterGain = null;

        // ✅ Toujours logger l'initialisation audio (même en production)
        console.log('🎵 AudioManager unifié initialisé (AudioContext différé)');
    }

    // ✅ Initialiser l'AudioContext après interaction utilisateur
    initAudioContext() {
        if (this.audioContextInitialized) return true;

        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            
            // Reprendre le contexte s'il est suspendu
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            
            // Créer le nœud principal pour les effets sonores
            this.masterGain = this.ctx.createGain();
            this.masterGain.connect(this.ctx.destination);
            this.masterGain.gain.value = this.volume.master * this.volume.sfx;
            
            this.audioContextInitialized = true;
            console.log('🎵 AudioContext initialisé avec succès');
            return true;
        } catch (error) {
            console.error('❌ Erreur initialisation AudioContext:', error);
            return false;
        }
    }

    // === CONTRÔLES GÉNÉRAUX ===

    setMasterVolume(level) {
        // Support de tous les niveaux de volume (pas seulement 0, 0.5, 1)
        this.volume.master = Math.max(0, Math.min(1, level)); // Clamp entre 0 et 1
        
        // Appliquer aux deux systèmes
        // IMPORTANT: Toujours appliquer le volume même si muté (pour que le démute fonctionne)
        if (!this.isMuted) {
            this.musicPlayer.volume = this.volume.master * this.volume.music;
            
            // ✅ Vérifier que l'AudioContext est initialisé avant d'utiliser masterGain
            if (this.masterGain) {
                this.masterGain.gain.value = this.volume.master * this.volume.sfx;
            }
        }
        
        if (!window.PRODUCTION_MODE) {
            console.log(`🎚️ Volume master: ${Math.round(this.volume.master * 100)}% (musicPlayer: ${Math.round(this.musicPlayer.volume * 100)}%, muté: ${this.isMuted})`);
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            // Sauvegarder le volume actuel avant de muter
            this.volumeBeforeMute = this.volume.master;
            this.musicPlayer.volume = 0;
            if (this.masterGain) {
                this.masterGain.gain.value = 0;
            }
            if (this.isPlaying) this.pause();
            if (!window.PRODUCTION_MODE) {
                console.log('🔇 Muté (volume sauvegardé:', Math.round(this.volumeBeforeMute * 100) + '%)');
            }
        } else {
            // Restaurer le volume d'avant le mute
            const volToRestore = this.volumeBeforeMute || this.volume.master;
            this.musicPlayer.volume = volToRestore * this.volume.music;
            if (this.masterGain) {
                this.masterGain.gain.value = volToRestore * this.volume.sfx;
            }
            if (!this.isPlaying) this.play();
            if (!window.PRODUCTION_MODE) {
                console.log('🔊 Démuté (volume restauré:', Math.round(volToRestore * 100) + '%)');
            }
        }
    }

    // === EFFETS SONORES ===

    async loadEffect(name) {
        // ✅ Initialiser l'AudioContext si nécessaire
        if (!this.audioContextInitialized) {
            const success = this.initAudioContext();
            if (!success) return null;
        }

        if (this.effectsCache.has(name)) {
            return this.effectsCache.get(name);
        }

        try {
            const response = await fetch(`modules/sound/${name}.mp3`);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
            
            this.effectsCache.set(name, audioBuffer);
            return audioBuffer;
        } catch (error) {
            console.error('❌ Erreur chargement effet sonore:', name, error);
            return null;
        }
    }

    async playEffect(name) {
        try {
            // ✅ Initialiser l'AudioContext si nécessaire
            if (!this.audioContextInitialized) {
                const success = this.initAudioContext();
                if (!success) return;
            }

            if (this.ctx.state === 'suspended') {
                await this.ctx.resume();
            }

            const buffer = await this.loadEffect(name);
            if (!buffer || !this.masterGain) return;

            const source = this.ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(this.masterGain);
            source.start(0);
        } catch (error) {
            console.error('❌ Erreur lecture effet sonore:', name, error);
        }
    }

    // === MUSIQUE ===

    play(phase = 'normal') {
        // ✅ Logger le démarrage musique même en production
        console.log('🎵 Démarrage musique phase:', phase);
        
        // ✅ Initialiser l'AudioContext au premier démarrage
        if (!this.audioContextInitialized) {
            console.log('🎵 Initialisation AudioContext...');
            this.initAudioContext();
        }
        
        if (this.isMuted) return;
        
        // Si on change de phase, on remet à zéro la liste des morceaux joués
        if (phase !== this.currentPhase) {
            this.currentPhase = phase;
            this.playedTracks = [];
            this.currentTrackIndex = 0;
            
            // Mode aléatoire SEULEMENT si c'est après le mode secret (normal) et randomMode activé
            // Sinon, toujours en mode séquentiel pour le jeu normal
            if (!window.PRODUCTION_MODE && phase !== 'secret' && !this.randomMode) {
                // Garder le mode séquentiel pour le jeu normal
                console.log('🎵 Jeu normal - Mode séquentiel maintenu');
            }
        }

        // Trouver les pistes appropriées pour la phase actuelle
        const appropriateTracks = this.playlist
            .map((track, index) => ({ track, index }))
            .filter(({ track }) => track.phases.includes(phase));

        if (appropriateTracks.length === 0) {
            if (!window.PRODUCTION_MODE) {
                console.log('🎵 Aucune piste disponible pour la phase', phase);
            }
            return;
        }

        // Choisir la piste selon le mode (aléatoire ou séquentiel)
        let nextTrack = null;
        
        if (this.randomMode) {
            // Mode aléatoire : choisir une piste au hasard parmi celles non jouées
            const unplayedTracks = appropriateTracks.filter(({ index }) => !this.playedTracks.includes(index));
            if (unplayedTracks.length === 0) {
                // Si toutes jouées, recommencer et choisir au hasard
                this.playedTracks = [];
                const randomIndex = Math.floor(Math.random() * appropriateTracks.length);
                nextTrack = appropriateTracks[randomIndex];
            } else {
                const randomIndex = Math.floor(Math.random() * unplayedTracks.length);
                nextTrack = unplayedTracks[randomIndex];
            }
        } else {
            // Mode séquentiel : ordre original
            for (let i = 0; i < appropriateTracks.length; i++) {
                const trackIndex = appropriateTracks[i].index;
                if (!this.playedTracks.includes(trackIndex)) {
                    nextTrack = appropriateTracks[i];
                    break;
                }
            }
            // Si toutes les pistes ont été jouées, recommencer depuis le début
            if (!nextTrack) {
                this.playedTracks = [];
                nextTrack = appropriateTracks[0];
            }
        }

        this.currentTrackIndex = nextTrack.index;
        this.currentTrack = nextTrack.track;
        this.playedTracks.push(this.currentTrackIndex);

        // Jouer le morceau
        this.musicPlayer.src = this.basePath + this.currentTrack.file;
        this.musicPlayer.volume = 0; // Démarrer silencieux pour le fade in
        this.musicPlayer.play()
            .then(() => {
                if (!window.PRODUCTION_MODE) {
                    console.log('🎵 Lecture séquentielle:', this.currentTrack.file);
                }
                this.isPlaying = true;
                this.fadeIn(); // Fade in progressif
            })
            .catch(error => {
                console.error('❌ Erreur lecture audio:', error);
            });
    }

    pause() {
        this.musicPlayer.pause();
        this.isPlaying = false;
    }

    resume() {
        if (!this.isMuted) {
            this.musicPlayer.play();
            this.isPlaying = true;
        }
    }

    // Fade in progressif (2 secondes)
    fadeIn() {
        // Nettoyer tout fade en cours
        if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
            this.fadeInterval = null;
        }

        const targetVolume = this.volume.master * this.volume.music;
        const step = targetVolume / 40; // 40 steps sur 2s
        this.fadeInterval = setInterval(() => {
            if (this.musicPlayer.volume < targetVolume - step) {
                this.musicPlayer.volume += step;
            } else {
                this.musicPlayer.volume = targetVolume;
                clearInterval(this.fadeInterval);
                this.fadeInterval = null;
            }
        }, 50);
    }

    // Fade out progressif (2 secondes)
    fadeOut(callback) {
        // Nettoyer tout fade en cours
        if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
            this.fadeInterval = null;
        }

        // Vérifier si l'audio est réellement en cours de lecture
        const audioIsActuallyPlaying = this.musicPlayer && !this.musicPlayer.paused && this.musicPlayer.currentTime > 0;

        if (!this.musicPlayer || !audioIsActuallyPlaying) {
            if (callback) callback();
            return;
        }

        const step = this.musicPlayer.volume / 40;
        this.fadeInterval = setInterval(() => {
            if (this.musicPlayer.volume > step) {
                this.musicPlayer.volume -= step;
            } else {
                this.musicPlayer.volume = 0;
                this.musicPlayer.pause(); // Arrêter la lecture
                this.isPlaying = false;
                clearInterval(this.fadeInterval);
                this.fadeInterval = null;
                if (callback) callback();
            }
        }, 50);
    }

    playNext() {
        // Sauvegarder le morceau actuel
        if (this.currentTrack) {
            this.playedTracks.push(this.currentTrack.file);
        }

        // Réinitialiser si tous les morceaux ont été joués
        if (this.playedTracks.length >= this.playlist.length) {
            this.playedTracks = [];
        }

        // Jouer le prochain morceau
        this.play(this.currentPhase);
    }

    changePhaseNumber(newPhase) {
        this.currentPhase = newPhase;
        this.playedTracks = [];
        this.play(newPhase);
    }

    stopImmediate() {
        this.musicPlayer.pause();
        this.isPlaying = false;
        this.currentTrack = null;
        if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
            this.fadeInterval = null;
        }
    }

    // Méthode de compatibilité avec l'ancien MusicManager
    setVolume(vol) {
        this.setMasterVolume(vol);
        // Note: le log détaillé est maintenant dans setMasterVolume
    }

    // Méthode de compatibilité pour obtenir l'état
    getState() {
        return {
            isPlaying: this.isPlaying,
            isMuted: this.isMuted,
            volume: this.volume.master,
            currentTrack: this.currentTrack ? this.currentTrack.file.replace('.mp3', '') : 'Aucune piste',
            currentTrackIndex: this.currentTrackIndex,
            totalTracks: this.playlist.length
        };
    }

    // Méthode de compatibilité pour changer de phase
    changePhase(phase) {
        // Si on entre en mode secret, désactiver le mode aléatoire
        if (phase === 'secret') {
            this.setRandomMode(false);
            if (!window.PRODUCTION_MODE) {
                console.log('🎵 Entrée mode secret - Mode séquentiel activé');
            }
        }
        this.changePhaseNumber(phase);
    }

    // Propriété de compatibilité pour accéder au volume master
    get volumeLevel() {
        return this.volume.master;
    }

    // Activer/désactiver le mode aléatoire
    setRandomMode(enabled) {
        this.randomMode = enabled;
        if (!window.PRODUCTION_MODE) {
            console.log('🎵 Mode aléatoire:', enabled ? 'ACTIVÉ' : 'DÉSACTIVÉ');
        }
    }

    // Méthode pour reprendre la musique après le mode secret
    resumeAfterSecret() {
        if (!window.PRODUCTION_MODE) {
            console.log('🎵 Reprise musique après mode secret - Mode aléatoire activé');
        }
        this.setRandomMode(true);
        this.currentPhase = 'normal';
        this.playedTracks = [];
        this.play('normal');
    }

    // Méthode pour démarrer la musique normale (séquentielle)
    startNormalMusic() {
        if (!window.PRODUCTION_MODE) {
            console.log('🎵 Démarrage musique normale - Mode séquentiel');
        }
        this.setRandomMode(false);
        this.currentPhase = 'normal';
        this.playedTracks = [];
        this.play('normal');
    }
}

// Créer et exporter l'instance unique
if (typeof window !== 'undefined') {
    window.AudioManager = AudioManager;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}