// Module Pont Narration - Interface entre le système narratif et le gameplay
class NarrationBridge {
    constructor(narrationManager, gameEngine) {
        this.narrationManager = narrationManager;
        this.gameEngine = gameEngine;
        this.eventListeners = new Map();
        this.gameplayState = {
            currentMode: null,
            objectives: {},
            completed: false
        };

        this.init();
    }

    init() {
        this.log('Initialisation du pont narration-gameplay');
        this.setupNarrationCallbacks();
        this.setupGameplayListeners();
    }

    // Configuration des callbacks de narration
    setupNarrationCallbacks() {
        // Début de phase : configurer le gameplay
        this.narrationManager.on('onPhaseStart', (phaseData) => {
            this.log(`Phase ${phaseData.phase} démarrée`);
            this.configureGameplayForPhase(phaseData);
        });

        // Changement de mode de jeu
        this.narrationManager.on('onGameModeChange', (gameMode) => {
            this.log(`Changement de mode: ${gameMode}`);
            this.switchGameMode(gameMode);
        });

        // Fin de phase
        this.narrationManager.on('onPhaseEnd', (phaseData) => {
            this.log(`Phase ${phaseData.phase} terminée`);
            this.onPhaseComplete(phaseData);
        });

        // Transitions
        this.narrationManager.on('onTransitionStart', (data) => {
            this.log(`Transition ${data.from} -> ${data.to}`);
            this.pauseGameplay();
        });

        this.narrationManager.on('onTransitionEnd', (data) => {
            if (data.completed) {
                this.log('Narration terminée');
                this.onNarrationComplete();
            } else if (data.showFinalMenu) {
                this.showGameFinalMenu();
            } else {
                this.resumeGameplay();
            }
        });
    }

    // Configuration du gameplay selon la phase
    configureGameplayForPhase(phaseData) {
        this.gameplayState.currentMode = phaseData.gameMode;
        this.gameplayState.objectives = phaseData.conditions || {};
        this.gameplayState.completed = false;

        // Dispatcher les événements de configuration
        this.dispatchGameEvent('configure', {
            mode: phaseData.gameMode,
            phase: phaseData.phase,
            objectives: phaseData.conditions
        });

        // Configuration spécifique par mode
        switch (phaseData.gameMode) {
            case 'coeurs':
                this.setupCoeursMode(phaseData);
                break;
            case 'briques':
                this.setupBriquesMode(phaseData);
                break;
            case 'stars':
                this.setupStarsMode(phaseData);
                break;
            case 'feux_artifice':
                this.setupFireworksMode(phaseData);
                break;
        }
    }

    // Configuration mode cœurs
    setupCoeursMode(phaseData) {
        this.dispatchGameEvent('mode:coeurs', {
            count: 5, // Nombre de cœurs par défaut
            difficulty: phaseData.metadata?.difficulty || 'medium',
            layout: 'scattered'
        });

        // Écouter la destruction des cœurs
        this.listenForGameEvent('coeurs:destroyed', (data) => {
            if (data.remaining === 0) {
                this.onObjectiveComplete('coeurs_destroy_all');
            }
        });
    }

    // Configuration mode briques
    setupBriquesMode(phaseData) {
        this.dispatchGameEvent('mode:briques', {
            layout: 'standard',
            difficulty: phaseData.metadata?.difficulty || 'medium',
            powerUps: true
        });

        // Écouter la destruction des briques
        this.listenForGameEvent('briques:destroyed', (data) => {
            if (data.remaining === 0) {
                this.onObjectiveComplete('briques_destroy_all');
            }
        });
    }

    // Configuration mode étoiles
    setupStarsMode(phaseData) {
        this.dispatchGameEvent('mode:stars', {
            nightMode: true,
            starCount: 20,
            difficulty: phaseData.metadata?.difficulty || 'medium'
        });

        // Écouter la complétion de la séquence étoiles
        this.listenForGameEvent('stars:sequence_complete', () => {
            this.onObjectiveComplete('stars_sequence_complete');
        });
    }

    // Configuration mode feux d'artifice
    setupFireworksMode(phaseData) {
        this.dispatchGameEvent('mode:feux_artifice', {
            duration: phaseData.duration || 10000,
            intensity: 'high',
            autoPlay: true
        });

        // Timer automatique pour les feux d'artifice
        setTimeout(() => {
            this.onObjectiveComplete('fireworks_complete');
        }, phaseData.duration || 10000);
    }

    // Gestion des objectifs atteints
    onObjectiveComplete(objectiveType) {
        this.log(`Objectif atteint: ${objectiveType}`);

        if (!this.gameplayState.completed) {
            this.gameplayState.completed = true;

            // Effet visuel de succès
            this.dispatchGameEvent('objective:complete', {
                type: objectiveType,
                phase: this.narrationManager.currentPhase
            });

            // Progression narrative après un délai
            setTimeout(() => {
                if (this.narrationManager.nextPhase()) {
                    this.narrationManager.executeCurrentPhase();
                }
            }, this.narrationManager.config.transitionDelay);
        }
    }

