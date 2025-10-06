/**
 * Module Music Manager - Gestionnaire de musique de fond
 * Playlist gospel pour ambiance narrative
 * @version 1.0.0
 * @author Emmanuel Payet (Dreamer Unisa)
 */

class MusicManager {
    constructor() {
        this.audio = null;
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.volume = 0.3; // Volume par défaut 30%
        this.isMuted = false;
        this.currentPhase = null; // Phase actuelle pour continuer dans la même phase
        this.playedTracks = []; // Historique des pistes jouées dans la phase actuelle

        // Playlist organisée par phase narrative
        // Format: { file, phases: [numéros de phase ou 'mode'] }
        this.playlist = [
            // Playlist complète - joue en ordre séquentiel
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
            { file: 'Comprendre.mp3', phases: ['secret'] },
            { file: 'Consommateur.mp3', phases: ['secret'] }
        ];

        this.basePath = 'modules/gospel/';
        this.init();
    }

    init() {
        this.audio = new Audio();
        this.audio.volume = this.volume;
        this.audio.loop = false; // Pas de loop, on change de piste

        // Auto-play la piste suivante quand une piste se termine
        this.audio.addEventListener('ended', () => {
            this.playNext();
        });

        console.log('🎵 Music Manager initialisé - ' + this.playlist.length + ' pistes disponibles');
    }

    // Démarrer/continuer la musique pour une phase donnée
    play(phase = null) {
        if (this.isMuted) return;

        // Si une phase est spécifiée, l'utiliser
        if (phase !== null) {
            // Vérifier si les pistes de la nouvelle phase sont différentes
            const oldTracks = this.currentPhase !== null ?
                this.playlist.filter(t => t.phases.includes(this.currentPhase)).map((t, i) => this.playlist.indexOf(t)) : [];
            const newTracks = this.playlist.filter(t => t.phases.includes(phase)).map((t, i) => this.playlist.indexOf(t));

            // Si les pistes sont complètement différentes, réinitialiser l'historique
            const tracksChanged = !oldTracks.every(t => newTracks.includes(t)) || !newTracks.every(t => oldTracks.includes(t));

            if (tracksChanged) {
                this.playedTracks = [];
            }

            this.currentPhase = phase;
        }

        // Arrêter l'ancienne musique si elle joue encore
        if (this.audio && this.isPlaying) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.isPlaying = false;
        }

        // Trouver la prochaine piste appropriée pour la phase actuelle
        if (this.currentPhase !== null) {
            const appropriateTracks = this.playlist
                .map((track, index) => ({ track, index }))
                .filter(({ track }) => track.phases.includes(this.currentPhase));

            if (appropriateTracks.length > 0) {
                // Trouver la prochaine piste non jouée dans l'ordre
                let nextTrack = null;

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

                this.currentTrackIndex = nextTrack.index;
                this.playedTracks.push(this.currentTrackIndex);
            }
        }

        const track = this.playlist[this.currentTrackIndex];
        const fullPath = this.basePath + track.file;
        this.audio.src = fullPath;
        this.audio.volume = 0; // Démarrer silencieux pour le fade in

        console.log('🎵 Chargement phase ' + this.currentPhase + ' : ' + track.file);

        this.audio.addEventListener('loadeddata', () => {
            console.log('✅ Fichier audio chargé');
        }, { once: true });

        this.audio.addEventListener('error', (e) => {
            console.error('❌ Erreur chargement:', fullPath, e);
        }, { once: true });

        this.audio.play().then(() => {
            this.isPlaying = true;
            this.fadeIn();
            console.log('🎵 Lecture : ' + track.file + ' (volume cible: ' + (this.volume * 100) + '%)');
        }).catch(err => {
            console.error('⚠️ Erreur lecture:', err);
        });
    }

    // Fade in progressif (2 secondes)
    fadeIn() {
        const targetVolume = this.volume;
        const step = targetVolume / 40; // 40 steps sur 2s
        const interval = setInterval(() => {
            if (this.audio.volume < targetVolume - step) {
                this.audio.volume += step;
            } else {
                this.audio.volume = targetVolume;
                clearInterval(interval);
            }
        }, 50);
    }

    // Fade out progressif (2 secondes)
    fadeOut(callback) {
        if (!this.audio || !this.isPlaying) {
            if (callback) callback();
            return;
        }

        const step = this.audio.volume / 40;
        const interval = setInterval(() => {
            if (this.audio.volume > step) {
                this.audio.volume -= step;
            } else {
                this.audio.volume = 0;
                this.audio.pause(); // Arrêter la lecture
                this.isPlaying = false;
                clearInterval(interval);
                if (callback) callback();
            }
        }, 50);
    }

    // Piste suivante (respecte l'ordre séquentiel de la phase)
    playNext() {
        this.play(); // Utilise la logique séquentielle de play()
    }

    // Arrêter avec fade out
    stop() {
        if (!this.isPlaying) return;

        this.fadeOut(() => {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.isPlaying = false;
            console.log('🎵 Musique arrêtée');
        });
    }

    // Pause
    pause() {
        if (!this.isPlaying) return;
        this.audio.pause();
        this.isPlaying = false;
        console.log('⏸️ Musique en pause');
    }

    // Reprendre
    resume() {
        if (this.isPlaying || this.isMuted) return;
        this.audio.play();
        this.isPlaying = true;
        console.log('▶️ Musique reprise');
    }

    // Changer vers une nouvelle phase narrative (avec transition)
    changePhaseNumber(phaseNumber) {
        console.log('🎵 Changement phase narrative → ' + phaseNumber);

        if (!this.isPlaying) {
            // Si aucune musique, démarrer directement
            this.play(phaseNumber);
            return;
        }

        // Sinon, faire une transition avec fade out/in
        this.fadeOut(() => {
            this.play(phaseNumber);
        });
    }

    // Régler le volume (0 à 1)
    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
        if (this.audio) {
            this.audio.volume = this.volume;
        }
        console.log('🔊 Volume : ' + Math.round(this.volume * 100) + '%');
    }

    // Mute/Unmute
    toggleMute() {
        this.isMuted = !this.isMuted;

        if (this.isMuted) {
            this.pause();
            console.log('🔇 Musique muette');
        } else {
            this.resume();
            console.log('🔊 Musique activée');
        }

        return this.isMuted;
    }

    // Obtenir le nom de la piste actuelle
    getCurrentTrackName() {
        if (this.currentTrackIndex < this.playlist.length) {
            return this.playlist[this.currentTrackIndex].file.replace('.mp3', '');
        }
        return 'Aucune piste';
    }

    // Obtenir l'état
    getState() {
        return {
            isPlaying: this.isPlaying,
            isMuted: this.isMuted,
            volume: this.volume,
            currentTrack: this.getCurrentTrackName(),
            trackIndex: this.currentTrackIndex,
            totalTracks: this.playlist.length
        };
    }
}

// Export pour utilisation dans le jeu principal
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MusicManager;
}
