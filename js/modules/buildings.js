/**
 * Cité des Préjugés - Module de gestion des bâtiments
 */

export class CitePrejuges {
    constructor() {
        this.buildings = [];
        this.canvas = { width: 0, height: 0 };
        this.destructionEffects = [];
        
        // Frontières intérieures à transcender (approche respectueuse)
        this.PREJUGES_DATA = [
            {
                nom: "Tour de l'Isolement", type: "tower", 
                story: "🗼 La Tour de l'Isolement s'ouvre ! Les ponts vers autrui se construisent...",
                reward: "+50 EXP • Connexion Retrouvée",
                colors: ['#6c757d', '#495057'] // Gris moderne élégant
            },
            {
                nom: "Château des Certitudes", type: "castle",
                story: "🏰 Le Château des Certitudes s'assouplit ! L'ouverture d'esprit fleurit...",
                reward: "+50 EXP • Flexibilité Mentale",
                colors: ['#8d9db6', '#7c8fab'] // Bleu gris sophistiqué
            },
            {
                nom: "Manoir des Habitudes", type: "manor",
                story: "🏘️ Le Manoir des Habitudes se renouvelle ! La créativité s'épanouit...",
                reward: "+50 EXP • Innovation Libérée",
                colors: ['#9fa8b2', '#8a94a0'] // Gris bleuté
            },
            {
                nom: "Forteresse de l'Ego", type: "fortress",
                story: "⛰️ La Forteresse de l'Ego s'humanise ! L'authenticité rayonne...",
                reward: "+50 EXP • Humilité Gagnée",
                colors: ['#a8a8a8', '#909090'] // Gris neutre
            },
            {
                nom: "Mur de la Peur", type: "wall",
                story: "🧱 Le Mur de la Peur se dissout ! Le courage traverse les frontières...",
                reward: "+50 EXP • Bravoure Éveillée",
                colors: ['#778899', '#708090'] // Gris ardoise
            },
            {
                nom: "Citadelle du Contrôle", type: "citadel",
                story: "🏛️ La Citadelle du Contrôle lâche prise ! La confiance en la vie grandit...",
                reward: "+50 EXP • Sérénité Offerte",
                colors: ['#9b9b9b', '#848484'] // Gris clair moderne
            },
            {
                nom: "Donjon des Croyances", type: "dungeon",
                story: "🕳️ Le Donjon des Croyances s'illumine ! La sagesse questionneuse s'éveille...",
                reward: "+50 EXP • Discernement Libre",
                colors: ['#7a8288', '#6c757d'] // Gris foncé élégant
            },
            {
                nom: "Palais des Apparences", type: "palace",
                story: "🏛️ Le Palais des Apparences se simplifie ! L'authenticité se révèle...",
                reward: "+50 EXP • Vérité Intérieure",
                colors: ['#95a5a6', '#85969a'] // Gris sage
            },
            {
                nom: "Temple de la Rigidité", type: "temple",
                story: "🕌 Le Temple de la Rigidité s'assouplit ! La fluidité de l'être danse...",
                reward: "+50 EXP • Adaptabilité Sacrée",
                colors: ['#8e9aaf', '#7c89a0'] // Gris bleu doux
            },
            {
                nom: "Basilique du Jugement", type: "basilica",
                story: "⛪ La Basilique du Jugement pardonne ! La bienveillance bénit les cœurs...",
                reward: "+50 EXP • Compassion Universelle",
                colors: ['#90a4ae', '#7d8e95'] // Gris bleu minéral
            }
        ];
    }

    // Créer l'espace des concepts négatifs
    createConceptSpace(canvasWidth, canvasHeight) {
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        
        this.buildings = [];
        this.destructionEffects = [];
        
        const cols = 2;
        const spacing = 25;
        const buildingW = (canvasWidth - spacing * 3) / cols;
        const buildingH = 45;
        
        for (let i = 0; i < 10; i++) {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const buildingData = this.PREJUGES_DATA[i];
            
            this.buildings.push({
                x: spacing + col * (buildingW + spacing),
                y: 80 + row * 55,
                w: buildingW,
                h: buildingH,
                building: buildingData,
                visible: true,
                glowing: false,
                destructionProgress: 0,
                id: i,
                particles: [],
                shakeMagnitude: 0
            });
        }
        
        return this.buildings;
    }

