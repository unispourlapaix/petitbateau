/**
 * Tests unitaires pour le module AngeGardien
 */

import AngeGardien from '../js/modules/angel.js';

// Mock du canvas pour les tests
const mockCanvas = { width: 480, height: 600 };

describe('AngeGardien', () => {
    let angel;

    beforeEach(() => {
        angel = new AngeGardien(mockCanvas.width, mockCanvas.height);
    });

    describe('Initialisation', () => {
        test('devrait initialiser avec les bonnes valeurs par défaut', () => {
            expect(angel.level).toBe(1);
            expect(angel.exp).toBe(0);
            expect(angel.hp).toBe(3);
            expect(angel.maxHp).toBe(3);
            expect(angel.name).toBe('Ange Gardien');
        });

        test('devrait positionner la raquette correctement', () => {
            expect(angel.paddle.x).toBe(mockCanvas.width / 2 - 50);
            expect(angel.paddle.y).toBe(mockCanvas.height - 90);
            expect(angel.paddle.w).toBe(100);
            expect(angel.paddle.h).toBe(70);
        });

        test('devrait calculer le centre correctement', () => {
            expect(angel.centerX).toBe(angel.paddle.x + 50);
            expect(angel.centerY).toBe(angel.paddle.y + 25);
        });
    });

    describe('Mouvement', () => {
        test('devrait déplacer l\'ange vers une position donnée', () => {
            angel.moveTo(200);
            expect(angel.paddle.x).toBe(150); // 200 - paddle.w/2
        });

        test('ne devrait pas sortir du bord gauche', () => {
            angel.moveTo(-100);
            expect(angel.paddle.x).toBe(0);
        });

        test('ne devrait pas sortir du bord droit', () => {
            angel.moveTo(mockCanvas.width + 100);
            expect(angel.paddle.x).toBe(mockCanvas.width - angel.paddle.w);
        });
    });

    describe('Système d\'expérience', () => {
        test('devrait gagner de l\'expérience', () => {
            const result = angel.gainExp(50);
            expect(angel.exp).toBe(50);
            expect(result.leveledUp).toBe(false);
            expect(result.currentLevel).toBe(1);
        });

        test('devrait monter de niveau à 100 EXP', () => {
            angel.gainExp(100);
            expect(angel.level).toBe(2);
            expect(angel.exp).toBe(0);
            expect(angel.hp).toBe(3); // HP déjà au max
        });

        test('devrait régénérer les HP en montant de niveau', () => {
            angel.stats.hp = 2; // Réduire les HP
            angel.gainExp(100);
            expect(angel.level).toBe(2);
            expect(angel.hp).toBe(3); // HP régénérés
        });
    });

    describe('Système de combat', () => {
        test('devrait perdre des HP lors de dégâts', () => {
            const result = angel.takeDamage();
            expect(angel.hp).toBe(2);
            expect(result.isDead).toBe(false);
            expect(result.currentHp).toBe(2);
        });

        test('devrait mourir à 0 HP', () => {
            angel.stats.hp = 1;
            const result = angel.takeDamage();
            expect(angel.hp).toBe(0);
            expect(result.isDead).toBe(true);
        });
    });

    describe('Collision avec orbe', () => {
        test('devrait détecter une collision proche', () => {
            const orb = {
                x: angel.centerX,
                y: angel.centerY - 20,
                r: 10,
                dx: 1,
                dy: 1
            };
            
            const collision = angel.checkOrbCollision(orb);
            expect(collision).toBe(true);
            expect(orb.dy).toBeLessThan(0); // L'orbe doit rebondir vers le haut
        });

        test('ne devrait pas détecter de collision lointaine', () => {
            const orb = {
                x: angel.centerX + 100,
                y: angel.centerY + 100,
                r: 10,
                dx: 1,
                dy: 1
            };
            
            const collision = angel.checkOrbCollision(orb);
            expect(collision).toBe(false);
        });
    });

    describe('Redimensionnement du canvas', () => {
        test('devrait mettre à jour les dimensions et repositionner', () => {
            const newWidth = 600;
            const newHeight = 800;
            
            angel.updateCanvasSize(newWidth, newHeight);
            
            expect(angel.canvas.width).toBe(newWidth);
            expect(angel.canvas.height).toBe(newHeight);
            expect(angel.paddle.y).toBe(newHeight - 90);
        });
    });

    describe('Réinitialisation', () => {
        test('devrait remettre à zéro toutes les statistiques', () => {
            // Modifier l'état de l'ange
            angel.gainExp(75);
            angel.takeDamage();
            angel.moveTo(300);
            
            // Réinitialiser
            angel.reset();
            
            // Vérifier que tout est remis à zéro
            expect(angel.level).toBe(1);
            expect(angel.exp).toBe(0);
            expect(angel.hp).toBe(3);
            expect(angel.maxHp).toBe(3);
            expect(angel.paddle.x).toBe(mockCanvas.width / 2 - 50);
            expect(angel.touching).toBe(false);
        });
    });

    describe('Interface utilisateur', () => {
        test('devrait retourner les bonnes statistiques pour l\'UI', () => {
            angel.stats.hp = 2;
            const stats = angel.getStatsForUI();
            
            expect(stats.name).toBe('Ange Gardien');
            expect(stats.level).toBe(1);
            expect(stats.exp).toBe(0);
            expect(stats.hp).toBe(2);
            expect(stats.maxHp).toBe(3);
            expect(stats.hearts).toBe('❤️❤️🖤');
        });
    });

    describe('Gestion tactile', () => {
        test('devrait commencer le toucher', () => {
            angel.startTouch(250);
            expect(angel.touching).toBe(true);
            expect(angel.paddle.x).toBe(200); // 250 - paddle.w/2
        });

        test('devrait déplacer pendant le toucher', () => {
            angel.startTouch(200);
            angel.moveTouch(300);
            expect(angel.paddle.x).toBe(250); // 300 - paddle.w/2
        });

        test('ne devrait pas bouger si pas en train de toucher', () => {
            const initialX = angel.paddle.x;
            angel.moveTouch(300);
            expect(angel.paddle.x).toBe(initialX);
        });

        test('devrait arrêter le toucher', () => {
            angel.startTouch(200);
            angel.endTouch();
            expect(angel.touching).toBe(false);
        });
    });
});

