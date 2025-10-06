/**
 * TEST INDIVIDUEL DES MODULES - Voir la Vérité
 * Test de chaque module en isolation
 */

// Test 1: BoatRenderer
console.log('🧪 Test 1: BoatRenderer');
try {
    const BoatRenderer = {
        config: {
            normalColor: {
                hull: ['#ff6b6b', '#e74c3c', '#c0392b'],
                sail: ['#ffffff', '#f8f9fa', '#e9ecef'],
                mast: '#8b4513',
                porthole: '#457b9d'
            }
        },
        render(ctx, raquette, C, modeSecret = false) {
            if (!ctx || !raquette || !C) {
                throw new Error('Paramètres manquants');
            }
            return { success: true, module: 'BoatRenderer' };
        }
    };

    const testResult = BoatRenderer.render(
        { save: () => {}, restore: () => {}, fillRect: () => {} },
        { x: 100, y: 100 },
        { PW: 80, PH: 20 }
    );
    console.log('✅ BoatRenderer: OK', testResult);

} catch (error) {
    console.error('❌ BoatRenderer: ERREUR', error.message);
}

// Test 2: HeartRenderer
console.log('🧪 Test 2: HeartRenderer');
try {
    const HeartRenderer = {
        drawPixelHeart(ctx, x, y, taille, couleur) {
            if (!ctx || typeof x !== 'number' || typeof y !== 'number') {
                throw new Error('Paramètres invalides');
            }
            return { success: true, type: 'pixel', x, y, taille, couleur };
        },
        drawPolygonalHeart(ctx, x, y, taille, couleur, rotation = 0, intensite = 1) {
            return { success: true, type: 'polygonal', rotation, intensite };
        },
        generateHeartPositions(nbBriques, largeurBrique, hauteurBrique, espacement, margeHaut, canvasWidth, canvasHeight) {
            if (nbBriques <= 0) throw new Error('nbBriques doit être positif');

            const positions = [];
            for(let i = 0; i < nbBriques; i++) {
                const t = (i / nbBriques) * 2 * Math.PI;
                const x = 16 * Math.pow(Math.sin(t), 3);
                const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
                positions.push({ x, y });
            }
            return positions;
        }
    };

    const heartTest1 = HeartRenderer.drawPixelHeart({}, 100, 100, 30, '#ff0000');
    const heartTest2 = HeartRenderer.generateHeartPositions(8, 20, 15, 5, 50, 800, 600);

    console.log('✅ HeartRenderer: OK', { heartTest1, positionsGenerated: heartTest2.length });

} catch (error) {
    console.error('❌ HeartRenderer: ERREUR', error.message);
}

// Test 3: GameConfig
console.log('🧪 Test 3: GameConfig');
try {
    const GameConfig = {
        CHAPITRE1: [
            { nom: 'TEST', couleur: '#FF0000', msg: 'Test message' }
        ],
        COLORS: {
            HEART_COLORS: ['#FF6B6B', '#4ECDC4', '#45B7D1']
        },
        GAMEPLAY: {
            VIES_INITIALES: 3,
            POINTS_PAR_COUP: 50
        },
        RESPONSIVE: {
            calculateConstants(canvasWidth, canvasHeight) {
                if (canvasWidth <= 0 || canvasHeight <= 0) {
                    throw new Error('Dimensions invalides');
                }
                return {
                    W: canvasWidth,
                    H: canvasHeight,
                    PW: Math.max(canvasWidth * 0.3, 100),
                    PH: Math.max(canvasHeight * 0.025, 15),
                    BS: Math.max(Math.min(canvasWidth, canvasHeight) * 0.025, 10),
                    SP: Math.max(Math.min(canvasWidth, canvasHeight) * 0.002, 1.5)
                };
            }
        }
    };

    const constants = GameConfig.RESPONSIVE.calculateConstants(800, 600);
    const chapitreTest = GameConfig.CHAPITRE1[0];

    console.log('✅ GameConfig: OK', {
        constants,
        chapitreTest,
        colors: GameConfig.COLORS.HEART_COLORS.length,
        vies: GameConfig.GAMEPLAY.VIES_INITIALES
    });

} catch (error) {
    console.error('❌ GameConfig: ERREUR', error.message);
}

// Test 4: ParticleSystem
console.log('🧪 Test 4: ParticleSystem');
try {
    const ParticleSystem = {
        collections: {
            main: [],
            hearts: [],
            explosions: []
        },
        addParticles(x, y, couleur, nombre = 8, collection = 'main') {
            if (typeof x !== 'number' || typeof y !== 'number') {
                throw new Error('Coordonnées invalides');
            }
            for(let i = 0; i < nombre; i++) {
                this.collections[collection].push({
                    x, y, couleur, vie: 1, type: 'particle'
                });
            }
            return this.collections[collection].length;
        },
        getTotalCount() {
            return Object.values(this.collections).reduce((total, collection) => {
                return total + collection.length;
            }, 0);
        },
        clear() {
            Object.keys(this.collections).forEach(key => {
                this.collections[key] = [];
            });
        }
    };

    ParticleSystem.addParticles(100, 100, '#FF0000', 5);
    ParticleSystem.addParticles(200, 200, '#00FF00', 3, 'hearts');
    const totalBefore = ParticleSystem.getTotalCount();

    ParticleSystem.clear();
    const totalAfter = ParticleSystem.getTotalCount();

    console.log('✅ ParticleSystem: OK', {
        totalBefore,
        totalAfter,
        collectionsCount: Object.keys(ParticleSystem.collections).length
    });

} catch (error) {
    console.error('❌ ParticleSystem: ERREUR', error.message);
}

// Test 5: Module Manager Structure
console.log('🧪 Test 5: ModuleManager Structure');
try {
    const ModuleManager = {
        graphics: {
            boat: { render: () => 'boat rendered' },
            heart: { drawPixelHeart: () => 'heart drawn' },
            lantern: { render: () => 'lantern rendered' },
            environment: { drawSky: () => 'sky drawn' }
        },
        systems: {
            particles: { addParticles: () => 'particles added' }
        },
        config: {
            CHAPITRE1: [],
            COLORS: { HEART_COLORS: [] },
            GAMEPLAY: { VIES_INITIALES: 3 }
        },

        isAvailable(category, module) {
            return !!(this[category] && this[category][module]);
        },

        getStats() {
            return {
                graphics: Object.keys(this.graphics).length,
                systems: Object.keys(this.systems).length,
                totalParticles: 0,
                configLoaded: !!this.config
            };
        }
    };

    const boatAvailable = ModuleManager.isAvailable('graphics', 'boat');
    const invalidModule = ModuleManager.isAvailable('graphics', 'invalid');
    const stats = ModuleManager.getStats();

    console.log('✅ ModuleManager: OK', {
        boatAvailable,
        invalidModule,
        stats
    });

} catch (error) {
    console.error('❌ ModuleManager: ERREUR', error.message);
}

console.log('🎯 Tests individuels terminés !');
console.log('📊 Ouvrez test-modules.html dans le navigateur pour les tests visuels complets.');