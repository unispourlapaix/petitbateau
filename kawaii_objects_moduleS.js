/**
 * Kawaii Objects Module - Objets mignons pour le mode secret
 * Attention Brian ! C'est ta copine ! 💕
 * @version 1.0.0
 * @author Emmanuel Payet (Dreamer Unisa)
 */

class KawaiiObjectsModule {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        // Collection d'objets kawaii
        this.objects = [];
        this.types = ['heart', 'star', 'cloud', 'flower', 'butterfly', 'rainbow', 'cat', 'sparkle'];

        // Configuration
        this.config = {
            maxObjects: 6,
            spawnRate: 0.985, // Plus c'est haut, moins d'objets spawent - AJUSTÉ pour plus de spawn
            speed: 1.2,
            minSize: 20,
            maxSize: 35
        };

        console.log('💕 Kawaii Objects Module initialisé - Brian, attention à ta copine ! 😘');
    }

    // Créer un objet kawaii aléatoire
    spawnObject() {
        if (this.objects.length >= this.config.maxObjects) return;
        if (Math.random() > (1 - this.config.spawnRate)) return;

        const C = { W: this.canvas.width, H: this.canvas.height };
        const type = this.types[Math.floor(Math.random() * this.types.length)];

        const object = {
            x: Math.random() * (C.W - 50) + 25,
            y: -50,
            type: type,
            size: this.config.minSize + Math.random() * (this.config.maxSize - this.config.minSize),
            rotation: 0, // Pas de rotation initiale
            rotationSpeed: 0, // Pas de rotation
            color: this.getKawaiiColor(type),
            floatOffset: Math.random() * Math.PI * 2,
            amplitude: Math.random() * 10 + 5,
            speed: this.config.speed * (0.5 + Math.random() * 0.5),
            sparkleTimer: Math.random() * 100
        };

        this.objects.push(object);
    }

    // Couleurs kawaii spécifiques par type
    getKawaiiColor(type) {
        const colors = {
            'heart': ['#FF69B4', '#FF1493', '#FFB6C1', '#FF91A4'],
            'star': ['#FFD700', '#FFFF66', '#FFA500', '#FFE135'],
            'cloud': ['#FFFFFF', '#F0F8FF', '#E6E6FA', '#F5F5F5'],
            'flower': ['#FF69B4', '#DA70D6', '#FF6347', '#FF1493'],
            'butterfly': ['#9370DB', '#8A2BE2', '#BA55D3', '#DDA0DD'],
            'rainbow': ['#FF0080', '#FF8000', '#FFFF00', '#80FF00'],
            'cat': ['#FFB6C1', '#FFC0CB', '#FF69B4', '#F0E68C'],
            'sparkle': ['#FFD700', '#87CEEB', '#DA70D6', '#98FB98']
        };

        const palette = colors[type] || ['#FF69B4'];
        return palette[Math.floor(Math.random() * palette.length)];
    }

    // Mettre à jour tous les objets
    update() {
        const C = { W: this.canvas.width, H: this.canvas.height };

        // Créer de nouveaux objets
        this.spawnObject();

        // Mettre à jour les objets existants
        for (let i = this.objects.length - 1; i >= 0; i--) {
            const obj = this.objects[i];

            // Mouvement principal
            obj.y += obj.speed;
            // obj.rotation += obj.rotationSpeed; // Rotation désactivée

            // Mouvement flottant kawaii
            obj.floatOffset += 0.04;
            obj.x += Math.sin(obj.floatOffset) * 0.3;

            // Sparkle timer
            obj.sparkleTimer += 1;

            // Supprimer si hors écran
            if (obj.y > C.H + obj.size || obj.x < -obj.size || obj.x > C.W + obj.size) {
                this.objects.splice(i, 1);
            }
        }
    }

    // Dessiner tous les objets kawaii
    render() {
        this.ctx.save();

        for (let obj of this.objects) {
            this.ctx.save();
            this.ctx.translate(obj.x, obj.y);
            // this.ctx.rotate(obj.rotation); // Rotation désactivée

            // Effet de lueur kawaii
            this.ctx.shadowColor = obj.color;
            this.ctx.shadowBlur = 8;

            this.drawKawaiiObject(obj);

            this.ctx.restore();
        }

        this.ctx.restore();
    }

    // Dessiner un objet selon son type
    drawKawaiiObject(obj) {
        this.ctx.fillStyle = obj.color;
        this.ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        this.ctx.lineWidth = 2;

        const size = obj.size;

        switch (obj.type) {
            case 'heart':
                this.drawHeart(size);
                break;
            case 'star':
                this.drawStar(size);
                break;
            case 'cloud':
                this.drawCloud(size);
                break;
            case 'flower':
                this.drawFlower(size);
                break;
            case 'butterfly':
                this.drawButterfly(size);
                break;
            case 'rainbow':
                this.drawRainbow(size);
                break;
            case 'cat':
                this.drawCat(size);
                break;
            case 'sparkle':
                this.drawSparkle(size, obj.sparkleTimer);
                break;
        }
    }

    // Dessiner un cœur kawaii avec visage
    drawHeart(size) {
        const s = size / 25;

        // Corps du cœur
        this.ctx.beginPath();
        this.ctx.moveTo(0, -6 * s);
        this.ctx.bezierCurveTo(-12 * s, -18 * s, -30 * s, -6 * s, 0, 6 * s);
        this.ctx.bezierCurveTo(30 * s, -6 * s, 12 * s, -18 * s, 0, -6 * s);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Yeux kawaii
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(-5 * s, -4 * s, 2 * s, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(5 * s, -4 * s, 2 * s, 0, Math.PI * 2);
        this.ctx.fill();

        // Sourire kawaii
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 4 * s, 0.2 * Math.PI, 0.8 * Math.PI);
        this.ctx.stroke();

        // Joues roses
        this.ctx.fillStyle = 'rgba(255, 182, 193, 0.6)';
        this.ctx.beginPath();
        this.ctx.arc(-8 * s, 0, 2 * s, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(8 * s, 0, 2 * s, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // Dessiner une étoile kawaii
    drawStar(size) {
        const s = size / 30;

        // Corps de l'étoile
        this.ctx.beginPath();
        for (let i = 0; i < 10; i++) {
            const angle = (i * Math.PI) / 5 - Math.PI / 2;
            const radius = (i % 2 === 0) ? 15 * s : 7 * s;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Visage kawaii
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(-3 * s, -2 * s, 1.5 * s, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(3 * s, -2 * s, 1.5 * s, 0, Math.PI * 2);
        this.ctx.fill();

        // Sourire
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(0, 2 * s, 3 * s, 0.2 * Math.PI, 0.8 * Math.PI);
        this.ctx.stroke();
    }

    // Dessiner un nuage kawaii
    drawCloud(size) {
        const s = size / 35;

        // Corps du nuage
        this.ctx.beginPath();
        this.ctx.arc(-12 * s, 0, 10 * s, 0, Math.PI * 2);
        this.ctx.arc(-4 * s, -8 * s, 12 * s, 0, Math.PI * 2);
        this.ctx.arc(8 * s, -6 * s, 11 * s, 0, Math.PI * 2);
        this.ctx.arc(14 * s, 2 * s, 9 * s, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // Visage kawaii
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(-3 * s, -3 * s, 2 * s, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(5 * s, -3 * s, 2 * s, 0, Math.PI * 2);
        this.ctx.fill();

        // Sourire endormi
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(1 * s, 2 * s, 4 * s, 0.1 * Math.PI, 0.9 * Math.PI);
        this.ctx.stroke();
    }

    // Dessiner une fleur kawaii
    drawFlower(size) {
        const s = size / 30;

        // Pétales
        for (let i = 0; i < 6; i++) {
            this.ctx.save();
            this.ctx.rotate((i * Math.PI) / 3);
            this.ctx.beginPath();
            this.ctx.ellipse(0, -10 * s, 5 * s, 10 * s, 0, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.restore();
        }

        // Centre
        this.ctx.fillStyle = '#FFFF00';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 5 * s, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // Visage kawaii
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(-2 * s, -1.5 * s, 1 * s, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(2 * s, -1.5 * s, 1 * s, 0, Math.PI * 2);
        this.ctx.fill();

        // Sourire
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.arc(0, 1 * s, 2 * s, 0.2 * Math.PI, 0.8 * Math.PI);
        this.ctx.stroke();
    }

    // Dessiner un papillon kawaii
    drawButterfly(size) {
        const s = size / 35;

        // Ailes supérieures
        this.ctx.beginPath();
        this.ctx.ellipse(-8 * s, -6 * s, 10 * s, 8 * s, -0.3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.ellipse(8 * s, -6 * s, 10 * s, 8 * s, 0.3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // Ailes inférieures
        this.ctx.beginPath();
        this.ctx.ellipse(-8 * s, 4 * s, 7 * s, 6 * s, 0.3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.ellipse(8 * s, 4 * s, 7 * s, 6 * s, -0.3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // Corps
        this.ctx.fillStyle = '#8B4513';
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, 2 * s, 15 * s, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Antennes
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(-1 * s, -12 * s);
        this.ctx.lineTo(-3 * s, -16 * s);
        this.ctx.moveTo(1 * s, -12 * s);
        this.ctx.lineTo(3 * s, -16 * s);
        this.ctx.stroke();
    }

    // Dessiner un arc-en-ciel kawaii
    drawRainbow(size) {
        const s = size / 45;
        const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];

        // Arc-en-ciel
        for (let i = 0; i < colors.length; i++) {
            this.ctx.strokeStyle = colors[i];
            this.ctx.lineWidth = 3 * s;
            this.ctx.beginPath();
            this.ctx.arc(0, 8 * s, (20 - i * 2.5) * s, Math.PI, 0);
            this.ctx.stroke();
        }

        // Nuages aux extrémités
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(-15 * s, 8 * s, 4 * s, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(15 * s, 8 * s, 4 * s, 0, Math.PI * 2);
        this.ctx.fill();

        // Visages des nuages
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(-16 * s, 7 * s, 0.8 * s, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(-14 * s, 7 * s, 0.8 * s, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(14 * s, 7 * s, 0.8 * s, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(16 * s, 7 * s, 0.8 * s, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // Dessiner un chat kawaii
    drawCat(size) {
        const s = size / 25;

        // Oreilles
        this.ctx.beginPath();
        this.ctx.moveTo(-8 * s, -10 * s);
        this.ctx.lineTo(-12 * s, -18 * s);
        this.ctx.lineTo(-4 * s, -15 * s);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(8 * s, -10 * s);
        this.ctx.lineTo(12 * s, -18 * s);
        this.ctx.lineTo(4 * s, -15 * s);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // Tête
        this.ctx.beginPath();
        this.ctx.arc(0, -5 * s, 12 * s, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // Corps
        this.ctx.beginPath();
        this.ctx.ellipse(0, 8 * s, 10 * s, 12 * s, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // Yeux kawaii
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(-4 * s, -7 * s, 2 * s, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(4 * s, -7 * s, 2 * s, 0, Math.PI * 2);
        this.ctx.fill();

        // Nez
        this.ctx.fillStyle = '#FF69B4';
        this.ctx.beginPath();
        this.ctx.moveTo(0, -3 * s);
        this.ctx.lineTo(-1.5 * s, -1 * s);
        this.ctx.lineTo(1.5 * s, -1 * s);
        this.ctx.closePath();
        this.ctx.fill();

        // Moustaches
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(-8 * s, -2 * s);
        this.ctx.lineTo(-12 * s, -3 * s);
        this.ctx.moveTo(-8 * s, 0);
        this.ctx.lineTo(-12 * s, 0);
        this.ctx.moveTo(8 * s, -2 * s);
        this.ctx.lineTo(12 * s, -3 * s);
        this.ctx.moveTo(8 * s, 0);
        this.ctx.lineTo(12 * s, 0);
        this.ctx.stroke();
    }

    // Dessiner des étincelles kawaii
    drawSparkle(size, timer) {
        const s = size / 30;
        const sparkleIntensity = Math.sin(timer * 0.1) * 0.5 + 0.5;

        // Étoile principale
        this.ctx.save();
        this.ctx.scale(1 + sparkleIntensity * 0.3, 1 + sparkleIntensity * 0.3);

        for (let i = 0; i < 8; i++) {
            this.ctx.save();
            this.ctx.rotate((i * Math.PI) / 4);
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(0, -12 * s);
            this.ctx.strokeStyle = this.ctx.fillStyle;
            this.ctx.lineWidth = 2 * s;
            this.ctx.stroke();
            this.ctx.restore();
        }

        this.ctx.restore();

        // Points scintillants autour
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 + timer * 0.02;
            const distance = 15 * s + Math.sin(timer * 0.05 + i) * 3 * s;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            this.ctx.fillStyle = this.ctx.fillStyle;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 2 * s * sparkleIntensity, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    // Nettoyer tous les objets
    clear() {
        this.objects = [];
    }

    // API publique
    getObjectCount() {
        return this.objects.length;
    }

    getObjects() {
        return [...this.objects]; // Copie pour éviter les modifications externes
    }

    // Configuration
    setConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    // Message spécial pour Brian ! 😄
    static getBrianWarning() {
        return "⚠️⚠️⚠️ ATTENTION BRIAN ! ⚠️⚠️⚠️\n\nTa copine kawaii est là ! 💕\nElle est très mignonne...\nNe tombe pas sous son charme ! 😘\n\n- Les objets kawaii 🎀";
    }
}

// Export du module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KawaiiObjectsModule;
} else {
    window.KawaiiObjectsModule = KawaiiObjectsModule;
}

console.log('💕 Kawaii Objects Module chargé - Brian, ta copine kawaii t\'attend ! 😍');