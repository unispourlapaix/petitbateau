// Gestionnaire principal du jeu - Coordonne toutes les phases
class GameManager {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.currentPhase = 0;
        this.phases = [];
        this.gameState = {
            score: 0,
            discoveries: [],
            timeStarted: Date.now()
        };

        this.isRunning = false;
        this.animationId = null;
    }

    // Initialisation du gestionnaire de jeu
    init(canvasId = 'gameCanvas') {
        console.log('GameManager - Initialisation...');

        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas non trouvé:', canvasId);
            return false;
        }

        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        this.loadPhases();
        this.setupEventListeners();

        console.log('GameManager - Initialisé avec succès');
        return true;
    }

    setupCanvas() {
        // Configuration responsive du canvas
        const resizeCanvas = () => {
            const container = this.canvas.parentElement;
            const rect = container.getBoundingClientRect();

            this.canvas.width = Math.min(rect.width, window.innerWidth);
            this.canvas.height = Math.min(rect.height, window.innerHeight);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    // Chargement des modules de phases
    loadPhases() {
        try {
            this.phases = [
                new Phase1Module(this.gameState),
                new Phase2Module(this.gameState),
                new Phase3Module(this.gameState)
            ];

            // Initialiser toutes les phases
            this.phases.forEach((phase, index) => {
                phase.init(this.canvas, this.ctx);
                console.log(`Phase ${index + 1} chargée`);
            });

        } catch (error) {
            console.error('Erreur lors du chargement des phases:', error);
        }
    }

    setupEventListeners() {
        // Gestion des clics
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const data = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            this.handleEvent('click', data);
        });

        // Gestion du touch
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const data = {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top
            };
            this.handleEvent('touch', data);
        });

        // Prévenir les actions par défaut
        this.canvas.addEventListener('touchmove', (e) => e.preventDefault());
        this.canvas.addEventListener('touchend', (e) => e.preventDefault());
    }

    // Démarrage du jeu
    start() {
        console.log('GameManager - Démarrage du jeu');
        this.isRunning = true;
        this.currentPhase = 0;
        this.startCurrentPhase();
        this.gameLoop();
    }

    // Boucle principale du jeu
    gameLoop() {
        if (!this.isRunning) return;

        // Mettre à jour la phase actuelle
        if (this.phases[this.currentPhase]) {
            this.phases[this.currentPhase].update();
        }

        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }

    // Gestion des événements
    handleEvent(eventType, data) {
        if (this.phases[this.currentPhase]) {
            this.phases[this.currentPhase].handleEvent(eventType, data);
        }
    }

    // Démarrage d'une phase spécifique
    startCurrentPhase() {
        const phase = this.phases[this.currentPhase];
        if (!phase) return;

        console.log(`Démarrage de la phase ${this.currentPhase + 1}`);

        // Nettoyer la phase précédente si nécessaire
        if (this.currentPhase > 0) {
            this.phases[this.currentPhase - 1].cleanup();
        }

        // Afficher le message de la phase
        switch (this.currentPhase) {
            case 0:
                phase.showIntroMessage();
                break;
            case 1:
                phase.showExplorationMessage();
                break;
            case 2:
                phase.showRevelationMessage();
                break;
        }
    }

    // Méthodes spécifiques aux phases
    startPhase1() {
        console.log('Début de la phase 1');
        this.hideMessage();
        // Logique spécifique à la phase 1
    }

    // Nouvelle méthode pour démarrer l'intro narrative
    startIntroNarrative() {
        console.log('Démarrage de l\'intro narrative');
        if (this.phases[0] && this.phases[0].startIntroNarrative) {
            this.phases[0].startIntroNarrative();
        }
    }

    startPhase2() {
        console.log('Transition vers la phase 2');
        this.nextPhase();
    }

    triggerRevelation() {
        console.log('Déclenchement de la révélation');
        if (this.phases[2]) {
            this.phases[2].triggerRevelation();
        }
        this.hideMessage();
    }

    // Passage à la phase suivante
    nextPhase() {
        if (this.currentPhase < this.phases.length - 1) {
            this.currentPhase++;
            this.startCurrentPhase();
        } else {
            this.endGame();
        }
    }

    // Passage à la phase précédente
    previousPhase() {
        if (this.currentPhase > 0) {
            this.currentPhase--;
            this.startCurrentPhase();
        }
    }

    // Aller à une phase spécifique
    goToPhase(phaseIndex) {
        if (phaseIndex >= 0 && phaseIndex < this.phases.length) {
            this.currentPhase = phaseIndex;
            this.startCurrentPhase();
        }
    }

    // Masquer les messages
    hideMessage() {
        const message = document.querySelector('.message');
        if (message) {
            message.style.display = 'none';
        }
    }

    // Fin du jeu
    endGame() {
        console.log('Fin du jeu');
        this.isRunning = false;

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        // Afficher les statistiques finales
        const finalTime = Date.now() - this.gameState.timeStarted;
        console.log(`Temps de jeu: ${Math.floor(finalTime / 1000)}s`);
        console.log(`Score final: ${this.gameState.score}`);
    }

    // Méthodes utilitaires
    getCurrentPhase() {
        return this.currentPhase;
    }

    getGameState() {
        return { ...this.gameState };
    }

    // Nettoyage
    destroy() {
        this.isRunning = false;

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        // Nettoyer toutes les phases
        this.phases.forEach(phase => {
            if (phase.cleanup) {
                phase.cleanup();
            }
        });

        console.log('GameManager - Détruit');
    }
}

// Export du module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameManager;
} else {
    window.GameManager = GameManager;
}