    // Mise à jour des dimensions du canvas
    updateCanvasSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        
        // Recalculer les positions des bâtiments
        if (this.buildings.length > 0) {
            const cols = 2;
            const spacing = 25;
            const buildingW = (width - spacing * 3) / cols;
            
            this.buildings.forEach((building, i) => {
                const row = Math.floor(i / cols);
                const col = i % cols;
                
                building.x = spacing + col * (buildingW + spacing);
                building.w = buildingW;
            });
        }
    }

    // Transmuter un concept négatif
    transmuteConcept(conceptId) {
        const concept = this.buildings[conceptId];
        if (!concept || !concept.visible) return null;
        
        concept.visible = false;
        this.createTransmutationEffect(concept);
        
        return concept.building;
    }

    // Créer un effet de transmutation (lumière dorée)
    createTransmutationEffect(concept) {
        const particles = [];
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: concept.x + Math.random() * concept.w,
                y: concept.y + Math.random() * concept.h,
                vx: (Math.random() - 0.5) * 6,
                vy: Math.random() * -8 - 3, // Particules qui montent (transformation positive)
                life: 80 + Math.random() * 40,
                maxLife: 120,
                color: '#FFD700', // Lumière dorée pour la transmutation
                size: Math.random() * 5 + 3,
                gravity: -0.1 // Gravité inversée pour un effet ascendant
            });
        }
        
        this.destructionEffects.push({
            particles,
            duration: 150, // Plus long pour un effet doux
            remaining: 150
        });
    }

    // Faire clignoter un bâtiment (avant destruction)
    startBuildingGlow(buildingId) {
        const building = this.buildings[buildingId];
        if (building && building.visible) {
            building.glowing = true;
            building.shakeMagnitude = 3;
        }
    }

    // Arrêter le clignotement
    stopBuildingGlow(buildingId) {
        const building = this.buildings[buildingId];
        if (building) {
            building.glowing = false;
            building.shakeMagnitude = 0;
        }
    }

    // Mettre à jour les effets
    updateEffects() {
        // Mise à jour des effets de destruction
        this.destructionEffects = this.destructionEffects.filter(effect => {
            effect.remaining--;
            
            effect.particles = effect.particles.filter(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += particle.gravity;
                particle.life--;
                particle.vx *= 0.99;
                return particle.life > 0;
            });
            
            return effect.remaining > 0 && effect.particles.length > 0;
        });
        
        // Mise à jour des secousses des bâtiments
        this.buildings.forEach(building => {
            if (building.shakeMagnitude > 0) {
                building.shakeMagnitude *= 0.95;
                if (building.shakeMagnitude < 0.1) {
                    building.shakeMagnitude = 0;
                }
            }
        });
    }

    // Dessiner les structures en pixel art détaillé
    drawPixelArtStructure(ctx, x, y, w, h, type) {
        ctx.save();
        ctx.imageSmoothingEnabled = false; // Pixel art net
        
        const centerX = x + w / 2;
        const centerY = y + h / 2;
        const pixelSize = Math.max(1, Math.floor(w / 20)); // Taille des pixels
        
        switch (type) {
            case 'tower':
                this.drawPixelTower(ctx, x, y, w, h, pixelSize, centerX, centerY);
                break;
            case 'castle':
                this.drawPixelCastle(ctx, x, y, w, h, pixelSize, centerX, centerY);
                break;
            case 'manor':
                this.drawPixelManor(ctx, x, y, w, h, pixelSize, centerX, centerY);
                break;
            case 'fortress':
                this.drawPixelFortress(ctx, x, y, w, h, pixelSize, centerX, centerY);
                break;
            case 'wall':
                this.drawPixelWall(ctx, x, y, w, h, pixelSize, centerX, centerY);
                break;
            case 'citadel':
                this.drawPixelCitadel(ctx, x, y, w, h, pixelSize, centerX, centerY);
                break;
            case 'dungeon':
                this.drawPixelDungeon(ctx, x, y, w, h, pixelSize, centerX, centerY);
                break;
            case 'palace':
                this.drawPixelPalace(ctx, x, y, w, h, pixelSize, centerX, centerY);
                break;
            case 'temple':
                this.drawPixelTemple(ctx, x, y, w, h, pixelSize, centerX, centerY);
                break;
            case 'basilica':
                this.drawPixelBasilica(ctx, x, y, w, h, pixelSize, centerX, centerY);
                break;
        }
        
        ctx.restore();
    }

    // Tour en pixel art moderne
    drawPixelTower(ctx, x, y, w, h, pixel, centerX, centerY) {
        // Style moderne minimaliste avec ombres
        const gradient = ctx.createLinearGradient(x, y, x, y + h);
        gradient.addColorStop(0, 'rgba(108,117,125,0.9)');
        gradient.addColorStop(1, 'rgba(73,80,87,0.9)');
        ctx.fillStyle = gradient;
        
        // Corps principal avec bordures arrondies simulées
        ctx.fillRect(x + pixel * 2, y + pixel * 2, w - pixel * 4, h - pixel * 2);
        
        // Effet de profondeur - ombre interne
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(x + pixel * 3, y + pixel * 3, pixel, h - pixel * 3);
        ctx.fillRect(x + pixel * 2, y + h - pixel, w - pixel * 4, pixel);
        
        // Créneaux modernes simplifiés
        ctx.fillStyle = gradient;
        const crenel = pixel * 3;
        for (let i = 0; i < Math.floor(w / crenel) - 1; i++) {
            if (i % 2 === 0) {
                ctx.fillRect(x + pixel * 2 + i * crenel, y, crenel - pixel, pixel * 2);
            }
        }
        
        // Fenêtres modernes avec effet de verre
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        const windowW = pixel * 2;
        const windowH = pixel * 2;
        for (let floor = 1; floor < 4; floor++) {
            const winX = centerX - windowW/2;
            const winY = y + floor * h/5;
            ctx.fillRect(winX, winY, windowW, windowH);
            // Reflet de fenêtre
            ctx.fillStyle = 'rgba(135,206,235,0.3)';
            ctx.fillRect(winX, winY, windowW/2, windowH/2);
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
        }
    }

    // Château en pixel art moderne
    drawPixelCastle(ctx, x, y, w, h, pixel, centerX, centerY) {
        // Gradient moderne gris bleu
        const gradient = ctx.createLinearGradient(x, y, x, y + h);
        gradient.addColorStop(0, 'rgba(141,157,182,0.9)');
        gradient.addColorStop(1, 'rgba(124,143,171,0.9)');
        ctx.fillStyle = gradient;
        
        // Corps principal avec effet architectural
        ctx.fillRect(x + pixel * 2, y + pixel * 4, w - pixel * 4, h - pixel * 4);
        
        // Tours latérales avec perspective
        ctx.fillRect(x, y + pixel * 2, pixel * 5, h - pixel * 2);
        ctx.fillRect(x + w - pixel * 5, y + pixel * 2, pixel * 5, h - pixel * 2);
        
        // Ombres architecturales
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fillRect(x + pixel, y + pixel * 3, pixel, h - pixel * 3);
        ctx.fillRect(x + w - pixel * 2, y + pixel * 3, pixel, h - pixel * 3);
        ctx.fillRect(x + pixel * 3, y + pixel * 5, pixel, h - pixel * 5);
        
        // Créneaux modernes épurés
        ctx.fillStyle = gradient;
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(x + i * pixel * 1.5, y, pixel, pixel * 2);
            ctx.fillRect(x + w - pixel * 5 + i * pixel * 1.5, y, pixel, pixel * 2);
        }
        
        // Porte moderne avec arche
        const gateGradient = ctx.createLinearGradient(centerX, y + h - pixel * 6, centerX, y + h);
        gateGradient.addColorStop(0, 'rgba(52,58,64,0.9)');
        gateGradient.addColorStop(1, 'rgba(33,37,41,0.9)');
        ctx.fillStyle = gateGradient;
        const gateW = pixel * 3;
        const gateH = pixel * 5;
        ctx.fillRect(centerX - gateW/2, y + h - gateH, gateW, gateH);
        
        // Poignée de porte moderne
        ctx.fillStyle = 'rgba(255,215,0,0.8)';
        ctx.fillRect(centerX + pixel, y + h - pixel * 3, pixel/2, pixel/2);
        
        // Fenêtres modernes avec reflets
        ctx.fillStyle = 'rgba(248,249,250,0.8)';
        ctx.fillRect(x + pixel * 3, y + h/2, pixel * 1.5, pixel * 1.5);
        ctx.fillRect(x + w - pixel * 4.5, y + h/2, pixel * 1.5, pixel * 1.5);
        
        // Reflets sur les fenêtres
        ctx.fillStyle = 'rgba(173,216,230,0.4)';
        ctx.fillRect(x + pixel * 3, y + h/2, pixel * 0.8, pixel * 0.8);
        ctx.fillRect(x + w - pixel * 4.5, y + h/2, pixel * 0.8, pixel * 0.8);
    }

    // Manoir en pixel art
    drawPixelManor(ctx, x, y, w, h, pixel, centerX, centerY) {
        ctx.fillStyle = 'rgba(160,120,80,0.9)';
        
        // Structure principale
        ctx.fillRect(x, y + pixel * 3, w, h - pixel * 3);
        
        // Toit en pointe
        ctx.beginPath();
        ctx.moveTo(x, y + pixel * 3);
        ctx.lineTo(centerX, y);
        ctx.lineTo(x + w, y + pixel * 3);
        ctx.closePath();
        ctx.fill();
        
        // Cheminée
        ctx.fillStyle = 'rgba(100,80,60,0.9)';
        ctx.fillRect(x + w * 0.75, y + pixel, pixel * 2, pixel * 4);
        
        // Fenêtres avec volets
        ctx.fillStyle = 'rgba(220,220,100,0.7)';
        const winSize = pixel * 3;
        ctx.fillRect(x + pixel * 2, y + h/2, winSize, winSize);
        ctx.fillRect(x + w - pixel * 5, y + h/2, winSize, winSize);
        
        // Porte d'entrée élégante
        ctx.fillStyle = 'rgba(80,40,20,0.9)';
        ctx.fillRect(centerX - pixel * 2, y + h - pixel * 5, pixel * 4, pixel * 5);
    }

    // Forteresse en pixel art
    drawPixelFortress(ctx, x, y, w, h, pixel, centerX, centerY) {
        ctx.fillStyle = 'rgba(120,120,120,0.95)';
        
        // Murs épais
        ctx.fillRect(x, y + pixel * 2, w, h - pixel * 2);
        
        // Remparts crénelés
        for (let i = 0; i < Math.floor(w / (pixel * 3)); i++) {
            if (i % 2 === 0) {
                ctx.fillRect(x + i * pixel * 3, y, pixel * 2, pixel * 3);
            }
        }
        
        // Tours de garde aux angles
        ctx.fillRect(x - pixel, y, pixel * 4, h);
        ctx.fillRect(x + w - pixel * 3, y, pixel * 4, h);
        
        // Meurtrières
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        for (let i = 1; i < 4; i++) {
            ctx.fillRect(x + i * w/4, y + h/3, pixel, pixel * 4);
        }
    }

    // Mur en pixel art moderne (frontière)
    drawPixelWall(ctx, x, y, w, h, pixel, centerX, centerY) {
        // Gradient moderne pour effet de profondeur
        const gradient = ctx.createLinearGradient(x, y, x, y + h);
        gradient.addColorStop(0, 'rgba(119,136,153,0.9)');
        gradient.addColorStop(1, 'rgba(112,128,144,0.9)');
        
        // Blocs de pierre modernes
        for (let py = y; py < y + h; py += pixel * 2) {
            for (let px = x; px < x + w; px += pixel * 3) {
                const offset = Math.floor(py / (pixel * 2)) % 2 === 0 ? 0 : pixel * 1.5;
                const blockX = px + offset;
                const blockY = py;
                
                if (blockX < x + w && blockY < y + h) {
                    ctx.fillStyle = gradient;
                    ctx.fillRect(blockX, blockY, pixel * 3, pixel * 2);
                    
                    // Effet de relief moderne
                    ctx.fillStyle = 'rgba(255,255,255,0.1)';
                    ctx.fillRect(blockX, blockY, pixel * 3, pixel/3);
                    ctx.fillStyle = 'rgba(0,0,0,0.1)';
                    ctx.fillRect(blockX, blockY + pixel * 2 - pixel/3, pixel * 3, pixel/3);
                }
                
                // Joints subtils entre les pierres
                ctx.strokeStyle = 'rgba(100,100,100,0.5)';
                ctx.lineWidth = 1;
                ctx.strokeRect(px + offset, py, pixel * 3, pixel * 2);
            }
        }
        
        // Brèche dans le mur (ouverture spirituelle)
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        const breachW = pixel * 4;
        const breachH = pixel * 6;
        ctx.fillRect(centerX - breachW/2, centerY - breachH/2, breachW, breachH);
    }

    // Citadelle en pixel art
    drawPixelCitadel(ctx, x, y, w, h, pixel, centerX, centerY) {
        ctx.fillStyle = 'rgba(150,130,110,0.9)';
        
        // Base massive
        ctx.fillRect(x + pixel, y + pixel * 4, w - pixel * 2, h - pixel * 4);
        
        // Tour centrale
        ctx.fillRect(centerX - pixel * 3, y, pixel * 6, h);
        
        // Dôme au sommet
        ctx.beginPath();
        ctx.arc(centerX, y + pixel * 2, pixel * 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Fenêtres en arc
        ctx.fillStyle = 'rgba(200,180,150,0.6)';
        ctx.beginPath();
        ctx.arc(centerX, y + h/2, pixel * 2, 0, Math.PI, true);
        ctx.fill();
    }

    // Autres structures... (dungeon, palace, temple, basilica)
    drawPixelDungeon(ctx, x, y, w, h, pixel, centerX, centerY) {
        ctx.fillStyle = 'rgba(80,80,80,0.95)';
        
        // Entrée souterraine
        ctx.fillRect(x + pixel * 2, y + pixel * 6, w - pixel * 4, h - pixel * 6);
        
        // Escalier descendant
        for (let i = 0; i < 5; i++) {
            ctx.fillRect(x + pixel * 3 + i * pixel, y + pixel * 4 + i * pixel, 
                         w - pixel * 6 - i * pixel * 2, pixel * 2);
        }
        
        // Barreaux
        ctx.strokeStyle = 'rgba(100,60,40,0.8)';
        ctx.lineWidth = pixel;
        for (let i = 0; i < 4; i++) {
            const barX = x + pixel * 4 + i * pixel * 2;
            ctx.beginPath();
            ctx.moveTo(barX, y + pixel * 3);
            ctx.lineTo(barX, y + h - pixel * 2);
            ctx.stroke();
        }
    }

    drawPixelPalace(ctx, x, y, w, h, pixel, centerX, centerY) {
        ctx.fillStyle = 'rgba(200,180,120,0.9)';
        
        // Structure palatiale
        ctx.fillRect(x, y + pixel * 3, w, h - pixel * 3);
        
        // Colonnes décoratives
        for (let i = 1; i < 4; i++) {
            ctx.fillRect(x + i * w/4 - pixel/2, y + pixel * 3, pixel, h - pixel * 3);
        }
        
        // Fronton triangulaire
        ctx.beginPath();
        ctx.moveTo(x, y + pixel * 3);
        ctx.lineTo(centerX, y);
        ctx.lineTo(x + w, y + pixel * 3);
        ctx.closePath();
        ctx.fill();
        
        // Décorations dorées
        ctx.fillStyle = 'rgba(255,215,0,0.7)';
        ctx.fillRect(centerX - pixel, y + pixel, pixel * 2, pixel);
    }

    drawPixelTemple(ctx, x, y, w, h, pixel, centerX, centerY) {
        ctx.fillStyle = 'rgba(220,200,180,0.9)';
        
        // Base du temple
        ctx.fillRect(x + pixel, y + pixel * 4, w - pixel * 2, h - pixel * 4);
        
        // Colonnes
        for (let i = 0; i < 5; i++) {
            ctx.fillRect(x + pixel * 2 + i * (w/6), y + pixel * 2, pixel * 2, h - pixel * 2);
        }
        
        // Toit
        ctx.beginPath();
        ctx.moveTo(x, y + pixel * 4);
        ctx.lineTo(centerX, y);
        ctx.lineTo(x + w, y + pixel * 4);
        ctx.closePath();
        ctx.fill();
    }

    drawPixelBasilica(ctx, x, y, w, h, pixel, centerX, centerY) {
        ctx.fillStyle = 'rgba(180,160,140,0.9)';
        
        // Nef principale
        ctx.fillRect(x + pixel * 2, y + pixel * 3, w - pixel * 4, h - pixel * 3);
        
        // Clocher
        ctx.fillRect(centerX - pixel * 2, y, pixel * 4, h);
        
        // Croix au sommet (stylisée)
        ctx.fillStyle = 'rgba(150,130,110,0.9)';
        ctx.fillRect(centerX - pixel/2, y - pixel, pixel, pixel * 3);
        ctx.fillRect(centerX - pixel * 1.5, y, pixel * 3, pixel);
        
        // Vitraux
        ctx.fillStyle = 'rgba(100,150,200,0.6)';
        ctx.fillRect(x + pixel * 4, y + h/2, pixel * 2, pixel * 3);
        ctx.fillRect(x + w - pixel * 6, y + h/2, pixel * 2, pixel * 3);
    }

    // Dessiner les fenêtres
    drawWindows(ctx, x, y, w, h) {
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        const windowW = Math.max(w * 0.15, 6);
        const windowH = Math.max(h * 0.3, 8);
        
        const windowCount = Math.floor(w / (windowW + 8));
        for (let i = 0; i < windowCount; i++) {
            ctx.fillRect(x + 8 + i * (windowW + 8), y + h * 0.3, windowW, windowH);
        }
    }

    // Dessiner un bâtiment individuel
    drawBuilding(ctx, building) {
        if (!building.visible) return;
        
        let { x, y, w, h } = building;
        
        // Effet de secousse
        if (building.shakeMagnitude > 0) {
            x += (Math.random() - 0.5) * building.shakeMagnitude;
            y += (Math.random() - 0.5) * building.shakeMagnitude;
        }
        
        ctx.save();
        
        // Ombre du bâtiment
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fillRect(x + 3, y + 3, w, h);
        
        // Corps principal du bâtiment
        const [color1, color2] = building.building.colors;
        const gradient = ctx.createLinearGradient(x, y, x, y + h);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, w, h);
        
        // Structures en pixel art
        this.drawPixelArtStructure(ctx, x, y, w, h, building.building.type);
        
        // Fenêtres
        this.drawWindows(ctx, x, y, w, h);
        
        // Effet de lueur si en cours de destruction
        if (building.glowing) {
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 3;
            ctx.strokeRect(x - 2, y - 2, w + 4, h + 4);
            
            // Particules dorées
            for (let i = 0; i < 5; i++) {
                const px = x + Math.random() * w;
                const py = y + Math.random() * h;
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.arc(px, py, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Nom du bâtiment
        ctx.fillStyle = '#2C3E50';
        ctx.font = `600 ${Math.max(h * 0.2, 8)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(
            building.building.nom.split(' ')[0],
            x + w / 2,
            y + h + 15
        );
        
        ctx.restore();
    }

    // Dessiner les effets de destruction
    drawDestructionEffects(ctx) {
        this.destructionEffects.forEach(effect => {
            effect.particles.forEach(particle => {
                const alpha = particle.life / particle.maxLife;
                ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
                ctx.fill();
            });
        });
    }

    // Dessiner tous les bâtiments
    draw(ctx) {
        this.buildings.forEach(building => this.drawBuilding(ctx, building));
        this.drawDestructionEffects(ctx);
    }

    // Vérifier la collision avec l'orbe
    checkOrbCollision(orb) {
        for (let i = 0; i < this.buildings.length; i++) {
            const building = this.buildings[i];
            if (!building.visible) continue;
            
            if (orb.x + orb.r >= building.x && 
                orb.x - orb.r <= building.x + building.w &&
                orb.y + orb.r >= building.y && 
                orb.y - orb.r <= building.y + building.h) {
                
                this.startBuildingGlow(i);
                return i;
            }
        }
        return -1;
    }

    // Obtenir les bâtiments visibles
    getVisibleBuildings() {
        return this.buildings.filter(building => building.visible);
    }

    // Obtenir le nombre de bâtiments détruits
    getDestroyedCount() {
        return this.buildings.filter(building => !building.visible).length;
    }

    // Réinitialiser l'espace conceptuel
    reset(canvasWidth, canvasHeight) {
        return this.createConceptSpace(canvasWidth, canvasHeight);
    }

    // Obtenir l'état de la cité
    getState() {
        return {
            totalBuildings: this.buildings.length,
            visibleBuildings: this.getVisibleBuildings().length,
            destroyedBuildings: this.getDestroyedCount(),
            hasActiveEffects: this.destructionEffects.length > 0
        };
    }
}

export default CitePrejuges;