    // Changement de mode de jeu
    switchGameMode(gameMode) {
        this.dispatchGameEvent('switch_mode', { mode: gameMode });

        // Nettoyage de l'ancien mode
        this.cleanupCurrentMode();

        // Configuration du nouveau mode
        const currentPhase = this.narrationManager.getCurrentPhaseData();
        if (currentPhase) {
            this.configureGameplayForPhase(currentPhase);
        }
    }

    // Nettoyage du mode actuel
    cleanupCurrentMode() {
        this.dispatchGameEvent('cleanup_mode', {
            mode: this.gameplayState.currentMode
        });
        this.gameplayState.completed = false;
    }

    // Pause/reprise du gameplay
    pauseGameplay() {
        this.dispatchGameEvent('pause', {});
    }

    resumeGameplay() {
        this.dispatchGameEvent('resume', {});
    }

    // Fin de phase
    onPhaseComplete(phaseData) {
        // Effets visuels de transition
        this.dispatchGameEvent('phase:complete', {
            phase: phaseData.phase,
            nextPhase: phaseData.phase + 1
        });
    }

    // Fin de narration
    onNarrationComplete() {
        this.dispatchGameEvent('narration:complete', {
            totalPhases: this.narrationManager.narrativeData.phases.length,
            progress: this.narrationManager.progress
        });
    }

    // Menu final
    showGameFinalMenu() {
        this.dispatchGameEvent('show:final_menu', {
            stats: this.generateGameStats(),
            progress: this.narrationManager.progress
        });
    }

    // Statistiques de jeu
    generateGameStats() {
        return {
            totalPhases: this.narrationManager.progress.total,
            completedPhases: this.narrationManager.progress.current - 1,
            percentage: this.narrationManager.progress.percentage,
            playtime: this.calculatePlaytime(),
            achievements: this.getAchievements()
        };
    }

    calculatePlaytime() {
        // Calcul du temps de jeu - à implémenter
        return "5:32"; // Placeholder
    }

    getAchievements() {
        // Liste des succès - à implémenter
        return [
            { id: 'first_truth', name: 'Première Vérité', unlocked: true },
            { id: 'family_discovered', name: 'Famille Découverte', unlocked: true },
            { id: 'chapter_complete', name: 'Chapitre Terminé', unlocked: false }
        ];
    }

    // Système d'événements
    dispatchGameEvent(type, data) {
        const event = new CustomEvent(`game:${type}`, { detail: data });
        window.dispatchEvent(event);
        this.log(`Événement envoyé: game:${type}`, data);
    }

    listenForGameEvent(type, callback) {
        const handler = (event) => callback(event.detail);
        window.addEventListener(`game:${type}`, handler);
        this.eventListeners.set(type, handler);
    }

    // Configuration des listeners gameplay existants
    setupGameplayListeners() {
        // Écouter les événements de l'ancien système
        this.setupLegacyEventBridge();
    }

    // Pont avec l'ancien système
    setupLegacyEventBridge() {
        // Mapper les anciens événements vers le nouveau système

        // Fin de niveau/phase via les conditions existantes
        window.addEventListener('gameplay:level_complete', () => {
            this.onObjectiveComplete('level_complete');
        });

        // Destruction de cœurs
        window.addEventListener('gameplay:coeur_destroyed', (event) => {
            this.dispatchGameEvent('coeurs:destroyed', event.detail);
        });

        // Destruction de briques
        window.addEventListener('gameplay:brique_destroyed', (event) => {
            this.dispatchGameEvent('briques:destroyed', event.detail);
        });

        // Séquence étoiles
        window.addEventListener('gameplay:stars_complete', () => {
            this.dispatchGameEvent('stars:sequence_complete', {});
        });
    }

    // API publique pour compatibilité
    triggerObjectiveComplete(objectiveType) {
        this.onObjectiveComplete(objectiveType);
    }

    getCurrentGameMode() {
        return this.gameplayState.currentMode;
    }

    isObjectiveComplete() {
        return this.gameplayState.completed;
    }

    // Debug
    log(message, data = null) {
        if (this.narrationManager.config.debug) {
            console.log(`[NarrationBridge] ${message}`, data || '');
        }
    }

    // Nettoyage
    destroy() {
        this.eventListeners.forEach((handler, type) => {
            window.removeEventListener(`game:${type}`, handler);
        });
        this.eventListeners.clear();
        this.log('NarrationBridge détruit');
    }
}

// Export du module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NarrationBridge;
} else {
    window.NarrationBridge = NarrationBridge;
}