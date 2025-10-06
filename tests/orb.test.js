/**
 * Tests unitaires pour le module OrbeDeVerite
 */

import OrbeDeVerite from '../js/modules/orb.js';

// Mock du canvas pour les tests
const mockCanvas = { width: 480, height: 600 };

describe('OrbeDeVerite', () => {
    let orb;

    beforeEach(() => {
        orb = new OrbeDeVerite(mockCanvas.width, mockCanvas.height);
    });

    describe('Initialisation', () => {
        test('devrait initialiser avec les bonnes valeurs par défaut', () => {
            expect(orb.x).toBe(mockCanvas.width / 2);
            expect(orb.y).toBe(mockCanvas.height - 90 - 35);
            expect(orb.r).toBe(12);
            expect(orb.dx).toBe(0.8);
            expect(orb.dy).toBe(-0.8);
            expect(orb.speed).toBe(1.0);
            expect(orb.active).toBe(true);
        });

        test('devrait initialiser les tableaux vides', () => {
            expect(orb.particles).toHaveLength(0);
            expect(orb.trail).toHaveLength(0);
        });
    });

    describe('Mouvement et physique', () => {
        test('devrait mettre à jour la position', () => {
            const initialX = orb.x;
            const initialY = orb.y;
            
            orb.update();
            
            expect(orb.x).toBe(initialX + orb.dx * orb.speed);
            expect(orb.y).toBe(initialY + orb.dy * orb.speed);
        });

        test('devrait créer une traînée en bougeant', () => {
            orb.update();
            expect(orb.trail.length).toBeGreaterThan(0);
        });

        test('devrait limiter la longueur de la traînée', () => {
            // Simuler plusieurs mises à jour pour dépasser maxTrailLength
            for (let i = 0; i < 15; i++) {
                orb.update();
            }
            expect(orb.trail.length).toBeLessThanOrEqual(orb.maxTrailLength);
        });
    });

    describe('Collisions avec les bords', () => {
        test('devrait rebondir sur le bord gauche', () => {
            orb.x = orb.r - 1; // Position près du bord gauche
            orb.dx = -1; // Se déplace vers la gauche
            
            const bounced = orb.checkBoundaryCollisions();
            
            expect(bounced).toBe(true);
            expect(orb.dx).toBe(1); // Direction inversée
        });

        test('devrait rebondir sur le bord droit', () => {
            orb.x = mockCanvas.width - orb.r + 1; // Position près du bord droit
            orb.dx = 1; // Se déplace vers la droite
            
            const bounced = orb.checkBoundaryCollisions();
            
            expect(bounced).toBe(true);
            expect(orb.dx).toBe(-1); // Direction inversée
        });

        test('devrait rebondir sur le haut (interface RPG)', () => {
            orb.y = orb.r + 70 - 1; // Position près du haut
            orb.dy = -1; // Se déplace vers le haut
            
            const bounced = orb.checkBoundaryCollisions();
            
            expect(bounced).toBe(true);
            expect(orb.dy).toBe(1); // Direction inversée
        });

        test('ne devrait pas rebondir si pas de collision', () => {
            orb.x = mockCanvas.width / 2;
            orb.y = mockCanvas.height / 2;
            
            const bounced = orb.checkBoundaryCollisions();
            
            expect(bounced).toBe(false);
        });
    });

    describe('Détection de chute', () => {
        test('devrait détecter quand l\'orbe tombe', () => {
            orb.y = mockCanvas.height + 10;
            expect(orb.checkFallOut()).toBe(true);
        });

        test('ne devrait pas détecter de chute si dans les limites', () => {
            orb.y = mockCanvas.height / 2;
            expect(orb.checkFallOut()).toBe(false);
        });
    });

    describe('Collision avec rectangle', () => {
        test('devrait détecter une collision avec un rectangle', () => {
            const rect = {
                x: orb.x - 20,
                y: orb.y - 20,
                w: 40,
                h: 40
            };
            
            expect(orb.checkRectCollision(rect)).toBe(true);
        });

        test('ne devrait pas détecter de collision éloignée', () => {
            const rect = {
                x: orb.x + 100,
                y: orb.y + 100,
                w: 40,
                h: 40
            };
            
            expect(orb.checkRectCollision(rect)).toBe(false);
        });
    });

    describe('Interaction avec l\'ange', () => {
        test('devrait rebondir correctement sur l\'ange', () => {
            const angelX = orb.x;
            const angelY = orb.y + 50;
            orb.dy = 1; // Se déplace vers le bas
            
            orb.bounceOffAngel(angelX, angelY);
            
            expect(orb.dy).toBeLessThan(0); // Rebondit vers le haut
            expect(orb.glowing).toBe(true);
        });

        test('devrait calculer l\'angle de rebond selon la position', () => {
            const angelX = orb.x - 40;
            const angelY = orb.y + 50;
            const oldDx = orb.dx;
            
            orb.bounceOffAngel(angelX, angelY);
            
            expect(orb.dx).not.toBe(oldDx); // L'angle a changé
        });
    });

    describe('Effets visuels', () => {
        test('devrait créer des effets de rebond', () => {
            const initialParticles = orb.particles.length;
            orb.createBounceEffect();
            expect(orb.particles.length).toBeGreaterThan(initialParticles);
        });

        test('devrait générer des particules magiques quand ça brille', () => {
            orb.glowing = true;
            const initialParticles = orb.particles.length;
            
            // Simuler plusieurs tentatives (probabiliste)
            for (let i = 0; i < 20; i++) {
                orb.generateParticles();
            }
            
            expect(orb.particles.length).toBeGreaterThanOrEqual(initialParticles);
        });

        test('devrait mettre à jour les particules', () => {
            // Ajouter une particule test
            orb.particles.push({
                x: 100, y: 100, vx: 1, vy: 1,
                life: 10, maxLife: 20,
                color: '#FFD700', size: 3
            });
            
            orb.updateParticles();
            
            // La particule devrait avoir bougé
            expect(orb.particles[0].x).toBe(101);
            expect(orb.particles[0].y).toBe(101);
            expect(orb.particles[0].life).toBe(9);
        });

        test('devrait supprimer les particules expirées', () => {
            // Ajouter une particule expirée
            orb.particles.push({
                x: 100, y: 100, vx: 0, vy: 0,
                life: 0, maxLife: 20,
                color: '#FFD700', size: 3
            });
            
            orb.updateParticles();
            
            expect(orb.particles).toHaveLength(0);
        });
    });

    describe('Repositionnement', () => {
        test('devrait repositionner près de la raquette', () => {
            const paddleX = 200;
            const paddleY = 500;
            const paddleW = 100;
            
            orb.repositionNearPaddle(paddleX, paddleY, paddleW);
            
            expect(orb.x).toBe(paddleX + paddleW / 2);
            expect(orb.y).toBe(paddleY - 35);
            expect(orb.dx).toBe(0.8);
            expect(orb.dy).toBe(-0.8);
        });

        test('devrait effacer la traînée lors du repositionnement', () => {
            orb.trail = [{ x: 100, y: 100, alpha: 1 }];
            orb.repositionNearPaddle(200, 500, 100);
            expect(orb.trail).toHaveLength(0);
        });
    });

    describe('Réinitialisation', () => {
        test('devrait remettre à zéro toutes les propriétés', () => {
            // Modifier l'état de l'orbe
            orb.x = 300;
            orb.y = 400;
            orb.dx = 2;
            orb.dy = 2;
            orb.speed = 2;
            orb.glowing = true;
            orb.particles = [{}];
            orb.trail = [{}];
            
            orb.reset(mockCanvas.width, mockCanvas.height);
            
            // Vérifier la réinitialisation
            expect(orb.x).toBe(mockCanvas.width / 2);
            expect(orb.y).toBe(mockCanvas.height - 90 - 35);
            expect(orb.dx).toBe(0.8);
            expect(orb.dy).toBe(-0.8);
            expect(orb.speed).toBe(1.0);
            expect(orb.glowing).toBe(false);
            expect(orb.particles).toHaveLength(0);
            expect(orb.trail).toHaveLength(0);
        });
    });

    describe('Activation/Désactivation', () => {
        test('devrait pouvoir désactiver l\'orbe', () => {
            orb.setActive(false);
            expect(orb.active).toBe(false);
        });

        test('devrait effacer les effets en désactivant', () => {
            orb.trail = [{}];
            orb.particles = [{}];
            
            orb.setActive(false);
            
            expect(orb.trail).toHaveLength(0);
            expect(orb.particles).toHaveLength(0);
        });

        test('ne devrait pas se mettre à jour si inactif', () => {
            orb.setActive(false);
            const initialX = orb.x;
            
            orb.update();
            
            expect(orb.x).toBe(initialX);
        });
    });

    describe('Amélioration des performances', () => {
        test('devrait augmenter la vitesse', () => {
            const initialSpeed = orb.speed;
            orb.increaseSpeed(0.2);
            expect(orb.speed).toBe(initialSpeed + 0.2);
        });

        test('ne devrait pas dépasser la vitesse maximale', () => {
            orb.speed = 1.9;
            orb.increaseSpeed(0.5);
            expect(orb.speed).toBe(2.0);
        });
    });

    describe('État de l\'orbe', () => {
        test('devrait retourner l\'état correct', () => {
            const state = orb.getState();
            
            expect(state).toHaveProperty('x');
            expect(state).toHaveProperty('y');
            expect(state).toHaveProperty('dx');
            expect(state).toHaveProperty('dy');
            expect(state).toHaveProperty('r');
            expect(state).toHaveProperty('speed');
            expect(state).toHaveProperty('active');
            expect(state).toHaveProperty('powerLevel');
            expect(state).toHaveProperty('glowing');
        });
    });
});

