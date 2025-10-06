// Module Phase 2 : Exploration et interaction
class Phase2Module {
    constructor(gameState) {
        this.gameState = gameState;
        this.canvas = null;
        this.ctx = null;
        this.initialized = false;
        this.particles = [];
        this.animationId = null;
    }

    init(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.initialized = true;
        this.setupParticles();
        console.log('Phase 2 - Module exploration initialisé');
    }

    setupParticles() {
        this.particles = [];
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                alpha: Math.random() * 0.8 + 0.2
            });
        }
    }

    showExplorationMessage() {
        const message = document.querySelector('.message');
        if (message) {
            message.innerHTML = `
                <div style="text-align: center;">
                    <h3 style="margin-bottom: 15px;">🔍 Phase d'Exploration</h3>
                    <p>Explorez l'environnement pour découvrir des indices...</p>
                    <button class="message-button" onclick="window.gameManager.startPhase2()">
                        Explorer
                    </button>
                </div>
            `;
            message.style.display = 'block';
        }
    }

    update() {
        if (!this.initialized) return;

        // Effacer le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Fond dégradé
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#e3f2fd');
        gradient.addColorStop(1, '#bbdefb');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Animer les particules
        this.updateParticles();
        this.drawParticles();

        // Texte de phase
        this.ctx.fillStyle = '#1976d2';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Phase 2 - Exploration', this.canvas.width / 2, 50);
    }

    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Rebond sur les bords
            if (particle.x <= 0 || particle.x >= this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y <= 0 || particle.y >= this.canvas.height) {
                particle.vy *= -1;
            }

            // Garder dans les limites
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = '#4da6ff';
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

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
        // Ajouter une particule à la position du clic
        this.particles.push({
            x: data.x,
            y: data.y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            size: Math.random() * 5 + 2,
            alpha: 1
        });

        console.log('Phase 2 - Click détecté:', data);
    }

    handleTouch(data) {
        this.handleClick(data); // Même comportement pour touch
    }

    cleanup() {
        console.log('Phase 2 - Nettoyage en cours');
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        const message = document.querySelector('.message');
        if (message) {
            message.style.display = 'none';
        }
    }
}

// Export du module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Phase2Module;
} else {
    window.Phase2Module = Phase2Module;
}