// Module Narration Manager - Système de gestion narrative modulaire
class NarrationManager {
    constructor(config = {}) {
        this.currentPhase = 1;
        this.isTransitioning = false;
        this.victoryTimers = new Map();
        this.phaseHistory = [];

        // Configuration modulaire
        this.config = {
            debug: config.debug || false,
            autoProgress: config.autoProgress || true,
            transitionDelay: config.transitionDelay || 1000,
            ...config
        };

        // Callbacks externes pour découplage
        this.callbacks = {
            onPhaseStart: null,
            onPhaseEnd: null,
            onGameModeChange: null,
            onTransitionStart: null,
            onTransitionEnd: null
        };

        // Données narratives séparées
        this.narrativeData = null;
        this.textAnimator = null;
        this.audioManager = null;

        // Initialiser avec des données par défaut immédiatement
        this.initDefaultData();
        this.initSync();
    }

    // Initialisation des données par défaut (synchrone)
    initDefaultData() {
        this.narrativeData = {
            metadata: {
                totalPhases: 16
            },
            phases: [
                {
                    id: 'VDV_NARR_P01_INTRO_LUMIERE',
                    phase: 1,
                    chapter: 1,
                    title: 'Voyage — L\'aube des doutes',
                    text: "🌟 \"On m'a dit qu'ils étaient tous des monstres...\n✨ On m'a dit tant de mal, tant de malheurs sur eux...\n🔍 Mais moi, j'ai préféré aller voir de mes propres yeux.\"",
                    gameMode: 'coeurs',
                    duration: 8000,
                    animation: 'typewriter',
                    speed: 45
                }
            ]
        };
        this.log('Données par défaut initialisées');
    }

    // Initialisation synchrone de base
    initSync() {
        this.log('NarrationManager - Initialisation synchrone');
        this.setupTextAnimator();
        this.setupEventListeners();

        // Charger les données de manière asynchrone en arrière-plan
        this.loadNarrativeData().then((loaded) => {
            if (loaded) {
                this.log('NarrationManager - Données JSON chargées avec succès');
            } else {
                this.log('NarrationManager - Utilisation des données par défaut');
            }
        }).catch(error => {
            this.log('Erreur chargement données:', error);
        });
    }

    // Initialisation modulaire (pour compatibilité)
    async init() {
        this.log('NarrationManager - Initialisation modulaire');
        await this.loadNarrativeData();
        this.setupTextAnimator();
        this.setupEventListeners();
    }

    // Chargement des données narratives
    async loadNarrativeData() {
        try {
            // Charger les données depuis le fichier JSON externe
            const response = await fetch('modules/narration-data.json');
            if (!response.ok) {
                throw new Error(`Erreur chargement: ${response.status}`);
            }

            this.narrativeData = await response.json();
            this.log('Données narratives chargées depuis narration-data.json');
            return true;
        } catch (error) {
            this.log('Erreur chargement JSON, conservation des données par défaut:', error);
            return false;
        }
    }

    // Données par défaut (legacy - ne devrait plus être utilisé)
    _getFallbackData() {
        return {
            phases: [
                {
                    id: 'VDV_NARR_P01_INTRO_LUMIERE',
                    phase: 1,
                    title: 'Voyage — L\'aube des doutes',
                    text: "🌟 \"On m'a dit qu'ils étaient tous des monstres...\n✨ On m'a dit tant de mal, tant de malheurs sur eux...\n🔍 Mais moi, j'ai préféré aller voir de mes propres yeux.\"",
                    gameMode: 'coeurs',
                    duration: 8000,
                    animation: 'typewriter',
                    speed: 45,
                    audio: null,
                    conditions: {
                        target: 'coeurs_destroy_all',
                        timeout: null
                    }
                },
                {
                    id: 'VDV_NARR_P02_REVELATION_FAMILLE',
                    phase: 2,
                    title: 'Voyage — La lumière',
                    text: '🤔 "Qui étaient-ils vraiment ?...\nEt j\'ai vu...\n\n👨‍👩‍👧‍👦 Un père... une mère... des enfants...\n\n💙 Tous cherchant simplement\nà vivre\nleur meilleure vie...\nComme moi."',
                    gameMode: 'briques',
                    duration: 10000,
                    animation: 'typewriter',
                    speed: 50,
                    audio: null,
                    conditions: {
                        target: 'briques_destroy_all',
                        timeout: null
                    }
                }
                // ... autres phases
            ],
            metadata: {
                version: '1.0.0',
                totalPhases: 16,
                defaultAnimation: 'typewriter',
                defaultSpeed: 50
            }
        };
    }

