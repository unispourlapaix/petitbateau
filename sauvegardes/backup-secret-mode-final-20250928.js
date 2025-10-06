/**
 * Module Mode Secret - Système de jeu Pacman marin
 * Obstacles, projectiles, survie 30 secondes
 * @version 1.0.0
 * @author Emmanuel Payet (Dreamer Unisa)
 */

class SecretModeModule {
    constructor(canvas, ctx, gameState) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.gameState = gameState; // Référence vers les variables globales du jeu

        // État du mode secret
        this.isActive = false;
        this.isMenuPhase = false; // Phase de menu 10s
        this.menuStartTime = 0;
        this.menuDuration = 10000; // 10 secondes
        this.startTime = 0;
        this.duration = 60000; // 60 secondes
        this.previousPhase = null; // Sauvegarder la phase précédente


        // Éléments du jeu secret
        this.projectiles = [];
        this.obstacles = [];
        this.score = 0;

        // Statistiques de fin
        this.stats = {
            totalLoss: 0,        // Total des points perdus
            objectsDestroyed: 0, // Objets détruits par le joueur
            objectsEscaped: 0,   // Objets qui ont touché le sol
            initialScore: 0      // Score de départ
        };

        // Module objets kawaii DOM (attention Brian ! 💕)
        this.kawaiiObjects = null;
        this.kawaiiContainer = null;
        if (typeof KawaiiObjects !== 'undefined') {
            this.kawaiiObjects = new KawaiiObjects();
            this.setupKawaiiContainer();
            console.log('💕 Objets kawaii DOM intégrés au mode secret - 9 objets disponibles !');
        } else {
            console.warn('⚠️ Module objets kawaii non trouvé - Brian est safe pour le moment 😄');
        }

        // Configuration
        this.config = {
            projectileSpeed: 3, // Plus lent
            projectileSize: 12, // Plus gros pour les cœurs bleus
            obstacleSpeed: 2,
            obstacleSize: 30,
            spawnRate: 0.98, // Plus c'est haut, moins d'obstacles spawent
            maxObstacles: 12
        };

        // Liste des objets kawaii actifs dans le jeu
        this.activeKawaiiObjects = [];

