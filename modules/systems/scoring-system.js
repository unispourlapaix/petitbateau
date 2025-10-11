/**
 * SCORING SYSTEM MODULE - Petit Bateau
 * Module pour la gestion du scoring avancé et des munitions
 */

const ScoringSystem = {
    // === MÉTADONNÉES MODULE ===
    moduleId: 'VDV_SYS_SCORING_003',
    family: 'GAMEPLAY_SYSTEMS',
    category: 'PROGRESSION_TRACKING',
    description: 'Système de scoring avancé avec munitions, multiplicateurs et points spéciaux',
    version: '1.0.0',
    dependencies: ['game-config'],

    // === DONNÉES DU MODULE ===
    score: 0,
    munitions: 0,
    rechargeTimer: 0,
    multiplier: 1,

    /**
     * Initialiser le système de scoring
     */
    init(config) {
        this.config = config.GAMEPLAY;
        this.reset();
    },

    /**
     * Reset du scoring
     */
    reset() {
        this.score = 0;
        this.munitions = this.config.MUNITIONS_INITIALES;
        this.rechargeTimer = 0;
        this.multiplier = 1;
    },

    /**
     * Mise à jour du système (rechargement munitions)
     */
    update(deltaTime) {
        // Rechargement des munitions
        if (this.munitions < this.config.MUNITIONS_INITIALES) {
            this.rechargeTimer += deltaTime;

            if (this.rechargeTimer >= this.config.TEMPS_RECHARGEMENT * 1000) {
                this.munitions++;
                this.rechargeTimer = 0;
            }
        }
    },

    /**
     * Utiliser une munition
     */
    useMunition() {
        if (this.munitions > 0) {
            this.munitions--;
            return true;
        }
        return false;
    },

    /**
     * Ajouter des points pour destruction de brique
     */
    addBrickPoints(brique, chapitre) {
        const basePoints = this.config.POINTS_PAR_DESTRUCTION;
        let points = basePoints;

        // Multiplicateur de chapitre
        if (chapitre === 2) {
            points *= 1.5; // 50% de bonus pour chapitre 2
        }

        // Multiplicateur général
        points *= this.multiplier;

        this.score += Math.round(points);
        return Math.round(points);
    },

    /**
     * Ajouter des points pour coup réussi
     */
    addHitPoints(chapitre) {
        const basePoints = this.config.POINTS_PAR_COUP;
        let points = basePoints;

        if (chapitre === 2) {
            points *= 1.5;
        }

        points *= this.multiplier;
        this.score += Math.round(points);
        return Math.round(points);
    },

    /**
     * Ajouter des points pour le corbeau
     */
    addCorbeauPoints(isTransformation = false) {
        const points = isTransformation ?
            this.config.POINTS_CORBEAU_TRANSFORMATION :
            this.config.POINTS_CORBEAU;

        this.score += points;
        return points;
    },

    /**
     * Ajouter des points pour victoire secrète
     */
    addSecretVictoryPoints() {
        const points = this.config.POINTS_VICTOIRE_SECRET;
        this.score += points;
        return points;
    },

    /**
     * Définir le multiplicateur
     */
    setMultiplier(multiplier) {
        this.multiplier = Math.max(1, multiplier);
    },

    /**
     * Obtenir le score actuel
     */
    getScore() {
        return this.score;
    },

    /**
     * Obtenir les munitions actuelles
     */
    getMunitions() {
        return this.munitions;
    },

    /**
     * Obtenir le pourcentage de rechargement
     */
    getRechargePercent() {
        if (this.munitions >= this.config.MUNITIONS_INITIALES) return 100;
        return (this.rechargeTimer / (this.config.TEMPS_RECHARGEMENT * 1000)) * 100;
    },

    /**
     * Vérifier si on peut tirer
     */
    canShoot() {
        return this.munitions > 0;
    },

    /**
     * Obtenir les statistiques pour l'affichage
     */
    getStats() {
        return {
            score: this.score,
            munitions: this.munitions,
            maxMunitions: this.config.MUNITIONS_INITIALES,
            rechargePercent: this.getRechargePercent(),
            multiplier: this.multiplier
        };
    },

    /**
     * Rendu de l'interface munitions
     */
    renderMunitionsUI(ctx, C) {
        const x = 10;
        const y = C.H - 60;
        const width = 120;
        const height = 20;

        // Fond
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(x, y, width, height);

        // Barre de munitions
        const munitionWidth = (this.munitions / this.config.MUNITIONS_INITIALES) * width;
        ctx.fillStyle = this.munitions > 2 ? '#4CAF50' : '#FF5722';
        ctx.fillRect(x, y, munitionWidth, height);

        // Barre de rechargement
        if (this.munitions < this.config.MUNITIONS_INITIALES) {
            const rechargeWidth = (this.getRechargePercent() / 100) * width;
            ctx.fillStyle = 'rgba(255,255,0,0.5)';
            ctx.fillRect(x, y + height + 2, rechargeWidth, 4);
        }

        // Texte
        ctx.fillStyle = 'white';
        ctx.font = '12px monospace';
        ctx.fillText(`Munitions: ${this.munitions}/${this.config.MUNITIONS_INITIALES}`, x, y - 5);
    }
};

// Export pour usage comme module ES6
export default ScoringSystem;

// Export pour usage CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScoringSystem;
}