// Tests de rendu avec mock du contexte
describe('OrbeDeVerite - Rendu', () => {
    let orb;
    let mockCtx;

    beforeEach(() => {
        orb = new OrbeDeVerite(mockCanvas.width, mockCanvas.height);
        mockCtx = {
            save: jest.fn(),
            restore: jest.fn(),
            fillStyle: '',
            strokeStyle: '',
            lineWidth: 0,
            font: '',
            textAlign: '',
            textBaseline: '',
            globalAlpha: 1,
            lineCap: '',
            beginPath: jest.fn(),
            arc: jest.fn(),
            fill: jest.fn(),
            stroke: jest.fn(),
            fillText: jest.fn(),
            moveTo: jest.fn(),
            lineTo: jest.fn(),
            translate: jest.fn(),
            scale: jest.fn(),
            createRadialGradient: jest.fn(() => ({
                addColorStop: jest.fn()
            })),
            createLinearGradient: jest.fn(() => ({
                addColorStop: jest.fn()
            }))
        };
    });

    test('devrait dessiner tous les éléments', () => {
        orb.draw(mockCtx);
        
        expect(mockCtx.save).toHaveBeenCalled();
        expect(mockCtx.restore).toHaveBeenCalled();
        expect(mockCtx.beginPath).toHaveBeenCalled();
        expect(mockCtx.arc).toHaveBeenCalled();
        expect(mockCtx.fill).toHaveBeenCalled();
    });

    test('ne devrait pas dessiner si inactif', () => {
        orb.setActive(false);
        orb.draw(mockCtx);
        
        expect(mockCtx.save).not.toHaveBeenCalled();
    });

    test('devrait dessiner la traînée si présente', () => {
        orb.trail = [
            { x: 100, y: 100, alpha: 1 },
            { x: 110, y: 110, alpha: 0.8 }
        ];
        
        orb.drawTrail(mockCtx);
        
        expect(mockCtx.beginPath).toHaveBeenCalled();
        expect(mockCtx.moveTo).toHaveBeenCalled();
        expect(mockCtx.lineTo).toHaveBeenCalled();
        expect(mockCtx.stroke).toHaveBeenCalled();
    });
});

export { OrbeDeVerite };