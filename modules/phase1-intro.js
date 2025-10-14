// Module Phase 1 : Introduction - "L'aube des doutes"
class Phase1Module {
    constructor(gameState) {
        this.gameState = gameState;
        this.canvas = null;
        this.ctx = null;
        this.initialized = false;

        // État de l'intro narrative
        this.introPhase = {
            id: 'VDV_NARR_P01_INTRO_LUMIERE',
            phase: 1,
            titre: 'Voyage — L\'aube des doutes',
            texte: "💭 \"On m'a dit qu'ils étaient tous des monstres...\nOn m'a dit tant de mal, tant de malheurs sur eux...\nMais moi, j'ai préféré aller voir de mes propres yeux.\"",
            mode: 'intro',
            duree: 8000,
            transition: 'fade',
            speed: 35
        };

        this.showingIntro = false;
        this.introStartTime = 0;
        this.textAnimator = null;
    }

    init(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.initialized = true;
        this.setupTextAnimator();
        console.log('Phase 1 - Module intro narratif initialisé');
    }

    setupTextAnimator() {
        // Système d'animation de texte similaire au jeu original
        this.textAnimator = {
            currentText: '',
            targetText: '',
            charIndex: 0,
            isAnimating: false,
            speed: 35,

            startAnimation(text, speed = 35) {
                this.targetText = text;
                this.currentText = '';
                this.charIndex = 0;
                this.isAnimating = true;
                this.speed = speed;
            },

            update() {
                if (!this.isAnimating) return false;

                if (this.charIndex < this.targetText.length) {
                    if (Date.now() % this.speed < 16) {
                        this.currentText += this.targetText[this.charIndex];
                        this.charIndex++;
                    }
                    return true;
                } else {
                    this.isAnimating = false;
                    return false;
                }
            }
        };
    }

    // Affichage du message d'introduction narratif
    showIntroMessage() {
        if (!this.initialized) return;

        const message = document.querySelector('.message');
        if (message) {
            message.innerHTML = `
                <div style="text-align: center;">
                    <h2 style="margin-bottom: 20px; color: #ffd700;">🌅 L'aube des doutes 🌅</h2>
                    <div style="font-style: italic; margin-bottom: 20px; color: #e3f2fd;">
                        "Un voyage commence toujours par un premier pas..."
                    </div>
                    <button class="message-button" onclick="window.gameManager.startIntroNarrative()"
                            style="background: linear-gradient(145deg, #ff8a65, #ff7043);">
                        Commencer le voyage
                    </button>
                </div>
            `;
            message.style.display = 'block';
        }
    }

    // Commencer la narration d'introduction
    startIntroNarrative() {
        this.showingIntro = true;
        this.introStartTime = Date.now();

        // Masquer le message d'accueil
        const message = document.querySelector('.message');
        if (message) {
            message.style.display = 'none';
        }

        // Démarrer l'animation du texte narratif
        this.textAnimator.startAnimation(this.introPhase.texte, this.introPhase.speed);

        console.log('Phase 1 - Début de la narration intro');
    }

