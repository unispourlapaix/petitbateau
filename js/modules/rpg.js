/**
 * Système RPG - Module de gestion de la quête et progression
 */

export class QuestManager {
    constructor() {
        this.quest = {
            title: "Libérer la Vérité",
            progress: 0,
            total: 10,
            playing: false,
            completed: false
        };
        this.callbacks = {
            onQuestComplete: null,
            onQuestFail: null,
            onProgress: null
        };
    }

    // Démarrer la quête
    startQuest() {
        this.quest.playing = true;
        this.quest.completed = false;
        this.quest.progress = 0;
        return this.quest;
    }

    // Arrêter la quête
    stopQuest() {
        this.quest.playing = false;
        return this.quest;
    }

    // Progression de la quête
    addProgress() {
        this.quest.progress++;
        
        if (this.callbacks.onProgress) {
            this.callbacks.onProgress(this.quest.progress, this.quest.total);
        }
        
        if (this.quest.progress >= this.quest.total) {
            this.completeQuest();
        }
        
        return this.quest;
    }

    // Compléter la quête
    completeQuest() {
        this.quest.completed = true;
        this.quest.playing = false;
        
        if (this.callbacks.onQuestComplete) {
            this.callbacks.onQuestComplete();
        }
        
        return this.quest;
    }

    // Échec de la quête
    failQuest() {
        this.quest.playing = false;
        
        if (this.callbacks.onQuestFail) {
            this.callbacks.onQuestFail();
        }
        
        return this.quest;
    }

    // Réinitialiser la quête
    resetQuest() {
        this.quest = {
            title: "Libérer la Vérité",
            progress: 0,
            total: 10,
            playing: false,
            completed: false
        };
        return this.quest;
    }

    // Définir les callbacks
    setCallbacks(callbacks) {
        this.callbacks = { ...this.callbacks, ...callbacks };
    }

    // Getters
    get isPlaying() { return this.quest.playing; }
    get isCompleted() { return this.quest.completed; }
    get progress() { return this.quest.progress; }
    get total() { return this.quest.total; }
    get title() { return this.quest.title; }
}

export class RPGSystem {
    constructor() {
        this.questManager = new QuestManager();
        this.messageQueue = [];
        this.currentMessage = null;
        this.messageTimeout = null;
    }

    // Afficher un message de quête
    showQuestMessage(text, duration = 0) {
        const message = {
            text,
            duration,
            timestamp: Date.now()
        };
        
        this.messageQueue.push(message);
        this.processMessageQueue();
        
        return message;
    }

    // Traiter la file des messages
    processMessageQueue() {
        if (this.currentMessage || this.messageQueue.length === 0) return;
        
        this.currentMessage = this.messageQueue.shift();
        
        // Afficher le message dans le DOM
        const msgElement = document.getElementById('questMsg');
        if (msgElement) {
            msgElement.innerHTML = this.currentMessage.text;
            msgElement.style.display = 'block';
            
            if (this.currentMessage.duration > 0) {
                this.messageTimeout = setTimeout(() => {
                    this.hideCurrentMessage();
                }, this.currentMessage.duration);
            }
        }
    }

    // Cacher le message actuel
    hideCurrentMessage() {
        const msgElement = document.getElementById('questMsg');
        if (msgElement) {
            msgElement.style.display = 'none';
        }
        
        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
            this.messageTimeout = null;
        }
        
        this.currentMessage = null;
        
        // Traiter le prochain message s'il y en a un
        setTimeout(() => this.processMessageQueue(), 100);
    }

    // Cacher tous les messages
    hideAllMessages() {
        const msgElement = document.getElementById('questMsg');
        if (msgElement) {
            msgElement.style.display = 'none';
        }
        
        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
            this.messageTimeout = null;
        }
        
        this.currentMessage = null;
        this.messageQueue = [];
    }

    // Interface pour la gestion des quêtes
    get quest() { return this.questManager; }
    
    // Gestion des événements RPG
    onBuildingDestroyed(building, angel) {
        // Gain d'expérience
        const expGain = angel.gainExp(50);
        
        // Progression de quête
        this.questManager.addProgress();
        
        // Message narratif
        this.showQuestMessage(
            building.story + '<br><br>🎁 ' + building.reward,
            4000
        );
        
        return {
            expGain,
            questProgress: this.questManager.progress,
            levelUp: expGain.leveledUp
        };
    }

    onAngelDamaged(angel) {
        const damage = angel.takeDamage();
        
        if (damage.isDead) {
            this.questManager.failQuest();
            this.showQuestMessage(
                '😢 L\'Ange s\'épuise...<br><br>🌟 "Mais la vérité est éternelle !"<br><br>⚔️ Recommencez la quête pour libérer la Cité ! ⚔️',
                0
            );
        } else {
            this.showQuestMessage(
                '💔 L\'Ange perd de l\'énergie ! La Cité résiste encore...',
                2500
            );
        }
        
        return damage;
    }

    onQuestComplete() {
        this.showQuestMessage(
            '🏆✨ QUÊTE ACCOMPLIE ! ✨🏆<br><br>😇 L\'Ange Gardien a transmué l\'espace !<br>🌟 Les concepts négatifs sont transformés !<br>💎 La Vérité illumine le monde !<br><br>🌍 "Nous avons vu avec nos yeux et notre cœur"<br><br>⚔️ Une nouvelle quête vous attend ! ⚔️',
            0
        );
    }

    // Réinitialisation complète du système RPG
    reset() {
        this.questManager.resetQuest();
        this.hideAllMessages();
        return {
            quest: this.questManager.quest
        };
    }
}

export default RPGSystem;