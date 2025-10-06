// Module Phase 3 : Révélation et climax
class Phase3Module {
    constructor(gameState) {
        this.gameState = gameState;
        this.canvas = null;
        this.ctx = null;
        this.initialized = false;
        this.revelationEffect = {
            intensity: 0,
            pulse: 0,
            revealed: false
        };
    }

    init(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.initialized = true;
        console.log('Phase 3 - Module révélation initialisé');
    }

    showRevelationMessage() {
        const message = document.querySelector('.message');
        if (message) {
            message.innerHTML = `
                <div style="text-align: center;">
                    <h3 style="margin-bottom: 15px; color: #ff6b6b;">⚡ Moment de Vérité ⚡</h3>
                    <p>La révélation approche... Êtes-vous prêt à voir la vérité ?</p>
                    <button class="message-button" onclick="window.gameManager.triggerRevelation()"
                            style="background: linear-gradient(145deg, #ff6b6b, #ee5a24);">
                        Révéler la Vérité
                    </button>
                </div>
            `;
            message.style.display = 'block';
        }
    }

    triggerRevelation() {
        this.revelationEffect.revealed = true;
        this.revelationEffect.intensity = 0;

        // Animation de révélation progressive
        const animate = () => {
            if (this.revelationEffect.intensity < 100) {
                this.revelationEffect.intensity += 2;
                this.revelationEffect.pulse = Math.sin(Date.now() * 0.01) * 0.5 + 0.5;
                setTimeout(animate, 50);
            }
        };
        animate();
    }

    update() {
        if (!this.initialized) return;

        // Effacer le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.revelationEffect.revealed) {
            this.drawRevelationEffect();
        } else {
            this.drawPreRevelation();
        }

        // Texte de phase
        this.ctx.fillStyle = this.revelationEffect.revealed ? '#ff6b6b' : '#7c3aed';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Phase 3 - Révélation', this.canvas.width / 2, 50);
    }

    drawPreRevelation() {
        // Fond sombre mystérieux
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#2c1810');
        gradient.addColorStop(0.5, '#3d2914');
        gradient.addColorStop(1, '#2c1810');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Effet de mystère
        this.ctx.save();
        this.ctx.globalAlpha = 0.3;
        this.ctx.fillStyle = '#7c3aed';

        for (let i = 0; i < 5; i++) {
            const x = this.canvas.width / 2 + Math.sin(Date.now() * 0.003 + i) * 100;
            const y = this.canvas.height / 2 + Math.cos(Date.now() * 0.002 + i) * 50;
            const size = 20 + Math.sin(Date.now() * 0.005 + i) * 10;

            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.restore();
    }

    drawRevelationEffect() {
        // Fond éclatant
        const intensity = this.revelationEffect.intensity / 100;
        const pulse = this.revelationEffect.pulse;

        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.width
        );

        const alpha = 0.3 + pulse * 0.4;
        gradient.addColorStop(0, `rgba(255, 215, 0, ${alpha * intensity})`);
        gradient.addColorStop(0.5, `rgba(255, 165, 0, ${alpha * intensity * 0.7})`);
        gradient.addColorStop(1, `rgba(255, 69, 0, ${alpha * intensity * 0.3})`);

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Rayons de lumière
        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);

        for (let i = 0; i < 12; i++) {
            this.ctx.save();
            this.ctx.rotate((i * Math.PI * 2) / 12 + Date.now() * 0.001);
            this.ctx.globalAlpha = intensity * (0.5 + pulse * 0.3);

            this.ctx.fillStyle = '#ffd700';
            this.ctx.fillRect(-2, -this.canvas.height, 4, this.canvas.height * 2);
            this.ctx.restore();
        }

        this.ctx.restore();

        // Texte de révélation
        if (intensity > 80) {
            this.ctx.save();
            this.ctx.globalAlpha = (intensity - 80) / 20;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('LA VÉRITÉ EST RÉVÉLÉE !', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.restore();
        }
    }

    handleEvent(eventType, data) {
        switch(eventType) {
            case 'click':
                if (!this.revelationEffect.revealed) {
                    this.triggerRevelation();
                }
                break;
            case 'touch':
                if (!this.revelationEffect.revealed) {
                    this.triggerRevelation();
                }
                break;
        }
    }

    cleanup() {
        console.log('Phase 3 - Nettoyage en cours');
        this.revelationEffect = {
            intensity: 0,
            pulse: 0,
            revealed: false
        };

        const message = document.querySelector('.message');
        if (message) {
            message.style.display = 'none';
        }
    }
}

// Export du module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Phase3Module;
} else {
    window.Phase3Module = Phase3Module;
}