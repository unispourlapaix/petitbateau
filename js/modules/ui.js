/**
 * Interface RPG - Module de gestion de l'interface utilisateur
 */

export class RPGInterface {
    constructor(canvasWidth, canvasHeight) {
        this.canvas = { width: canvasWidth, height: canvasHeight };
        this.headerHeight = 70;
        this.animations = {
            expBar: 0,
            hearts: {},
            questTitle: { scale: 1, pulse: 0 }
        };
    }

    // Mise à jour des dimensions
    updateCanvasSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    // Animer la barre d'expérience
    animateExpBar(targetExp, duration = 1000) {
        const startTime = Date.now();
        const startExp = this.animations.expBar;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing pour une animation fluide
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            this.animations.expBar = startExp + (targetExp - startExp) * easeProgress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Animer les cœurs (dégâts/guérison)
    animateHearts(heartIndex, type = 'damage') {
        this.animations.hearts[heartIndex] = {
            type,
            startTime: Date.now(),
            duration: 1000,
            scale: type === 'damage' ? 1.5 : 1.2,
            alpha: 1
        };
    }

    // Animer le titre de quête
    animateQuestTitle() {
        this.animations.questTitle.pulse = Date.now();
    }

    // Dessiner le panneau de quête principal
    drawQuestPanel(ctx) {
        // Panneau principal avec dégradé
        const panelGrad = ctx.createLinearGradient(0, 0, 0, this.headerHeight);
        panelGrad.addColorStop(0, 'rgba(44, 62, 80, 0.95)');
        panelGrad.addColorStop(1, 'rgba(52, 73, 94, 0.9)');
        ctx.fillStyle = panelGrad;
        ctx.fillRect(0, 0, this.canvas.width, this.headerHeight);
        
        // Bordure dorée
        ctx.strokeStyle = '#F39C12';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, this.canvas.width, this.headerHeight);
        
        // Effet de lueur sur les bords
        const glowGrad = ctx.createLinearGradient(0, 0, 0, 5);
        glowGrad.addColorStop(0, 'rgba(243, 156, 18, 0.3)');
        glowGrad.addColorStop(1, 'rgba(243, 156, 18, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, this.canvas.width, 5);
        
        // Motifs décoratifs dans les coins
        this.drawCornerDecorations(ctx);
    }

    // Dessiner les décorations des coins
    drawCornerDecorations(ctx) {
        ctx.strokeStyle = 'rgba(243, 156, 18, 0.6)';
        ctx.lineWidth = 1;
        
        // Coin supérieur gauche
        ctx.beginPath();
        ctx.moveTo(10, 15);
        ctx.lineTo(25, 15);
        ctx.moveTo(15, 10);
        ctx.lineTo(15, 25);
        ctx.stroke();
        
        // Coin supérieur droit
        ctx.beginPath();
        ctx.moveTo(this.canvas.width - 10, 15);
        ctx.lineTo(this.canvas.width - 25, 15);
        ctx.moveTo(this.canvas.width - 15, 10);
        ctx.lineTo(this.canvas.width - 15, 25);
        ctx.stroke();
    }

    // Dessiner le titre de quête avec animation
    drawQuestTitle(ctx, questTitle) {
        // Animation de pulsation
        const timeSincePulse = Date.now() - this.animations.questTitle.pulse;
        let scale = 1;
        if (timeSincePulse < 2000) {
            scale = 1 + Math.sin(timeSincePulse / 200) * 0.1;
        }
        
        ctx.save();
        ctx.translate(this.canvas.width / 2, 20);
        ctx.scale(scale, scale);
        
        // Ombre du texte
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.font = `bold ${Math.max(this.canvas.width * 0.025, 12)}px serif`;
        ctx.textAlign = 'center';
        ctx.fillText(`⚔️ ${questTitle} ⚔️`, 1, 1);
        
        // Texte principal
        ctx.fillStyle = '#F39C12';
        ctx.fillText(`⚔️ ${questTitle} ⚔️`, 0, 0);
        
        ctx.restore();
    }

    // Dessiner les statistiques du héros
    drawHeroStats(ctx, heroStats) {
        const fontSize = Math.max(this.canvas.width * 0.02, 10);
        ctx.fillStyle = '#ECF0F1';
        ctx.font = `${fontSize}px sans-serif`;
        
        // Nom et niveau (gauche)
        ctx.textAlign = 'left';
        ctx.fillText(`😇 ${heroStats.name} - Niv.${heroStats.level}`, 10, 38);
        
        // Points de vie (droite) avec animation
        ctx.textAlign = 'right';
        this.drawAnimatedHearts(ctx, heroStats.hearts, this.canvas.width - 10, 38);
        
        // Progression de quête (centre)
        ctx.textAlign = 'center';
        ctx.fillText(`Cité Libérée: ${heroStats.progress}/${heroStats.total}`, this.canvas.width / 2, 38);
    }

    // Dessiner les cœurs animés
    drawAnimatedHearts(ctx, hearts, x, y) {
        ctx.save();
        
        const heartArray = hearts.split('');
        let currentX = x;
        
        heartArray.reverse().forEach((heart, index) => {
            const animation = this.animations.hearts[index];
            let scale = 1;
            let alpha = 1;
            
            if (animation) {
                const elapsed = Date.now() - animation.startTime;
                const progress = elapsed / animation.duration;
                
                if (progress < 1) {
                    scale = animation.scale * (1 - progress) + 1 * progress;
                    alpha = animation.type === 'damage' ? 1 - progress * 0.5 : 1;
                } else {
                    delete this.animations.hearts[index];
                }
            }
            
            ctx.save();
            ctx.translate(currentX, y);
            ctx.scale(scale, scale);
            ctx.globalAlpha = alpha;
            
            ctx.font = `${Math.max(this.canvas.width * 0.02, 10)}px sans-serif`;
            ctx.textAlign = 'right';
            ctx.fillText(heart, 0, 0);
            
            ctx.restore();
            
            currentX -= 20;
        });
        
        ctx.restore();
    }

    // Dessiner la barre d'expérience
    drawExpBar(ctx, currentExp, maxExp = 100) {
        const barX = 10;
        const barY = 50;
        const barWidth = this.canvas.width - 20;
        const barHeight = 8;
        
        // Fond de la barre
        ctx.fillStyle = 'rgba(52, 73, 94, 0.8)';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Barre d'expérience avec dégradé
        const expProgress = this.animations.expBar / maxExp;
        const expWidth = barWidth * expProgress;
        
        if (expWidth > 0) {
            const expGrad = ctx.createLinearGradient(barX, barY, barX + expWidth, barY);
            expGrad.addColorStop(0, '#F39C12');
            expGrad.addColorStop(0.5, '#E67E22');
            expGrad.addColorStop(1, '#D35400');
            
            ctx.fillStyle = expGrad;
            ctx.fillRect(barX, barY, expWidth, barHeight);
            
            // Effet de brillance sur la barre
            const glowGrad = ctx.createLinearGradient(barX, barY, barX, barY + barHeight / 2);
            glowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = glowGrad;
            ctx.fillRect(barX, barY, expWidth, barHeight / 2);
        }
        
        // Bordure de la barre
        ctx.strokeStyle = '#34495E';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
        
        // Texte de l'expérience
        ctx.fillStyle = '#ECF0F1';
        ctx.font = `${Math.max(this.canvas.width * 0.018, 9)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(`EXP: ${Math.floor(currentExp)}/100`, this.canvas.width / 2, 64);
    }

    // Effet de niveau supérieur
    drawLevelUpEffect(ctx, centerX, centerY) {
        const time = Date.now();
        
        // Cercle de lumière qui s'étend
        for (let i = 0; i < 3; i++) {
            const radius = 30 + i * 15 + Math.sin(time * 0.01 + i) * 10;
            const alpha = 0.3 - i * 0.1;
            
            const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
            grad.addColorStop(0, `rgba(255, 215, 0, ${alpha})`);
            grad.addColorStop(1, `rgba(255, 215, 0, 0)`);
            
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Particules dorées qui montent
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const distance = 40 + Math.sin(time * 0.015 + i) * 20;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance - Math.sin(time * 0.02) * 10;
            
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Dessiner l'interface complète
    draw(ctx, gameState) {
        // Panneau principal
        this.drawQuestPanel(ctx);
        
        // Titre de la quête
        this.drawQuestTitle(ctx, gameState.quest.title);
        
        // Statistiques du héros
        this.drawHeroStats(ctx, {
            name: gameState.angel.name,
            level: gameState.angel.level,
            hearts: gameState.angel.hearts,
            progress: gameState.quest.progress,
            total: gameState.quest.total
        });
        
        // Barre d'expérience
        this.drawExpBar(ctx, gameState.angel.exp, 100);
        
        // Effets spéciaux si nécessaire
        if (gameState.showLevelUpEffect) {
            this.drawLevelUpEffect(ctx, gameState.angel.centerX, gameState.angel.centerY);
        }
    }

    // Mettre à jour les animations
    update(gameState) {
        // Synchroniser la barre d'EXP si nécessaire
        const targetExp = gameState.angel.exp % 100;
        if (Math.abs(this.animations.expBar - targetExp) > 1) {
            this.animateExpBar(targetExp, 500);
        }
    }

    // Déclencher une animation de dégâts
    triggerDamageAnimation(heartIndex) {
        this.animateHearts(heartIndex, 'damage');
    }

    // Déclencher une animation de guérison
    triggerHealAnimation(heartIndex) {
        this.animateHearts(heartIndex, 'heal');
    }

    // Déclencher l'animation du titre
    triggerQuestTitlePulse() {
        this.animateQuestTitle();
    }
}

export default RPGInterface;