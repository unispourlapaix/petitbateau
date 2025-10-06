/**
 * CORBEAU SYSTEM MODULE - Voir la Vérité
 * Module pour la gestion du corbeau secret
 */

const CorbeauSystem = {
    // === MÉTADONNÉES MODULE ===
    moduleId: 'VDV_SYS_CORBEAU_001',
    family: 'GAMEPLAY_SYSTEMS',
    category: 'SECRET_MECHANICS',
    description: 'Système de corbeau secret avec apparitions aléatoires et mécaniques de transformation',
    version: '1.0.0',
    dependencies: ['particle-system', 'game-config'],

    // === DONNÉES DU MODULE ===
    corbeau: null,
    touchesCount: 0,
    lastApparition: 0,
    isTransformed: false,

    /**
     * Initialiser le système corbeau
     */
    init(config) {
        this.config = config.GAMEPLAY.CORBEAU;
        this.messages = config.MESSAGES.CORBEAU_RIGOLO;
        this.reset();
    },

    /**
     * Reset du corbeau
     */
    reset() {
        this.corbeau = null;
        this.touchesCount = 0;
        this.lastApparition = Date.now();
        this.isTransformed = false;
    },

    /**
     * Mise à jour du corbeau
     */
    update(timestamp, C) {
        // Vérifier si il faut faire apparaître le corbeau
        if (!this.corbeau &&
            timestamp - this.lastApparition > this.config.INTERVALLE_APPARITION) {
            this.spawnCorbeau(C);
        }

        // Déplacer le corbeau
        if (this.corbeau) {
            this.corbeau.x += this.corbeau.vx;
            this.corbeau.y += this.corbeau.vy;

            // Retirer si hors écran
            if (this.corbeau.x < -50 || this.corbeau.x > C.W + 50 ||
                this.corbeau.y < -50 || this.corbeau.y > C.H + 50) {
                this.corbeau = null;
                this.lastApparition = timestamp;
            }
        }
    },

    /**
     * Faire apparaître le corbeau
     */
    spawnCorbeau(C) {
        const side = Math.random() < 0.5 ? 'left' : 'right';

        this.corbeau = {
            x: side === 'left' ? -30 : C.W + 30,
            y: C.H * 0.2 + Math.random() * C.H * 0.4,
            vx: (side === 'left' ? 1 : -1) * this.config.VITESSE,
            vy: (Math.random() - 0.5) * 0.5,
            size: 25,
            visible: true,
            side: side
        };
    },

    /**
     * Vérifier collision avec la balle
     */
    checkCollision(balle) {
        if (!this.corbeau || !balle.visible) return false;

        const dx = balle.x - this.corbeau.x;
        const dy = balle.y - this.corbeau.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < (this.corbeau.size + 10);
    },

    /**
     * Toucher le corbeau
     */
    hit(showMessage) {
        if (!this.corbeau) return 0;

        this.touchesCount++;

        // Message rigolo
        const randomMessage = this.messages[Math.floor(Math.random() * this.messages.length)];
        showMessage(`🐦‍⬛ ${randomMessage}`, 1500);

        // Transformation après 3 touches
        if (this.touchesCount >= this.config.TOUCHES_POUR_TRANSFORMATION) {
            const transformPoints = this.config.POINTS_TRANSFORMATION || 1000;
            // Transférer l'XP vers l'ange principal
            this.transferXPToMainGame(transformPoints);
            this.transform(showMessage);
            return transformPoints;
        }

        // Faire disparaître temporairement
        this.corbeau = null;
        this.lastApparition = Date.now();

        // 10 XP pour cliquer sur le corbeau
        const clickPoints = 10;
        this.transferXPToMainGame(clickPoints);

        return clickPoints;
    },

    /**
     * Transférer les points vers le score du jeu
     */
    transferXPToMainGame(amount) {
        try {
            // Utiliser directement la variable score globale
            if (typeof window.score !== 'undefined') {
                window.score += amount;
                // console.log(`🐦‍⬛ Points ajoutés depuis corbeau: +${amount} (total: ${window.score})`);
                return true;
            } else {
                // console.log(`⚠️ Variable score non trouvée pour transférer ${amount} points depuis corbeau`);
                return false;
            }
        } catch (error) {
            console.error('❌ Erreur lors du transfert points depuis corbeau:', error);
            return false;
        }
    },

    /**
     * Transformation du corbeau
     */
    transform(showMessage) {
        this.isTransformed = true;
        this.corbeau = null;

        showMessage(`🦅✨ Le corbeau révèle la vérité :
        "Les préjugés... ce ne sont que des mensonges
        pour diviser les cœurs qui se ressemblent !" ✨`, 4000);
    },

    /**
     * Rendu du corbeau
     */
    render(ctx, C) {
        if (!this.corbeau) return;

        ctx.save();

        const x = this.corbeau.x;
        const y = this.corbeau.y;
        const size = this.corbeau.size;

        // Corps du corbeau
        ctx.fillStyle = '#2C2C2C';
        ctx.beginPath();
        ctx.ellipse(x, y, size * 0.8, size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Ailes
        const wingOffset = Math.sin(Date.now() * 0.01) * 0.3;
        ctx.fillStyle = '#1A1A1A';

        // Aile gauche
        ctx.beginPath();
        ctx.ellipse(x - size * 0.5, y + wingOffset * 5, size * 0.6, size * 0.3, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Aile droite
        ctx.beginPath();
        ctx.ellipse(x + size * 0.5, y - wingOffset * 5, size * 0.6, size * 0.3, 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Tête
        ctx.fillStyle = '#2C2C2C';
        ctx.beginPath();
        ctx.arc(x + (this.corbeau.side === 'left' ? size * 0.3 : -size * 0.3), y - size * 0.3, size * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Bec
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(x + (this.corbeau.side === 'left' ? size * 0.6 : -size * 0.6), y - size * 0.3);
        ctx.lineTo(x + (this.corbeau.side === 'left' ? size * 0.8 : -size * 0.8), y - size * 0.2);
        ctx.lineTo(x + (this.corbeau.side === 'left' ? size * 0.6 : -size * 0.6), y - size * 0.1);
        ctx.closePath();
        ctx.fill();

        // Œil
        ctx.fillStyle = '#FF4444';
        ctx.beginPath();
        ctx.arc(x + (this.corbeau.side === 'left' ? size * 0.2 : -size * 0.2), y - size * 0.4, size * 0.1, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
};

// Export pour usage comme module ES6
export default CorbeauSystem;

// Export pour usage CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CorbeauSystem;
}