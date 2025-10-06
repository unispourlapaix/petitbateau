/**
 * PARTICLE SYSTEM MODULE - Voir la Vérité
 * Système de particules réutilisable
 */

const ParticleSystem = {
    // Collections de particules
    collections: {
        main: [],
        hearts: [],
        explosions: [],
        floating: []
    },

    /**
     * Ajouter des particules normales
     * @param {number} x - Position X
     * @param {number} y - Position Y
     * @param {string} couleur - Couleur des particules
     * @param {number} nombre - Nombre de particules à créer
     * @param {string} collection - Nom de la collection ('main', 'hearts', etc.)
     */
    addParticles(x, y, couleur, nombre = 8, collection = 'main') {
        const particles = this.collections[collection];

        // Limiter le nombre total de particules pour les performances
        const maxParticules = 200;
        if(particles.length >= maxParticules) {
            particles.splice(0, nombre); // Supprimer les plus anciennes
        }

        for(let i = 0; i < nombre; i++) {
            particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                couleur,
                vie: 1,
                taille: Math.random() * 4 + 2,
                type: 'rond'
            });
        }
    },

    /**
     * Ajouter des particules en forme de cœur qui volent vers le haut
     * @param {number} x - Position X
     * @param {number} y - Position Y
     * @param {string} couleur - Couleur des particules
     * @param {number} nombre - Nombre de particules à créer
     */
    addHeartParticles(x, y, couleur, nombre = 8) {
        const particles = this.collections.hearts;

        // Limiter le nombre total de particules pour les performances
        const maxParticules = 200;
        if(particles.length >= maxParticules) {
            particles.splice(0, nombre); // Supprimer les plus anciennes
        }

        for(let i = 0; i < nombre; i++) {
            particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 6, // Moins de dispersion horizontale
                vy: -(Math.random() * 8 + 4),  // Toujours vers le haut
                couleur,
                vie: 1,
                taille: Math.random() * 3 + 2,
                type: 'coeur'
            });
        }
    },

    /**
     * Mettre à jour toutes les particules
     * @param {boolean} animationBateau - Si l'animation du bateau est active
     */
    update(animationBateau = false) {
        if(animationBateau) return; // Pas de particules pendant l'animation du bateau

        // Mettre à jour chaque collection
        Object.keys(this.collections).forEach(collectionName => {
            this._updateCollection(this.collections[collectionName]);
        });
    },

    /**
     * Mettre à jour une collection de particules
     * @param {Array} particles - Collection de particules
     */
    _updateCollection(particles) {
        for(let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if(p.type === 'coeur') {
                // Cœurs : pas de gravité, continuent vers le haut
                p.vy *= 0.99; // Légère décélération
            } else {
                // Particules normales : gravité
                p.vy += 0.15;
            }

            p.vie -= 0.02;

            // Supprimer les particules qui sortent de l'écran ou qui ont fini leur vie
            if(p.vie <= 0 || p.x < -50 || p.x > window.innerWidth + 50 || p.y < -50 || p.y > window.innerHeight + 50) {
                particles.splice(i, 1);
            }
        }
    },

    /**
     * Dessiner toutes les particules
     * @param {CanvasRenderingContext2D} ctx - Contexte du canvas
     * @param {boolean} animationBateau - Si l'animation du bateau est active
     */
    render(ctx, animationBateau = false) {
        if(animationBateau) return; // Pas de particules pendant l'animation du bateau

        // Dessiner chaque collection
        Object.values(this.collections).forEach(particles => {
            this._renderCollection(ctx, particles);
        });
    },

    /**
     * Dessiner une collection de particules
     * @param {CanvasRenderingContext2D} ctx - Contexte du canvas
     * @param {Array} particles - Collection de particules
     */
    _renderCollection(ctx, particles) {
        particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.vie * 0.8;
            ctx.fillStyle = p.couleur;

            if(p.type === 'coeur') {
                // Dessiner petit cœur
                this._drawHeartParticle(ctx, p);
            } else {
                // Particule ronde normale
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.taille, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        });
    },

    /**
     * Dessiner une particule cœur
     * @param {CanvasRenderingContext2D} ctx - Contexte du canvas
     * @param {Object} p - Particule
     */
    _drawHeartParticle(ctx, p) {
        const taille = p.taille;
        ctx.beginPath();
        // Partie gauche du cœur
        ctx.arc(p.x - taille*0.3, p.y - taille*0.2, taille*0.4, 0, Math.PI, true);
        // Partie droite du cœur
        ctx.arc(p.x + taille*0.3, p.y - taille*0.2, taille*0.4, 0, Math.PI, true);
        // Pointe du cœur
        ctx.lineTo(p.x, p.y + taille*0.6);
        ctx.closePath();
        ctx.fill();
    },

    /**
     * Nettoyer toutes les particules
     */
    clear() {
        Object.keys(this.collections).forEach(collectionName => {
            this.collections[collectionName] = [];
        });
    },

    /**
     * Obtenir le nombre total de particules
     * @returns {number} Nombre total de particules
     */
    getTotalCount() {
        return Object.values(this.collections).reduce((total, collection) => {
            return total + collection.length;
        }, 0);
    },

    /**
     * Créer des particules de feux d'artifice
     * @param {number} x - Position X
     * @param {number} y - Position Y
     * @param {string} couleur - Couleur
     * @param {number} nombre - Nombre de particules
     */
    createFireworks(x, y, couleur, nombre = 15) {
        const particles = this.collections.explosions;

        for(let i = 0; i < nombre; i++) {
            const angle = (i / nombre) * Math.PI * 2;
            const vitesse = Math.random() * 8 + 4;

            particles.push({
                x, y,
                vx: Math.cos(angle) * vitesse,
                vy: Math.sin(angle) * vitesse,
                couleur,
                vie: 1,
                taille: Math.random() * 6 + 3,
                type: 'firework',
                gravite: 0.1,
                scintillement: Math.random() * Math.PI * 2
            });
        }
    }
};

// Export pour usage comme module ES6
export default ParticleSystem;

// Export pour usage CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParticleSystem;
}