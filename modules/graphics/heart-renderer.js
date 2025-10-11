/**
 * HEART RENDERER MODULE - Petit Bateau
 * Module pour le rendu des cœurs et formes d'amour
 */

const HeartRenderer = {
    // === MÉTADONNÉES MODULE ===
    moduleId: 'VDV_GFX_HEART_003',
    family: 'GRAPHICS_SYSTEMS',
    category: 'PARTICLE_RENDERER',
    description: 'Moteur de rendu des cœurs avec plusieurs styles et génération de positions',
    version: '1.0.0',
    dependencies: [],

    /**
     * Dessiner un cœur pixel art (pour les briques)
     * @param {CanvasRenderingContext2D} ctx - Contexte du canvas
     * @param {number} x - Position X
     * @param {number} y - Position Y
     * @param {number} taille - Taille du cœur
     * @param {string} couleur - Couleur du cœur
     */
    drawPixelHeart(ctx, x, y, taille, couleur) {
        ctx.save();
        ctx.translate(x, y);

        const t = taille;
        const temps = Date.now() * 0.003;
        const pulsation = 1 + Math.sin(temps) * 0.15; // Pulsation douce

        // Appliquer la pulsation
        ctx.scale(pulsation, pulsation);

        // Style simple et clair
        ctx.fillStyle = couleur;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;

        // Cœur super mignon pour les briques qui pulse
        ctx.beginPath();

        // Lobe gauche (forme arrondie avec segments)
        ctx.moveTo(-t * 0.3, -t * 0.02);
        ctx.lineTo(-t * 0.22, -t * 0.18);
        ctx.lineTo(-t * 0.12, -t * 0.2);
        ctx.lineTo(-t * 0.05, -t * 0.1);
        ctx.lineTo(-t * 0.02, -t * 0.02);

        // Lobe droit (forme arrondie avec segments)
        ctx.lineTo(t * 0.02, -t * 0.02);
        ctx.lineTo(t * 0.05, -t * 0.1);
        ctx.lineTo(t * 0.12, -t * 0.2);
        ctx.lineTo(t * 0.22, -t * 0.18);
        ctx.lineTo(t * 0.3, -t * 0.02);

        // Descente vers la pointe avec courbe
        ctx.lineTo(t * 0.18, t * 0.15);
        ctx.lineTo(t * 0.08, t * 0.3);
        ctx.lineTo(0, t * 0.4);
        ctx.lineTo(-t * 0.08, t * 0.3);
        ctx.lineTo(-t * 0.18, t * 0.15);

        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Détails mignons - petits cœurs à l'intérieur
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';

        // Petit cœur gauche
        ctx.beginPath();
        ctx.moveTo(-t * 0.15, -t * 0.05);
        ctx.lineTo(-t * 0.12, -t * 0.08);
        ctx.lineTo(-t * 0.09, -t * 0.05);
        ctx.lineTo(-t * 0.12, t * 0.02);
        ctx.closePath();
        ctx.fill();

        // Petit cœur droit
        ctx.beginPath();
        ctx.moveTo(t * 0.09, -t * 0.05);
        ctx.lineTo(t * 0.12, -t * 0.08);
        ctx.lineTo(t * 0.15, -t * 0.05);
        ctx.lineTo(t * 0.12, t * 0.02);
        ctx.closePath();
        ctx.fill();

        // Point lumineux central
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(0, t * 0.05, t * 0.02, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    },

    /**
     * Dessiner un cœur polygonal (pour les particules volantes)
     * @param {CanvasRenderingContext2D} ctx - Contexte du canvas
     * @param {number} x - Position X
     * @param {number} y - Position Y
     * @param {number} taille - Taille du cœur
     * @param {string} couleur - Couleur du cœur
     * @param {number} rotation - Rotation en radians
     * @param {number} intensite - Intensité de la couleur (0-1)
     */
    drawPolygonalHeart(ctx, x, y, taille, couleur, rotation = 0, intensite = 1) {
        ctx.save();
        ctx.translate(x, y);
        if(rotation) ctx.rotate(rotation);

        const t = taille;

        // Style simple
        ctx.fillStyle = couleur;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;

        // Cœur fait avec plusieurs triangles pour former une vraie forme
        ctx.beginPath();

        // Lobe gauche (plusieurs triangles pour arrondir)
        ctx.moveTo(-t * 0.3, -t * 0.05);
        ctx.lineTo(-t * 0.2, -t * 0.2);
        ctx.lineTo(-t * 0.1, -t * 0.15);
        ctx.lineTo(-t * 0.05, -t * 0.05);

        // Lobe droit (plusieurs triangles pour arrondir)
        ctx.lineTo(t * 0.05, -t * 0.05);
        ctx.lineTo(t * 0.1, -t * 0.15);
        ctx.lineTo(t * 0.2, -t * 0.2);
        ctx.lineTo(t * 0.3, -t * 0.05);

        // Côtés qui descendent vers la pointe
        ctx.lineTo(t * 0.15, t * 0.1);
        ctx.lineTo(0, t * 0.4);
        ctx.lineTo(-t * 0.15, t * 0.1);

        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    },

    /**
     * Dessiner un petit cœur pour les particules
     * @param {CanvasRenderingContext2D} ctx - Contexte du canvas
     * @param {number} x - Position X
     * @param {number} y - Position Y
     * @param {number} taille - Taille du cœur
     * @param {string} couleur - Couleur du cœur
     */
    drawSmallHeart(ctx, x, y, taille, couleur) {
        ctx.save();
        ctx.fillStyle = couleur;

        // Dessiner petit cœur simple
        ctx.beginPath();
        // Partie gauche du cœur
        ctx.arc(x - taille*0.3, y - taille*0.2, taille*0.4, 0, Math.PI, true);
        // Partie droite du cœur
        ctx.arc(x + taille*0.3, y - taille*0.2, taille*0.4, 0, Math.PI, true);
        // Pointe du cœur
        ctx.lineTo(x, y + taille*0.6);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    },

    /**
     * Générer des positions en forme de cœur (équation paramétrique)
     * @param {number} nbBriques - Nombre de briques à positionner
     * @param {number} largeurBrique - Largeur d'une brique
     * @param {number} hauteurBrique - Hauteur d'une brique
     * @param {number} espacement - Espacement entre les briques
     * @param {number} margeHaut - Marge du haut
     * @param {number} canvasWidth - Largeur du canvas
     * @param {number} canvasHeight - Hauteur du canvas
     * @returns {Array} Tableau des positions {x, y}
     */
    generateHeartPositions(nbBriques, largeurBrique, hauteurBrique, espacement, margeHaut, canvasWidth, canvasHeight) {
        const positions = [];
        const centreX = canvasWidth / 2;
        const centreY = margeHaut + canvasHeight * 0.15;
        const taille = Math.min(canvasWidth, canvasHeight) * 0.3; // Taille du cœur

        // Générer des positions selon l'équation paramétrique d'un cœur
        for(let i = 0; i < nbBriques; i++) {
            const t = (i / nbBriques) * 2 * Math.PI; // Paramètre de 0 à 2π

            // Équation paramétrique d'un cœur : x = 16sin³(t), y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));

            // Mise à l'échelle et centrage
            const posX = centreX + (x * taille / 32) - largeurBrique / 2;
            const posY = centreY + (y * taille / 32) - hauteurBrique / 2;

            positions.push({ x: posX, y: posY });
        }

        return positions;
    }
};

// Export pour usage comme module ES6
export default HeartRenderer;

// Export pour usage CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeartRenderer;
}