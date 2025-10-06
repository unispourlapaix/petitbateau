/**
 * Orbe de Vérité - Module de gestion de la balle magique
 */

export class OrbeDeVerite {
    constructor(canvasWidth, canvasHeight) {
        this.canvas = { width: canvasWidth, height: canvasHeight };
        this.reset(canvasWidth, canvasHeight);
        this.particles = [];
        this.trail = [];
        this.maxTrailLength = 10;
    }

    // Réinitialiser la position de l'orbe
    reset(canvasWidth, canvasHeight, paddleY = null) {
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        
        const defaultPaddleY = canvasHeight - 90;
        const py = paddleY !== null ? paddleY : defaultPaddleY;
        
        this.x = canvasWidth / 2;
        this.y = py - 35;
        this.dx = 0.8;
        this.dy = -0.8;
        this.r = 12;
        this.speed = 1.0;
        this.trail = [];
        this.particles = [];
        
        // État de l'orbe
        this.active = true;
        this.glowing = false;
        this.powerLevel = 1;
    }

    // Mise à jour des dimensions du canvas
    updateCanvasSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    // Repositionner près de la raquette
    repositionNearPaddle(paddleX, paddleY, paddleW) {
        this.x = paddleX + paddleW / 2;
        this.y = paddleY - 35;
        this.dx = 0.8;
        this.dy = -0.8;
        this.trail = [];
        this.particles = [];
    }

    // Mise à jour de la physique
    update() {
        if (!this.active) return;
        
        // Sauvegarder la position précédente pour la traînée
        this.trail.unshift({ x: this.x, y: this.y, alpha: 1.0 });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.pop();
        }
        
        // Diminuer l'alpha de la traînée
        this.trail.forEach((point, index) => {
            point.alpha = Math.max(0, 1 - (index / this.maxTrailLength));
        });
        
        // Mouvement de l'orbe
        this.x += this.dx * this.speed;
        this.y += this.dy * this.speed;
        
        // Mise à jour des particules magiques
        this.updateParticles();
        
