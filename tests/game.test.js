/**
 * Tests unitaires pour le module QueteDeVerite (Gestionnaire Principal)
 */

import QueteDeVerite from '../js/modules/game.js';

// Mock des modules
jest.mock('../js/modules/angel.js');
jest.mock('../js/modules/orb.js');
jest.mock('../js/modules/buildings.js');
jest.mock('../js/modules/rpg.js');
jest.mock('../js/modules/ui.js');

describe('QueteDeVerite', () => {
    let game;
    let mockCanvas;

    beforeEach(() => {
        // Mock du canvas
        mockCanvas = {
            getContext: jest.fn(() => ({
                clearRect: jest.fn(),
                fillStyle: '',
                fillRect: jest.fn(),
                createLinearGradient: jest.fn(() => ({
                    addColorStop: jest.fn()
                }))
            })),
            addEventListener: jest.fn(),
            width: 480,
            height: 600
        };

        // Mock de window
        Object.defineProperty(global, 'window', {
            value: {
                innerWidth: 800,
                innerHeight: 1000,
                addEventListener: jest.fn(),
                devicePixelRatio: 1
            },
            writable: true
        });

        game = new QueteDeVerite(mockCanvas);
    });

    describe('Initialisation', () => {
        test('devrait initialiser le jeu correctement', () => {
            expect(game.canvas).toBe(mockCanvas);
            expect(game.ctx).toBeDefined();
            expect(game.gameState.initialized).toBe(true);
            expect(game.gameState.showWelcome).toBe(true);
        });

        test('devrait calculer la taille optimale du canvas', () => {
            const size = game.calculateOptimalSize();
            
            expect(size).toHaveProperty('w');
            expect(size).toHaveProperty('h');
            expect(size.w).toBeGreaterThan(0);
            expect(size.h).toBeGreaterThan(0);
        });

        test('devrait initialiser tous les modules', () => {
            expect(game.angel).toBeDefined();
            expect(game.orb).toBeDefined();
            expect(game.city).toBeDefined();
            expect(game.rpg).toBeDefined();
            expect(game.ui).toBeDefined();
        });
    });

    describe('Gestion des événements', () => {
        test('devrait configurer les événements correctement', () => {
            expect(mockCanvas.addEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function));
            expect(mockCanvas.addEventListener).toHaveBeenCalledWith('touchmove', expect.any(Function));
            expect(mockCanvas.addEventListener).toHaveBeenCalledWith('touchend', expect.any(Function));
            expect(mockCanvas.addEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
            expect(mockCanvas.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
        });

        test('devrait calculer les coordonnées d\'interaction correctement', () => {
            mockCanvas.getBoundingClientRect = jest.fn(() => ({
                left: 10,
                top: 20
            }));

            const mockEvent = {
                clientX: 110,
                clientY: 120
            };

            const coords = game.getInteractionCoords(mockEvent);
            
            expect(coords.x).toBe(100);
            expect(coords.y).toBe(100);
        });
    });

    describe('Redimensionnement', () => {
        test('devrait gérer le redimensionnement de la fenêtre', () => {
            const originalSize = game.size;
            
            // Simuler un changement de taille de fenêtre
            global.window.innerWidth = 1200;
            global.window.innerHeight = 800;
            
            game.handleResize();
            
            // La taille devrait être recalculée
            expect(game.size).not.toEqual(originalSize);
        });

        test('devrait mettre à jour tous les modules lors du redimensionnement', () => {
            game.angel.updateCanvasSize = jest.fn();
            game.orb.updateCanvasSize = jest.fn();
            game.city.updateCanvasSize = jest.fn();
            game.ui.updateCanvasSize = jest.fn();
            
            game.handleResize();
            
            expect(game.angel.updateCanvasSize).toHaveBeenCalled();
            expect(game.orb.updateCanvasSize).toHaveBeenCalled();
            expect(game.city.updateCanvasSize).toHaveBeenCalled();
            expect(game.ui.updateCanvasSize).toHaveBeenCalled();
        });
    });

    describe('Démarrage de quête', () => {
        test('devrait démarrer une nouvelle quête', () => {
            game.angel.reset = jest.fn();
            game.orb.reset = jest.fn();
            game.orb.setActive = jest.fn();
            game.city.reset = jest.fn();
            game.rpg.quest.startQuest = jest.fn();
            game.rpg.hideAllMessages = jest.fn();
            game.ui.triggerQuestTitlePulse = jest.fn();
            
            game.startNewQuest();
            
            expect(game.angel.reset).toHaveBeenCalled();
            expect(game.orb.reset).toHaveBeenCalled();
            expect(game.orb.setActive).toHaveBeenCalledWith(true);
            expect(game.city.reset).toHaveBeenCalled();
            expect(game.rpg.quest.startQuest).toHaveBeenCalled();
            expect(game.gameState.showWelcome).toBe(false);
        });
    });

    describe('Logique de jeu', () => {
        beforeEach(() => {
            // Mock des méthodes nécessaires
            game.rpg.quest.isPlaying = true;
            game.orb.update = jest.fn();
            game.orb.checkBoundaryCollisions = jest.fn();
            game.orb.checkFallOut = jest.fn(() => false);
            game.angel.checkOrbCollision = jest.fn(() => false);
            game.city.checkOrbCollision = jest.fn(() => -1);
            game.city.updateEffects = jest.fn();
            game.ui.update = jest.fn();
        });

        test('devrait mettre à jour la logique du jeu', () => {
            game.update(16);
            
            expect(game.orb.update).toHaveBeenCalled();
            expect(game.orb.checkBoundaryCollisions).toHaveBeenCalled();
            expect(game.angel.checkOrbCollision).toHaveBeenCalled();
            expect(game.city.checkOrbCollision).toHaveBeenCalled();
        });

        test('ne devrait pas mettre à jour si la quête n\'est pas en cours', () => {
            game.rpg.quest.isPlaying = false;
            
            game.update(16);
            
            expect(game.orb.update).not.toHaveBeenCalled();
        });

        test('devrait gérer la collision avec un bâtiment', () => {
            game.city.checkOrbCollision = jest.fn(() => 5);
            game.city.destroyBuilding = jest.fn(() => ({ story: 'Test', reward: 'Test' }));
            game.rpg.onBuildingDestroyed = jest.fn(() => ({ levelUp: false }));
            game.orb.dy = 1;
            
            game.update(16);
            
            expect(game.city.destroyBuilding).toHaveBeenCalledWith(5);
            expect(game.orb.dy).toBe(-1); // Rebond
        });

        test('devrait gérer la chute de l\'orbe', () => {
            game.orb.checkFallOut = jest.fn(() => true);
            game.rpg.onAngelDamaged = jest.fn(() => ({ isDead: false, currentHp: 2 }));
            game.orb.repositionNearPaddle = jest.fn();
            
            game.update(16);
            
            expect(game.rpg.onAngelDamaged).toHaveBeenCalled();
            expect(game.orb.repositionNearPaddle).toHaveBeenCalled();
        });
    });

    describe('Rendu', () => {
        test('devrait effectuer le rendu complet', () => {
            game.ctx.clearRect = jest.fn();
            game.city.draw = jest.fn();
            game.angel.draw = jest.fn();
            game.orb.draw = jest.fn();
            game.ui.draw = jest.fn();
            
            game.render(1000);
            
            expect(game.ctx.clearRect).toHaveBeenCalled();
            expect(game.ui.draw).toHaveBeenCalled();
            expect(game.city.draw).toHaveBeenCalled();
            expect(game.angel.draw).toHaveBeenCalled();
            expect(game.orb.draw).toHaveBeenCalled();
        });

        test('devrait dessiner le ciel', () => {
            game.ctx.createLinearGradient = jest.fn(() => ({
                addColorStop: jest.fn()
            }));
            game.ctx.fillRect = jest.fn();
            
            game.drawSky();
            
            expect(game.ctx.createLinearGradient).toHaveBeenCalled();
            expect(game.ctx.fillRect).toHaveBeenCalled();
        });
    });

    describe('État du jeu', () => {
        test('devrait retourner l\'état correct pour l\'UI', () => {
            // Mock des propriétés nécessaires
            game.rpg.quest.title = 'Test Quest';
            game.rpg.quest.progress = 5;
            game.rpg.quest.total = 10;
            game.angel.name = 'Test Angel';
            game.angel.level = 2;
            game.angel.exp = 75;
            game.angel.centerX = 240;
            game.angel.centerY = 300;
            game.angel.getStatsForUI = jest.fn(() => ({ hearts: '❤️❤️🖤' }));
            
            const state = game.getGameStateForUI();
            
            expect(state.quest.title).toBe('Test Quest');
            expect(state.quest.progress).toBe(5);
            expect(state.quest.total).toBe(10);
            expect(state.angel.name).toBe('Test Angel');
            expect(state.angel.level).toBe(2);
            expect(state.angel.exp).toBe(75);
        });

        test('devrait retourner les statistiques de performance', () => {
            const stats = game.getPerformanceStats();
            
            expect(stats).toHaveProperty('fps');
            expect(stats).toHaveProperty('frameCount');
            expect(stats).toHaveProperty('canvasSize');
            expect(stats).toHaveProperty('gameInitialized');
        });
    });

    describe('Callbacks RPG', () => {
        test('devrait gérer la completion de quête', () => {
            game.orb.setActive = jest.fn();
            game.ui.triggerQuestTitlePulse = jest.fn();
            
            game.onQuestComplete();
            
            expect(game.orb.setActive).toHaveBeenCalledWith(false);
            expect(game.gameState.showWelcome).toBe(true);
            expect(game.ui.triggerQuestTitlePulse).toHaveBeenCalled();
        });

        test('devrait gérer l\'échec de quête', () => {
            game.orb.setActive = jest.fn();
            
            game.onQuestFail();
            
            expect(game.orb.setActive).toHaveBeenCalledWith(false);
            expect(game.gameState.showWelcome).toBe(true);
        });
    });
});

// Tests d'intégration
describe('QueteDeVerite - Intégration', () => {
    let game;
    let mockCanvas;

    beforeEach(() => {
        mockCanvas = {
            getContext: jest.fn(() => ({
                clearRect: jest.fn(),
                fillStyle: '',
                fillRect: jest.fn(),
                createLinearGradient: jest.fn(() => ({
                    addColorStop: jest.fn()
                }))
            })),
            addEventListener: jest.fn(),
            width: 480,
            height: 600
        };

        global.window = {
            innerWidth: 800,
            innerHeight: 1000,
            addEventListener: jest.fn(),
            devicePixelRatio: 1
        };

        game = new QueteDeVerite(mockCanvas);
    });

    test('devrait simuler une partie complète', () => {
        // Mock des méthodes nécessaires
        game.angel.reset = jest.fn();
        game.orb.reset = jest.fn();
        game.orb.setActive = jest.fn();
        game.orb.update = jest.fn();
        game.orb.checkBoundaryCollisions = jest.fn();
        game.orb.checkFallOut = jest.fn(() => false);
        game.angel.checkOrbCollision = jest.fn(() => false);
        game.city.reset = jest.fn();
        game.city.checkOrbCollision = jest.fn();
        game.city.destroyBuilding = jest.fn();
        game.city.updateEffects = jest.fn();
        game.rpg.quest.startQuest = jest.fn();
        game.rpg.quest.isPlaying = true;
        game.rpg.quest.progress = 0;
        game.rpg.quest.total = 10;
        game.rpg.hideAllMessages = jest.fn();
        game.rpg.onBuildingDestroyed = jest.fn(() => ({ levelUp: false }));
        game.ui.triggerQuestTitlePulse = jest.fn();
        game.ui.update = jest.fn();
        game.ui.draw = jest.fn();
        
        // Démarrer une nouvelle quête
        game.startNewQuest();
        expect(game.gameState.showWelcome).toBe(false);
        
        // Simuler la mise à jour du jeu
        game.update(16);
        
        // Vérifier que tous les systèmes sont actifs
        expect(game.orb.update).toHaveBeenCalled();
        expect(game.city.updateEffects).toHaveBeenCalled();
    });
});

export { QueteDeVerite };