        this.init();
    }

    init() {
        console.log('🎮 Module Mode Secret initialisé');
    }

    // Créer le conteneur DOM pour les objets kawaii
    setupKawaiiContainer() {
        if (!this.kawaiiObjects) return;

        // Créer le conteneur si il n'existe pas
        let container = document.getElementById('kawaii-secret-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'kawaii-secret-container';
            container.style.cssText = `
                position: absolute;
                top: 110px;
                left: 0;
                width: 100%;
                height: calc(100vh - 110px);
                pointer-events: none;
                z-index: 30;
                overflow: visible;
                background: transparent;
            `;
            document.querySelector('.game-container').appendChild(container);
        }

        this.kawaiiContainer = container;

        // Injecter les styles CSS du module
        const styleId = 'kawaii-objects-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = this.kawaiiObjects.getCSS();
            document.head.appendChild(style);
        }
    }

    // Activer le mode secret
    activate() {
        this.isActive = true;
        this.isMenuPhase = true; // Commencer par le menu
        this.menuStartTime = Date.now();
        this.startTime = 0; // Sera défini quand le jeu commence vraiment
        this.projectiles = [];
        this.obstacles = [];
        this.score = 0;

        // FORCER l'injection du CSS kawaii à l'activation
        if (this.kawaiiObjects) {
            const styleId = 'kawaii-objects-styles';
            // Supprimer l'ancien si il existe
            const oldStyle = document.getElementById(styleId);
            if (oldStyle) {
                oldStyle.remove();
            }

            // Injecter le nouveau CSS
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = this.kawaiiObjects.getCSS();
            document.head.appendChild(style);
            console.log('🎨 CSS kawaii forcé à l\'activation du mode secret');
        }

        // Sauvegarder la phase actuelle
        this.previousPhase = this.gameState.phaseJeu;

        // Notifier le jeu principal
        this.gameState.modeSecret = true;

        // BONUS DÉCOUVERTE MODE SECRET !
        if (!this.gameState.secretModeDiscovered) {
            const bonusXP = 100;

            // Ajouter les points au score principal
            if (this.gameState.score !== undefined) {
                this.gameState.score += bonusXP;
                console.log(`🎉 DÉCOUVERTE MODE SECRET ! +${bonusXP} points XP (nouveau total: ${this.gameState.score})`);

                // Transférer l'XP vers l'ange principal
                this.transferXPToMainGame(bonusXP);
            }

            this.gameState.secretModeDiscovered = true; // Marquer comme découvert

            if (this.gameState.ajouterParticules) {
                // Explosion de particules dorées pour la découverte
                const centerX = this.canvas.width / 2;
                const centerY = this.canvas.height / 2;
                this.gameState.ajouterParticules(centerX, centerY, '#FFD700', 15);
            }

            console.log('🎉 DÉCOUVERTE ! +100 points XP pour avoir trouvé le mode secret !');
        }

        // Activer les objets kawaii DOM
        if (this.kawaiiObjects && this.kawaiiContainer) {
            this.clearKawaiiObjects(); // Nettoyer les anciens objets
        }

        console.log('🚀 Mode secret activé - Survie 60s !');

        // Message d'introduction
        if (this.gameState.afficherMessage) {
            const message = this.gameState.secretModeDiscovered ?
                '🎮 MODE SECRET ACTIVÉ ! 🎮\n\n🎯 Tirez sur les objets kawaii !\n❤️ Épargnez les innocents (-points)\n💀 Éliminez les ennemis (+points)\n⏱️ Survivez 60 secondes !' :
                '🎉 MODE SECRET DÉCOUVERT ! 🎉\n\n✨ +100 POINTS XP BONUS ✨\n🐋 Bienvenue dans le mode Kawaii !\n🎯 Éliminez les ennemis, épargnez les innocents !\n⏱️ Survivez 60 secondes !';

            this.gameState.afficherMessage(message, 4000);
        }
    }

    // Démarrer le jeu après le menu
    startGame() {
        this.isMenuPhase = false;
        this.startTime = Date.now();

        // Initialiser les statistiques
        this.stats.initialScore = this.gameState.score || 0;
        this.stats.totalLoss = 0;
        this.stats.objectsDestroyed = 0;
        this.stats.objectsEscaped = 0;

        // Activer les objets kawaii DOM maintenant que le jeu commence
        if (this.kawaiiObjects && this.kawaiiContainer) {
            this.clearKawaiiObjects(); // Nettoyer les anciens objets
            this.spawnKawaiiObjects(); // Créer de nouveaux objets
        }

        console.log('🚀 Jeu secret démarré! Survie pendant 60 secondes.');
    }

    // Désactiver le mode secret
    deactivate() {
        this.isActive = false;
        this.startTime = 0;
        this.projectiles = [];
        this.obstacles = [];

        // Notifier le jeu principal et restaurer la phase normale
        this.gameState.modeSecret = false;
        this.gameState.jeu = true; // Relancer le jeu principal

        // Restaurer la phase de jeu précédente
        if (this.gameState.phaseJeu && this.previousPhase) {
            this.gameState.phaseJeu = this.previousPhase; // Retour à la phase d'origine
        }

        // Nettoyer les objets kawaii DOM
        if (this.kawaiiObjects && this.kawaiiContainer) {
            this.clearKawaiiObjects();
        }

        // Réinitialiser
        this.previousPhase = null;

        console.log('✅ Mode secret terminé - Retour au jeu principal');
    }

    // Mettre à jour la logique du mode secret
    update() {
        if (!this.isActive) return;

        // Si on est en phase de menu, vérifier si les 10s sont écoulées
        if (this.isMenuPhase) {
            const menuElapsed = Date.now() - this.menuStartTime;
            if (menuElapsed >= this.menuDuration) {
                this.startGame(); // Démarrer automatiquement après 10s
            }
            return; // Ne pas mettre à jour le jeu pendant le menu
        }

        const currentTime = Date.now();
        const elapsedTime = currentTime - this.startTime;

        // Vérifier si les 60 secondes sont écoulées
        if (elapsedTime >= this.duration) {
            this.handleVictory();
            return;
        }

        // Mettre à jour les projectiles
        this.updateProjectiles();

        // DÉSACTIVÉ: Plus d'obstacles Canvas (remplacés par objets kawaii DOM)
        // this.updateObstacles();
        // this.spawnObstacles();

        // Mettre à jour les objets kawaii DOM (attention Brian ! 💕)
        if (this.kawaiiObjects && this.kawaiiContainer) {
            this.updateKawaiiObjects();
            this.spawnKawaiiObjects();
        }

        // Vérifier les collisions
        this.checkCollisions();

    }

    // Gérer la victoire (survie 60s)
    handleVictory() {
        const victoryBonus = 5000;
        const finalScore = this.gameState.score || 0;
        const scoreGained = finalScore - this.stats.initialScore;
        const netGain = scoreGained + victoryBonus;

        // Ajouter le bonus de victoire
        this.gameState.score += victoryBonus;

        // Calculer les statistiques finales
        const stats = {
            finalScore: this.gameState.score,
            scoreGained: scoreGained,
            totalLoss: this.stats.totalLoss,
            objectsDestroyed: this.stats.objectsDestroyed,
            objectsEscaped: this.stats.objectsEscaped,
            netGain: netGain,
            victoryBonus: victoryBonus
        };

        // Transférer le score final en XP vers l'ange principal
        this.transferXPToMainGame(netGain);

        console.log('📊 STATISTIQUES FINALES MODE SECRET:', stats);

        if (this.gameState.afficherMessage) {
            const message = `🏆 VICTOIRE SECRÈTE ! 🏆

🎯 Objets détruits: ${stats.objectsDestroyed}
💥 Objets échappés: ${stats.objectsEscaped}
📉 Points perdus: -${stats.totalLoss}
📈 Gain net: +${stats.scoreGained}
💎 Bonus victoire: +${victoryBonus}
✨ Total XP ajouté: +${netGain}

⚡ Le jeu continue...`;

            this.gameState.afficherMessage(message, 6000);
        }

        this.deactivate();
    }

    // Mettre à jour les projectiles avec oscillation kawaii
    updateProjectiles() {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const proj = this.projectiles[i];

            // Mouvement vertical (plus lent)
            proj.y -= this.config.projectileSpeed;

            // Oscillation horizontale kawaii
            proj.time += 0.1; // Incrémenter le timer d'animation
            proj.x = proj.startX + Math.sin(proj.time) * 15; // Oscillation de ±15 pixels

            // Supprimer si hors écran
            if (proj.y < -this.config.projectileSize) {
                this.projectiles.splice(i, 1);
            }
        }
    }

    // Mettre à jour les obstacles
    updateObstacles() {
        const C = { W: this.canvas.width, H: this.canvas.height };

        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obs = this.obstacles[i];
            obs.y += this.config.obstacleSpeed;

            // Mouvement ondulant
            obs.x += Math.sin(obs.y * 0.01) * 0.5;

            // Supprimer si hors écran
            if (obs.y > C.H + this.config.obstacleSize) {
                this.obstacles.splice(i, 1);
            }
        }
    }

    // Générer de nouveaux obstacles
    spawnObstacles() {
        // DÉSACTIVÉ: Plus d'obstacles Canvas ronds gris/carrés verts
        // Les objets kawaii DOM les remplacent !
        return;
    }

    // Vérifier les collisions
    checkCollisions() {
        // Collision projectile-obstacle
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const proj = this.projectiles[i];

            for (let j = this.obstacles.length - 1; j >= 0; j--) {
                const obs = this.obstacles[j];

                const dx = proj.x - obs.x;
                const dy = proj.y - obs.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < (this.config.projectileSize + obs.size) / 2) {
                    // Collision ! Détruire les deux
                    this.projectiles.splice(i, 1);
                    this.obstacles.splice(j, 1);

                    // Points
                    this.gameState.score += 50;

                    // Particules
                    if (this.gameState.ajouterParticules) {
                        this.gameState.ajouterParticules(obs.x, obs.y, '#FFD700', 5);
                    }

                    break;
                }
            }
        }

        // Collision projectile-animaux volants (corbeau, colombe, chauve-souris)
        const animaux = document.querySelectorAll('.crow, .dove, .bat');
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const proj = this.projectiles[i];

            for (let animal of animaux) {
                if (!animal) continue;

                const rect = animal.getBoundingClientRect();
                const canvasRect = this.canvas.getBoundingClientRect();

                const animalX = rect.left - canvasRect.left + rect.width / 2;
                const animalY = rect.top - canvasRect.top + rect.height / 2;

                const dx = proj.x - animalX;
                const dy = proj.y - animalY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 40) {
                    this.projectiles.splice(i, 1);

                    // Points selon l'animal
                    let points = 0;
                    if (animal.classList.contains('crow')) points = 1;      // Corbeau +1 XP
                    else if (animal.classList.contains('dove')) points = 10; // Colombe +10 XP
                    else if (animal.classList.contains('bat')) points = -10; // Chauve-souris -10 XP

                    // Ajouter les points
                    if (this.gameState && points !== 0) {
                        const oldScore = this.gameState.score || 0;
                        this.gameState.score = oldScore + points;
                        console.log(`🐦 Animal touché! ${points > 0 ? '+' : ''}${points} XP`);
                    }

                    break;
                }
            }
        }

        // TRANSFORMATION RÉVÉLATION - Lanterne sur corbeau/colombe → chauve-souris
        const lanternes = document.querySelectorAll('.lantern, .flashlight');
        const corbeauxEtColombes = document.querySelectorAll('.crow, .dove');

        for (let lanterne of lanternes) {
            if (!lanterne) continue;

            const lantRect = lanterne.getBoundingClientRect();

            for (let oiseau of corbeauxEtColombes) {
                if (!oiseau) continue;

                const oiseauRect = oiseau.getBoundingClientRect();

                // Vérifier si la lanterne éclaire l'oiseau (proximité)
                const dx = lantRect.left - oiseauRect.left;
                const dy = lantRect.top - oiseauRect.top;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) { // Zone d'éclairage
                    // RÉVÉLATION ! Transformation en chauve-souris
                    const bonusRevelation = 1000;

                    if (this.gameState) {
                        const oldScore = this.gameState.score || 0;
                        this.gameState.score = oldScore + bonusRevelation;
                        console.log(`💡 RÉVÉLATION! Oiseau transformé en chauve-souris +${bonusRevelation} XP`);
                    }

                    // Transformer l'oiseau (changer les classes CSS)
                    oiseau.classList.remove('crow', 'dove');
                    oiseau.classList.add('bat');

                    // Changer l'apparence visuelle si possible
                    if (oiseau.style) {
                        oiseau.style.filter = 'brightness(0.3) sepia(1) hue-rotate(280deg)';
                        oiseau.style.transform = 'scaleX(-1)'; // Retourner l'image
                    }

                    // Effet de particules de révélation
                    if (this.gameState.ajouterParticules) {
                        const canvasRect = this.canvas.getBoundingClientRect();
                        const particleX = oiseauRect.left - canvasRect.left + oiseauRect.width / 2;
                        const particleY = oiseauRect.top - canvasRect.top + oiseauRect.height / 2;

                        this.gameState.ajouterParticules(particleX, particleY, '#9400D3', 15); // Particules violettes
                    }

                    break; // Une seule transformation par lanterne
                }
            }
        }

        // Collision projectile-objet kawaii
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const proj = this.projectiles[i];

            for (let j = this.activeKawaiiObjects.length - 1; j >= 0; j--) {
                const kawaiiObj = this.activeKawaiiObjects[j];
                const element = kawaiiObj.element;

                if (!element) continue;

                // Position de l'objet kawaii - SIMPLE: même système de coordonnées
                const objX = parseFloat(element.style.left) || 0;
                const objY = parseFloat(element.style.top) || 0;

                // Le conteneur kawaii commence à top:110px, donc ajuster
                const objCanvasX = objX + 30; // Centre X
                const objCanvasY = objY + 110 + 30; // Centre Y + offset du conteneur

                const dx = proj.x - objCanvasX;
                const dy = proj.y - objCanvasY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Zone de collision TRÈS généreuse pour les cœurs bleus
                const collisionRadius = 40; // Zone fixe plus grande

                // Debug collision désactivé pour moins de spam

                if (distance < collisionRadius) {
                    // Collision détectée !

                    // Collision ! Détruire le projectile et l'objet kawaii
                    this.projectiles.splice(i, 1);

                    // Retirer l'objet kawaii du DOM et de la liste
                    if (element.parentNode) {
                        element.parentNode.removeChild(element);
                    }
                    this.activeKawaiiObjects.splice(j, 1);

                    // Points selon le type d'objet
                    const points = this.getKawaiiPoints(kawaiiObj.type);

                    // Tracker les objets détruits
                    this.stats.objectsDestroyed++;

                    // AJOUTER LES POINTS AU JEU PRINCIPAL - FORCÉ
                    if (this.gameState) {
                        console.log(`🔍 DEBUG: gameState disponible, propriétés:`, Object.keys(this.gameState));

                        const oldScore = this.gameState.score || this.gameState.points || 0;

                        // Essayer différentes propriétés de score
                        if (this.gameState.score !== undefined) {
                            this.gameState.score += points;
                            console.log(`💰 SCORE AJOUTÉ via .score! ${oldScore} → ${this.gameState.score} (${points > 0 ? '+' : ''}${points})`);
                        } else if (this.gameState.points !== undefined) {
                            this.gameState.points += points;
                            console.log(`💰 SCORE AJOUTÉ via .points! ${oldScore} → ${this.gameState.points} (${points > 0 ? '+' : ''}${points})`);
                        } else {
                            // Créer la propriété score si elle n'existe pas
                            this.gameState.score = oldScore + points;
                            console.log(`💰 SCORE CRÉÉ! Nouveau: ${this.gameState.score} (${points > 0 ? '+' : ''}${points})`);
                        }

                        // Essayer de forcer la mise à jour de l'affichage
                        if (typeof window.updateScoreDisplay === 'function') {
                            window.updateScoreDisplay();
                        }

                        // TRANSFERT XP VERS L'ANGE PRINCIPAL !
                        if (points > 0) {
                            // Seulement pour les points positifs (objets dangereux éliminés)
                            this.transferXPToMainGame(points);
                        }
                    } else {
                        console.error(`❌ gameState non disponible pour ajouter ${points} points!`);
                    }

                    // EXPLOSION de particules kawaii !
                    if (this.gameState.ajouterParticules) {
                        const color = points > 0 ? '#00FF00' : '#FF0000'; // Vert positif, rouge négatif

                        // Grande explosion de particules
                        this.gameState.ajouterParticules(objCanvasX, objCanvasY, color, 12);

                        // Explosion supplémentaire en étoiles dorées pour effet kawaii
                        setTimeout(() => {
                            this.gameState.ajouterParticules(objCanvasX, objCanvasY, '#FFD700', 6);
                        }, 100);

                        console.log(`💥 EXPLOSION! ${kawaiiObj.type} - particules ${color} + dorées`);
                    }

                    // Message de points visible au joueur
                    if (this.gameState.afficherMessage) {
                        const emoji = points > 0 ? '🎉' : '💔';
                        const message = `${emoji} ${kawaiiObj.type.toUpperCase()} ${points > 0 ? '+' : ''}${points} points!`;

                        // Petit message flash temporaire
                        setTimeout(() => {
                            if (this.gameState.afficherMessage) {
                                this.gameState.afficherMessage(message, 1000);
                            }
                        }, 100);
                    }

                    break;
                }
            }
        }

        // Collision joueur-obstacle (game over)
        if (this.gameState.raquette) {
            const playerX = this.gameState.raquette.x + this.gameState.C.PW / 2;
            const playerY = this.gameState.raquette.y + this.gameState.C.PH / 2;

            for (let obs of this.obstacles) {
                const dx = playerX - obs.x;
                const dy = playerY - obs.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < (this.config.obstacleSize + Math.min(this.gameState.C.PW, this.gameState.C.PH)) / 2) {
                    this.handleGameOver();
                    return;
                }
            }
        }
    }

    // Game Over
    handleGameOver() {
        if (this.gameState.afficherMessage) {
            this.gameState.afficherMessage('💀 GAME OVER ! 💀\n\n🌊 Touché par un obstacle marin !\n⏱️ Temps survécu: ' + Math.floor((Date.now() - this.startTime) / 1000) + 's\n\n🔄 Le jeu reprend...', 3000);
        }

        this.deactivate();
    }

    // Créer un projectile - Tir d'étoiles multicolores OU gestion du bouton GO!
    createProjectile(mouseX, mouseY) {
        if (!this.isActive) return;

        // Si on est en phase de menu, vérifier le clic sur le bouton GO!
        if (this.isMenuPhase && this.goButton && mouseX && mouseY) {
            if (mouseX >= this.goButton.x && mouseX <= this.goButton.x + this.goButton.width &&
                mouseY >= this.goButton.y && mouseY <= this.goButton.y + this.goButton.height) {
                this.startGame(); // Démarrer immédiatement
                return;
            }
            return; // Ignorer les autres clics pendant le menu
        }

        if (!this.gameState.raquette) return;

        const C = this.gameState.C;

        // Créer 3 étoiles : dorée, argentée, bleue
        const starColors = [
            { fill: '#FFD700', stroke: '#FFB347', name: 'dorée', glow: 'rgba(255, 215, 0, 0.6)' },
            { fill: '#C0C0C0', stroke: '#A9A9A9', name: 'argentée', glow: 'rgba(192, 192, 192, 0.6)' },
            { fill: '#4169E1', stroke: '#1E90FF', name: 'bleue', glow: 'rgba(65, 105, 225, 0.6)' }
        ];

        starColors.forEach((star, index) => {
            this.projectiles.push({
                x: this.gameState.raquette.x + C.PW / 2 + (index - 1) * 25, // Espacées de 25px
                y: this.gameState.raquette.y,
                size: this.config.projectileSize,
                startX: this.gameState.raquette.x + C.PW / 2 + (index - 1) * 25,
                time: 0,
                star: star, // Données de l'étoile
                type: 'star' // Type projectile
            });
        });

    }

    // Dessiner tous les éléments du mode secret
    render() {
        if (!this.isActive) return;

        this.ctx.save();

        // Si on est en phase de menu, afficher le menu au lieu du jeu
        if (this.isMenuPhase) {
            this.renderMenu();
            this.ctx.restore();
            return;
        }

        // Dessiner les projectiles
        this.renderProjectiles();

        // Dessiner les obstacles
        this.renderObstacles();

        // Les objets kawaii DOM sont déjà affichés automatiquement
        // Pas besoin de rendu Canvas

        // Dessiner l'interface
        this.renderUI();

        this.ctx.restore();
    }

    // Dessiner les projectiles - 3 étoiles brillantes (dorée, argentée, bleue)
    renderProjectiles() {
        for (let proj of this.projectiles) {
            this.ctx.save();
            this.ctx.translate(proj.x, proj.y);

            // Étoile brillante avec effet de lueur
            const size = proj.size * 1.2; // Taille appropriée pour les étoiles
            const star = proj.star;

            // Effet de lueur
            this.ctx.shadowColor = star.glow;
            this.ctx.shadowBlur = 20;

            // Dessiner l'étoile à 5 branches
            this.drawStar(0, 0, size, star.fill, star.stroke);

            // Effet scintillant pour le mode hybride
            const time = Date.now() * 0.01;
            const sparkleIntensity = 0.5 + 0.5 * Math.sin(time + proj.time);

            if (sparkleIntensity > 0.7) {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                this.ctx.beginPath();
                this.ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
                this.ctx.fill();
            }

            this.ctx.restore();
        }
    }

    // Fonction utilitaire pour dessiner une étoile à 5 branches
    drawStar(x, y, radius, fillColor, strokeColor) {
        const spikes = 5;
        const outerRadius = radius;
        const innerRadius = radius * 0.4;

        this.ctx.beginPath();
        this.ctx.moveTo(x, y - outerRadius);

        for (let i = 0; i < spikes * 2; i++) {
            const angle = (i * Math.PI) / spikes;
            const r = i % 2 === 0 ? outerRadius : innerRadius;
            const px = x + Math.cos(angle - Math.PI / 2) * r;
            const py = y + Math.sin(angle - Math.PI / 2) * r;
            this.ctx.lineTo(px, py);
        }

        this.ctx.closePath();
        this.ctx.fillStyle = fillColor;
        this.ctx.fill();
        this.ctx.strokeStyle = strokeColor;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    // SUPPRIMÉ: renderObstacles Canvas - remplacé par objets kawaii DOM
    renderObstacles() {
        // Les objets kawaii DOM remplacent les obstacles Canvas
        // Plus d'objets ronds gris ou carrés verts !
    }

    // Interface du mode secret
    renderUI() {
        const elapsedTime = Date.now() - this.startTime;
        const remainingTime = Math.max(0, this.duration - elapsedTime);
        const seconds = Math.ceil(remainingTime / 1000);

        // BANDEAU BLANC EN HAUT - Score et Timer (sous le header)
        const bandeauY = 60; // Décalé pour ne pas cacher le header
        const bandeauW = this.canvas.width;
        const bandeauH = 35; // Plus compact

        // Fond blanc du bandeau avec transparence
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.fillRect(0, bandeauY, bandeauW, bandeauH);

        // Bordure fine
        this.ctx.strokeStyle = '#CCCCCC';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(0, bandeauY, bandeauW, bandeauH);

        // Informations du joueur dans le bandeau
        this.ctx.fillStyle = '#333333';
        this.ctx.font = 'bold 14px Arial';

        // Score/XP à gauche
        this.ctx.textAlign = 'left';
        const scoreText = `💰 ${this.gameState.score || 0}`;
        this.ctx.fillText(scoreText, 8, bandeauY + 22);

        // Timer restant à droite
        this.ctx.textAlign = 'right';
        const timerText = `⏰ ${seconds}s`;
        this.ctx.fillText(timerText, bandeauW - 8, bandeauY + 22);

        // Info kawaii au centre seulement si il y en a
        this.ctx.textAlign = 'center';
        if (this.kawaiiObjects && this.activeKawaiiObjects.length > 0) {
            const nbKawaii = this.activeKawaiiObjects.length;
            const kawaiiText = `💕 ${nbKawaii}`;
            this.ctx.fillText(kawaiiText, bandeauW / 2, bandeauY + 22);
        }

        // Ancien timer supprimé - remplacé par le bandeau blanc

        // Reset text align
        this.ctx.textAlign = 'left';
    }


    // Afficher le menu de démarrage (10 secondes) - Texte noir centré uniquement
    renderMenu() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // Calculer le temps restant
        const elapsed = Date.now() - this.menuStartTime;
        const remaining = Math.max(0, this.menuDuration - elapsed);
        const seconds = Math.ceil(remaining / 1000);

        // Tout le texte en noir gras, centré
        this.ctx.fillStyle = '#000000';
        this.ctx.textAlign = 'center';

        // Titre principal
        this.ctx.font = 'bold 28px Arial';
        this.ctx.fillText('MODE SECRET', centerX, centerY - 60);

        // Instructions simplifiées
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillText('Tirez pour transformer', centerX, centerY - 20);
        this.ctx.fillText('Évitez • Éliminez • Survivez', centerX, centerY + 10);

        // Compte à rebours et bouton
        if (seconds > 0) {
            this.ctx.font = 'bold 18px Arial';
            this.ctx.fillText(`Démarrage dans ${seconds}s`, centerX, centerY + 50);
            this.renderGoButton(centerX, centerY + 90, true);
        } else {
            this.renderGoButton(centerX, centerY + 50, false);
        }
    }

    // Dessiner le bouton GO! - Simple bordure noire
    renderGoButton(x, y, showCountdown) {
        const buttonWidth = 120;
        const buttonHeight = 50;

        // Bordure simple noire
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x - buttonWidth/2, y - buttonHeight/2, buttonWidth, buttonHeight);

        // Texte du bouton en noir
        this.ctx.fillStyle = '#000000';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GO!', x, y + 8);

        // Stocker les coordonnées du bouton pour la détection de clic
        this.goButton = {
            x: x - buttonWidth/2,
            y: y - buttonHeight/2,
            width: buttonWidth,
            height: buttonHeight
        };
    }

    // Système de points pour objets kawaii
    getKawaiiPoints(type) {
        const pointsMap = {
            // OBJETS INNOCENTS - Points négatifs (il ne faut PAS les tuer)
            'baleine': -200,      // 🐋 Très mal de tuer une baleine !
            'etoile': -100,       // ⭐ Étoile magique protectrice
            'lune': -300,         // 🌙 Objet sacré - très mal !
            'banane': -50,        // 🍌 Fruit innocent
            'smartphone': -75,    // 📱 iPhone innocent - mal !
            'poubelle': -30,      // 🗑️ Poubelle mignonne - pas bien !

            // OBJETS DANGEREUX - Points positifs (il faut les éliminer)
            'asteroide': +150,    // ☄️ Bon de détruire l'astéroïde
            'tank': +200,         // 🚗 Tank ennemi - très bon
            'avion': +100         // ✈️ Avion ennemi
        };

        return pointsMap[type] || 0;
    }

    // Transférer l'XP du mode secret vers l'ange principal
    transferXPToMainGame(amount) {
        try {
            // Essayer de trouver l'ange principal via différentes méthodes
            let mainAngel = null;

            // Méthode 1: Via window
            if (window.angel) {
                mainAngel = window.angel;
            }
            // Méthode 2: Via gameState
            else if (this.gameState && this.gameState.angel) {
                mainAngel = this.gameState.angel;
            }
            // Méthode 3: Via un gestionnaire de jeu global
            else if (window.gameManager && window.gameManager.angel) {
                mainAngel = window.gameManager.angel;
            }
            // Méthode 4: Via recherche dans les modules chargés
            else if (window.modules && window.modules.angel) {
                mainAngel = window.modules.angel;
            }

            if (mainAngel && typeof mainAngel.gainExp === 'function') {
                const result = mainAngel.gainExp(amount);
                console.log(`✨ XP transféré vers l'ange principal: +${amount} XP (niveau: ${result.currentLevel}, total: ${result.currentExp})`);
                return true;
            } else {
                console.log(`⚠️ Impossible de trouver l'ange principal pour transférer ${amount} XP`);
                return false;
            }
        } catch (error) {
            console.error('❌ Erreur lors du transfert XP:', error);
            return false;
        }
    }

    // ========== GESTION OBJETS KAWAII DOM ==========

    // Nettoyer tous les objets kawaii
    clearKawaiiObjects() {
        if (this.kawaiiContainer) {
            this.kawaiiContainer.innerHTML = '';
        }
        this.activeKawaiiObjects = [];
    }

    // Générer de nouveaux objets kawaii
    spawnKawaiiObjects() {
        if (!this.kawaiiObjects || !this.kawaiiContainer) {
            return;
        }
        // Système de colonnes : 5 colonnes sur la largeur
        const numColumns = 5;
        const columnWidth = this.canvas.width / numColumns;

        // Vérifier quelles colonnes sont libres
        const occupiedColumns = new Set();
        this.activeKawaiiObjects.forEach(obj => {
            if (obj.element && obj.gameData) {
                const objX = parseFloat(obj.element.style.left) || 0;
                const columnIndex = Math.floor(objX / columnWidth);
                occupiedColumns.add(columnIndex);
            }
        });

        // Colonnes disponibles
        const freeColumns = [];
        for (let i = 0; i < numColumns; i++) {
            if (!occupiedColumns.has(i)) {
                freeColumns.push(i);
            }
        }

        // Si toutes les colonnes sont occupées, ne pas créer d'objet
        if (freeColumns.length === 0) {
            return;
        }

        // 0.5% de chance de spawn par frame (un peu plus pour avoir de l'action)
        if (Math.random() > 0.995) {
            const types = ['baleine', 'asteroide', 'etoile', 'tank', 'lune', 'banane', 'smartphone', 'poubelle', 'avion'];
            const randomType = types[Math.floor(Math.random() * types.length)];

            // Choisir une colonne libre aléatoire
            const selectedColumn = freeColumns[Math.floor(Math.random() * freeColumns.length)];

            // Position X centrée dans la colonne
            const x = selectedColumn * columnWidth + columnWidth / 2 - 30; // -30 pour centrer l'objet (60px de large)
            const y = 0; // En haut du conteneur

            const kawaiiObj = this.kawaiiObjects.createObject(randomType, x, y);
            if (kawaiiObj) {
                // Ajouter propriétés de jeu
                const now = Date.now();
                kawaiiObj.gameData = {
                    vx: 0, // Pas de mouvement horizontal - chute droite
                    vy: -(0.05 + Math.random() * 0.1),     // Vitesse ultra lente
                    life: 60000, // 60 secondes de vie - assez pour tout le mode secret
                    waitTime: 1000, // 1 seconde d'attente avant de commencer à descendre
                    startTime: now, // Moment de création
                    column: selectedColumn // Mémoriser la colonne pour debug
                };

                console.log(`🎯 Nouvel objet ${randomType} créé à ${now} dans colonne ${selectedColumn}, commencera à bouger à ${now + 1000}`);

                this.kawaiiContainer.appendChild(kawaiiObj.element);
                this.activeKawaiiObjects.push(kawaiiObj);
            }
        }
    }

    // Mettre à jour les objets kawaii
    updateKawaiiObjects() {
        const C = { W: this.canvas.width, H: this.canvas.height };

        for (let i = this.activeKawaiiObjects.length - 1; i >= 0; i--) {
            const kawaiiObj = this.activeKawaiiObjects[i];
            const element = kawaiiObj.element;
            const gameData = kawaiiObj.gameData;

            if (!element || !gameData) {
                this.activeKawaiiObjects.splice(i, 1);
                continue;
            }

            // Vérifier si l'objet doit attendre avant de commencer à descendre
            const currentTime = Date.now();
            const timeElapsed = currentTime - gameData.startTime;

            // Mettre à jour position
            const currentX = parseFloat(element.style.left) || 0;
            const currentY = parseFloat(element.style.top) || 0;

            let newX = currentX;
            let newY = currentY;

            // DEBUG temporaire
            if (Math.random() < 0.001) {
                console.log(`⏰ ${kawaiiObj.type}: temps=${timeElapsed}ms, waitTime=${gameData.waitTime}ms, doit bouger=${timeElapsed >= gameData.waitTime}`);
            }

            // Commencer à bouger seulement après le temps d'attente
            if (timeElapsed >= gameData.waitTime) {
                newX = currentX + gameData.vx;
                newY = currentY + gameData.vy;
            }
            // Sinon, rester immobile en haut

            element.style.left = newX + 'px';
            element.style.top = newY + 'px';

            // Debug retiré - objets descendent correctement

            // Mouvement flottant DÉSACTIVÉ pour chute droite
            // if (['baleine', 'etoile', 'lune', 'banane'].includes(kawaiiObj.type)) {
            //     element.style.left = (newX + Math.sin(Date.now() * 0.003) * 2) + 'px';
            // }

            // Diminuer durée de vie
            gameData.life -= 16; // ~60fps

            // Supprimer si hors écran ou mort - ZONES ÉLARGIES
            if (newX < -100 || newX > C.W + 100 || newY > 800 || gameData.life <= 0) {
                // Perte de points si un mauvais objet touche le sol (newY > 800)
                if (newY > 800) {
                    const objectPoints = this.getKawaiiPoints(kawaiiObj.type);
                    // Si c'est un objet dangereux (points positifs), on perd des points
                    if (objectPoints > 0) {
                        const pointLoss = -objectPoints; // Inverser les points
                        this.gameState.score = (this.gameState.score || 0) + pointLoss;

                        // Tracker les statistiques
                        this.stats.totalLoss += Math.abs(pointLoss);
                        this.stats.objectsEscaped++;

                        console.log(`💥 Objet dangereux ${kawaiiObj.type} a touché le sol! ${pointLoss} points`);

                        // Effet visuel de perte
                        if (this.gameState.ajouterParticules) {
                            this.gameState.ajouterParticules(newX, newY, '#FF0000', 5);
                        }
                    }
                }

                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
                this.activeKawaiiObjects.splice(i, 1);

                // Debug suppression
                console.log(`🗑️ Objet ${kawaiiObj.type} supprimé - x=${newX.toFixed(0)} y=${newY.toFixed(0)} life=${gameData.life}`);
            }
        }
    }

    // API publique
    getState() {
        return {
            isActive: this.isActive,
            elapsedTime: this.isActive ? Date.now() - this.startTime : 0,
            remainingTime: this.isActive ? Math.max(0, this.duration - (Date.now() - this.startTime)) : 0,
            projectileCount: this.projectiles.length,
            obstacleCount: this.obstacles.length,
            kawaiiCount: this.activeKawaiiObjects.length,
            kawaiiTypes: this.activeKawaiiObjects.map(obj => obj.type),
            brianWarning: this.kawaiiObjects ? "⚠️ Brian, attention aux 9 objets kawaii ! 💕" : "Brian est safe... pour le moment 😄"
        };
    }

    // Instructions
    static getInstructions() {
        return {
            controls: {
                'Clic': 'Tirer un projectile',
                'Mouvement': 'Éviter les obstacles'
            },
            objective: 'Survivre 30 secondes aux obstacles marins',
            scoring: {
                'Obstacle détruit': '+50 points',
                'Victoire 30s': '+5000 points bonus'
            }
        };
    }
}

// Export du module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecretModeModule;
} else {
    window.SecretModeModule = SecretModeModule;
}

console.log('🎮 Module Mode Secret chargé - Prêt pour la survie marine !');