// Tests d'intégration avec mock du contexte canvas
describe('AngeGardien - Rendu', () => {
    let angel;
    let mockCtx;

    beforeEach(() => {
        angel = new AngeGardien(mockCanvas.width, mockCanvas.height);
        mockCtx = {
            save: jest.fn(),
            restore: jest.fn(),
            fillStyle: '',
            strokeStyle: '',
            lineWidth: 0,
            font: '',
            textAlign: '',
            globalAlpha: 1,
            fillRect: jest.fn(),
            strokeRect: jest.fn(),
            beginPath: jest.fn(),
            arc: jest.fn(),
            ellipse: jest.fn(),
            fill: jest.fn(),
            stroke: jest.fn(),
            fillText: jest.fn(),
            translate: jest.fn(),
            scale: jest.fn(),
            createRadialGradient: jest.fn(() => ({
                addColorStop: jest.fn()
            })),
            moveTo: jest.fn(),
            lineTo: jest.fn()
        };
    });

    test('devrait appeler toutes les méthodes de dessin', () => {
        angel.draw(mockCtx);
        
        expect(mockCtx.save).toHaveBeenCalled();
        expect(mockCtx.restore).toHaveBeenCalled();
        expect(mockCtx.beginPath).toHaveBeenCalled();
        expect(mockCtx.arc).toHaveBeenCalled();
        expect(mockCtx.ellipse).toHaveBeenCalled();
        expect(mockCtx.fill).toHaveBeenCalled();
        expect(mockCtx.stroke).toHaveBeenCalled();
    });

    test('devrait dessiner l\'aura avec les bonnes couleurs', () => {
        mockCtx.createRadialGradient.mockReturnValue({
            addColorStop: jest.fn()
        });
        
        angel.drawAura(mockCtx);
        
        expect(mockCtx.createRadialGradient).toHaveBeenCalled();
    });
});

export { AngeGardien };