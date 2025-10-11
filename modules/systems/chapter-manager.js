/**
 * CHAPTER MANAGER MODULE - Petit Bateau
 * Module pour la gestion des chapitres et transitions
 */

const ChapterManager = {
    // === MÉTADONNÉES MODULE ===
    moduleId: 'VDV_SYS_CHAPTER_002',
    family: 'NARRATIVE_SYSTEMS',
    category: 'PROGRESSION_MANAGER',
    description: 'Gestionnaire de chapitres et transitions narratives entre lumière et obscurité',
    version: '1.0.0',
    dependencies: ['game-config', 'particle-system'],

    // === DONNÉES DU MODULE ===
    currentChapter: 1,
    transitionInProgress: false,

    /**
     * Initialiser le gestionnaire de chapitres
     */
    init(config) {
        this.config = config;
        this.currentChapter = 1;
        this.transitionInProgress = false;
    },

    /**
     * Obtenir les données du chapitre actuel
     */
    getCurrentChapterData() {
        return this.currentChapter === 1 ? this.config.CHAPITRE1 : this.config.CHAPITRE2;
    },

    /**
     * Obtenir le numéro du chapitre actuel
     */
    getCurrentChapter() {
        return this.currentChapter;
    },

    /**
     * Vérifier si c'est le moment de passer au chapitre suivant
     */
    shouldTransition(briquesRestantes, totalBriques) {
        // Transition vers chapitre 2 quand toutes les briques du chapitre 1 sont détruites
        if (this.currentChapter === 1 && briquesRestantes === 0) {
            return true;
        }
        return false;
    },

    /**
     * Démarrer la transition vers le chapitre suivant
     */
    startTransition(showMessage, particles, C) {
        if (this.transitionInProgress) return false;

        this.transitionInProgress = true;

        if (this.currentChapter === 1) {
            // Transition vers chapitre 2
            showMessage(`🌅➡️🌑 TRANSITION<br><br>
                La lumière révèle parfois des ombres...<br>
                Préparez-vous pour...<br><br>
                🌑 CHAPITRE 2 : L'OBSCURITÉ ⛈️`, 4000);

            // Effets visuels de transition
            if (particles) {
                // Particules sombres
                for (let i = 0; i < 20; i++) {
                    setTimeout(() => {
                        particles.addParticles(
                            Math.random() * C.W,
                            Math.random() * C.H,
                            '#2C2C2C',
                            8
                        );
                    }, i * 100);
                }
            }

            // Effectuer la transition après 4 secondes
            setTimeout(() => {
                this.completeTransition();
            }, 4000);

            return true;
        }

        return false;
    },

    /**
     * Compléter la transition
     */
    completeTransition() {
        this.currentChapter = 2;
        this.transitionInProgress = false;
    },

    /**
     * Obtenir la configuration d'environnement pour le chapitre
     */
    getEnvironmentConfig() {
        if (this.currentChapter === 1) {
            return {
                skyType: 'day',
                seaType: 'calm',
                backgroundColors: ['#87CEEB', '#98D8E8', '#A9E4F7'],
                isSecret: false
            };
        } else {
            return {
                skyType: 'storm',
                seaType: 'rough',
                backgroundColors: ['#2F4F4F', '#36454F', '#3C5B5C'],
                isSecret: false
            };
        }
    },

    /**
     * Vérifier si la transition est en cours
     */
    isInTransition() {
        return this.transitionInProgress;
    },

    /**
     * Reset pour nouveau jeu
     */
    reset() {
        this.currentChapter = 1;
        this.transitionInProgress = false;
    },

    /**
     * Obtenir le message d'intro pour le chapitre
     */
    getChapterIntroMessage() {
        if (this.currentChapter === 1) {
            return this.config.MESSAGES_INTRO[0];
        } else {
            return `🌑⛈️ CHAPITRE 2 : L'OBSCURITÉ ⛈️🌑<br><br>
                💭 "Mais soudain, les nuages arrivent...<br>
                Les tempêtes de la haine, les vents du mensonge...<br>
                Pourtant, je garde mon cœur pur...<br>
                Car je sais maintenant ce qui est vrai." ✨`;
        }
    }
};

// Export pour usage comme module ES6
export default ChapterManager;

// Export pour usage CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChapterManager;
}