    // Setup visuel du canvas pour l'intro
    setupCanvas() {
        if (!this.canvas || !this.ctx) return;

        // Fond dégradé pour l'ambiance de l'aube
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#ff9a56'); // Orange aube
        gradient.addColorStop(0.3, '#ffad7a');
        gradient.addColorStop(0.7, '#ffcc99');
        gradient.addColorStop(1, '#fff4e6'); // Beige clair

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Titre de la phase
        this.ctx.fillStyle = '#8b4513';
        this.ctx.font = 'bold 18px serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Phase 1 - L\'aube des doutes', this.canvas.width / 2, 40);
    }

    // Mise à jour de la phase 1
    update() {
        if (!this.initialized) return;

        // Dessiner le fond
        this.setupCanvas();

        if (this.showingIntro) {
            this.updateIntroNarrative();
        } else {
            this.drawWaitingState();
        }
    }

    updateIntroNarrative() {
        // Mettre à jour l'animation du texte
        const isAnimating = this.textAnimator.update();

        // Garder le fond original (pas de fond sombre)
        this.setupCanvas();

        // Dessiner le texte animé
        this.drawNarrativeText();

        // Vérifier si l'intro est terminée
        const elapsed = Date.now() - this.introStartTime;
        if (elapsed > this.introPhase.duree && !isAnimating) {
            this.completeIntro();
        }
    }

    drawNarrativeText() {
        const text = this.textAnimator.currentText;
        const lines = text.split('\n');

        // Configuration du texte - blanc centré sans fond
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 18px serif';
        this.ctx.textAlign = 'center';

        // Ombre légère pour la lisibilité
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        this.ctx.shadowBlur = 2;
        this.ctx.shadowOffsetX = 1;
        this.ctx.shadowOffsetY = 1;

        // Largeur maximale du texte (plus étroit pour meilleure lisibilité)
        const maxWidth = this.canvas.width * 0.7; // 70% de la largeur du canvas

        // Position de départ
        const lineHeight = 30;
        const startY = this.canvas.height / 2 - (lines.length * lineHeight) / 2;

        // Dessiner chaque ligne avec gestion de la largeur
        lines.forEach((line, index) => {
            if (line.trim()) {
                const words = line.trim().split(' ');
                let currentLine = '';
                let y = startY + (index * lineHeight);

                // Ajuster si le texte dépasse la largeur max
                for (let word of words) {
                    const testLine = currentLine + (currentLine ? ' ' : '') + word;
                    const metrics = this.ctx.measureText(testLine);

                    if (metrics.width > maxWidth && currentLine) {
                        // Dessiner la ligne actuelle
                        this.ctx.fillText(currentLine, this.canvas.width / 2, y);
                        currentLine = word;
                        y += lineHeight;
                    } else {
                        currentLine = testLine;
                    }
                }

                // Dessiner la dernière ligne
                if (currentLine) {
                    this.ctx.fillText(currentLine, this.canvas.width / 2, y);
                }
            }
        });

        // Réinitialiser l'ombre
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
    }

    drawWaitingState() {
        // État d'attente - paysage de l'aube
        this.drawSun();
        this.drawClouds();

        // Texte d'indication
        this.ctx.fillStyle = '#8b4513';
        this.ctx.font = '14px serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            window.getTranslatedText ? window.getTranslatedText('game.instructions.click_to_start', 'Cliquez pour commencer le voyage...') : 'Cliquez pour commencer le voyage...',
            this.canvas.width / 2,
            this.canvas.height - 30
        );
    }

    drawSun() {
        // Soleil levant
        const sunX = this.canvas.width / 2;
        const sunY = this.canvas.height / 3;
        const sunRadius = 30;

        // Rayons de soleil
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.lineWidth = 2;
        for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI * 2) / 12;
            const startX = sunX + Math.cos(angle) * (sunRadius + 5);
            const startY = sunY + Math.sin(angle) * (sunRadius + 5);
            const endX = sunX + Math.cos(angle) * (sunRadius + 15);
            const endY = sunY + Math.sin(angle) * (sunRadius + 15);

            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();
        }

        // Soleil
        const sunGradient = this.ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius);
        sunGradient.addColorStop(0, '#fff200');
        sunGradient.addColorStop(0.7, '#ffa500');
        sunGradient.addColorStop(1, '#ff8c00');

        this.ctx.fillStyle = sunGradient;
        this.ctx.beginPath();
        this.ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawClouds() {
        // Nuages simples
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

        // Nuage 1
        this.drawCloud(this.canvas.width * 0.2, this.canvas.height * 0.25, 25);

        // Nuage 2
        this.drawCloud(this.canvas.width * 0.8, this.canvas.height * 0.3, 20);
    }

    drawCloud(x, y, size) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.arc(x + size * 0.7, y, size * 0.8, 0, Math.PI * 2);
        this.ctx.arc(x + size * 1.2, y, size * 0.6, 0, Math.PI * 2);
        this.ctx.arc(x + size * 0.6, y - size * 0.5, size * 0.7, 0, Math.PI * 2);
        this.ctx.fill();
    }

    completeIntro() {
        this.showingIntro = false;
        console.log('Phase 1 - Intro narrative terminée');

        // 🎯 BONUS 100 XP pour avoir regardé l'intro complète
        this.rewardIntroCompletion();

        // Montrer le message de transition
        const message = document.querySelector('.message');
        if (message) {
            const getTranslated = window.getTranslatedText || ((key, fallback) => fallback);
            message.innerHTML = `
                <div style="text-align: center;">
                    <h3 style="margin-bottom: 15px; color: #4caf50;">${getTranslated('ui.journey_begins', '✨ Le voyage commence ✨')}</h3>
                    <p>${getTranslated('ui.opened_eyes', 'Vous avez ouvert vos yeux à la vérité...')}</p>
                    <p style="color: #ffd700; font-size: 14px; margin: 10px 0;">
                        ${getTranslated('ui.intro_complete_xp', '🌟 +100 XP pour avoir regardé l\'introduction complète ! 🌟')}
                    </p>
                    <button class="message-button" onclick="window.gameManager.nextPhase()"
                            style="background: linear-gradient(145deg, #4caf50, #45a049);">
                        ${getTranslated('ui.continue_journey', 'Continuer le voyage')}
                    </button>
                </div>
            `;
            message.style.display = 'block';
        }
    }

    /**
     * Récompense pour avoir regardé l'intro complète
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
            // Méthode 4: Via gameState
            else if (this.gameState && this.gameState.angel) {
                mainAngel = this.gameState.angel;
            }

            if (mainAngel && typeof mainAngel.gainExp === 'function') {
                const result = mainAngel.gainExp(rewardAmount);
                console.log(`🌟 XP transféré vers l'ange depuis intro: +${rewardAmount} XP (niveau: ${result.currentLevel}, total: ${result.currentExp})`);

                // Afficher un message temporaire à l'écran
                this.showXPRewardMessage(rewardAmount);
                return true;
            } else {
                console.log(`⚠️ Impossible de trouver l'ange principal pour transférer ${rewardAmount} XP depuis intro`);
                return false;
            }
        } catch (error) {
            console.error('❌ Erreur lors du transfert XP depuis intro:', error);
            return false;
        }
    }

    /**
     * Afficher un message visuel de récompense XP
     */
    showXPRewardMessage(amount) {
        if (!this.canvas || !this.ctx) return;

        // Créer un effet visuel temporaire
        const startTime = Date.now();
        const duration = 2000; // 2 secondes

        const drawReward = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed > duration) return;

            const progress = elapsed / duration;
            const alpha = 1 - progress;
            const y = this.canvas.height / 2 - (progress * 50);

            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = '#ffd700';
            this.ctx.font = 'bold 24px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.strokeStyle = '#ff8c00';
            this.ctx.lineWidth = 2;

            const text = `+${amount} XP`;
            this.ctx.strokeText(text, this.canvas.width / 2, y);
            this.ctx.fillText(text, this.canvas.width / 2, y);

            this.ctx.restore();

            if (elapsed < duration) {
                requestAnimationFrame(drawReward);
            }
        };

        requestAnimationFrame(drawReward);
    }

    // Nettoyage lors du changement de phase
    cleanup() {
        console.log('Phase 1 - Nettoyage en cours');
        const message = document.querySelector('.message');
        if (message) {
            message.style.display = 'none';
        }
    }

    // Gestion des événements spécifiques à la phase 1
    handleEvent(eventType, data) {
        switch(eventType) {
            case 'click':
                this.handleClick(data);
                break;
            case 'touch':
                this.handleTouch(data);
                break;
        }
    }

    handleClick(data) {
        console.log('Phase 1 - Click détecté:', data);
    }

    handleTouch(data) {
        console.log('Phase 1 - Touch détecté:', data);
    }
}

// Export du module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Phase1Module;
} else {
    window.Phase1Module = Phase1Module;
}