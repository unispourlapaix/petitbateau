// Phase Bonus - Cœur Élégant avec J Pulsant
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
            parties: null, // Will be initialized dynamically in getPartie()
            _partiesIds: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'ÉPILOGUE'],
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
        
        // Animation du cœur et du J
        this.heartPulse = 0;
        this.jPulse = 0;
        this.particleSystem = [];
    }

    init(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.initialized = true;
        this.setupTextAnimator();
        console.log('Phase Bonus - Le Mur dans la Mer initialisée');
    }

    // Récupérer les parties avec traductions dynamiques
    getParties() {
        if (!window.getTranslatedText) {
            console.error('❌ getTranslatedText not available');
            return [];
        }

        return [
            {
                id: 'P1',
                texte: `💭 "${window.getTranslatedText('narrative.phase17.text', 'Au loin… je vois un mur...')}"`
            },
            {
                id: 'P2',
                texte: `💭 "${window.getTranslatedText('narrative.phase18.text', 'Ce mur est la prison...')}"`
            },
            {
                id: 'P3',
                texte: `💭 "${window.getTranslatedText('narrative.phase19.text', 'Pour les pauvres...')}"`
            },
            {
                id: 'P4',
                texte: `💭 "${window.getTranslatedText('narrative.phase20.text', 'Pour les riches...')}"`
            },
            {
                id: 'P5',
                texte: `💭 "${window.getTranslatedText('narrative.phase21.text', 'Alors je me demande...')}"`
            },
            {
                id: 'P6',
                texte: `💭 "${window.getTranslatedText('narrative.phase22.text', 'Mais dans le cœur des vagues...')}"`
            },
            {
                id: 'ÉPILOGUE',
                texte: `💭 "${window.getTranslatedText('narrative.walls_message', 'Ce mur se dresse...')}\n\n${window.getTranslatedText('narrative.final_message', 'L\'humanité n\'a pas besoin de murs...')}"\n\n${window.getTranslatedText('narrative.wall_crumbles', '✨ LE MUR S\'EFFRITE DÉFINITIVEMENT ✨')}`
            }
        ];
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

        // Masquer tout message existant
        const message = document.querySelector('.message');
        if (message) {
            message.style.display = 'none';
        }

        // Démarrer directement le poème avec le cœur élégant (pas de message d'introduction)
        this.startBonusPoem();

        console.log('Phase Bonus - Démarrage automatique de l\'épilogue avec cœur élégant');
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
        const parties = this.getParties();
        if (this.currentPartie >= parties.length) {
            this.completeBonus();
            return;
        }

        const partie = parties[this.currentPartie];
        console.log(`📖 Affichage ${partie.id}: ${partie.texte.substring(0, 50)}...`);

        // Démarrer l'animation du texte de cette partie
        this.textAnimator.startAnimation(partie.texte, 20);
        this.partieStartTime = Date.now();
    }

    // Setup visuel du canvas pour la phase bonus
    setupCanvas() {
        if (!this.canvas || !this.ctx) return;

        // Animation du livre
        this.heartPulse += 0.02;

        // Fond avec texture bois/bibliothèque
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#8B7355'); // Brun bibliothèque
        gradient.addColorStop(0.5, '#A0826D'); // Brun clair
        gradient.addColorStop(1, '#6F5436'); // Brun foncé

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Dessiner le livre ouvert avec les pages
        this.drawOpenBook();
    }

    // Dessiner le mur dans la mer avec destruction progressive
    drawSeaWall() {
        const centerX = this.canvas.width / 2;
        const seaLevel = this.canvas.height * 0.7;

        // Progression de la destruction selon la partie actuelle
        const parties = this.getParties();
        const destructionProgress = this.showingBonus ? (this.currentPartie / parties.length) : 0;
        const isEpilogue = this.showingBonus && this.currentPartie === parties.length - 1;

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

        // Navigation manuelle par boutons - pas de passage automatique
        // L'utilisateur clique sur Précédent/Suivant pour tourner les pages
    }

    // Changer de page du livre
    nextPage() {
        const parties = this.getParties();
        if (this.currentPartie < parties.length - 1) {
            this.currentPartie++;
            this.startCurrentPartie();
        } else {
            this.completeBonus();
        }
    }

    previousPage() {
        if (this.currentPartie > 0) {
            this.currentPartie--;
            this.startCurrentPartie();
        }
    }

    closePage() {
        this.completeBonus();
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
                <div style="text-align: center; background: linear-gradient(135deg, #1e3c72, #2a5298); padding: 30px; border-radius: 15px; box-shadow: 0 8px 32px rgba(0,0,0,0.3);">
                    <h2 style="margin-bottom: 20px; color: #ffffff; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); font-size: 28px;">${window.getTranslatedText('ui.thank_you_reading', '🌊 Merci d\'avoir lu 🌊')}</h2>
                    
                    <div style="background: rgba(255,255,255,0.1); border-left: 4px solid #ffd700; padding: 20px; margin: 20px 0; border-radius: 8px;">
                        <p style="color: #e3f2fd; font-size: 18px; line-height: 1.6; margin-bottom: 15px; font-style: italic;">
                            "${window.getTranslatedText('ui.final_wisdom_quote', 'Car l\'eau finit toujours par user la pierre,<br>et la liberté, tôt ou tard, reprendra son chemin.')}"
                        </p>
                        <p style="color: #87CEEB; font-style: italic; font-size: 16px;">
                            — Dreamer Unisona
                        </p>
                    </div>
                    
                    <p style="color: #ffd700; font-size: 20px; font-weight: bold; margin: 25px 0; text-shadow: 0 0 10px rgba(255,215,0,0.5);">
                        ${window.getTranslatedText('ui.end_of_game', '✨ Fin de PETIT BATEAU ✨')}
                    </p>
                    
                    <button class="message-button" onclick="window.gameManager.restart()"
                            style="background: linear-gradient(145deg, #4169E1, #1E90FF); border: none; border-radius: 25px; padding: 15px 35px; color: white; font-size: 16px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(65,105,225,0.4); transition: all 0.3s ease; margin-top: 15px;"
                            onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 20px rgba(65,105,225,0.6)'"
                            onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 15px rgba(65,105,225,0.4)'">
                        ${window.getTranslatedText('ui.restart_journey', 'Recommencer le voyage')}
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

    // Dessiner un cœur élégant avec texte à l'intérieur
    drawElegantHeart() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2 + 20; // Légèrement plus bas
        const scale = 1.8 + Math.sin(this.heartPulse) * 0.1; // Pulsation douce
        const size = 120 * scale; // Plus grand pour contenir plus de texte

        this.ctx.save();
        this.ctx.translate(centerX, centerY);

        // Ombre portée élégante
        this.ctx.shadowColor = 'rgba(255, 105, 180, 0.4)';
        this.ctx.shadowBlur = 30;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 10;

        // Dessiner le cœur avec un dégradé radial
        this.ctx.beginPath();
        
        // Forme de cœur (courbe de Bézier)
        const topCurveHeight = size * 0.3;
        this.ctx.moveTo(0, topCurveHeight);
        
        // Côté gauche du cœur
        this.ctx.bezierCurveTo(
            -size / 2, -topCurveHeight,
            -size, topCurveHeight / 3,
            -size / 2, size * 0.7
        );
        
        // Pointe du bas
        this.ctx.lineTo(0, size);
        
        // Côté droit du cœur
        this.ctx.lineTo(size / 2, size * 0.7);
        this.ctx.bezierCurveTo(
            size, topCurveHeight / 3,
            size / 2, -topCurveHeight,
            0, topCurveHeight
        );
        
        this.ctx.closePath();

        // Dégradé du cœur - rose doux avec brillance
        const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, size);
        gradient.addColorStop(0, 'rgba(255, 182, 193, 0.95)');
        gradient.addColorStop(0.5, 'rgba(255, 105, 180, 0.9)');
        gradient.addColorStop(1, 'rgba(219, 112, 147, 0.85)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        // Contour blanc doux
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        this.ctx.shadowBlur = 0;

        // Texte à l'intérieur du cœur
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        this.ctx.font = '12px "Segoe UI", Arial, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Utiliser le texte de l'animateur ou un texte par défaut
        const displayText = this.textAnimator.currentText || '💖 Le Mur d\'avare\\rit 💖';
        
        // Nettoyer le texte (retirer les guillemets et emoji du début)
        let cleanText = displayText.replace(/^💭\s*[""]/, '').replace(/[""]$/, '');
        
        // Wrapper le texte pour qu'il tienne dans le cœur
        const maxWidth = size * 1.4;
        const lines = this.wrapTextInHeart(cleanText, maxWidth);
        const lineHeight = 16;
        const totalHeight = lines.length * lineHeight;
        
        lines.forEach((line, index) => {
            const y = -totalHeight / 2 + index * lineHeight + lineHeight / 2;
            this.ctx.fillText(line, 0, y);
        });

        this.ctx.restore();
    }

    // Wrapper le texte pour qu'il rentre dans le cœur
    wrapTextInHeart(text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        words.forEach(word => {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const metrics = this.ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });
        
        if (currentLine) {
            lines.push(currentLine);
        }
        
        return lines.slice(0, 15); // Maximum 15 lignes (augmenté)
    }

    // Dessiner le J translucide pulsant en blanc
    drawPulsingJ() {
        const centerX = this.canvas.width / 2;
        const topY = 80;
        
        // Calcul de la pulsation (entre 0.7 et 1.0)
        const pulseScale = 0.85 + Math.sin(this.jPulse) * 0.15;
        const opacity = 0.6 + Math.sin(this.jPulse) * 0.2;

        this.ctx.save();
        this.ctx.translate(centerX, topY);
        this.ctx.scale(pulseScale, pulseScale);

        // Ombre douce pour le J
        this.ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        this.ctx.shadowBlur = 20;

        // Dessiner le J en blanc translucide moderne
        this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        this.ctx.font = 'bold 72px "Segoe UI", Arial, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('J', 0, 0);

        // Effet de brillance
        this.ctx.shadowColor = 'transparent';
        this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
        this.ctx.font = 'bold 76px "Segoe UI", Arial, sans-serif';
        this.ctx.fillText('J', -2, -2);

        this.ctx.restore();
    }

    // Dessiner un livre ouvert avec pages qui tournent
    drawOpenBook() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Dimensions du livre
        const bookWidth = this.canvas.width * 0.85;
        const bookHeight = this.canvas.height * 0.75;
        const pageWidth = bookWidth / 2;
        
        // Position du livre
        const bookX = centerX - bookWidth / 2;
        const bookY = centerY - bookHeight / 2;

        this.ctx.save();

        // Ombre du livre
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        this.ctx.shadowBlur = 30;
        this.ctx.shadowOffsetY = 15;

        // Page de gauche (beige ancien)
        this.ctx.fillStyle = '#F5E6D3';
        this.ctx.fillRect(bookX, bookY, pageWidth, bookHeight);

        // Page de droite (beige clair)
        this.ctx.fillStyle = '#FFF8E7';
        this.ctx.fillRect(bookX + pageWidth, bookY, pageWidth, bookHeight);

        this.ctx.shadowBlur = 0;

        // Reliure au centre
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(centerX - 3, bookY, 6, bookHeight);

        // Bordures des pages
        this.ctx.strokeStyle = '#D4AF37';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(bookX + 10, bookY + 10, pageWidth - 20, bookHeight - 20);
        this.ctx.strokeRect(bookX + pageWidth + 10, bookY + 10, pageWidth - 20, bookHeight - 20);

        // Titre en haut de la page de gauche
        this.ctx.fillStyle = '#8B4513';
        this.ctx.font = 'bold 20px "Georgia", serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('📖 Épilogue 📖', bookX + pageWidth / 2, bookY + 35);

        // Numéro de partie sur page de droite
        const parties = this.getParties();
        const partieNum = `Partie ${this.currentPartie + 1}/${parties.length}`;
        this.ctx.fillStyle = '#8B4513';
        this.ctx.font = 'italic 14px "Georgia", serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(partieNum, bookX + pageWidth * 1.5, bookY + 35);

        // Texte sur la page de gauche
        const displayText = this.textAnimator.currentText || '💖 Le Mur d\'avare\\rit 💖';
        let cleanText = displayText.replace(/^💭\s*[""]/, '').replace(/[""]$/, '');

        this.ctx.fillStyle = '#3C2F2F';
        this.ctx.font = '14px "Georgia", serif';
        this.ctx.textAlign = 'left';

        const textX = bookX + 25;
        const textY = bookY + 60;
        const maxWidth = pageWidth - 50;
        const lines = this.wrapTextForBook(cleanText, maxWidth);
        const lineHeight = 22;

        lines.forEach((line, index) => {
            if (index < 20) { // Max 20 lignes par page
                this.ctx.fillText(line, textX, textY + index * lineHeight);
            }
        });

        // Boutons de navigation (flèches)
        this.drawBookButtons(bookX, bookY, bookWidth, bookHeight);

        this.ctx.restore();
    }

    // Dessiner les boutons de navigation du livre
    drawBookButtons(bookX, bookY, bookWidth, bookHeight) {
        const buttonY = bookY + bookHeight + 15;
        const centerX = bookX + bookWidth / 2;

        // Bouton précédent (◄)
        if (this.currentPartie > 0) {
            this.ctx.fillStyle = '#D4AF37';
            this.ctx.font = 'bold 24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('◄', centerX - 60, buttonY);
            
            this.ctx.font = '12px Arial';
            this.ctx.fillText('Précédent', centerX - 60, buttonY + 18);
        }

        // Bouton suivant (►)
        const parties = this.getParties();
        if (this.currentPartie < parties.length - 1) {
            this.ctx.fillStyle = '#D4AF37';
            this.ctx.font = 'bold 24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('►', centerX + 60, buttonY);
            
            this.ctx.font = '12px Arial';
            this.ctx.fillText('Suivant', centerX + 60, buttonY + 18);
        }

        // Bouton fermer au centre
        this.ctx.fillStyle = '#8B4513';
        this.ctx.font = '12px Arial';
        this.ctx.fillText('✕ Fermer', centerX, buttonY + 10);
    }

    // Wrapper le texte pour le livre
    wrapTextForBook(text, maxWidth) {
        this.ctx.font = '14px "Georgia", serif';
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        words.forEach(word => {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const metrics = this.ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });
        
        if (currentLine) {
            lines.push(currentLine);
        }
        
        return lines;
    }

    // Nettoyage
    cleanup() {
        console.log('Phase Bonus - Nettoyage');
        const message = document.querySelector('.message');
        if (message) {
            message.style.display = 'none';
        }
        this.particleSystem = [];
    }
}

// Export du module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PhaseBonusMur;
} else {
    window.PhaseBonusMur = PhaseBonusMur;
}