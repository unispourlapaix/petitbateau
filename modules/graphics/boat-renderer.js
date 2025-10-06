/**
 * BOAT RENDERER MODULE - Voir la Vérité
 * Module pour le rendu du bateau et ses animations
 */

const BoatRenderer = {
    // === MÉTADONNÉES MODULE ===
    moduleId: 'VDV_GFX_BOAT_001',
    family: 'GRAPHICS_SYSTEMS',
    category: 'PLAYER_RENDERER',
    description: 'Moteur de rendu du bateau joueur avec modes normal et militaire',
    version: '1.0.0',
    dependencies: [],

    // === CONFIGURATION DU BATEAU ===
    config: {
        normalColor: {
            hull: ['#ff6b6b', '#e74c3c', '#c0392b'],
            sail: ['#ffffff', '#f8f9fa', '#e9ecef'],
            mast: '#8b4513',
            porthole: '#457b9d'
        },
        militaryColor: {
            hull: ['#74b9ff', '#0984e3', '#2d3436'],
            sail: ['#ffffff', '#f8f9fa', '#e9ecef'],
            mast: '#8b4513',
            porthole: '#457b9d'
        }
    },

    /**
     * Dessiner le bateau complet
     * @param {CanvasRenderingContext2D} ctx - Contexte du canvas
     * @param {Object} raquette - Position et dimensions du bateau
     * @param {Object} C - Constantes du jeu
     * @param {boolean} modeSecret - Mode secret (bateau militaire)
     */
    render(ctx, raquette, C, modeSecret = false) {
        ctx.save();

        // Ombre du bateau
        this._drawShadow(ctx, raquette, C);

        // Choisir les couleurs selon le mode
        const colors = modeSecret ? this.config.militaryColor : this.config.normalColor;

        // Dessiner la coque
        this._drawHull(ctx, raquette, C, colors);

        // Dessiner le mât et la voile
        this._drawMastAndSail(ctx, raquette, C, colors);

        // Dessiner les hublots
        this._drawPortholes(ctx, raquette, C, colors);

        ctx.restore();
    },

    /**
     * Dessiner l'ombre du bateau
     */
    _drawShadow(ctx, raquette, C) {
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(raquette.x + 3, raquette.y + 3, C.PW, C.PH);
    },

    /**
     * Dessiner la coque du bateau
     */
    _drawHull(ctx, raquette, C, colors) {
        // Points de la coque - forme géométrique élégante
        const hullPoints = [
            [raquette.x + C.PW * 0.1, raquette.y + C.PH],        // Arrière gauche
            [raquette.x, raquette.y + C.PH * 0.6],               // Pointe arrière
            [raquette.x + C.PW * 0.2, raquette.y],               // Proue gauche
            [raquette.x + C.PW * 0.8, raquette.y],               // Proue droite
            [raquette.x + C.PW, raquette.y + C.PH * 0.6],        // Pointe avant
            [raquette.x + C.PW * 0.9, raquette.y + C.PH]         // Arrière droite
        ];

        // Gradient pour la coque
        const hullGrad = ctx.createLinearGradient(raquette.x, raquette.y, raquette.x, raquette.y + C.PH);
        hullGrad.addColorStop(0, colors.hull[0]);
        hullGrad.addColorStop(0.5, colors.hull[1]);
        hullGrad.addColorStop(1, colors.hull[2]);

        ctx.fillStyle = hullGrad;
        ctx.beginPath();
        ctx.moveTo(hullPoints[0][0], hullPoints[0][1]);
        for(let i = 1; i < hullPoints.length; i++) {
            ctx.lineTo(hullPoints[i][0], hullPoints[i][1]);
        }
        ctx.closePath();
        ctx.fill();

        // Bordure de la coque
        ctx.strokeStyle = colors.hull[2];
        ctx.lineWidth = 2;
        ctx.stroke();

        // Reflet sur la coque
        const reflectGrad = ctx.createLinearGradient(raquette.x, raquette.y, raquette.x, raquette.y + C.PH*0.4);
        reflectGrad.addColorStop(0, 'rgba(255,255,255,0.4)');
        reflectGrad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = reflectGrad;
        ctx.beginPath();
        ctx.moveTo(hullPoints[0][0], hullPoints[0][1]);
        for(let i = 1; i < hullPoints.length; i++) {
            ctx.lineTo(hullPoints[i][0], hullPoints[i][1]);
        }
        ctx.closePath();
        ctx.fill();
    },

    /**
     * Dessiner le mât et la voile
     */
    _drawMastAndSail(ctx, raquette, C, colors) {
        const mastX = raquette.x + C.PW/2;
        const mastY = raquette.y - C.PH * 3.75; // Voile 1.5x plus haute
        const mastH = C.PH * 4.5;

        // Mât central
        ctx.strokeStyle = colors.mast;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(mastX, raquette.y + C.PH*0.3);
        ctx.lineTo(mastX, mastY);
        ctx.stroke();

        // Voile triangulaire
        const sailPoints = [
            [mastX, mastY],                              // Haut du mât
            [mastX - C.PW*0.4, raquette.y - C.PH*0.5], // Bas gauche plus haut
            [mastX + C.PW*0.25, raquette.y - C.PH*0.1] // Bas droite plus haut
        ];

        // Gradient pour la voile
        const sailGrad = ctx.createLinearGradient(mastX - C.PW*0.4, mastY, mastX + C.PW*0.25, raquette.y);
        sailGrad.addColorStop(0, colors.sail[0]);
        sailGrad.addColorStop(0.6, colors.sail[1]);
        sailGrad.addColorStop(1, colors.sail[2]);

        ctx.fillStyle = sailGrad;
        ctx.beginPath();
        ctx.moveTo(sailPoints[0][0], sailPoints[0][1]);
        for(let i = 1; i < sailPoints.length; i++) {
            ctx.lineTo(sailPoints[i][0], sailPoints[i][1]);
        }
        ctx.closePath();
        ctx.fill();

        // Bordure de la voile
        ctx.strokeStyle = '#ced4da';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Lignes de contrainte de la voile
        ctx.strokeStyle = '#adb5bd';
        ctx.lineWidth = 1;
        for(let i = 0; i < 3; i++) {
            const y = mastY + (raquette.y - C.PH*0.5 - mastY) * (i + 1) / 4;
            ctx.beginPath();
            ctx.moveTo(mastX - C.PW*0.3 * (1 - i/3), y);
            ctx.lineTo(mastX + C.PW*0.2 * (1 - i/3), y);
            ctx.stroke();
        }
    },

    /**
     * Dessiner les hublots
     */
    _drawPortholes(ctx, raquette, C, colors) {
        ctx.fillStyle = colors.porthole;
        for(let i = 0; i < 3; i++) {
            const portholeX = raquette.x + C.PW*0.25 + i * C.PW*0.25;
            const portholeY = raquette.y + C.PH*0.5;
            ctx.beginPath();
            ctx.arc(portholeX, portholeY, C.PH*0.1, 0, Math.PI * 2);
            ctx.fill();
        }
    }
};

// Export pour usage comme module ES6
export default BoatRenderer;

// Export pour usage CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BoatRenderer;
}