/**
 * MODULE INDEX - Voir la Vérité
 * Point d'entrée principal pour tous les modules
 */

// Import des modules graphiques
import BoatRenderer from './graphics/boat-renderer.js';
import HeartRenderer from './graphics/heart-renderer.js';
import LanternRenderer from './graphics/lantern-renderer.js';
import EnvironmentRenderer from './graphics/environment-renderer.js';

// Import des systèmes
import ParticleSystem from './systems/particle-system.js';
import CorbeauSystem from './systems/corbeau-system.js';
import ChapterManager from './systems/chapter-manager.js';
import ScoringSystem from './systems/scoring-system.js';

// Import de la configuration
import GameConfig from './config/game-config.js';

/**
 * Gestionnaire principal des modules
 */
const ModuleManager = {
    // Modules graphiques
    graphics: {
        boat: BoatRenderer,
        heart: HeartRenderer,
        lantern: LanternRenderer,
        environment: EnvironmentRenderer
    },

    // Systèmes
    systems: {
        particles: ParticleSystem,
        corbeau: CorbeauSystem,
        chapters: ChapterManager,
        scoring: ScoringSystem
    },

    // Configuration
    config: GameConfig,

    /**
     * Initialiser tous les modules
     */
    init() {
        console.log('🎮 Initialisation des modules - Voir la Vérité');

        // Initialiser les systèmes
        this.systems.particles.clear();
        this.systems.corbeau.init(this.config);
        this.systems.chapters.init(this.config);
        this.systems.scoring.init(this.config);

        console.log('✅ Modules initialisés avec succès');
        return this;
    },

    /**
     * Obtenir un module spécifique
     * @param {string} category - Catégorie (graphics, systems, config)
     * @param {string} module - Nom du module
     * @returns {Object} Module demandé
     */
    get(category, module) {
        if (!this[category] || !this[category][module]) {
            console.warn(`⚠️ Module non trouvé: ${category}.${module}`);
            return null;
        }
        return this[category][module];
    },

    /**
     * Vérifier la disponibilité d'un module
     * @param {string} category - Catégorie
     * @param {string} module - Nom du module
     * @returns {boolean} Disponibilité
     */
    isAvailable(category, module) {
        return !!(this[category] && this[category][module]);
    },

    /**
     * Lister tous les modules disponibles
     * @returns {Object} Liste des modules
     */
    listModules() {
        const modules = {};

        Object.keys(this).forEach(category => {
            if (typeof this[category] === 'object' && category !== 'config') {
                modules[category] = Object.keys(this[category]);
            }
        });

        return modules;
    },

    /**
     * Obtenir des statistiques sur les modules
     * @returns {Object} Statistiques
     */
    getStats() {
        return {
            graphics: Object.keys(this.graphics).length,
            systems: Object.keys(this.systems).length,
            totalParticles: this.systems.particles.getTotalCount(),
            configLoaded: !!this.config
        };
    }
};

// Initialisation automatique
ModuleManager.init();

// Export pour usage global
window.ModuleManager = ModuleManager;

// Export pour usage comme module ES6
export default ModuleManager;

// Export pour usage CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModuleManager;
}