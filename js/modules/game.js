/**
 * Gestionnaire Principal du Jeu - Module de coordination
 */

import AngeGardien from './angel.js';
import OrbeDeVerite from './orb.js';
import CitePrejuges from './buildings.js';
import RPGSystem from './rpg.js';
import RPGInterface from './ui.js';

export class QueteDeVerite {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // État du jeu - initialiser en premier
        this.gameState = {
            initialized: false,
            showWelcome: true,
            showLevelUpEffect: false,
            levelUpEffectTimer: 0
        };
        
        // Performance
        this.lastFrameTime = 0;
        this.frameCount = 0;
        this.fps = 60;
        
        // Initialisation des modules
        this.setupCanvas();
        this.initializeModules();
        this.setupEventListeners();
    }

    // Configuration du canvas bord à bord
    setupCanvas() {
        // Dimensions plein écran pour mode bord à bord
        this.size = {
            w: window.innerWidth,
            h: window.innerHeight
        };
        
        // Configuration plein écran
        this.canvas.width = this.size.w;
        this.canvas.height = this.size.h;
        
        console.log(`🎯 Canvas bord à bord: ${this.size.w}x${this.size.h}`);
    }

    // Calculer la taille optimale du canvas
    calculateOptimalSize() {
        const w = Math.min(window.innerWidth * 0.9, 460);
        const h = Math.min(window.innerHeight * 0.7, w * 4/3);
        return { w: Math.floor(w), h: Math.floor(h) };
    }

    // Initialiser tous les modules
    initializeModules() {
        this.angel = new AngeGardien(this.size.w, this.size.h);
        this.orb = new OrbeDeVerite(this.size.w, this.size.h);
        this.city = new CitePrejuges();
        this.rpg = new RPGSystem();
        this.ui = new RPGInterface(this.size.w, this.size.h);
        
        // Créer l'espace conceptuel
        this.city.createConceptSpace(this.size.w, this.size.h);
        
        // Configuration des callbacks RPG
        this.setupRPGCallbacks();
        
        this.gameState.initialized = true;
    }

    // Configuration des callbacks RPG
    setupRPGCallbacks() {
        this.rpg.quest.setCallbacks({
            onQuestComplete: () => this.onQuestComplete(),
            onQuestFail: () => this.onQuestFail(),
            onProgress: (progress, total) => this.onQuestProgress(progress, total)
        });
    }

    // Gestionnaire d'événements
    setupEventListeners() {
        // Redimensionnement de la fenêtre
        window.addEventListener('resize', () => this.handleResize());
        
        // Événements tactiles
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Événements souris
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        
        // Empêcher le défilement sur le canvas
        this.canvas.addEventListener('touchmove', (e) => e.preventDefault());
    }

    // Gestion du redimensionnement avec uniformité
    handleResize() {
        // Recalculer avec les nouvelles dimensions uniformes
        this.setupCanvas();
        
        // Mettre à jour tous les modules avec les nouvelles dimensions
        this.angel.updateCanvasSize(this.size.w, this.size.h);
        this.orb.updateCanvasSize(this.size.w, this.size.h);
        this.city.updateCanvasSize(this.size.w, this.size.h);
        this.ui.updateCanvasSize(this.size.w, this.size.h);
        
        // Repositionner les éléments si le jeu n'est pas en cours
        if (!this.rpg.quest.isPlaying) {
            this.orb.repositionNearPaddle(this.angel.paddle.x, this.angel.paddle.y, this.angel.paddle.w);
        }
    }

    // Obtenir les coordonnées d'interaction
    getInteractionCoords(e) {
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches ? e.touches[0] : e;
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
    }

    // Gestion des événements tactiles
    handleTouchStart(e) {
        e.preventDefault();
        const coords = this.getInteractionCoords(e);
        
        if (!this.rpg.quest.isPlaying) {
            this.startNewQuest();
            return;
        }
        
        this.angel.startTouch(coords.x);
    }

    handleTouchMove(e) {
        e.preventDefault();
        if (!this.rpg.quest.isPlaying) return;
        
        const coords = this.getInteractionCoords(e);
        this.angel.moveTouch(coords.x);
    }

    handleTouchEnd(e) {
        e.preventDefault();
        this.angel.endTouch();
    }

    // Gestion des événements souris
    handleMouseMove(e) {
        if (!this.rpg.quest.isPlaying) return;
        
        const coords = this.getInteractionCoords(e);
        this.angel.moveTo(coords.x);
    }

    handleClick(e) {
        if (!this.rpg.quest.isPlaying) {
            this.startNewQuest();
        }
    }

    // Démarrer une nouvelle quête
    startNewQuest() {
        // Réinitialiser tous les modules
        this.angel.reset();
        this.orb.reset(this.size.w, this.size.h, this.angel.paddle.y);
        this.city.reset(this.size.w, this.size.h);
        
        // Démarrer la quête
        this.rpg.quest.startQuest();
        this.rpg.hideAllMessages();
        
        // Activer l'orbe
        this.orb.setActive(true);
        
        this.gameState.showWelcome = false;
        
        // Animation du titre
        this.ui.triggerQuestTitlePulse();
    }

    // Logique de mise à jour du jeu
    update(deltaTime) {
        if (!this.gameState.initialized) return;
        
        // Mettre à jour les effets visuels
        this.city.updateEffects();
        this.ui.update(this.getGameStateForUI());
        
        // Si la quête n'est pas en cours, ne pas mettre à jour la physique
        if (!this.rpg.quest.isPlaying) return;
        
        // Mettre à jour la physique de l'orbe
        this.orb.update();
        
        // Vérifier les collisions avec les bords
        this.orb.checkBoundaryCollisions();
        
        // Vérifier la collision avec l'ange
        if (this.angel.checkOrbCollision(this.orb)) {
            this.orb.bounceOffAngel(this.angel.centerX, this.angel.centerY);
        }
        
        // Vérifier les collisions avec les bâtiments
        const hitBuildingId = this.city.checkOrbCollision(this.orb);
        if (hitBuildingId !== -1) {
            this.handleBuildingHit(hitBuildingId);
        }
        
        // Vérifier si l'orbe est tombée
        if (this.orb.checkFallOut()) {
            this.handleOrbFallOut();
        }
        
        // Mettre à jour l'effet de montée de niveau
        if (this.gameState.showLevelUpEffect) {
            this.gameState.levelUpEffectTimer -= deltaTime;
            if (this.gameState.levelUpEffectTimer <= 0) {
                this.gameState.showLevelUpEffect = false;
            }
        }
    }

    // Gestion de la collision avec un concept négatif
    handleBuildingHit(buildingId) {
        const concept = this.city.transmuteConcept(buildingId);
        if (!concept) return;
        
        // Rebond de l'orbe
        this.orb.dy = -this.orb.dy;
        
        // Traitement RPG
        const result = this.rpg.onBuildingDestroyed(concept, this.angel);
        
        // Effet visuel de montée de niveau
        if (result.levelUp) {
            this.gameState.showLevelUpEffect = true;
            this.gameState.levelUpEffectTimer = 2000;
            this.ui.triggerHealAnimation(this.angel.hp - 1);
        }
        
        // Vérifier si la quête est terminée
        if (this.rpg.quest.progress >= this.rpg.quest.total) {
            this.rpg.quest.completeQuest();
        }
    }

    // Gestion de la chute de l'orbe
    handleOrbFallOut() {
        const damage = this.rpg.onAngelDamaged(this.angel);
        
        if (!damage.isDead) {
            // Repositionner l'orbe
            this.orb.repositionNearPaddle(
                this.angel.paddle.x,
                this.angel.paddle.y,
                this.angel.paddle.w
            );
            this.ui.triggerDamageAnimation(damage.currentHp);
        } else {
            // Arrêter la quête
            this.orb.setActive(false);
            this.gameState.showWelcome = true;
        }
    }

    // Callbacks des événements RPG
    onQuestComplete() {
        this.orb.setActive(false);
        this.gameState.showWelcome = true;
        this.ui.triggerQuestTitlePulse();
    }

    onQuestFail() {
        this.orb.setActive(false);
        this.gameState.showWelcome = true;
    }

    onQuestProgress(progress, total) {
        console.log(`Progression de quête: ${progress}/${total}`);
    }

    // Rendu du ciel moderne
    drawSky() {
        const skyGrad = this.ctx.createLinearGradient(0, 0, 0, this.size.h);
        skyGrad.addColorStop(0, '#f8f9fa');
        skyGrad.addColorStop(0.4, '#ffffff');
        skyGrad.addColorStop(1, '#e9ecef');
        
        this.ctx.fillStyle = skyGrad;
        this.ctx.fillRect(0, 0, this.size.w, this.size.h);
    }

    // Dessiner le titre intégré dans le jeu avec proportions uniformes
    drawGameTitle() {
        const ctx = this.ctx;
        const centerX = this.size.w / 2;
        const titleY = Math.max(35, this.size.h * 0.08); // Position proportionnelle
        
        ctx.save();
        
        // Titre principal avec taille proportionnelle uniforme
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Taille de police proportionnelle et uniforme
        const titleSize = Math.max(16, Math.min(22, this.size.w * 0.042));
        const subtitleSize = Math.max(9, Math.min(12, this.size.w * 0.024));
        
        // Ombre du titre
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.font = `bold ${titleSize}px system-ui`;
        ctx.fillText('✨ Libérez la Vérité ✨', centerX + 1, titleY + 1);
        
        // Titre principal avec gradient uniforme
        const titleGradient = ctx.createLinearGradient(
            centerX - this.size.w * 0.2, 
            titleY - 15, 
            centerX + this.size.w * 0.2, 
            titleY + 15
        );
        titleGradient.addColorStop(0, '#2d3436');
        titleGradient.addColorStop(0.5, '#495057');
        titleGradient.addColorStop(1, '#2d3436');
        
        ctx.fillStyle = titleGradient;
        ctx.fillText('✨ Libérez la Vérité ✨', centerX, titleY);
        
        // Sous-titre proportionnel
        ctx.font = `${subtitleSize}px system-ui`;
        ctx.fillStyle = 'rgba(99, 110, 114, 0.7)';
        const subtitleY = titleY + Math.max(20, titleSize * 1.3);
        ctx.fillText('Transcendez vos frontières intérieures', centerX, subtitleY);
        
        ctx.restore();
    }

    // Afficher le message de bienvenue
    drawWelcomeMessage() {
        if (!this.gameState.showWelcome) return;
        
        // Message d'accueil ou de fin
        const isComplete = this.rpg.quest.isCompleted;
        const message = isComplete ?
            '🏆✨ QUÊTE ACCOMPLIE ! ✨🏆<br><br>😇 L\'Ange Gardien a illuminé l\'espace !<br>🌟 Les concepts négatifs sont transmutés !<br>💎 La Vérité rayonne dans le monde !<br><br>🌍 "Nous avons vu avec nos yeux et notre cœur"<br><br>⚔️ Une nouvelle quête vous attend ! ⚔️' :
            '⚔️✨ LA QUÊTE DE VÉRITÉ ✨⚔️<br><br>🏰 Dans le Royaume des Frontières Intérieures<br>😇 Un Ange Gardien cherche la Vérité<br><br>🌟 Ouvrez les barrières de l\'esprit :<br>Tours, Châteaux, Manoirs et Temples<br><br>💎 L\'Orbe de Vérité transcendera les limites<br><br>"Voir avec ses propres yeux et son cœur"<br><br>⚔️ Touchez pour commencer la quête ! ⚔️';
        
        this.rpg.showQuestMessage(message, 0);
    }

    // Obtenir l'état du jeu pour l'UI
    getGameStateForUI() {
        return {
            quest: {
                title: this.rpg.quest.title,
                progress: this.rpg.quest.progress,
                total: this.rpg.quest.total
            },
            angel: {
                name: this.angel.name,
                level: this.angel.level,
                exp: this.angel.exp,
                hearts: this.angel.getStatsForUI().hearts,
                centerX: this.angel.centerX,
                centerY: this.angel.centerY
            },
            showLevelUpEffect: this.gameState.showLevelUpEffect
        };
    }

    // Rendu principal
    render(currentTime) {
        // Calcul du delta time pour des animations fluides
        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;
        
        // Calcul des FPS
        this.frameCount++;
        if (this.frameCount % 60 === 0) {
            this.fps = Math.round(1000 / (deltaTime || 16));
        }
        
        // Effacer le canvas
        this.ctx.clearRect(0, 0, this.size.w, this.size.h);
        
        // Dessiner le ciel
        this.drawSky();
        
        // Titre intégré dans le jeu
        this.drawGameTitle();
        
        // Interface RPG
        this.ui.draw(this.ctx, this.getGameStateForUI());
        
        // Éléments du jeu
        this.city.draw(this.ctx);
        this.angel.draw(this.ctx);
        this.orb.draw(this.ctx);
        
        // Message de bienvenue si nécessaire
        this.drawWelcomeMessage();
    }

    // Boucle principale du jeu
    gameLoop(currentTime) {
        this.update(currentTime - this.lastFrameTime);
        this.render(currentTime);
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    // Démarrer le jeu
    start() {
        this.drawWelcomeMessage();
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    // Obtenir les statistiques de performance
    getPerformanceStats() {
        return {
            fps: this.fps,
            frameCount: this.frameCount,
            canvasSize: this.size,
            gameInitialized: this.gameState.initialized
        };
    }
}

export default QueteDeVerite;