    // Configuration de l'animateur de texte
    setupTextAnimator() {
        if (window.TextAnimationModule) {
            this.textAnimator = new window.TextAnimationModule();
        } else {
            this.log('TextAnimationModule non disponible - fallback simple');
            this.textAnimator = {
                typewriter: (element, text, speed, callback) => {
                    element.innerHTML = text.replace(/\n/g, '<br>');
                    if (callback) callback();
                }
            };
        }
    }

    // Configuration des événements
    setupEventListeners() {
        // Écouter les événements de jeu
        if (typeof window !== 'undefined') {
            window.addEventListener('narration:advance', () => this.nextPhase());
            window.addEventListener('narration:reset', () => this.reset());
            window.addEventListener('narration:pause', () => this.pause());
            window.addEventListener('narration:resume', () => this.resume());
        }
    }

    // API publique simplifiée
    start() {
        this.log('Démarrage de la narration');
        this.reset();
        this.executeCurrentPhase();
    }

    reset() {
        this.log('Reset de la narration');
        this.currentPhase = 1;
        this.phaseHistory = [];
        this.isTransitioning = false;
        this.victoryTimers.clear();
        this.hideAllMessages();
    }

    pause() {
        this.log('Pause de la narration');
        this.isTransitioning = true;
        if (this.textAnimator && this.textAnimator.stop) {
            this.textAnimator.stop();
        }
    }

    resume() {
        this.log('Reprise de la narration');
        this.isTransitioning = false;
        this.executeCurrentPhase();
    }

    // Navigation entre phases
    nextPhase() {
        if (this.isTransitioning) return false;

        const currentData = this.getCurrentPhaseData();
        if (!currentData) return false;

        this.log(`Transition P${this.currentPhase} -> P${this.currentPhase + 1}`);

        // Callback avant transition
        this.trigger('onTransitionStart', { from: this.currentPhase, to: this.currentPhase + 1 });

        // 🎯 BONUS 100 XP pour avoir terminé la phase 1 (intro)
        if (this.currentPhase === 1) {
            this.rewardIntroCompletion();
        }

        this.phaseHistory.push(this.currentPhase);
        this.currentPhase++;

        // Vérifier si fin de narration
        if (this.currentPhase > this.narrativeData.phases.length) {
            this.finalize();
            return false;
        }

        return true;
    }

    goToPhase(phaseNumber) {
        if (this.isTransitioning) return false;

        this.log(`Navigation directe vers phase ${phaseNumber}`);
        this.currentPhase = phaseNumber;
        this.executeCurrentPhase();
        return true;
    }

    // Exécution de phase avec découplage
    executeCurrentPhase() {
        const phaseData = this.getCurrentPhaseData();
        if (!phaseData) {
            this.finalize();
            return;
        }

        this.log(`Exécution phase ${phaseData.phase}: ${phaseData.id}`);

        // Callback début de phase
        this.trigger('onPhaseStart', phaseData);

        // Changement de mode de jeu
        if (phaseData.gameMode) {
            this.trigger('onGameModeChange', phaseData.gameMode);
        }

        // Affichage du texte narratif
        this.displayNarrativeText(phaseData);

        // Configuration automatique de la progression
        if (this.config.autoProgress && phaseData.conditions) {
            this.setupAutoProgress(phaseData);
        }
    }

    // Affichage du texte avec animation
    displayNarrativeText(phaseData) {
        const messageElement = this.getMessageElement();
        if (!messageElement) {
            this.log('Élément message non trouvé');
            return;
        }

        // Configuration de l'affichage
        messageElement.classList.add('narratif', 'show');

        // Animation du texte
        const onComplete = () => {
            this.log(`Animation terminée pour phase ${phaseData.phase}`);
            this.trigger('onPhaseEnd', phaseData);
        };

        if (this.textAnimator && phaseData.animation === 'typewriter') {
            this.textAnimator.typewriter(
                messageElement,
                phaseData.text,
                phaseData.speed || 50,
                onComplete
            );
        } else {
            messageElement.innerHTML = phaseData.text.replace(/\n/g, '<br>');
            setTimeout(onComplete, phaseData.duration || 3000);
        }
    }

    // Configuration de la progression automatique
    setupAutoProgress(phaseData) {
        const conditions = phaseData.conditions;

        // Timer de progression automatique
        if (conditions.timeout) {
            setTimeout(() => {
                if (!this.isTransitioning) {
                    this.nextPhase();
                    this.executeCurrentPhase();
                }
            }, conditions.timeout);
        }

        // Écouter les événements de gameplay
        if (conditions.target) {
            this.setupGameplayListener(conditions.target);
        }
    }

