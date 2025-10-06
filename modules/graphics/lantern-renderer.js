/**
 * LANTERN RENDERER MODULE - Voir la Vérité
 * Module pour le rendu de la lanterne magique
 */

const LanternRenderer = {
    // === MÉTADONNÉES MODULE ===
    moduleId: 'VDV_GFX_LANTERN_002',
    family: 'GRAPHICS_SYSTEMS',
    category: 'BALL_RENDERER',
    description: 'Moteur de rendu de la lanterne magique avec états actif/inactif et animations',
    version: '1.0.0',
    dependencies: [],

    /**
     * Dessiner la lanterne complète
     * @param {CanvasRenderingContext2D} ctx - Contexte du canvas
     * @param {Object} balle - Position de la balle/lanterne
     * @param {Object} lanterne - État de la lanterne
     * @param {Object} C - Constantes du jeu
     * @param {boolean} animationBateau - Si l'animation du bateau est active
     * @param {string} phaseJeu - Phase actuelle du jeu
     */
    render(ctx, balle, lanterne, C, animationBateau, phaseJeu) {
        // Ne dessiner la lanterne que si on est dans la phase des briques et pas pendant l'animation
        if (animationBateau || !balle.visible || phaseJeu !== 'jeu_briques') return;

        ctx.save();

        const posX = balle.x;
        const posY = balle.y;
        const temps = Date.now() * 0.001;

        // 1. HALO DE BOUGIE SIMPLE
        if(lanterne.active) {
            this._drawHalo(ctx, posX, posY, C.BS);
        }

        // 2. LANTERNE CYLINDRIQUE CLASSIQUE
        this._drawLanternBody(ctx, posX, posY, C.BS, lanterne.active);

        // 3. FLAMME AVEC ANIMATIONS TRÈS LENTES
        if(lanterne.active) {
            this._drawFlame(ctx, posX, posY, C.BS, temps);
        } else {
            this._drawExtinguishedWick(ctx, posX, posY, C.BS);
        }

        // 4. SYSTÈME DE SUSPENSION SIMPLE
        this._drawSuspension(ctx, posX, posY, C.BS, lanterne.active);

        ctx.restore();
    },

    /**
     * Dessiner le halo lumineux
     */
    _drawHalo(ctx, posX, posY, baseSize) {
        // Halo simple statique
        const haloSize = baseSize * 3;
        const haloIntensity = 0.4;

        // Halo principal simple
        const haloGrad = ctx.createRadialGradient(posX, posY, 0, posX, posY, haloSize);
        haloGrad.addColorStop(0, `rgba(255, 220, 150, ${haloIntensity})`);
        haloGrad.addColorStop(0.3, `rgba(255, 180, 100, ${haloIntensity * 0.7})`);
        haloGrad.addColorStop(0.7, `rgba(255, 140, 60, ${haloIntensity * 0.3})`);
        haloGrad.addColorStop(1, 'rgba(255, 100, 30, 0)');

        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(posX, posY, haloSize, 0, Math.PI * 2);
        ctx.fill();
    },

    /**
     * Dessiner le corps de la lanterne
     */
    _drawLanternBody(ctx, posX, posY, baseSize, isActive) {
        // Dimensions de la lanterne cylindrique plus haute et plus petite
        const rayon = baseSize * 0.8;        // Rayon du cylindre (plus petit)
        const corpsH = baseSize * 2.4;       // Hauteur du corps cylindrique (plus haute)
        const domeH = baseSize * 0.4;        // Hauteur du dôme
        const baseH = baseSize * 0.2;        // Hauteur de la base

        // LUEUR DOUCE AUTOUR DE LA LANTERNE
        if(isActive) {
            const lueurSize = rayon * 2.5;
            const lueurGrad = ctx.createRadialGradient(posX, posY, rayon, posX, posY, lueurSize);
            lueurGrad.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
            lueurGrad.addColorStop(0.5, 'rgba(255, 180, 0, 0.2)');
            lueurGrad.addColorStop(1, 'rgba(255, 140, 0, 0)');
            ctx.fillStyle = lueurGrad;
            ctx.beginPath();
            ctx.arc(posX, posY, lueurSize, 0, Math.PI * 2);
            ctx.fill();
        }

        // Armature métallique de la lanterne
        const armatureColor = isActive ? '#B8860B' : '#654321';

        // BASE RONDE plus petite
        const baseY = posY + corpsH/2;
        ctx.fillStyle = armatureColor;
        ctx.beginPath();
        ctx.ellipse(posX, baseY, rayon * 1.05, baseH, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = armatureColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // CORPS CYLINDRIQUE
        const corpsTop = posY - corpsH/2;
        const corpsBottom = posY + corpsH/2;

        // Vitres cylindriques
        if(isActive) {
            // Vitres dorées lumineuses
            const vitreGrad = ctx.createRadialGradient(posX, posY, 0, posX, posY, rayon);
            vitreGrad.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
            vitreGrad.addColorStop(0.7, 'rgba(255, 200, 0, 0.6)');
            vitreGrad.addColorStop(1, 'rgba(255, 180, 0, 0.4)');
            ctx.fillStyle = vitreGrad;
        } else {
            // Vitres éteintes
            ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        }
        ctx.beginPath();
        ctx.ellipse(posX, posY, rayon, corpsH/2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Contour du cylindre
        ctx.strokeStyle = armatureColor;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Barreaux en forme de croix
        ctx.beginPath();
        // Barre verticale
        ctx.moveTo(posX, corpsTop);
        ctx.lineTo(posX, corpsBottom);
        // Barre horizontale
        ctx.moveTo(posX - rayon, posY);
        ctx.lineTo(posX + rayon, posY);
        ctx.stroke();

        // DÔME SUPÉRIEUR
        const domeTop = corpsTop - domeH;
        ctx.fillStyle = armatureColor;
        ctx.strokeStyle = '#CD7F32';
        ctx.lineWidth = 2;

        // Dôme en forme d'ellipse plus petit
        ctx.beginPath();
        ctx.ellipse(posX, domeTop + domeH/2, rayon * 0.9, domeH/2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    },

    /**
     * Dessiner la flamme active
     */
    _drawFlame(ctx, posX, posY, baseSize, temps) {
        // Flamme avec mouvement très lent et doux
        const flammeX = posX + Math.sin(temps * 0.3) * 1; // Très lent
        const flammeY = posY - baseSize * 0.3;
        const flammeH = baseSize * 0.6;
        const flammeW = baseSize * 0.3;

        // Flamme principale avec danse très douce
        const flammeGrad = ctx.createRadialGradient(flammeX, flammeY, 0, flammeX, flammeY, flammeH);
        flammeGrad.addColorStop(0, '#FFFF99');
        flammeGrad.addColorStop(0.3, '#FFD700');
        flammeGrad.addColorStop(0.6, '#FFA500');
        flammeGrad.addColorStop(1, '#FF6347');

        ctx.fillStyle = flammeGrad;
        ctx.beginPath();
        // Forme de flamme avec variations très lentes
        ctx.ellipse(flammeX, flammeY, flammeW * (0.6 + Math.sin(temps * 0.4) * 0.05), flammeH * (0.8 + Math.cos(temps * 0.35) * 0.05), Math.sin(temps * 0.2) * 0.05, 0, Math.PI * 2);
        ctx.fill();

        // Cœur de la flamme plus lumineux
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.ellipse(flammeX, flammeY, flammeW * 0.3, flammeH * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Mèche de la bougie
        ctx.fillStyle = '#654321';
        ctx.fillRect(posX - 1, posY, 2, baseSize * 0.2);
    },

    /**
     * Dessiner la mèche éteinte
     */
    _drawExtinguishedWick(ctx, posX, posY, baseSize) {
        // Mèche éteinte
        ctx.fillStyle = '#654321';
        ctx.fillRect(posX - 1, posY - 2, 2, 4);

        // Cœur d'humanité au repos
        const coeurSize = baseSize * 0.4;
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.moveTo(posX, posY + coeurSize*0.3);
        ctx.bezierCurveTo(posX, posY, posX - coeurSize*0.5, posY, posX - coeurSize*0.5, posY + coeurSize*0.3);
        ctx.bezierCurveTo(posX - coeurSize*0.5, posY + coeurSize*0.7, posX, posY + coeurSize*0.7, posX, posY + coeurSize);
        ctx.bezierCurveTo(posX, posY + coeurSize*0.7, posX + coeurSize*0.5, posY + coeurSize*0.7, posX + coeurSize*0.5, posY + coeurSize*0.3);
        ctx.bezierCurveTo(posX + coeurSize*0.5, posY, posX, posY, posX, posY + coeurSize*0.3);
        ctx.fill();
    },

    /**
     * Dessiner le système de suspension
     */
    _drawSuspension(ctx, posX, posY, baseSize, isActive) {
        const rayon = baseSize * 0.8;
        const corpsH = baseSize * 2.4;
        const domeH = baseSize * 0.4;
        const domeTop = posY - corpsH/2 - domeH;
        const cordeLength = baseSize * 2;

        ctx.strokeStyle = isActive ? '#8B4513' : '#4a4a4a';
        ctx.lineWidth = 2;

        // Cordes depuis le dôme adaptées à la taille
        ctx.beginPath();
        ctx.moveTo(posX - rayon*0.6, domeTop); // Gauche du dôme
        ctx.lineTo(posX - rayon*0.2, posY - cordeLength);
        ctx.moveTo(posX + rayon*0.6, domeTop); // Droite du dôme
        ctx.lineTo(posX + rayon*0.2, posY - cordeLength);
        ctx.stroke();

        // Corde centrale
        ctx.beginPath();
        ctx.moveTo(posX, domeTop); // Centre du dôme
        ctx.lineTo(posX, posY - cordeLength);
        ctx.stroke();
    }
};

// Export pour usage comme module ES6
export default LanternRenderer;

// Export pour usage CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanternRenderer;
}