        // Générer de nouvelles particules si l'orbe brille
        if (this.glowing) {
            this.generateParticles();
        }
    }

    // Gestion des rebonds sur les bords
    checkBoundaryCollisions() {
        let bounced = false;
        
        // Rebonds latéraux
        if (this.x <= this.r || this.x >= this.canvas.width - this.r) {
            this.dx = -this.dx;
            bounced = true;
            this.createBounceEffect();
        }
        
        // Rebond sur le haut (interface RPG)
        if (this.y <= this.r + 70) {
            this.dy = -this.dy;
            bounced = true;
            this.createBounceEffect();
        }
        
        return bounced;
    }

    // Vérifier si l'orbe est tombée
    checkFallOut() {
        return this.y > this.canvas.height;
    }

    // Collision avec un rectangle (bâtiment)
    checkRectCollision(rect) {
        return (
            this.x + this.r >= rect.x &&
            this.x - this.r <= rect.x + rect.w &&
            this.y + this.r >= rect.y &&
            this.y - this.r <= rect.y + rect.h
        );
    }

    // Appliquer l'effet de rebond sur l'ange
    bounceOffAngel(angelX, angelY) {
        this.dy = -Math.abs(this.dy);
        
        // Calcul de l'angle basé sur la position relative
        const relativePos = (this.x - angelX) / 40;
        this.dx = Math.max(-2, Math.min(2, relativePos));
        
        // Effet visuel
        this.glowing = true;
        this.powerLevel = Math.min(3, this.powerLevel + 0.1);
        
        setTimeout(() => {
            this.glowing = false;
        }, 500);
    }

    // Créer un effet de rebond
    createBounceEffect() {
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * 2,
                vy: Math.sin(angle) * 2,
                life: 30,
                maxLife: 30,
                color: '#3498DB',
                size: 3
            });
        }
    }

    // Générer des particules magiques
    generateParticles() {
        if (Math.random() < 0.3) {
            this.particles.push({
                x: this.x + (Math.random() - 0.5) * this.r * 2,
                y: this.y + (Math.random() - 0.5) * this.r * 2,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1,
                life: 20,
                maxLife: 20,
                color: '#FFD700',
                size: Math.random() * 3 + 1
            });
        }
    }

    // Mise à jour des particules
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            return particle.life > 0;
        });
    }

    // Dessiner la traînée magique
    drawTrail(ctx) {
        if (this.trail.length < 2) return;
        
        ctx.save();
        ctx.strokeStyle = '#74B9FF';
        ctx.lineWidth = this.r * 0.8;
        ctx.lineCap = 'round';
        
        for (let i = 1; i < this.trail.length; i++) {
            const current = this.trail[i];
            const previous = this.trail[i - 1];
            
            ctx.globalAlpha = current.alpha * 0.5;
            ctx.lineWidth = this.r * 0.8 * current.alpha;
            
            ctx.beginPath();
            ctx.moveTo(previous.x, previous.y);
            ctx.lineTo(current.x, current.y);
            ctx.stroke();
        }
        
        ctx.restore();
    }

    // Dessiner les particules
    drawParticles(ctx) {
        ctx.save();
        
        this.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
            ctx.fill();
        });
        
        ctx.restore();
    }

    // Dessiner l'ombre de l'orbe
    drawShadow(ctx) {
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.arc(this.x + 2, this.y + 2, this.r, 0, Math.PI * 2);
        ctx.fill();
    }

    // Dessiner l'orbe principal
    drawOrb(ctx) {
        // Gradient radial pour l'effet 3D
        const orbGrad = ctx.createRadialGradient(
            this.x - this.r * 0.3,
            this.y - this.r * 0.3,
            0,
            this.x,
            this.y,
            this.r
        );
        
        // Couleurs selon le niveau de puissance
        const intensity = this.powerLevel / 3;
        const baseColor = this.glowing ? 
            `rgba(255, 215, 0, ${0.95 + intensity * 0.05})` : 
            'rgba(255, 255, 255, 0.95)';
        const middleColor = this.glowing ? 
            `rgba(116, 185, 255, ${0.8 + intensity * 0.1})` : 
            'rgba(116, 185, 255, 0.8)';
        const outerColor = this.glowing ? 
            `rgba(52, 152, 219, ${0.9 + intensity * 0.1})` : 
            'rgba(52, 152, 219, 0.9)';
        
        orbGrad.addColorStop(0, baseColor);
        orbGrad.addColorStop(0.5, middleColor);
        orbGrad.addColorStop(1, outerColor);
        
        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        
        // Contour magique
        ctx.strokeStyle = this.glowing ? '#FFD700' : '#3498DB';
        ctx.lineWidth = this.glowing ? 3 : 2;
        ctx.stroke();
    }

    // Dessiner le symbole de vérité
    drawTruthSymbol(ctx) {
        ctx.fillStyle = this.glowing ? '#FF6B35' : '#E74C3C';
        ctx.font = `${this.r}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Effet de pulsation
        const pulse = this.glowing ? 1 + Math.sin(Date.now() * 0.01) * 0.2 : 1;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(pulse, pulse);
        ctx.fillText('💎', 0, 0);
        ctx.restore();
    }

    // Dessiner l'orbe complet
    draw(ctx) {
        if (!this.active) return;
        
        ctx.save();
        
        // Ordre de dessin pour les effets de profondeur
        this.drawTrail(ctx);
        this.drawShadow(ctx);
        this.drawOrb(ctx);
        this.drawTruthSymbol(ctx);
        this.drawParticles(ctx);
        
        ctx.restore();
    }

    // Activer/désactiver l'orbe
    setActive(active) {
        this.active = active;
        if (!active) {
            this.trail = [];
            this.particles = [];
        }
    }

    // Augmenter la vitesse
    increaseSpeed(amount = 0.1) {
        this.speed = Math.min(2.0, this.speed + amount);
    }

    // Obtenir l'état de l'orbe
    getState() {
        return {
            x: this.x,
            y: this.y,
            dx: this.dx,
            dy: this.dy,
            r: this.r,
            speed: this.speed,
            active: this.active,
            powerLevel: this.powerLevel,
            glowing: this.glowing
        };
    }
}

export default OrbeDeVerite;