/**
 * Saison Effect Module - Effets saisonniers et objets kawaii
 * Neige, vent, tempête avec 8 types d'objets kawaii
 * @version 1.0.0
 * @author Emmanuel Payet (Dreamer Unisa)
 */

class SaisonEffectModule {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        // État du module
        this.isActive = false;
        this.currentSeason = 'spring'; // spring, summer, autumn, winter
        this.weatherMode = 'calm'; // calm, wind, storm, snow

        // Particules météo
        this.weatherParticles = [];

        // Utiliser le vrai module kawaii pour les objets
        this.kawaiiObjects = null;
        if (typeof KawaiiObjectsModule !== 'undefined') {
            this.kawaiiObjects = new KawaiiObjectsModule(canvas, ctx);
            console.log('🌸 SaisonEffect utilise les vrais objets kawaii - Brian attention ! 💕');
        } else {
            console.warn('⚠️ KawaiiObjectsModule non trouvé - pas d\'objets kawaii');
        }

        // Types d'objets kawaii (8 types)
        this.kawaiiTypes = ['heart', 'star', 'cloud', 'flower', 'butterfly', 'rainbow', 'cat', 'sparkle'];

        // Configuration par saison
        this.seasonConfig = {
            spring: {
                colors: ['#FFB6C1', '#98FB98', '#87CEEB', '#DDA0DD'],
                kawaiiTypes: ['flower', 'butterfly', 'heart'],
                weatherIntensity: 0.3,
                kawaiiSpawnRate: 0.995
            },
            summer: {
                colors: ['#FFD700', '#FF6347', '#87CEEB', '#98FB98'],
                kawaiiTypes: ['star', 'sparkle', 'rainbow'],
                weatherIntensity: 0.2,
                kawaiiSpawnRate: 0.992
            },
            autumn: {
                colors: ['#FF8C00', '#CD853F', '#A0522D', '#DAA520'],
                kawaiiTypes: ['star', 'cloud', 'cat'],
                weatherIntensity: 0.6,
                kawaiiSpawnRate: 0.996
            },
            winter: {
                colors: ['#FFFFFF', '#E6E6FA', '#87CEEB', '#B0E0E6'],
                kawaiiTypes: ['sparkle', 'star', 'cloud'],
                weatherIntensity: 0.8,
                kawaiiSpawnRate: 0.994
            }
        };

        // Configuration des effets météo
        this.weatherConfig = {
            snow: {
                particleCount: 80,
                speed: [1, 3],
                size: [2, 8],
                drift: 0.5,
                opacity: [0.3, 0.9]
            },
            wind: {
                particleCount: 40,
                speed: [3, 8],
                size: [1, 4],
                drift: 2.0,
                opacity: [0.2, 0.6]
            },
            storm: {
                particleCount: 120,
                speed: [5, 12],
                size: [1, 6],
                drift: 3.0,
                opacity: [0.4, 0.8]
            }
        };

        // Configuration objets kawaii
        this.kawaiiConfig = {
            maxObjects: 8,
            spawnRate: 0.995,
            speed: [0.8, 2.0],
            size: [15, 30],
            floatAmplitude: 8,
            lifespan: 15000 // 15 secondes
        };

