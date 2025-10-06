/**
 * Point d'entrée principal - Version optimisée modulaire
 * La Quête de Vérité - Système RPG Spirituel
 */

import QueteDeVerite from './modules/game.js';

// Configuration globale optimisée
const CONFIG = {
    performance: {
        targetFPS: 60,
        enableVsync: true,
        maxDeltaTime: 33.333 // ~30 FPS minimum
    },
    graphics: {
        enableAntialiasing: true,
        pixelRatio: Math.min(window.devicePixelRatio || 1, 2)
    }
};

class GameManager {
    constructor() {
        this.game = null;
        this.canvas = null;
        this.initialized = false;
        this.performanceMonitor = {
            lastCheck: 0,
            frameCount: 0,
            avgFPS: 60
        };
    }

    // Initialisation optimisée
    async init() {
        try {
            // Récupération du canvas
            this.canvas = document.getElementById('canvas');
            if (!this.canvas) {
                throw new Error('Canvas element not found');
            }

            // Configuration du canvas pour les performances
            this.setupCanvasOptimizations();

            // Créer l'instance de jeu
            this.game = new QueteDeVerite(this.canvas);

            // Monitoring des performances
            this.setupPerformanceMonitoring();

            // Démarrer le jeu
            this.game.start();
            
            this.initialized = true;
            console.log('🎮 La Quête de Vérité - Jeu initialisé avec succès');
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation:', error);
            this.showErrorMessage(error.message);
        }
    }

    // Configuration des optimisations canvas
    setupCanvasOptimizations() {
        const ctx = this.canvas.getContext('2d');
        
        // Optimisations de rendu
        if (CONFIG.graphics.enableAntialiasing) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
        }

        // Configuration pour les appareils haute densité
        const pixelRatio = CONFIG.graphics.pixelRatio;
        if (pixelRatio > 1) {
            const rect = this.canvas.getBoundingClientRect();
            this.canvas.width = rect.width * pixelRatio;
            this.canvas.height = rect.height * pixelRatio;
            ctx.scale(pixelRatio, pixelRatio);
        }

        // Optimisations de performance
        ctx.textRenderingOptimization = 'optimizeSpeed';
        
        // Désactiver la sélection sur le canvas
        this.canvas.style.userSelect = 'none';
        this.canvas.style.webkitUserSelect = 'none';
        this.canvas.style.touchAction = 'none';
    }

    // Monitoring des performances
    setupPerformanceMonitoring() {
        const checkPerformance = () => {
            const now = performance.now();
            this.performanceMonitor.frameCount++;

            if (now - this.performanceMonitor.lastCheck >= 1000) {
                this.performanceMonitor.avgFPS = this.performanceMonitor.frameCount;
                this.performanceMonitor.frameCount = 0;
                this.performanceMonitor.lastCheck = now;

                // Alerte si les performances sont faibles
                if (this.performanceMonitor.avgFPS < 30) {
                    console.warn(`⚠️ Performances faibles détectées: ${this.performanceMonitor.avgFPS} FPS`);
                    this.optimizeForLowPerformance();
                }
            }

            requestAnimationFrame(checkPerformance);
        };
        
        requestAnimationFrame(checkPerformance);
    }

    // Optimisations pour les appareils moins performants
    optimizeForLowPerformance() {
        console.log('🔧 Activation des optimisations pour performances faibles...');
        
        // Réduire la qualité graphique
        const ctx = this.canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        
        // Réduire le pixel ratio
        CONFIG.graphics.pixelRatio = 1;
        
        // D'autres optimisations pourraient être ajoutées ici
    }

    // Affichage des erreurs
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #e74c3c, #c0392b);
            color: white;
            padding: 20px 30px;
            border-radius: 15px;
            font-family: 'Segoe UI', sans-serif;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 1000;
            max-width: 90vw;
        `;
        
        errorDiv.innerHTML = `
            <h3>⚠️ Erreur de Chargement</h3>
            <p>${message}</p>
            <button onclick="location.reload()" style="
                background: white;
                color: #e74c3c;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                margin-top: 15px;
                cursor: pointer;
                font-weight: bold;
            ">Recharger la page</button>
        `;
        
        document.body.appendChild(errorDiv);
    }

    // Méthodes utilitaires pour le debug
    getGameStats() {
        if (!this.game) return null;
        
        return {
            ...this.game.getPerformanceStats(),
            avgFPS: this.performanceMonitor.avgFPS,
            config: CONFIG
        };
    }

    // Basculer le mode debug (accessible depuis la console)
    toggleDebugMode() {
        console.log('📊 Statistiques du jeu:', this.getGameStats());
    }
}

// Fonction d'initialisation avec gestion d'erreurs robuste
async function initializeGame() {
    try {
        // Vérifier la compatibilité du navigateur
        if (!window.requestAnimationFrame) {
            throw new Error('Votre navigateur ne supporte pas les animations web modernes');
        }

        if (!document.getElementById('canvas')) {
            throw new Error('Élément canvas introuvable');
        }

        // Créer et initialiser le gestionnaire de jeu
        const gameManager = new GameManager();
        await gameManager.init();

        // Exposer pour le debug (accessible via window.game dans la console)
        window.game = gameManager;

        // Message de succès
        console.log(`
🎮✨ LA QUÊTE DE VÉRITÉ ✨🎮
Version Modulaire Optimisée

Modules chargés:
• 🛡️ Système d'Ange Gardien
• 🔮 Orbe de Vérité  
• 🏰 Cité des Préjugés
• ⚔️ Système RPG
• 🖥️ Interface Utilisateur
• 🎯 Gestionnaire Principal

Tapez "game.toggleDebugMode()" dans la console pour voir les stats !
        `);

    } catch (error) {
        console.error('❌ Échec d\'initialisation du jeu:', error);
        
        // Affichage d'erreur pour l'utilisateur
        const errorManager = new GameManager();
        errorManager.showErrorMessage(error.message);
    }
}

// Points d'entrée multiples pour une compatibilité maximale
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    // Le DOM est déjà chargé
    initializeGame();
}

// Gestion des erreurs globales
window.addEventListener('error', (event) => {
    console.error('❌ Erreur JavaScript globale:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Promesse rejetée non gérée:', event.reason);
});

// Export pour les tests
export { GameManager, CONFIG };