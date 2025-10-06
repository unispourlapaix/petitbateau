// Phase Bonus - Le Mur dans la Mer
class PhaseBonusMur {
    constructor(gameState) {
        this.gameState = gameState;
        this.canvas = null;
        this.ctx = null;
        this.initialized = false;

        // État de la phase bonus - Les 6 parties du Mur d'avare\rit
        this.phaseData = {
            id: 'VDV_BONUS_MUR_AVARIE',
            titre: 'Épilogue — LE MUR d\'avare\\rit',
            parties: [
                {
                    id: 'P1',
                    texte: `💭 "Au loin… je vois un mur.
Un mur dressé dans la mer comme une cicatrice.
Un mur qui n'est pas fait de pierres,
mais de lois, de papiers et de regards fermés."`
                },
                {
                    id: 'P2',
                    texte: `💭 "Ce mur est la prison de la liberté des hommes.
Il sépare ceux qui peuvent courir sans chaînes,
et ceux qu'on enferme dans des frontières invisibles."`
                },
                {
                    id: 'P3',
                    texte: `💭 "Pour les pauvres, il est barbelé de refus,
fermé comme une porte rouillée.
Ils y frappent de leurs mains nues,
leurs rêves brisés par le silence des gardiens."`
                },
                {
                    id: 'P4',
                    texte: `💭 "Pour les riches, il est une porte d'or.
Elle s'ouvre sans effort,
et les laisse circuler comme le vent qui n'a pas de patrie."`
                },
                {
                    id: 'P5',
                    texte: `💭 "Alors je me demande…
La liberté est-elle vraiment un droit,
ou est-elle devenue un privilège vendu aux plus offrants ?"`
                },
                {
                    id: 'P6',
                    texte: `💭 "Mais dans le cœur des vagues,
la mer murmure une vérité :
aucun mur n'est éternel.
Car l'eau finit toujours par user la pierre,
et la liberté, tôt ou tard,
reprendra son chemin."`
                },
                {
                    id: 'ÉPILOGUE',
                    texte: `💭 "Ce mur se dresse, orgueilleux,
fait de briques volées à l'espoir,
de ciment arraché aux rêves,
de poutres qui auraient pu abriter des vies.

C'est nous, par nos silences et nos maux,
par nos peurs murmurées,
par nos mots jetés comme pierres,
qui le rendons plus solide.

C'est un mur d'égoïsme,
construit avec ce qui aurait pu être des toits,
des refuges, des foyers.

L'humanité n'a pas besoin de murs pour se protéger,
mais de ponts pour se rencontrer.
Construisons avec amour, pas avec peur.
Un monde uni vaut mieux qu'un monde cloisonné."

✨ LE MUR S'EFFRITE DÉFINITIVEMENT ✨`
                }
            ],
            duree: 45000, // 45 secondes
            rewardXP: 200
        };

        this.showingBonus = false;
        this.startTime = 0;
        this.textAnimator = null;
        this.waveAnimation = 0;
        this.currentPartie = 0; // Index de la partie actuelle (0-6 pour P1-P6+ÉPILOGUE)
        this.partieStartTime = 0;
        this.partieDuration = 7000; // 7 secondes par partie (sauf épilogue)
    }

    init(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.initialized = true;
        this.setupTextAnimator();
        console.log('Phase Bonus - Le Mur dans la Mer initialisée');
    }

