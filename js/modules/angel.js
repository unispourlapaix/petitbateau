/**
 * Système de l'Ange Gardien - Module RPG
 * Gère le héros ange avec ses auras, mouvements et interactions
 */

export class AngeGardien {
    constructor(canvasWidth, canvasHeight) {
        this.canvas = { width: canvasWidth, height: canvasHeight };
        this.paddle = {
            x: canvasWidth / 2 - 50,
            y: canvasHeight - 90,
            w: 100,
            h: 70
        };
        this.stats = {
            name: "Ange Gardien",
            level: 1,
            exp: 0,
            hp: 3,
            maxHp: 3
        };
        this.aura = {
            radius: 35,
            intensity: 0.2,
            color: '#f8f9fa' // Blanc doux moderne
        };
        this.touching = false;
    }

    // Getters pour les stats
    get level() { return this.stats.level; }
    get exp() { return this.stats.exp; }
    get hp() { return this.stats.hp; }
    get maxHp() { return this.stats.maxHp; }
    get name() { return this.stats.name; }

    // Position du centre de l'ange
    get centerX() { return this.paddle.x + this.paddle.w / 2; }
    get centerY() { return this.paddle.y + 25; }

    // Mise à jour des dimensions du canvas
    updateCanvasSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.paddle.y = height - 90;
        this.paddle.x = Math.max(0, Math.min(this.paddle.x, width - this.paddle.w));
    }

    // Déplacer l'ange
    moveTo(x) {
        this.paddle.x = x - this.paddle.w / 2;
        this.paddle.x = Math.max(0, Math.min(this.paddle.x, this.canvas.width - this.paddle.w));
    }

    // Gestion du toucher
    startTouch(x) {
        this.touching = true;
        this.moveTo(x);
    }

    moveTouch(x) {
        if (!this.touching) return;
        this.moveTo(x);
    }

    endTouch() {
        this.touching = false;
    }

    // Collision avec l'orbe
    checkOrbCollision(orb) {
        const distance = Math.sqrt(
            (orb.x - this.centerX) ** 2 + 
            (orb.y - this.centerY) ** 2
        );
        
        if (distance <= orb.r + 30) {
            // Protection divine - l'orbe rebondit
            orb.dy = -Math.abs(orb.dy);
            // Angle basé sur la position relative
            const angle = (orb.x - this.centerX) / 40;
            orb.dx = angle;
            return true;
        }
        return false;
    }

    // Gagner de l'expérience
    gainExp(amount) {
        this.stats.exp += amount;
        
        // Montée de niveau
        if (this.stats.exp >= 100) {
            this.levelUp();
        }
        
        return {
            leveledUp: this.stats.exp >= 100,
            currentLevel: this.stats.level,
            currentExp: this.stats.exp
        };
    }

    // Montée de niveau avec régénération HP
    levelUp() {
        this.stats.level++;
        this.stats.exp = 0;
        
        // Régénération divine
        if (this.stats.hp < this.stats.maxHp) {
            this.stats.hp++;
        }
        
        // Amélioration de l'aura
        this.aura.intensity = Math.min(0.5, this.aura.intensity + 0.02);
        this.aura.radius = Math.min(50, this.aura.radius + 2);
        
        return {
            newLevel: this.stats.level,
            hpRestored: true,
            newHp: this.stats.hp
        };
    }

    // Perdre de la vie
    takeDamage() {
        this.stats.hp--;
        return {
            isDead: this.stats.hp <= 0,
            currentHp: this.stats.hp
        };
    }

    // Réinitialiser l'ange
    reset() {
        this.stats = {
            name: "Ange Gardien",
            level: 1,
            exp: 0,
            hp: 3,
            maxHp: 3
        };
        this.aura = {
            radius: 35,
            intensity: 0.2,
            color: '#f8f9fa' // Blanc doux moderne
        };
        this.paddle.x = this.canvas.width / 2 - 50;
        this.touching = false;
    }

    // Dessiner l'aura divine moderne
    drawAura(ctx) {
        const x = this.centerX;
        const y = this.centerY;
        
        // Aura blanche élégante et subtile
        const pulseIntensity = this.aura.intensity + Math.sin(Date.now() * 0.003) * 0.05;
        const auraGrad = ctx.createRadialGradient(x, y, 0, x, y, this.aura.radius);
        auraGrad.addColorStop(0, `rgba(248, 249, 250, ${pulseIntensity * 0.8})`);
        auraGrad.addColorStop(0.5, `rgba(233, 236, 239, ${pulseIntensity * 0.4})`);
        auraGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(x, y, this.aura.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Cercle externe subtil
        ctx.strokeStyle = `rgba(206, 212, 218, ${pulseIntensity * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, this.aura.radius - 2, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Dessiner les ailes modernes épurées
    drawWings(ctx) {
        const x = this.centerX;
        const y = this.centerY;
        
        // Animation subtile des ailes
        const wingFlap = Math.sin(Date.now() * 0.008) * 0.05;
        
        // Style moderne minimaliste
        const wingGradient = ctx.createLinearGradient(x - 35, y - 15, x + 35, y - 15);
        wingGradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        wingGradient.addColorStop(0.5, 'rgba(248, 249, 250, 0.9)');
        wingGradient.addColorStop(1, 'rgba(255, 255, 255, 0.95)');
        
        ctx.fillStyle = wingGradient;
        ctx.strokeStyle = 'rgba(108, 117, 125, 0.3)';
        ctx.lineWidth = 1.5;
        
        // Aile gauche moderne
        ctx.beginPath();
        ctx.ellipse(x - 24, y - 6, 16, 10, -0.25 + wingFlap, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Détail interne aile gauche
        ctx.strokeStyle = 'rgba(173, 181, 189, 0.4)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.ellipse(x - 24, y - 6, 12, 7, -0.25 + wingFlap, 0, Math.PI * 2);
        ctx.stroke();
        
        // Aile droite moderne
        ctx.strokeStyle = 'rgba(108, 117, 125, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(x + 24, y - 6, 16, 10, 0.25 - wingFlap, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Détail interne aile droite
        ctx.strokeStyle = 'rgba(173, 181, 189, 0.4)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.ellipse(x + 24, y - 6, 12, 7, 0.25 - wingFlap, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Dessiner le corps de l'ange moderne
    drawBody(ctx) {
        const x = this.centerX;
        const y = this.centerY;
        
        // Corps avec gradient moderne et effet de profondeur
        const bodyGradient = ctx.createRadialGradient(x - 5, y - 5, 0, x, y, 22);
        bodyGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        bodyGradient.addColorStop(0.7, 'rgba(248, 249, 250, 0.95)');
        bodyGradient.addColorStop(1, 'rgba(233, 236, 239, 0.9)');
        
        ctx.fillStyle = bodyGradient;
        ctx.strokeStyle = 'rgba(108, 117, 125, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Effet de lumière interne
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(x - 6, y - 6, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Bordure interne subtile
        ctx.strokeStyle = 'rgba(173, 181, 189, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Dessiner l'auréole divine moderne
    drawHalo(ctx) {
        const x = this.centerX;
        const y = this.centerY - 28;
        
        // Auréole moderne et subtile
        const haloPulse = 1.5 + Math.sin(Date.now() * 0.006) * 0.3;
        
        // Cercle principal de l'auréole
        ctx.strokeStyle = `rgba(248, 249, 250, ${0.7 + haloPulse * 0.2})`;
        ctx.lineWidth = haloPulse;
        ctx.beginPath();
        ctx.arc(x, y, 11, 0, Math.PI * 2);
        ctx.stroke();
        
        // Cercle intérieur
        ctx.strokeStyle = `rgba(233, 236, 239, ${0.5 + haloPulse * 0.15})`;
        ctx.lineWidth = haloPulse * 0.7;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.stroke();
        
        // Points de lumière modernes (plus subtils)
        ctx.fillStyle = `rgba(255, 255, 255, ${0.6 + haloPulse * 0.2})`;
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const pointX = x + Math.cos(angle) * 14;
            const pointY = y + Math.sin(angle) * 14;
            
            ctx.beginPath();
            ctx.arc(pointX, pointY, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Dessiner le visage héroïque
    drawFace(ctx) {
        const x = this.centerX;
        const y = this.centerY;
        
        // Expression selon le niveau de HP
        let expression = '😇';
        if (this.stats.hp <= 1) {
            expression = '😰';
        } else if (this.stats.hp === 2) {
            expression = '😌';
        }
        
        ctx.fillStyle = '#2C3E50';
        ctx.font = `${Math.max(this.canvas.width * 0.035, 14)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(expression, x, y + 8);
    }

    // Dessiner l'ange complet
    draw(ctx) {
        ctx.save();
        
        // Ordre de dessin pour les effets de profondeur
        this.drawAura(ctx);
        this.drawWings(ctx);
        this.drawBody(ctx);
        this.drawHalo(ctx);
        this.drawFace(ctx);
        
        ctx.restore();
    }

    // Obtenir les statistiques pour l'interface
    getStatsForUI() {
        return {
            name: this.stats.name,
            level: this.stats.level,
            exp: this.stats.exp,
            hp: this.stats.hp,
            maxHp: this.stats.maxHp,
            hearts: '❤️'.repeat(this.stats.hp) + '🖤'.repeat(this.stats.maxHp - this.stats.hp)
        };
    }
}

// Export par défaut pour compatibilité
export default AngeGardien;