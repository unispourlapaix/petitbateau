const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

function createIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Créer un masque avec bords arrondis (style moderne)
    const cornerRadius = size * 0.18; // 18% pour des bords bien arrondis
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, cornerRadius);
    ctx.clip();

    // Fond ciel bleu clair moderne
    const gradient = ctx.createLinearGradient(0, 0, 0, size);
    gradient.addColorStop(0, '#e0f6ff'); // Bleu très clair (ciel)
    gradient.addColorStop(0.3, '#87CEEB'); // Bleu ciel doux
    gradient.addColorStop(0.6, '#4682B4'); // Bleu acier (horizon)
    gradient.addColorStop(0.8, '#2563eb'); // Bleu mer
    gradient.addColorStop(1, '#1e40af'); // Bleu mer profond
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Effet de brillance subtil en haut
    const shineGradient = ctx.createLinearGradient(0, 0, 0, size*0.3);
    shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = shineGradient;
    ctx.fillRect(0, 0, size, size*0.3);

    // Nuages doux dans le ciel
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#ffffff';
    
    // Nuage 1
    ctx.beginPath();
    ctx.arc(size*0.2, size*0.15, size*0.04, 0, Math.PI * 2);
    ctx.arc(size*0.25, size*0.12, size*0.05, 0, Math.PI * 2);
    ctx.arc(size*0.3, size*0.15, size*0.04, 0, Math.PI * 2);
    ctx.fill();
    
    // Nuage 2
    ctx.beginPath();
    ctx.arc(size*0.7, size*0.08, size*0.03, 0, Math.PI * 2);
    ctx.arc(size*0.75, size*0.06, size*0.04, 0, Math.PI * 2);
    ctx.arc(size*0.8, size*0.08, size*0.03, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.globalAlpha = 1;

    // Soleil radieux dans le ciel
    ctx.save();
    ctx.translate(size*0.8, size*0.2);
    
    // Rayons du soleil
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
    ctx.lineWidth = size*0.003;
    for(let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(size*0.08, 0);
        ctx.stroke();
        ctx.rotate(Math.PI / 6);
    }
    
    // Corps du soleil avec dégradé radieux
    const sunGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size*0.04);
    sunGradient.addColorStop(0, '#fff700'); // Jaune très brillant
    sunGradient.addColorStop(0.5, '#ffed4e'); // Jaune doré
    sunGradient.addColorStop(1, '#fbbf24'); // Jaune plus sombre
    
    ctx.fillStyle = sunGradient;
    ctx.beginPath();
    ctx.arc(0, 0, size*0.04, 0, Math.PI * 2);
    ctx.fill();
    
    // Reflet brillant sur le soleil
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(-size*0.01, -size*0.01, size*0.015, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();

    // Arc-en-ciel dans le ciel
    ctx.save();
    ctx.translate(size*0.2, size*0.4);
    ctx.globalAlpha = 0.7;
    
    const rainbowColors = [
        '#ff0000', // Rouge
        '#ff8000', // Orange
        '#ffff00', // Jaune
        '#80ff00', // Vert clair
        '#00ff80', // Vert
        '#0080ff', // Bleu clair
        '#8000ff'  // Violet
    ];
    
    rainbowColors.forEach((color, index) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = size*0.008;
        ctx.beginPath();
        const radius = size*0.25 + index*size*0.01;
        ctx.arc(0, 0, radius, 0, Math.PI);
        ctx.stroke();
    });
    
    ctx.restore();
    ctx.globalAlpha = 1;

    // Dessiner un bateau moderne et stylisé
    ctx.save();
    ctx.translate(size/2, size*0.6);
    
    // Vagues stylisées en arrière-plan plus visibles
    ctx.globalAlpha = 0.8; // Augmenté l'opacité pour plus de visibilité
    for(let i = 0; i < 4; i++) {
        const waveGradient = ctx.createLinearGradient(-size/2, 0, size/2, 0);
        waveGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
        waveGradient.addColorStop(0.5, 'rgba(255, 255, 255, 1)'); // Blanc pur au centre
        waveGradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
        
        ctx.strokeStyle = waveGradient;
        ctx.lineWidth = size*0.012; // Lignes plus épaisses
        ctx.beginPath();
        const y = size*0.15 + i*size*0.04;
        for(let x = -size/2; x <= size/2; x += size*0.02) {
            const wave = Math.sin((x + i*50) * 0.02) * size*0.015; // Amplitude plus grande
            if(x === -size/2) {
                ctx.moveTo(x, y + wave);
            } else {
                ctx.lineTo(x, y + wave);
            }
        }
        ctx.stroke();
        
        // Ajouter un trait blanc continu plus épais
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = size*0.008;
        ctx.beginPath();
        const baseY = size*0.15 + i*size*0.04;
        for(let x = -size/2; x <= size/2; x += size*0.01) {
            const wave = Math.sin((x + i*50) * 0.02) * size*0.01;
            if(x === -size/2) {
                ctx.moveTo(x, baseY + wave);
            } else {
                ctx.lineTo(x, baseY + wave);
            }
        }
        ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Coque du bateau rouge en forme de V avec effet 3D
    const hullGradient = ctx.createLinearGradient(-size*0.25, -size*0.05, size*0.25, size*0.12);
    hullGradient.addColorStop(0, '#fca5a5'); // Rouge clair (lumière)
    hullGradient.addColorStop(0.3, '#ef4444'); // Rouge vif
    hullGradient.addColorStop(0.7, '#dc2626'); // Rouge moyen
    hullGradient.addColorStop(1, '#991b1b'); // Rouge sombre (ombre)
    
    ctx.fillStyle = hullGradient;
    ctx.beginPath();
    // Forme en V de la coque
    ctx.moveTo(-size*0.25, size*0.12); // Coin gauche
    ctx.lineTo(0, size*0.05); // Pointe du V (centre bas)
    ctx.lineTo(size*0.25, size*0.12); // Coin droit
    ctx.quadraticCurveTo(size*0.15, size*0.14, 0, size*0.14); // Fond arrondi
    ctx.quadraticCurveTo(-size*0.15, size*0.14, -size*0.25, size*0.12); // Retour au début
    ctx.closePath();
    ctx.fill();
    
    // Ombre portée 3D de la coque en V
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.moveTo(-size*0.23, size*0.15);
    ctx.lineTo(size*0.02, size*0.08);
    ctx.lineTo(size*0.27, size*0.15);
    ctx.quadraticCurveTo(size*0.17, size*0.17, size*0.02, size*0.17);
    ctx.quadraticCurveTo(-size*0.13, size*0.17, -size*0.23, size*0.15);
    ctx.closePath();
    ctx.fill();
    
    // Reflet brillant 3D sur la coque en V
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.moveTo(-size*0.18, size*0.10);
    ctx.lineTo(-size*0.05, size*0.07);
    ctx.lineTo(size*0.08, size*0.10);
    ctx.lineTo(-size*0.05, size*0.12);
    ctx.closePath();
    ctx.fill();
    
    // Bordure 3D de la coque en V
    ctx.strokeStyle = '#7f1d1d';
    ctx.lineWidth = size*0.003;
    ctx.beginPath();
    ctx.moveTo(-size*0.25, size*0.12);
    ctx.lineTo(0, size*0.05);
    ctx.lineTo(size*0.25, size*0.12);
    ctx.quadraticCurveTo(size*0.15, size*0.14, 0, size*0.14);
    ctx.quadraticCurveTo(-size*0.15, size*0.14, -size*0.25, size*0.12);
    ctx.stroke();

    // Voile blanche triangulaire pointant vers le haut avec effet 3D léger
    const sailGradient = ctx.createLinearGradient(-size*0.15, -size*0.35, size*0.15, size*0.05);
    sailGradient.addColorStop(0, '#ffffff'); // Blanc pur (lumière)
    sailGradient.addColorStop(0.3, '#fefefe'); // Blanc presque pur
    sailGradient.addColorStop(0.7, '#f8fafc'); // Blanc très légèrement gris
    sailGradient.addColorStop(1, '#f1f5f9'); // Gris très clair (ombre très douce)
    
    ctx.fillStyle = sailGradient;
    ctx.beginPath();
    // Triangle pointant vers le haut
    ctx.moveTo(0, -size*0.35); // Pointe du triangle (en haut)
    ctx.lineTo(-size*0.15, size*0.05); // Coin inférieur gauche
    ctx.lineTo(size*0.15, size*0.05); // Coin inférieur droit
    ctx.closePath();
    ctx.fill();

    // Ombre 3D très légère de la voile triangulaire
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Ombre très douce
    ctx.beginPath();
    ctx.moveTo(size*0.01, -size*0.33);
    ctx.lineTo(-size*0.14, size*0.06);
    ctx.lineTo(size*0.16, size*0.06);
    ctx.closePath();
    ctx.fill();

    // Plis très légers sur la voile triangulaire
    ctx.fillStyle = 'rgba(0, 0, 0, 0.03)'; // Très subtil
    ctx.beginPath();
    ctx.moveTo(0, -size*0.25);
    ctx.lineTo(-size*0.08, size*0.03);
    ctx.lineTo(size*0.08, size*0.03);
    ctx.closePath();
    ctx.fill();
    
    // Contour très léger de la voile triangulaire
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = size*0.002;
    ctx.beginPath();
    ctx.moveTo(0, -size*0.35);
    ctx.lineTo(-size*0.15, size*0.05);
    ctx.lineTo(size*0.15, size*0.05);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();

    return canvas;
}

function generateIcons() {
    const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
    const iconsDir = path.join(__dirname, 'icons');
    
    // Créer le dossier icons s'il n'existe pas
    if (!fs.existsSync(iconsDir)) {
        fs.mkdirSync(iconsDir);
    }

    console.log('🎨 Génération des icônes Petit Bateau...\n');

    sizes.forEach(size => {
        const canvas = createIcon(size);
        const filename = `icon-${size}x${size}.png`;
        const filepath = path.join(iconsDir, filename);
        
        // Sauvegarder l'icône
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filepath, buffer);
        
        console.log(`✅ ${filename} généré avec succès`);
    });

    console.log(`\n🚢 Toutes les icônes ont été générées dans le dossier 'icons' !`);
}

// Exporter les fonctions pour une utilisation externe
module.exports = { createIcon, generateIcons };

// Exécuter si ce fichier est lancé directement
if (require.main === module) {
    generateIcons();
}