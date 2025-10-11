/**
 * ENVIRONMENT RENDERER MODULE - Petit Bateau
 * Module pour le rendu de l'environnement (ciel, mer, etc.)
 */

const EnvironmentRenderer = {
    // === MÉTADONNÉES MODULE ===
    moduleId: 'VDV_GFX_ENV_004',
    family: 'GRAPHICS_SYSTEMS',
    category: 'BACKGROUND_RENDERER',
    description: 'Moteur de rendu de l\'environnement (ciel, mer, requins) avec variations par chapitre',
    version: '1.0.0',
    dependencies: [],

    /**
     * Dessiner le ciel complet
     * @param {CanvasRenderingContext2D} ctx - Contexte du canvas
     * @param {Object} C - Constantes du jeu
     * @param {number} chapitre - Chapitre actuel (1 ou 2)
     * @param {number} brises - Nombre de briques cassées
     * @param {Object} VOYAGE - Données du voyage
     * @param {Object} soleil - État du soleil
     * @param {boolean} animationBateau - Si l'animation du bateau est active
     */
    drawSky(ctx, C, chapitre, brises, VOYAGE, soleil, animationBateau) {
        const temps = Date.now() * 0.0003;

        // Ne pas dessiner le soleil pendant l'animation du bateau
        if(animationBateau) return;

        if(chapitre === 1) {
            this._drawSun(ctx, C, brises, VOYAGE, soleil);
        } else {
            this._drawMoon(ctx, C);
        }

        // Nuages selon le chapitre
        this._drawClouds(ctx, C, chapitre, temps);
    },

    /**
     * Dessiner la mer
     * @param {CanvasRenderingContext2D} ctx - Contexte du canvas
     * @param {Object} C - Constantes du jeu
     * @param {number} chapitre - Chapitre actuel
     */
    drawSea(ctx, C, chapitre) {
        const temps = Date.now() * 0.0005;
        const merY = C.H - 60;

        // Couleur de la mer selon le chapitre
        const merGrad = ctx.createLinearGradient(0, merY, 0, C.H);
        if(chapitre === 1) {
            // Mer bleue paisible
            merGrad.addColorStop(0, 'rgba(70, 130, 180, 0.8)');
            merGrad.addColorStop(0.5, 'rgba(100, 150, 200, 0.9)');
            merGrad.addColorStop(1, 'rgba(30, 100, 140, 0.95)');
        } else {
            // Mer sombre et menaçante
            merGrad.addColorStop(0, 'rgba(47, 79, 79, 0.9)');
            merGrad.addColorStop(0.5, 'rgba(25, 25, 112, 0.95)');
            merGrad.addColorStop(1, 'rgba(0, 0, 139, 0.98)');
        }
        ctx.fillStyle = merGrad;
        ctx.fillRect(0, merY, C.W, C.H - merY);

        // Vagues selon le chapitre
        this._drawWaves(ctx, C, chapitre, merY, temps);

        // Ailerons de requin dans le chapitre 2
        if(chapitre === 2) {
            this._drawSharks(ctx, C, merY, temps);
        }
    },

    /**
     * Dessiner le soleil (chapitre 1)
     */
    _drawSun(ctx, C, brises, VOYAGE, soleil) {
        const soleilX = C.W * 0.8;
        const soleilY = C.H * 0.15;
        const soleilR = Math.min(C.W, C.H) * 0.06;

        // Corps du soleil
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(soleilX, soleilY, soleilR, 0, Math.PI * 2);
        ctx.fill();

        // Rayons du soleil
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        for(let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const x1 = soleilX + Math.cos(angle) * (soleilR + 5);
            const y1 = soleilY + Math.sin(angle) * (soleilR + 5);
            const x2 = soleilX + Math.cos(angle) * (soleilR + 15);
            const y2 = soleilY + Math.sin(angle) * (soleilR + 15);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }

        // Visage du soleil
        this._drawSunFace(ctx, soleilX, soleilY, soleilR, brises, VOYAGE, soleil);
    },

    /**
     * Dessiner le visage du soleil
     */
    _drawSunFace(ctx, soleilX, soleilY, soleilR, brises, VOYAGE, soleil) {
        // Vérifier si le soleil fait un clin d'œil
        const tempsClignotement = Date.now() - soleil.tempsClignotement;
        const faitClinOeil = soleil.clignotement && tempsClignotement < 2000;

        // Arrêter le clignotement après 2 secondes
        if(tempsClignotement > 2000) {
            soleil.clignotement = false;
        }

        if(brises >= VOYAGE.length) {
            // Soleil paisible et bienveillant à la fin
            ctx.fillStyle = '#FF8C00';
            ctx.strokeStyle = '#FF8C00';
            ctx.lineWidth = 3;
            ctx.beginPath();
            // Yeux fermés paisibles en forme de croissants
            ctx.arc(soleilX - soleilR*0.3, soleilY - soleilR*0.15, soleilR*0.15, 0.3, Math.PI - 0.3);
            ctx.arc(soleilX + soleilR*0.3, soleilY - soleilR*0.15, soleilR*0.15, 0.3, Math.PI - 0.3);
            ctx.stroke();

            // Sourire doux et modéré
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(soleilX, soleilY + soleilR*0.2, soleilR*0.3, 0.2, Math.PI - 0.2);
            ctx.stroke();
        } else if(brises > 0) {
            // Soleil qui commence à sourire
            ctx.fillStyle = '#FF8C00';
            ctx.beginPath();

            if(faitClinOeil) {
                // Clin d'œil ! Œil gauche fermé, œil droit ouvert
                ctx.strokeStyle = '#FF8C00';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(soleilX - soleilR*0.3, soleilY - soleilR*0.2, soleilR*0.15, 0.3, Math.PI - 0.3);
                ctx.stroke();

                // Œil droit ouvert (normal)
                ctx.fillStyle = '#FF8C00';
                ctx.beginPath();
                ctx.arc(soleilX + soleilR*0.3, soleilY - soleilR*0.2, soleilR*0.15, 0, Math.PI * 2);
                ctx.fill();

                // Sourire extra large pour le clin d'œil
                ctx.strokeStyle = '#FF8C00';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(soleilX, soleilY + soleilR*0.1, soleilR*0.5, 0, Math.PI);
                ctx.stroke();
            } else {
                // Yeux normaux
                ctx.arc(soleilX - soleilR*0.3, soleilY - soleilR*0.2, soleilR*0.15, 0, Math.PI * 2);
                ctx.arc(soleilX + soleilR*0.3, soleilY - soleilR*0.2, soleilR*0.15, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#FF8C00';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(soleilX, soleilY + soleilR*0.1, soleilR*0.4, 0, Math.PI);
                ctx.stroke();
            }
        } else {
            // Soleil qui boude au début
            ctx.fillStyle = '#FF8C00';
            ctx.beginPath();
            ctx.arc(soleilX - soleilR*0.3, soleilY - soleilR*0.1, soleilR*0.1, 0, Math.PI * 2);
            ctx.arc(soleilX + soleilR*0.3, soleilY - soleilR*0.1, soleilR*0.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#FF8C00';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(soleilX, soleilY + soleilR*0.3, soleilR*0.3, Math.PI, 0, true);
            ctx.stroke();
        }
    },

    /**
     * Dessiner la lune (chapitre 2)
     */
    _drawMoon(ctx, C) {
        const luneX = C.W * 0.2;
        const luneY = C.H * 0.15;
        const luneR = Math.min(C.W, C.H) * 0.06;

        // Corps de la lune
        ctx.fillStyle = '#E6E6FA';
        ctx.beginPath();
        ctx.arc(luneX, luneY, luneR, 0, Math.PI * 2);
        ctx.fill();

        // Ombre de la lune (croissant)
        ctx.fillStyle = '#B0C4DE';
        ctx.beginPath();
        ctx.arc(luneX + luneR * 0.3, luneY, luneR * 0.8, 0, Math.PI * 2);
        ctx.fill();

        // Halo lunaire
        const haloGrad = ctx.createRadialGradient(luneX, luneY, luneR, luneX, luneY, luneR * 2);
        haloGrad.addColorStop(0, 'rgba(230, 230, 250, 0.3)');
        haloGrad.addColorStop(1, 'rgba(230, 230, 250, 0)');
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(luneX, luneY, luneR * 2, 0, Math.PI * 2);
        ctx.fill();

        // Visage de la lune inquiétante
        ctx.fillStyle = '#8B8B8B';
        // Yeux sombres et inquiets
        ctx.beginPath();
        ctx.arc(luneX - luneR*0.3, luneY - luneR*0.1, luneR*0.12, 0, Math.PI * 2);
        ctx.arc(luneX + luneR*0.3, luneY - luneR*0.1, luneR*0.12, 0, Math.PI * 2);
        ctx.fill();

        // Sourire malsain
        ctx.strokeStyle = '#696969';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(luneX, luneY + luneR*0.2, luneR*0.3, 0, Math.PI);
        ctx.stroke();
    },

    /**
     * Dessiner les nuages
     */
    _drawClouds(ctx, C, chapitre, temps) {
        if(chapitre === 1) {
            // Nuages blancs paisibles
            const nuages = [
                { x: 0.2, y: 0.2, taille: 0.8, vitesse: 1 },
                { x: 0.6, y: 0.25, taille: 1, vitesse: 0.7 },
                { x: 0.1, y: 0.35, taille: 0.6, vitesse: 1.2 }
            ];

            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.strokeStyle = 'rgba(200, 200, 200, 0.6)';
            ctx.lineWidth = 2;

            nuages.forEach(nuage => {
                const nuageX = (C.W * nuage.x + temps * nuage.vitesse * 50) % (C.W + 100) - 50;
                const nuageY = C.H * nuage.y;
                const taille = Math.min(C.W, C.H) * 0.04 * nuage.taille;

                for(let i = 0; i < 3; i++) {
                    const offsetX = (i - 1) * taille * 0.8;
                    const rayonNuage = taille * (0.8 + i * 0.1);
                    ctx.beginPath();
                    ctx.arc(nuageX + offsetX, nuageY, rayonNuage, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                }
            });
        } else {
            // Nuages d'orage gris avec éclairs
            this._drawStormClouds(ctx, C, temps);
        }
    },

    /**
     * Dessiner les nuages d'orage
     */
    _drawStormClouds(ctx, C, temps) {
        const nuagesOrage = [
            { x: 0.3, y: 0.25, taille: 1.2, vitesse: 0.8 },
            { x: 0.7, y: 0.2, taille: 1.5, vitesse: 0.5 },
            { x: 0.1, y: 0.3, taille: 1.0, vitesse: 1.0 }
        ];

        nuagesOrage.forEach(nuage => {
            const nuageX = (C.W * nuage.x + temps * nuage.vitesse * 30) % (C.W + 150) - 75;
            const nuageY = C.H * nuage.y;
            const taille = Math.min(C.W, C.H) * 0.05 * nuage.taille;

            // Nuages gris menaçants
            ctx.fillStyle = 'rgba(80, 80, 80, 0.9)';
            ctx.strokeStyle = 'rgba(60, 60, 60, 0.8)';
            ctx.lineWidth = 2;

            for(let i = 0; i < 4; i++) {
                const offsetX = (i - 1.5) * taille * 0.6;
                const rayonNuage = taille * (0.7 + i * 0.1);
                ctx.beginPath();
                ctx.arc(nuageX + offsetX, nuageY, rayonNuage, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }

            // Éclairs occasionnels
            if(Math.random() < 0.02) {
                ctx.strokeStyle = '#FFFF00';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(nuageX, nuageY + taille);
                ctx.lineTo(nuageX + (Math.random() - 0.5) * 60, nuageY + taille + Math.random() * 80);
                ctx.lineTo(nuageX + (Math.random() - 0.5) * 40, nuageY + taille + Math.random() * 120);
                ctx.stroke();
            }
        });
    },

    /**
     * Dessiner les vagues
     */
    _drawWaves(ctx, C, chapitre, merY, temps) {
        // Vagues selon le chapitre
        if(chapitre === 1) {
            // Vagues paisibles
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 2;
        } else {
            // Vagues agitées
            ctx.strokeStyle = 'rgba(200, 200, 200, 0.4)';
            ctx.lineWidth = 3;
        }

        // Lignes de vagues
        for(let ligne = 0; ligne < 3; ligne++) {
            const y = merY + ligne * 15;
            const amplitude = chapitre === 1 ? (8 - ligne * 2) : (12 - ligne * 3);
            const fréquence = 0.01 + ligne * 0.005;
            const vitesse = chapitre === 1 ? 1 : 1.5;
            const offset = temps * vitesse * (1 + ligne * 0.3);

            ctx.beginPath();
            for(let x = 0; x <= C.W; x += 10) {
                const vague = Math.sin(x * fréquence + offset) * amplitude;
                if(x === 0) ctx.moveTo(x, y + vague);
                else ctx.lineTo(x, y + vague);
            }
            ctx.stroke();
        }
    },

    /**
     * Dessiner les ailerons de requin
     */
    _drawSharks(ctx, C, merY, temps) {
        const requins = [
            { x: 0.2, vitesse: 0.3, taille: 1.0 },
            { x: 0.6, vitesse: 0.5, taille: 0.8 },
            { x: 0.9, vitesse: 0.4, taille: 1.2 }
        ];

        requins.forEach(requin => {
            const reqX = (C.W * requin.x + temps * requin.vitesse * 80) % (C.W + 100) - 50;
            const reqY = merY + 25 + Math.sin(temps * 2 + requin.x * 10) * 8;
            const taille = Math.min(C.W, C.H) * 0.03 * requin.taille;

            // Aileron de requin
            ctx.fillStyle = '#2F4F4F';
            ctx.strokeStyle = '#1C1C1C';
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.moveTo(reqX - taille*0.5, reqY + taille*0.8); // Base gauche
            ctx.lineTo(reqX, reqY - taille); // Pointe
            ctx.lineTo(reqX + taille*0.3, reqY + taille*0.5); // Base droite
            ctx.lineTo(reqX - taille*0.2, reqY + taille*0.8); // Retour base
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Sillage du requin
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(reqX - taille, reqY + taille*0.5);
            ctx.lineTo(reqX - taille*2, reqY + taille*0.3);
            ctx.stroke();
        });
    }
};

// Export pour usage comme module ES6
export default EnvironmentRenderer;

// Export pour usage CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnvironmentRenderer;
}