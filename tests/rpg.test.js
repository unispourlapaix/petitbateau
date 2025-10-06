/**
 * Tests unitaires pour le module RPGSystem
 */

import RPGSystem, { QuestManager } from '../js/modules/rpg.js';

// Mock du DOM pour les tests
Object.defineProperty(global, 'document', {
    value: {
        getElementById: jest.fn(() => ({
            innerHTML: '',
            style: { display: 'none' }
        }))
    }
});

global.setTimeout = jest.fn(cb => cb());
global.clearTimeout = jest.fn();

describe('QuestManager', () => {
    let questManager;

    beforeEach(() => {
        questManager = new QuestManager();
    });

    describe('Initialisation', () => {
        test('devrait initialiser avec les bonnes valeurs par défaut', () => {
            expect(questManager.title).toBe('Libérer la Vérité');
            expect(questManager.progress).toBe(0);
            expect(questManager.total).toBe(10);
            expect(questManager.isPlaying).toBe(false);
            expect(questManager.isCompleted).toBe(false);
        });
    });

    describe('Gestion de la quête', () => {
        test('devrait démarrer une quête', () => {
            const quest = questManager.startQuest();
            
            expect(quest.playing).toBe(true);
            expect(quest.completed).toBe(false);
            expect(quest.progress).toBe(0);
            expect(questManager.isPlaying).toBe(true);
        });

        test('devrait arrêter une quête', () => {
            questManager.startQuest();
            const quest = questManager.stopQuest();
            
            expect(quest.playing).toBe(false);
            expect(questManager.isPlaying).toBe(false);
        });

        test('devrait ajouter de la progression', () => {
            questManager.startQuest();
            const quest = questManager.addProgress();
            
            expect(quest.progress).toBe(1);
            expect(questManager.progress).toBe(1);
        });

        test('devrait compléter la quête automatiquement', () => {
            const onComplete = jest.fn();
            questManager.setCallbacks({ onQuestComplete: onComplete });
            
            questManager.startQuest();
            
            // Ajouter assez de progression pour terminer
            for (let i = 0; i < 10; i++) {
                questManager.addProgress();
            }
            
            expect(questManager.isCompleted).toBe(true);
            expect(questManager.isPlaying).toBe(false);
            expect(onComplete).toHaveBeenCalled();
        });

        test('devrait échouer la quête', () => {
            const onFail = jest.fn();
            questManager.setCallbacks({ onQuestFail: onFail });
            
            questManager.startQuest();
            questManager.failQuest();
            
            expect(questManager.isPlaying).toBe(false);
            expect(onFail).toHaveBeenCalled();
        });

        test('devrait réinitialiser la quête', () => {
            questManager.startQuest();
            questManager.addProgress();
            questManager.addProgress();
            
            const quest = questManager.resetQuest();
            
            expect(quest.progress).toBe(0);
            expect(quest.playing).toBe(false);
            expect(quest.completed).toBe(false);
        });
    });

    describe('Callbacks', () => {
        test('devrait appeler le callback de progression', () => {
            const onProgress = jest.fn();
            questManager.setCallbacks({ onProgress });
            
            questManager.startQuest();
            questManager.addProgress();
            
            expect(onProgress).toHaveBeenCalledWith(1, 10);
        });

        test('devrait fusionner les callbacks sans écraser les existants', () => {
            const onProgress = jest.fn();
            const onComplete = jest.fn();
            
            questManager.setCallbacks({ onProgress });
            questManager.setCallbacks({ onQuestComplete: onComplete });
            
            expect(questManager.callbacks.onProgress).toBe(onProgress);
            expect(questManager.callbacks.onQuestComplete).toBe(onComplete);
        });
    });
});