    // Écoute des événements de gameplay
    setupGameplayListener(target) {
        const eventName = `gameplay:${target}`;

        const handler = () => {
            this.log(`Condition atteinte: ${target}`);
            if (this.nextPhase()) {
                setTimeout(() => this.executeCurrentPhase(), this.config.transitionDelay);
            }
            window.removeEventListener(eventName, handler);
        };

        window.addEventListener(eventName, handler);
    }

    // Utilitaires
    getCurrentPhaseData() {
        return this.narrativeData.phases.find(p => p.phase === this.currentPhase) || null;
    }

    getPhaseById(id) {
        return this.narrativeData.phases.find(p => p.id === id) || null;
    }

    getMessageElement() {
        return document.querySelector('.message') || document.getElementById('message');
    }

    hideAllMessages() {
        const message = this.getMessageElement();
        if (message) {
            message.classList.remove('show', 'narratif');
            message.style.display = 'none';
        }
    }

    // Finalisation de la narration
    finalize() {
        this.log('Narration terminée');
        this.hideAllMessages();
        this.trigger('onTransitionEnd', { completed: true });
    }

    // Système de callbacks
    on(event, callback) {
        this.callbacks[event] = callback;
    }

    trigger(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event](data);
        }
    }

    // Debugging conditionnel
    log(message, level = 'info') {
        if (this.config.debug) {
            console.log(`[NarrationManager] ${message}`);
        }
    }

    // API de compatibilité avec l'ancien système
    goToNextPhaseDirect() {
        this.log('Appel legacy: goToNextPhaseDirect');
        if (this.nextPhase()) {
            this.executeCurrentPhase();
        }
    }

    goToPhase2t() {
        this.log('Appel legacy: goToPhase2t');
        this.goToPhase('2t'); // Gérer les phases avec ID spéciaux
    }

    showFinalMenu() {
        this.log('Affichage menu final');
        this.finalize();
        // Trigger event pour le menu final
        this.trigger('onTransitionEnd', { showFinalMenu: true });
    }

    // Getters pour compatibilité
    get isActive() {
        return this.currentPhase > 0 && this.currentPhase <= this.narrativeData.phases.length;
    }

    get progress() {
        return {
            current: this.currentPhase,
            total: this.narrativeData.phases.length,
            percentage: Math.round((this.currentPhase / this.narrativeData.phases.length) * 100)
        };
    }

    /**
     * Récompense pour avoir terminé l'intro (phase 1)
     */
    rewardIntroCompletion() {
        const rewardAmount = 100;

        try {
            // Essayer de trouver l'ange principal via différentes méthodes
            let mainAngel = null;

            // Méthode 1: Via window
            if (window.angel) {
                mainAngel = window.angel;
            }
            // Méthode 2: Via un gestionnaire de jeu global
            else if (window.gameManager && window.gameManager.angel) {
                mainAngel = window.gameManager.angel;
            }
            // Méthode 3: Via recherche dans les modules chargés
            else if (window.modules && window.modules.angel) {
                mainAngel = window.modules.angel;
            }

            if (mainAngel && typeof mainAngel.gainExp === 'function') {
                const result = mainAngel.gainExp(rewardAmount);
                this.log(`🌟 XP transféré vers l'ange depuis intro: +${rewardAmount} XP (niveau: ${result.currentLevel}, total: ${result.currentExp})`);

                // Afficher notification dans le jeu
                this.showXPRewardNotification(rewardAmount);
                return true;
            } else {
                this.log(`⚠️ Impossible de trouver l'ange principal pour transférer ${rewardAmount} XP depuis intro`);
                return false;
            }
        } catch (error) {
            this.log('❌ Erreur lors du transfert XP depuis intro:', error);
            return false;
        }
    }

    /**
     * Afficher une notification de récompense XP
     */
    showXPRewardNotification(amount) {
        try {
            // Méthode 1: Via afficherMessage global
            if (typeof window.afficherMessage === 'function') {
                window.afficherMessage(`🌟 +${amount} XP pour avoir regardé l'introduction complète ! 🌟`, 3000);
            }
            // Méthode 2: Via console
            else {
                console.log(`🎯 Bonus intro: +${amount} XP accordé !`);
            }
        } catch (error) {
            this.log('Erreur affichage notification XP:', error);
        }
    }
}

// Export du module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NarrationManager;
} else {
    window.NarrationManager = NarrationManager;
}