    setupTextAnimator() {
        this.textAnimator = {
            currentText: '',
            targetText: '',
            charIndex: 0,
            isAnimating: false,
            speed: 15, // Plus lent pour un effet contemplatif

            startAnimation(text, speed = 15) {
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

    // Démarrer la phase bonus
    start() {
        if (!this.initialized) return;

        this.showingBonus = true;
        this.startTime = Date.now();

        // Afficher le message d'introduction
        const message = document.querySelector('.message');
        if (message) {
            message.innerHTML = `
                <div style="text-align: center; background: linear-gradient(135deg, #1e3c72, #2a5298); padding: 20px; border-radius: 10px;">
                    <h2 style="margin-bottom: 20px; color: #ffffff; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">🌊 Phase Bonus Débloquée 🌊</h2>
                    <p style="color: #e3f2fd; margin-bottom: 20px;">
                        Vous avez terminé votre voyage de vérité.<br>
                        Voici une réflexion finale sur notre monde...
                    </p>
                    <p style="color: #ffd700; font-size: 14px; margin: 10px 0;">
                        🌟 +200 XP pour avoir complété le jeu ! 🌟
                    </p>
                    <button class="message-button" onclick="window.phaseBonusMur.startBonusPoem()"
                            style="background: linear-gradient(145deg, #4caf50, #45a049); margin-top: 15px;">
                        Lire l'épilogue poétique
                    </button>
                </div>
            `;
            message.style.display = 'block';
        }

        // Le bonus XP est maintenant géré par le jeu principal

        console.log('Phase Bonus - Démarrage de l\'épilogue');
    }

    // Commencer le poème en 6 parties
    startBonusPoem() {
        // Masquer le message d'introduction
        const message = document.querySelector('.message');
        if (message) {
            message.style.display = 'none';
        }

        // Démarrer avec la première partie (P1)
        this.currentPartie = 0;
        this.partieStartTime = Date.now();
        this.startCurrentPartie();
        console.log('Phase Bonus - Début des 6 parties du Mur d\'avare\\rit');
    }

    // Démarrer l'affichage de la partie actuelle
    startCurrentPartie() {
        if (this.currentPartie >= this.phaseData.parties.length) {
            this.completeBonus();
            return;
        }

        const partie = this.phaseData.parties[this.currentPartie];
        console.log(`📖 Affichage ${partie.id}: ${partie.texte.substring(0, 50)}...`);

        // Démarrer l'animation du texte de cette partie
        this.textAnimator.startAnimation(partie.texte, 20);
        this.partieStartTime = Date.now();
    }

    // Setup visuel du canvas pour la phase bonus
    setupCanvas() {
        if (!this.canvas || !this.ctx) return;

        // Animation des vagues
        this.waveAnimation += 0.02;

        // Fond dégradé mer et ciel
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB'); // Bleu ciel
        gradient.addColorStop(0.6, '#4682B4'); // Bleu acier
        gradient.addColorStop(1, '#191970'); // Bleu nuit

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Dessiner le mur dans la mer
        this.drawSeaWall();

        // Titre de la phase avec numéro de partie
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 20px serif';
        this.ctx.textAlign = 'center';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        this.ctx.shadowBlur = 3;

        const partieText = this.showingBonus && this.currentPartie < this.phaseData.parties.length
            ? ` - ${this.phaseData.parties[this.currentPartie].id}`
            : '';
        this.ctx.fillText(`LE MUR d'avare\\rit${partieText}`, this.canvas.width / 2, 40);
        this.ctx.shadowBlur = 0;
    }

    // Dessiner le mur dans la mer avec destruction progressive
    drawSeaWall() {
        const centerX = this.canvas.width / 2;
        const seaLevel = this.canvas.height * 0.7;

        // Progression de la destruction selon la partie actuelle
        const destructionProgress = this.showingBonus ? (this.currentPartie / this.phaseData.parties.length) : 0;
        const isEpilogue = this.showingBonus && this.currentPartie === this.phaseData.parties.length - 1;

        // Hauteur du mur qui diminue
        const murHeight = 100 * (1 - destructionProgress * 0.7);
        const murWidth = 6 * (1 - destructionProgress * 0.3);

        // Le mur - avec fissures selon la progression
        this.ctx.fillStyle = `rgba(47, 79, 79, ${1 - destructionProgress * 0.5})`;
        this.ctx.fillRect(centerX - murWidth/2, seaLevel - murHeight, murWidth, murHeight);

        // Fissures du mur (plus il y en a, plus le mur est détruit)
        if (destructionProgress > 0.2) {
            this.ctx.strokeStyle = `rgba(139, 69, 19, ${destructionProgress})`;
            this.ctx.lineWidth = 2;

            for (let i = 0; i < Math.floor(destructionProgress * 8); i++) {
                const y = seaLevel - murHeight + (i * murHeight / 8);
                this.ctx.beginPath();
                this.ctx.moveTo(centerX - murWidth/2, y);
                this.ctx.lineTo(centerX + murWidth/2, y + Math.sin(y * 0.1) * 5);
                this.ctx.stroke();
            }
        }

        // Reflet du mur dans l'eau (s'estompe avec la destruction)
        if (destructionProgress < 0.8) {
            this.ctx.globalAlpha = 0.3 * (1 - destructionProgress);
            this.ctx.fillRect(centerX - murWidth/2, seaLevel, murWidth, 80 * (1 - destructionProgress));
            this.ctx.globalAlpha = 1;
        }

        // Particules de destruction qui tombent
        if (destructionProgress > 0.4) {
            this.drawDestructionParticles(centerX, seaLevel, destructionProgress);
        }

        // Pont d'or qui apparaît lors de l'épilogue
        if (isEpilogue) {
            this.drawGoldenBridge(centerX, seaLevel);
        }

        // Vagues animées (plus agitées quand le mur se détruit)
        this.drawWaves(seaLevel, destructionProgress);
    }

    // Dessiner les particules de destruction
    drawDestructionParticles(centerX, seaLevel, progress) {
        const particleCount = Math.floor(progress * 10);

        for (let i = 0; i < particleCount; i++) {
            const x = centerX + (Math.random() - 0.5) * 40;
            const y = seaLevel - 50 + Math.random() * 100;
            const size = Math.random() * 3 + 1;

            this.ctx.fillStyle = `rgba(139, 69, 19, ${Math.random() * progress})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    // Dessiner le pont d'or de l'épilogue
    drawGoldenBridge(centerX, seaLevel) {
        const bridgeY = seaLevel - 40;
        const bridgeWidth = this.canvas.width * 0.8;
        const bridgeHeight = 8;

        // Pont principal avec dégradé doré
        const gradient = this.ctx.createLinearGradient(centerX - bridgeWidth/2, bridgeY, centerX + bridgeWidth/2, bridgeY);
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
        gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.9)');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0.3)');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(centerX - bridgeWidth/2, bridgeY, bridgeWidth, bridgeHeight);

        // Piliers du pont
        for (let i = 0; i < 5; i++) {
            const pilierX = centerX - bridgeWidth/2 + (i * bridgeWidth/4);
            this.ctx.fillStyle = 'rgba(255, 215, 0, 0.7)';
            this.ctx.fillRect(pilierX - 2, bridgeY, 4, seaLevel - bridgeY);
        }

        // Particules dorées qui scintillent
        for (let i = 0; i < 8; i++) {
            const x = centerX - bridgeWidth/2 + Math.random() * bridgeWidth;
            const y = bridgeY + Math.random() * 20 - 10;
            const size = Math.random() * 2 + 1;

            this.ctx.fillStyle = `rgba(255, 215, 0, ${Math.random() * 0.8 + 0.2})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    // Dessiner les vagues (plus agitées quand le mur se détruit)
    drawWaves(seaLevel, destructionProgress = 0) {
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.6;

        // Les vagues deviennent plus agitées avec la destruction
        const agitation = 1 + destructionProgress * 2;

        for (let i = 0; i < 3; i++) {
            this.ctx.beginPath();
            for (let x = 0; x <= this.canvas.width; x += 10) {
                const baseY = seaLevel + Math.sin((x * 0.01) + this.waveAnimation + (i * 0.5)) * (8 - i * 2);
                const y = baseY + Math.sin((x * 0.02) + this.waveAnimation * 2) * destructionProgress * 5;

                if (x === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.stroke();
        }
        this.ctx.globalAlpha = 1;
    }

    // Mise à jour de la phase bonus
    update() {
        if (!this.initialized) return;

        // Dessiner le fond
        this.setupCanvas();

        if (this.showingBonus) {
            this.updateBonusPoem();
        } else {
            this.drawWaitingState();
        }
    }

    updateBonusPoem() {
        // Mettre à jour l'animation du texte
        const isAnimating = this.textAnimator.update();

        // Dessiner le texte de la partie actuelle
        this.drawPoemText();

        // Vérifier si il faut passer à la partie suivante
        const partieElapsed = Date.now() - this.partieStartTime;

        // Durée spéciale pour l'épilogue (plus long)
        const currentDuration = (this.currentPartie === this.phaseData.parties.length - 1) ? 12000 : this.partieDuration;

        if (partieElapsed > currentDuration && !isAnimating) {
            this.currentPartie++;

            if (this.currentPartie < this.phaseData.parties.length) {
                // Pause de 1 seconde entre les parties
                setTimeout(() => {
                    this.startCurrentPartie();
                }, 1000);
            } else {
                // Toutes les parties terminées
                this.completeBonus();
            }
        }
    }

    drawPoemText() {
        const text = this.textAnimator.currentText;
        const lines = text.split('\n');

        // Configuration du texte
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '16px serif';
        this.ctx.textAlign = 'center';

        // Ombre pour la lisibilité
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        this.ctx.shadowBlur = 2;
        this.ctx.shadowOffsetX = 1;
        this.ctx.shadowOffsetY = 1;

        // Position et espacement
        const lineHeight = 22;
        const startY = this.canvas.height * 0.15;
        const maxWidth = this.canvas.width * 0.8;

        // Dessiner chaque ligne
        lines.forEach((line, index) => {
            if (line.trim()) {
                const y = startY + (index * lineHeight);

                // Titre en plus grand
                if (line === 'LE MUR DANS LA MER') {
                    this.ctx.font = 'bold 20px serif';
                    this.ctx.fillStyle = '#ffd700';
                } else {
                    this.ctx.font = '16px serif';
                    this.ctx.fillStyle = '#ffffff';
                }

                // Gérer les lignes trop longues
                if (this.ctx.measureText(line).width > maxWidth) {
                    const words = line.split(' ');
                    let currentLine = '';
                    let currentY = y;

                    words.forEach(word => {
                        const testLine = currentLine + (currentLine ? ' ' : '') + word;
                        if (this.ctx.measureText(testLine).width > maxWidth && currentLine) {
                            this.ctx.fillText(currentLine, this.canvas.width / 2, currentY);
                            currentLine = word;
                            currentY += lineHeight;
                        } else {
                            currentLine = testLine;
                        }
                    });

                    if (currentLine) {
                        this.ctx.fillText(currentLine, this.canvas.width / 2, currentY);
                    }
                } else {
                    this.ctx.fillText(line, this.canvas.width / 2, y);
                }
            }
        });

        // Réinitialiser l'ombre
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
    }

    drawWaitingState() {
        // État d'attente - pas de message affiché
        // La phase bonus sera gérée par le menu principal
        return;
    }

    completeBonus() {
        this.showingBonus = false;
        console.log('Phase Bonus - Épilogue terminé');

        // Message de fin
        const message = document.querySelector('.message');
        if (message) {
            message.innerHTML = `
                <div style="text-align: center; background: linear-gradient(135deg, #2E8B57, #3CB371); padding: 20px; border-radius: 10px;">
                    <h3 style="margin-bottom: 15px; color: #ffffff;">🌊 Merci d'avoir lu 🌊</h3>
                    <p style="color: #f0fff0; margin-bottom: 15px;">
                        "Car l'eau finit toujours par user la pierre,<br>
                        et la liberté, tôt ou tard, reprendra son chemin."
                    </p>
                    <p style="color: #87CEEB; font-style: italic; margin-bottom: 15px;">
                        — Dreamer Unisona
                    </p>
                    <p style="color: #ffd700; font-size: 14px;">
                        ✨ Fin de Voir la Vérité ✨
                    </p>
                    <button class="message-button" onclick="window.gameManager.restart()"
                            style="background: linear-gradient(145deg, #4169E1, #1E90FF); margin-top: 15px;">
                        Recommencer le voyage
                    </button>
                </div>
            `;
            message.style.display = 'block';
        }
    }

    /**
     * Récompense pour avoir terminé le jeu
     */
    rewardCompletion() {
        const rewardAmount = 200;

        try {
            let mainAngel = null;

            if (window.angel) {
                mainAngel = window.angel;
            } else if (window.gameManager && window.gameManager.angel) {
                mainAngel = window.gameManager.angel;
            } else if (window.modules && window.modules.angel) {
                mainAngel = window.modules.angel;
            } else if (this.gameState && this.gameState.angel) {
                mainAngel = this.gameState.angel;
            }

            if (mainAngel && typeof mainAngel.gainExp === 'function') {
                const result = mainAngel.gainExp(rewardAmount);
                console.log(`🌟 XP bonus fin de jeu: +${rewardAmount} XP (niveau: ${result.currentLevel}, total: ${result.currentExp})`);
                return true;
            } else {
                console.log(`⚠️ Impossible de trouver l'ange principal pour le bonus de fin`);
                return false;
            }
        } catch (error) {
            console.error('❌ Erreur lors du bonus XP fin de jeu:', error);
            return false;
        }
    }

    // Nettoyage
    cleanup() {
        console.log('Phase Bonus - Nettoyage');
        const message = document.querySelector('.message');
        if (message) {
            message.style.display = 'none';
        }
    }
}

// Export du module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PhaseBonusMur;
} else {
    window.PhaseBonusMur = PhaseBonusMur;
}