describe('RPGSystem', () => {
    let rpgSystem;
    let mockAngel;
    let mockBuilding;
    let mockElement;

    beforeEach(() => {
        rpgSystem = new RPGSystem();
        
        mockElement = {
            innerHTML: '',
            style: { display: 'none' }
        };
        
        document.getElementById.mockReturnValue(mockElement);
        
        mockAngel = {
            gainExp: jest.fn(() => ({ leveledUp: false, currentLevel: 1 })),
            takeDamage: jest.fn(() => ({ isDead: false, currentHp: 2 }))
        };
        
        mockBuilding = {
            story: 'Test story',
            reward: 'Test reward'
        };
    });

    describe('Système de messages', () => {
        test('devrait afficher un message de quête', () => {
            const message = rpgSystem.showQuestMessage('Test message', 1000);
            
            expect(message.text).toBe('Test message');
            expect(message.duration).toBe(1000);
            expect(mockElement.innerHTML).toBe('Test message');
            expect(mockElement.style.display).toBe('block');
        });

        test('devrait traiter la file des messages', () => {
            rpgSystem.showQuestMessage('Message 1', 0);
            rpgSystem.showQuestMessage('Message 2', 0);
            
            expect(mockElement.innerHTML).toBe('Message 1');
            expect(rpgSystem.messageQueue).toHaveLength(1);
        });

        test('devrait cacher le message actuel', () => {
            rpgSystem.showQuestMessage('Test message', 0);
            rpgSystem.hideCurrentMessage();
            
            expect(mockElement.style.display).toBe('none');
            expect(rpgSystem.currentMessage).toBeNull();
        });

        test('devrait cacher tous les messages et vider la file', () => {
            rpgSystem.showQuestMessage('Message 1', 0);
            rpgSystem.showQuestMessage('Message 2', 0);
            
            rpgSystem.hideAllMessages();
            
            expect(mockElement.style.display).toBe('none');
            expect(rpgSystem.messageQueue).toHaveLength(0);
            expect(rpgSystem.currentMessage).toBeNull();
        });
    });

    describe('Événements RPG', () => {
        test('devrait gérer la destruction d\'un bâtiment', () => {
            rpgSystem.quest.startQuest();
            
            const result = rpgSystem.onBuildingDestroyed(mockBuilding, mockAngel);
            
            expect(mockAngel.gainExp).toHaveBeenCalledWith(50);
            expect(rpgSystem.quest.progress).toBe(1);
            expect(result).toHaveProperty('expGain');
            expect(result).toHaveProperty('questProgress');
            expect(result).toHaveProperty('levelUp');
        });

        test('devrait gérer les dégâts à l\'ange', () => {
            rpgSystem.quest.startQuest();
            
            const result = rpgSystem.onAngelDamaged(mockAngel);
            
            expect(mockAngel.takeDamage).toHaveBeenCalled();
            expect(result.isDead).toBe(false);
        });

        test('devrait gérer la mort de l\'ange', () => {
            mockAngel.takeDamage.mockReturnValue({ isDead: true, currentHp: 0 });
            rpgSystem.quest.startQuest();
            
            rpgSystem.onAngelDamaged(mockAngel);
            
            expect(rpgSystem.quest.isPlaying).toBe(false);
        });
    });

    describe('Completion de quête', () => {
        test('devrait afficher le message de completion', () => {
            rpgSystem.onQuestComplete();
            
            expect(mockElement.innerHTML).toContain('QUÊTE ACCOMPLIE');
            expect(mockElement.innerHTML).toContain('Ange Gardien');
        });
    });

    describe('Réinitialisation', () => {
        test('devrait réinitialiser complètement le système', () => {
            rpgSystem.quest.startQuest();
            rpgSystem.quest.addProgress();
            rpgSystem.showQuestMessage('Test', 0);
            
            const result = rpgSystem.reset();
            
            expect(result.quest.progress).toBe(0);
            expect(result.quest.playing).toBe(false);
            expect(mockElement.style.display).toBe('none');
        });
    });

    describe('Accès aux propriétés', () => {
        test('devrait donner accès au gestionnaire de quête', () => {
            expect(rpgSystem.quest).toBeInstanceOf(QuestManager);
        });
    });
});

// Tests d'intégration
describe('RPGSystem - Intégration', () => {
    let rpgSystem;
    let mockAngel;

    beforeEach(() => {
        rpgSystem = new RPGSystem();
        
        document.getElementById.mockReturnValue({
            innerHTML: '',
            style: { display: 'none' }
        });

        mockAngel = {
            gainExp: jest.fn(() => ({ leveledUp: true, currentLevel: 2 })),
            takeDamage: jest.fn(() => ({ isDead: false, currentHp: 2 }))
        };
    });

    test('devrait gérer une session de jeu complète', () => {
        const onComplete = jest.fn();
        rpgSystem.quest.setCallbacks({ onQuestComplete: onComplete });
        
        // Démarrer la quête
        rpgSystem.quest.startQuest();
        expect(rpgSystem.quest.isPlaying).toBe(true);
        
        // Détruire tous les bâtiments
        for (let i = 0; i < 10; i++) {
            const building = { story: `Building ${i}`, reward: `Reward ${i}` };
            rpgSystem.onBuildingDestroyed(building, mockAngel);
        }
        
        // Vérifier que la quête est terminée
        expect(rpgSystem.quest.isCompleted).toBe(true);
        expect(rpgSystem.quest.isPlaying).toBe(false);
        expect(onComplete).toHaveBeenCalled();
    });

    test('devrait gérer l\'échec de la quête par mort', () => {
        const onFail = jest.fn();
        rpgSystem.quest.setCallbacks({ onQuestFail: onFail });
        
        // Démarrer la quête
        rpgSystem.quest.startQuest();
        
        // L'ange prend des dégâts jusqu'à la mort
        mockAngel.takeDamage
            .mockReturnValueOnce({ isDead: false, currentHp: 2 })
            .mockReturnValueOnce({ isDead: false, currentHp: 1 })
            .mockReturnValueOnce({ isDead: true, currentHp: 0 });
        
        rpgSystem.onAngelDamaged(mockAngel);
        rpgSystem.onAngelDamaged(mockAngel);
        rpgSystem.onAngelDamaged(mockAngel);
        
        expect(rpgSystem.quest.isPlaying).toBe(false);
        expect(onFail).toHaveBeenCalled();
    });
});

export { RPGSystem, QuestManager };