        console.log('🌨️ SaisonEffect Module initialisé - Effets saisonniers prêts ! ❄️');
    }

    // Activer le module avec une saison et météo
    activate(season = 'spring', weather = 'calm') {
        this.isActive = true;
        this.currentSeason = season;
        this.weatherMode = weather;

        // Nettoyer les anciens effets
        this.weatherParticles = [];
        if (this.kawaiiObjects) {
            this.kawaiiObjects.clear();
        }

        console.log(`🌟 Saison activée: ${season} avec météo: ${weather}`);
        this.configureKawaiiForSeason();
        this.generateInitialEffects();
    }

    // Désactiver le module
    deactivate() {
        this.isActive = false;
        this.weatherParticles = [];
        if (this.kawaiiObjects) {
            this.kawaiiObjects.clear();
        }
        console.log('🛑 Effets saisonniers désactivés');
    }

    // Changer de saison
    setSeason(season) {
        if (this.seasonConfig[season]) {
            this.currentSeason = season;
            console.log(`🌸 Saison changée vers: ${season}`);
            this.configureKawaiiForSeason();
            this.generateInitialEffects();
        }
    }

    // Changer la météo
    setWeather(weather) {
        this.weatherMode = weather;
        console.log(`🌦️ Météo changée vers: ${weather}`);
        this.generateInitialEffects();
    }

    // Générer les effets initiaux
    generateInitialEffects() {
        const C = { W: this.canvas.width, H: this.canvas.height };

        // Générer les particules météo selon le mode
        if (this.weatherMode !== 'calm') {
            const config = this.weatherConfig[this.weatherMode];
            if (config) {
                for (let i = 0; i < config.particleCount; i++) {
                    this.createWeatherParticle();
                }
            }
        }
    }

    // Créer une particule météo
    createWeatherParticle() {
        const C = { W: this.canvas.width, H: this.canvas.height };
        const config = this.weatherConfig[this.weatherMode];
        if (!config) return;

        const particle = {
            x: Math.random() * (C.W + 100) - 50,
            y: Math.random() * (C.H + 100) - 100,
            vx: (Math.random() - 0.5) * config.drift,
            vy: config.speed[0] + Math.random() * (config.speed[1] - config.speed[0]),
            size: config.size[0] + Math.random() * (config.size[1] - config.size[0]),
            opacity: config.opacity[0] + Math.random() * (config.opacity[1] - config.opacity[0]),
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            type: this.weatherMode,
            life: Math.random() * 1000 + 500
        };

        this.weatherParticles.push(particle);
    }

    // Configurer le module kawaii pour la saison
    configureKawaiiForSeason() {
        if (!this.kawaiiObjects) return;

        const season = this.seasonConfig[this.currentSeason];

        // Ajuster la configuration selon la saison
        this.kawaiiObjects.setConfig({
            maxObjects: Math.floor(8 * season.weatherIntensity + 2), // Plus d'objets en hiver/automne
            spawnRate: season.kawaiiSpawnRate,
            speed: 1.0 + season.weatherIntensity * 0.5 // Plus rapide avec météo intense
        });
    }

    // Obtenir une couleur kawaii saisonnière
    getSeasonalKawaiiColor(type) {
        const seasonColors = this.seasonConfig[this.currentSeason].colors;

        const typeColors = {
            'heart': ['#FF69B4', '#FF1493', '#FFB6C1'],
            'star': ['#FFD700', '#FFFF66', '#FFA500'],
            'cloud': ['#FFFFFF', '#F0F8FF', '#E6E6FA'],
            'flower': ['#FF69B4', '#DA70D6', '#FF6347'],
            'butterfly': ['#9370DB', '#8A2BE2', '#BA55D3'],
            'rainbow': ['#FF0080', '#FF8000', '#FFFF00'],
            'cat': ['#FFB6C1', '#FFC0CB', '#F0E68C'],
            'sparkle': ['#FFD700', '#87CEEB', '#DA70D6']
        };

        // Mélanger les couleurs de type avec les couleurs saisonnières
        const baseColors = typeColors[type] || ['#FF69B4'];
        const mixedColors = [...baseColors, ...seasonColors];

        return mixedColors[Math.floor(Math.random() * mixedColors.length)];
    }

    // Mettre à jour tous les effets
    update() {
        if (!this.isActive) return;

        // Mettre à jour les particules météo
        this.updateWeatherParticles();

        // Mettre à jour les objets kawaii avec le vrai module
        if (this.kawaiiObjects) {
            this.kawaiiObjects.update();
        }

        // Générer de nouveaux effets météo
        this.spawnNewWeatherEffects();
    }

    // Mettre à jour les particules météo
    updateWeatherParticles() {
        const C = { W: this.canvas.width, H: this.canvas.height };

        for (let i = this.weatherParticles.length - 1; i >= 0; i--) {
            const particle = this.weatherParticles[i];

            // Mouvement
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.rotation += particle.rotationSpeed;
            particle.life--;

            // Effets spéciaux selon le type
            if (particle.type === 'snow') {
                particle.x += Math.sin(particle.y * 0.01) * 0.3;
            } else if (particle.type === 'storm') {
                particle.vx += (Math.random() - 0.5) * 0.1;
            }

            // Supprimer si hors écran ou mort
            if (particle.y > C.H + 50 || particle.x < -50 || particle.x > C.W + 50 || particle.life <= 0) {
                this.weatherParticles.splice(i, 1);
            }
        }
    }

    // Générer de nouvelles particules météo
    spawnNewWeatherEffects() {
        // Générer des particules météo seulement
        if (this.weatherMode !== 'calm') {
            const config = this.weatherConfig[this.weatherMode];
            if (config && this.weatherParticles.length < config.particleCount) {
                if (Math.random() > 0.95) {
                    this.createWeatherParticle();
                }
            }
        }
        // Les objets kawaii sont gérés par le KawaiiObjectsModule directement
    }

    // Dessiner tous les effets
    render() {
        if (!this.isActive) return;

        this.ctx.save();

        // Dessiner les particules météo
        this.renderWeatherParticles();

        // Dessiner les vrais objets kawaii détaillés
        if (this.kawaiiObjects) {
            this.kawaiiObjects.render();
        }

        this.ctx.restore();
    }

    // Dessiner les particules météo
    renderWeatherParticles() {
        for (let particle of this.weatherParticles) {
            this.ctx.save();
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation);
            this.ctx.globalAlpha = particle.opacity;

            if (particle.type === 'snow') {
                // Flocon de neige
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.shadowColor = '#87CEEB';
                this.ctx.shadowBlur = 3;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
                this.ctx.fill();

                // Détails du flocon
                this.ctx.strokeStyle = '#E6E6FA';
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    this.ctx.save();
                    this.ctx.rotate(i * Math.PI / 3);
                    this.ctx.moveTo(0, 0);
                    this.ctx.lineTo(0, -particle.size);
                    this.ctx.restore();
                }
                this.ctx.stroke();

            } else if (particle.type === 'wind') {
                // Particule de vent
                this.ctx.strokeStyle = '#87CEEB';
                this.ctx.lineWidth = particle.size;
                this.ctx.lineCap = 'round';
                this.ctx.beginPath();
                this.ctx.moveTo(-10, 0);
                this.ctx.lineTo(10, 0);
                this.ctx.stroke();

            } else if (particle.type === 'storm') {
                // Particule de tempête
                this.ctx.fillStyle = '#696969';
                this.ctx.shadowColor = '#2F4F4F';
                this.ctx.shadowBlur = 2;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
            }

            this.ctx.restore();
        }
    }

    // Les objets kawaii sont maintenant dessinés par le KawaiiObjectsModule directement
    // Plus besoin de méthodes de rendu personnalisées !


    // API publique
    getState() {
        return {
            isActive: this.isActive,
            season: this.currentSeason,
            weather: this.weatherMode,
            weatherParticleCount: this.weatherParticles.length,
            kawaiiObjectCount: this.kawaiiObjects ? this.kawaiiObjects.getObjectCount() : 0,
            kawaiiObjectsModule: !!this.kawaiiObjects
        };
    }

    // Obtenir les informations sur les saisons disponibles
    getAvailableSeasons() {
        return Object.keys(this.seasonConfig);
    }

    getAvailableWeather() {
        return ['calm', ...Object.keys(this.weatherConfig)];
    }
}

// Export du module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SaisonEffectModule;
} else {
    window.SaisonEffectModule = SaisonEffectModule;
}

console.log('🌨️ SaisonEffect Module chargé - Effets saisonniers et kawaii prêts ! ❄️🌸☀️🍂');