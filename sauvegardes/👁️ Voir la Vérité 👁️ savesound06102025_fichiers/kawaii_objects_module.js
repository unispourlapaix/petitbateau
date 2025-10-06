// ====================================
// MODULE OBJETS KAWAII - EMMANUEL PAYET
// ====================================
// Pour Claude Code : objets réutilisables avec fond transparent
// Structure modulaire avec ID unique pour chaque objet

// LISTE DES OBJETS DISPONIBLES :
// 1. baleine - Baleine kawaii qui plonge avec nageoires-ailes animées
// 2. asteroide - Astéroïde grognon mais mignon destructible  
// 3. etoile - Étoile magique heureuse avec étincelles
// 4. tank - Tank militaire kawaii avec roues, fumée et canon
// 5. lune - Lune endormie paisible et sacrée
// 6. banane - Banane kawaii super mignonne
// 7. smartphone - Téléphone moderne neutre
// 8. poubelle - Poubelle urbaine neutre
// 9. avion - Avion rapide destructible

class KawaiiObjects {
    constructor() {
        this.objects = {
            baleine: { type: 'innocent', canShoot: false, name: 'Baleine kawaii 🐋' },
            asteroide: { type: 'dangereux', canShoot: true, name: 'Astéroïde grognon 💥' },
            etoile: { type: 'innocent', canShoot: false, name: 'Étoile magique ⭐' },
            tank: { type: 'dangereux', canShoot: true, name: 'Tank héroïque 🚗' },
            lune: { type: 'sacre', canShoot: false, name: 'Lune endormie 🌙' },
            banane: { type: 'dangereux', canShoot: true, name: 'Banane dangereuse 🍌' },
            smartphone: { type: 'innocent', canShoot: false, name: 'iPhone kawaii 📱' },
            poubelle: { type: 'innocent', canShoot: false, name: 'Poubelle mignonne 🗑️' },
            avion: { type: 'dangereux', canShoot: true, name: 'Avion rapide ✈️' }
        };
    }

    // CSS pour tous les objets (fond transparent)
    getCSS() {
        return `
/* ===============================
   OBJETS KAWAII - STYLES DE BASE
   =============================== */

.kawaii-object {
    position: absolute;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    border: 3px solid #FF69B4;
    box-shadow: 0 4px 15px rgba(255,105,180,0.3);
    border-radius: 15px;
    background: transparent; /* FOND TRANSPARENT */
}

.kawaii-object:hover {
    transform: scale(1.15) rotate(-5deg);
    box-shadow: 0 8px 25px rgba(255,105,180,0.5);
    filter: brightness(1.1);
}

/* EXPLOSION KAWAII */
.explode {
    animation: explodeKawaii 0.6s ease-out forwards !important;
}

@keyframes explodeKawaii {
    0% { transform: scale(1) rotate(0deg); opacity: 1; filter: brightness(1); }
    25% { transform: scale(1.3) rotate(10deg); opacity: 0.9; filter: brightness(1.3); }
    50% { transform: scale(1.8) rotate(-5deg); opacity: 0.7; filter: brightness(1.6); }
    100% { transform: scale(2.5) rotate(15deg); opacity: 0; filter: brightness(2); }
}

/* ===============================
   BALEINE KAWAII (ID: baleine)
   =============================== */

.obj-baleine {
    width: 60px;
    height: 70px;
    background: linear-gradient(180deg, #4FC3F7 0%, #4FC3F7 40%, #87CEEB 60%, #87CEEB 100%);
    border-radius: 8px 8px 30px 30px;
}

.obj-baleine::before {
    content: '';
    position: absolute;
    bottom: 15px;
    left: 18px;
    width: 8px;
    height: 8px;
    background: #000;
    border-radius: 50%;
    box-shadow: 
        0 0 0 2px #FFF,
        12px 0 0 -6px #000,
        12px 0 0 -4px #FFF,
        -5px 8px 0 -4px #FFB3BA,
        17px 8px 0 -4px #FFB3BA,
        6px 6px 0 -6px #FF69B4;
}

.obj-baleine::after {
    content: '';
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 25px solid #4FC3F7;
}

.baleine-nageoire-gauche {
    position: absolute;
    top: 15px;
    left: -20px;
    width: 25px;
    height: 8px;
    background: linear-gradient(135deg, #87CEEB 0%, #4FC3F7 100%);
    border: 2px solid #FF69B4;
    border-radius: 15px 0 0 15px;
    transform: rotate(45deg);
    animation: nageoireGauche 1.5s ease-in-out infinite;
    box-shadow: inset 0 2px 4px rgba(255,255,255,0.3);
}

.baleine-nageoire-droite {
    position: absolute;
    top: 15px;
    right: -20px;
    width: 25px;
    height: 8px;
    background: linear-gradient(135deg, #87CEEB 0%, #4FC3F7 100%);
    border: 2px solid #FF69B4;
    border-radius: 0 15px 15px 0;
    transform: rotate(-45deg);
    animation: nageoireDroite 1.5s ease-in-out infinite;
    box-shadow: inset 0 2px 4px rgba(255,255,255,0.3);
}

@keyframes nageoireGauche {
    0%, 100% { transform: rotate(45deg) translateY(0px); }
    25% { transform: rotate(55deg) translateY(-4px); }
    50% { transform: rotate(45deg) translateY(0px); }
    75% { transform: rotate(35deg) translateY(2px); }
}

@keyframes nageoireDroite {
    0%, 100% { transform: rotate(-45deg) translateY(0px); }
    25% { transform: rotate(-55deg) translateY(-4px); }
    50% { transform: rotate(-45deg) translateY(0px); }
    75% { transform: rotate(-35deg) translateY(2px); }
}

@keyframes heartFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
    50% { transform: translateY(-8px) rotate(10deg); opacity: 1; }
}

/* ===============================
   ASTÉROÏDE KAWAII (ID: asteroide)
   =============================== */

.obj-asteroide {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #654321 0%, #8B4513 30%, #A0522D 60%, #654321 100%);
    border-radius: 50%;
    position: relative;
    animation: asteroidFloat 3s ease-in-out infinite;
}

.obj-asteroide::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow:
        /* Morceaux détachés autour */
        -15px -10px 0 -20px #654321,
        20px -5px 0 -22px #8B4513,
        -8px 18px 0 -25px #A0522D,
        15px 15px 0 -23px #654321,
        /* Cratères sur la surface */
        inset -8px -8px 0 -15px rgba(0,0,0,0.4),
        inset 10px -5px 0 -18px rgba(0,0,0,0.3),
        inset -5px 12px 0 -20px rgba(0,0,0,0.2);
}

.obj-asteroide::after {
    content: '';
    position: absolute;
    top: -30px;
    left: 50%;
    width: 3px;
    height: 25px;
    background: linear-gradient(180deg, transparent 0%, #FFA500 30%, #FF6500 70%, transparent 100%);
    transform: translateX(-50%) skewY(-20deg);
    animation: trailingEffect 2s ease-in-out infinite;
}

@keyframes asteroidFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-3px) rotate(5deg); }
}

@keyframes trailingEffect {
    0% { opacity: 0.8; transform: translateX(-50%) skewY(-20deg) scaleY(1); }
    50% { opacity: 1; transform: translateX(-50%) skewY(-15deg) scaleY(1.2); }
    100% { opacity: 0.6; transform: translateX(-50%) skewY(-25deg) scaleY(0.8); }
}

/* ===============================
   ÉTOILE KAWAII (ID: etoile)
   =============================== */

.obj-etoile {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #FFEE58 0%, #FFD54F 100%);
    border-radius: 50%;
}

.obj-etoile::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 22px;
    width: 6px;
    height: 3px;
    background: #000;
    border-radius: 3px 3px 0 0;
    box-shadow: 
        10px 0 0 #000,
        3px 8px 0 -4px #FF6B6B,
        1px 10px 0 -5px #000,
        7px 10px 0 -5px #000,
        -8px 6px 0 -2px #FFCDD2,
        18px 6px 0 -2px #FFCDD2;
}

.obj-etoile::after {
    content: '✨';
    position: absolute;
    top: -10px;
    left: -8px;
    font-size: 16px;
    animation: sparkleKawaii 1.5s ease-in-out infinite;
}

@keyframes sparkleKawaii {
    0%, 100% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(1.1); }
}

/* ===============================
   TANK KAWAII (ID: tank)
   =============================== */

.obj-tank {
    width: 75px;
    height: 40px;
    background: linear-gradient(135deg, #2E7D32 0%, #4CAF50 50%, #388E3C 100%);
    border-radius: 8px 8px 3px 3px;
    border: 3px solid #1B5E20;
    position: relative;
    box-shadow:
        inset 0 3px 6px rgba(255,255,255,0.3),
        inset 0 -3px 6px rgba(0,0,0,0.3),
        0 4px 12px rgba(0,0,0,0.4);
    animation: tankRumble 3s ease-in-out infinite;
}

/* Yeux sérieux et déterminés */
.obj-tank::before {
    content: '';
    position: absolute;
    top: 15px;
    left: 25px;
    width: 6px;
    height: 6px;
    background: #FFF;
    border-radius: 50%;
    box-shadow:
        0 0 0 2px #000,
        14px 0 0 -2px #FFF,
        14px 0 0 0 #000,
        /* Petites pupilles noires mignonnes */
        1px 1px 0 -3px #000,
        15px 1px 0 -3px #000,
        /* Petits reflets blancs kawaii */
        -1px -1px 0 -4px #FFF,
        13px -1px 0 -4px #FFF,
        /* Sourcils sérieux plus marqués */
        -3px -5px 0 -2px #1B5E20,
        17px -5px 0 -2px #1B5E20,
        /* Bouche souriante kawaii */
        7px 8px 0 -3px #FF69B4,
        4px 10px 0 -4px #FF69B4,
        10px 10px 0 -4px #FF69B4,
        /* Casque militaire */
        -5px -8px 0 -1px #795548,
        19px -8px 0 -1px #795548,
        /* Joues roses kawaii */
        -8px 2px 0 -2px #FFB6C1,
        22px 2px 0 -2px #FFB6C1;
}

/* Canon principal plus imposant */
.obj-tank::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 10px;
    height: 15px;
    background: linear-gradient(180deg, #263238 0%, #37474F 50%, #263238 100%);
    border: 2px solid #000;
    border-radius: 4px;
    box-shadow:
        0 -6px 0 -3px #FFD54F,
        inset 0 2px 4px rgba(255,255,255,0.2),
        0 0 8px rgba(0,0,0,0.5),
        /* Tourelle ronde au bout du canon */
        0 20px 0 -2px #37474F,      /* Tourelle gris foncé */
        0 20px 0 0px #000,          /* Contour noir */
        /* Mini yeux kawaii espacés */
        -3px 22px 0 -5px #FFF,      /* Œil gauche blanc */
        3px 22px 0 -5px #FFF,       /* Œil droit blanc */
        -2px 23px 0 -6px #000,      /* Pupille gauche */
        4px 23px 0 -6px #000;       /* Pupille droite */
}

@keyframes tankRumble {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-1px); }
    75% { transform: translateX(1px); }
}

@keyframes nervousEyes {
    0% {
        box-shadow:
            0 -6px 0 -3px #FFD54F,
            inset 0 2px 4px rgba(255,255,255,0.2),
            0 0 8px rgba(0,0,0,0.5),
            0 30px 0 -2px #37474F,
            0 30px 0 0px #000,
            -4px 32px 0 -5px #FF0000,
            4px 32px 0 -5px #FF0000;
    }
    100% {
        box-shadow:
            0 -6px 0 -3px #FFD54F,
            inset 0 2px 4px rgba(255,255,255,0.2),
            0 0 8px rgba(0,0,0,0.5),
            0 30px 0 -2px #37474F,
            0 30px 0 0px #000,
            -3px 31px 0 -5px #FF0000,
            5px 31px 0 -5px #FF0000;
    }
}

@keyframes tankSmoke {
    0% {
        box-shadow:
            0 0 0 2px #000,
            14px 0 0 -2px #FFF,
            14px 0 0 0 #000,
            -3px -5px 0 -2px #1B5E20,
            17px -5px 0 -2px #1B5E20,
            7px 8px 0 -3px #1B5E20,
            -5px -8px 0 -1px #795548,
            19px -8px 0 -1px #795548,
            7px -15px 0 -3px #FF8C00,
            5px -18px 0 -4px #FF6500,
            9px -18px 0 -4px #FF6500,
            6px -21px 0 -5px #FF4500,
            8px -21px 0 -5px #FF4500;
    }
    50% {
        box-shadow:
            0 0 0 2px #000,
            14px 0 0 -2px #FFF,
            14px 0 0 0 #000,
            -3px -5px 0 -2px #1B5E20,
            17px -5px 0 -2px #1B5E20,
            7px 8px 0 -3px #1B5E20,
            -5px -8px 0 -1px #795548,
            19px -8px 0 -1px #795548,
            8px -16px 0 -3px #FF8C00,
            4px -19px 0 -4px #FF6500,
            10px -19px 0 -4px #FF6500,
            5px -22px 0 -5px #FF4500,
            9px -22px 0 -5px #FF4500;
    }
    100% {
        box-shadow:
            0 0 0 2px #000,
            14px 0 0 -2px #FFF,
            14px 0 0 0 #000,
            -3px -5px 0 -2px #1B5E20,
            17px -5px 0 -2px #1B5E20,
            7px 8px 0 -3px #1B5E20,
            -5px -8px 0 -1px #795548,
            19px -8px 0 -1px #795548,
            6px -17px 0 -3px #FF8C00,
            6px -20px 0 -4px #FF6500,
            8px -20px 0 -4px #FF6500,
            7px -23px 0 -5px #FF4500,
            7px -23px 0 -5px #FF4500;
    }
}

/* Système de chenilles complet */
.obj-tank {
    overflow: visible;
}

/* Rectangles noirs pour les chenilles */
.tank-track {
    position: absolute;
    width: 8px;
    height: 80px;
    background: #000;
    top: -5px;
    border-radius: 2px;
}

.tank-track.center {
    left: 50%;
    transform: translateX(-50%);
}

/* Fumée du tank */
.tank-smoke {
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 30px;
    pointer-events: none;
}

.tank-smoke::before {
    content: '💕';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    font-size: 18px;
    animation: smokeAnimation 2s ease-in-out infinite;
}

.tank-smoke::after {
    content: '✨';
    position: absolute;
    top: 3px;
    left: 70%;
    transform: translateX(-50%);
    font-size: 12px;
    animation: fireAnimation 1.5s ease-in-out infinite alternate;
}

@keyframes smokeAnimation {
    0% {
        opacity: 0.6;
        transform: translateX(-50%) scale(0.8) rotate(-5deg);
    }
    50% {
        opacity: 1;
        transform: translateX(-50%) scale(1.1) rotate(5deg) translateY(-3px);
    }
    100% {
        opacity: 0.7;
        transform: translateX(-50%) scale(0.9) rotate(-3deg) translateY(-1px);
    }
}

@keyframes fireAnimation {
    0% {
        opacity: 0.8;
        transform: translateX(-50%) scale(1);
    }
    100% {
        opacity: 1;
        transform: translateX(-50%) scale(1.2);
    }
}


/* Anciennes classes tank supprimées - tout en CSS box-shadow maintenant */

@keyframes powerPulse {
    0%, 100% { transform: scale(1); filter: brightness(1); }
    50% { transform: scale(1.1); filter: brightness(1.2); }
}

/* ===============================
   LUNE KAWAII (ID: lune)
   =============================== */

.obj-lune {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #F8F8FF 0%, #E6E6FA 100%);
    border-radius: 50%;
}

.obj-lune::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 22px;
    width: 8px;
    height: 4px;
    background: #000;
    border-radius: 4px 4px 0 0;
    box-shadow: 
        12px 0 0 #000,
        6px 8px 0 -4px #DDA0DD,
        4px 10px 0 -5px #000,
        8px 10px 0 -5px #000,
        -8px 6px 0 -2px #F8BBD9,
        20px 6px 0 -2px #F8BBD9,
        -15px -8px 0 -3px #E0E0E0,
        25px 15px 0 -3px #E0E0E0;
}

.obj-lune::after {
    content: '💤';
    position: absolute;
    top: -15px;
    right: -10px;
    font-size: 12px;
    animation: sleepFloat 2s ease-in-out infinite;
}

@keyframes sleepFloat {
    0%, 100% { transform: translateY(0); opacity: 0.6; }
    50% { transform: translateY(-10px); opacity: 1; }
}

/* ===============================
   AUTRES OBJETS KAWAII
   =============================== */

.obj-banane {
    width: 60px;
    height: 60px;
    position: relative;
    border: 3px solid #FFD700;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(255,215,0,0.1) 0%, rgba(255,193,7,0.2) 100%);
}

.obj-banane::before {
    content: '🍌';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-30deg);
    font-size: 35px;
    filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
}

@keyframes bananaGlow {
    0% {
        box-shadow:
            inset 0 4px 8px rgba(255,255,255,0.4),
            inset 0 -4px 8px rgba(0,0,0,0.3),
            0 6px 20px rgba(255,193,7,0.4),
            0 0 15px rgba(255,235,59,0.3);
    }
    100% {
        box-shadow:
            inset 0 4px 8px rgba(255,255,255,0.6),
            inset 0 -4px 8px rgba(0,0,0,0.2),
            0 8px 25px rgba(255,193,7,0.6),
            0 0 25px rgba(255,235,59,0.5);
        transform: rotate(-30deg) scale(1.05);
    }
}

/* IPHONE KAWAII 📱 */
.obj-smartphone {
    width: 42px;
    height: 70px;
    background: linear-gradient(145deg, #1A1A1A 0%, #000 100%);
    border-radius: 12px;
    border: 1px solid #333;
    position: relative;
    box-shadow:
        0 6px 12px rgba(0,0,0,0.4),
        inset 0 1px 0 rgba(255,255,255,0.1),
        0 0 0 1px rgba(255,255,255,0.05);
}

.obj-smartphone::before {
    content: '';
    position: absolute;
    top: 6px;
    left: 3px;
    width: 34px;
    height: 56px;
    background: linear-gradient(145deg, #0066CC 0%, #004499 100%);
    border-radius: 8px;
    box-shadow:
        inset 0 2px 4px rgba(255,255,255,0.2),
        inset 0 -1px 2px rgba(0,0,0,0.3);
}

.obj-smartphone::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: 16px;
    height: 3px;
    background: #333;
    border-radius: 2px;
    box-shadow: 0 0 0 1px #000;
}

/* POUBELLE KAWAII MIGNONNE 🗑️ */
.obj-poubelle {
    width: 50px;
    height: 60px;
    background: linear-gradient(180deg, #4CAF50 0%, #388E3C 50%, #2E7D32 100%);
    border-radius: 8px 8px 12px 12px;
    border: 2px solid #2E7D32;
    position: relative;
    box-shadow:
        inset 0 2px 4px rgba(255,255,255,0.3),
        inset 0 -2px 4px rgba(0,0,0,0.2),
        0 4px 8px rgba(0,0,0,0.3);
    animation: binHappy 3s ease-in-out infinite;
}

.obj-poubelle::before {
    content: '';
    position: absolute;
    top: 15px;
    left: 50%;
    transform: translateX(-50%);
    width: 8px;
    height: 8px;
    background: #FFF;
    border-radius: 50%;
    box-shadow:
        0 0 0 2px #000,
        12px 0 0 -2px #FFF,
        12px 0 0 0 #000,
        /* Pupilles mignonnes */
        1px 1px 0 -4px #000,
        11px 1px 0 -4px #000,
        /* Joues roses */
        -6px 8px 0 -3px #FFB6C1,
        18px 8px 0 -3px #FFB6C1,
        /* Sourire kawaii */
        6px 15px 0 -4px #FF69B4,
        3px 17px 0 -5px #FF69B4,
        9px 17px 0 -5px #FF69B4;
}

.obj-poubelle::after {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 35px;
    height: 6px;
    background: linear-gradient(90deg, #66BB6A 0%, #4CAF50 50%, #66BB6A 100%);
    border-radius: 3px;
    border: 1px solid #388E3C;
    box-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

@keyframes binHappy {
    0%, 100% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.05) rotate(1deg); }
}

/* BOMBARDIER FURTIF B-2 SPIRIT 🛩️ */
.obj-avion {
    width: 90px;
    height: 70px;
    background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 30%, #2c2c2c 60%, #000000 100%);
    border-radius: 0;
    border: none;
    position: relative;
    transform: rotate(180deg); /* Orienté vers le bas - nez pointant vers le sol */
    /* Forme en triangle caractéristique du B-2 avec ailes diagonales */
    clip-path: polygon(
        50% 0%,      /* Nez pointu */
        15% 35%,     /* Aile gauche diagonale */
        0% 70%,      /* Bout aile gauche */
        30% 85%,     /* Arrière gauche */
        50% 100%,    /* Queue centrale */
        70% 85%,     /* Arrière droite */
        100% 70%,    /* Bout aile droite */
        85% 35%      /* Aile droite diagonale */
    );
    box-shadow:
        inset 0 3px 6px rgba(255,255,255,0.08),
        inset 0 -3px 6px rgba(0,0,0,0.7),
        0 8px 16px rgba(0,0,0,0.8),
        0 0 20px rgba(0,100,255,0.2);
    animation: stealthFly 4s ease-in-out infinite;
}

.obj-avion::before {
    content: '';
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 6px;
    background: linear-gradient(90deg, transparent, #00ffff 50%, transparent);
    border-radius: 2px;
    opacity: 0.6;
    box-shadow:
        0 0 10px rgba(0,255,255,0.5),
        0 0 20px rgba(0,255,255,0.3);
    animation: stealthLights 2s ease-in-out infinite alternate;
}

.obj-avion::after {
    content: '';
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 3px;
    background: linear-gradient(90deg,
        transparent 0%,
        #ff4500 20%,
        #ff6600 40%,
        #ffaa00 60%,
        #ff4500 80%,
        transparent 100%);
    border-radius: 50%;
    opacity: 0.9;
    box-shadow:
        0 0 8px rgba(255,69,0,0.6),
        0 0 16px rgba(255,102,0,0.4);
    animation: stealthJet 1s ease-in-out infinite;
}

@keyframes stealthFly {
    0%, 100% {
        transform: rotate(180deg) translateY(0);
        filter: brightness(0.8);
    }
    50% {
        transform: rotate(180deg) translateY(-3px) scale(1.02);
        filter: brightness(1.1);
    }
}

@keyframes stealthLights {
    0% {
        opacity: 0.6;
        box-shadow:
            0 0 8px #FF0000,
            8px 15px 0 -2px #FF0000,
            -8px 15px 0 -2px #FF0000;
    }
    100% {
        opacity: 1;
        box-shadow:
            0 0 15px #FF0000,
            8px 15px 0 -2px #FF4444,
            -8px 15px 0 -2px #FF4444,
            0 0 25px rgba(255,0,0,0.8);
    }
}

@keyframes stealthJet {
    0%, 100% {
        opacity: 0.8;
        transform: translateX(-50%) scaleY(1);
    }
    50% {
        opacity: 1;
        transform: translateX(-50%) scaleY(1.3);
    }
}

@keyframes phoneGlow {
    0%, 100% { text-shadow: 0 0 10px #FF69B4; }
    50% { text-shadow: 0 0 20px #FF1493; }
}


/* ===============================
   NOUVELLES ANIMATIONS DÉBRIS ET AVION FURTIF
   =============================== */

@keyframes debrisFloat {
    0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.8; }
    25% { transform: translate(-3px, -5px) rotate(90deg); opacity: 1; }
    50% { transform: translate(5px, -8px) rotate(180deg); opacity: 0.6; }
    75% { transform: translate(-2px, -3px) rotate(270deg); opacity: 1; }
}

@keyframes dustTrail {
    0%, 100% { transform: scale(0.8) rotate(0deg); opacity: 0.5; }
    50% { transform: scale(1.2) rotate(180deg); opacity: 0.9; }
}

@keyframes reactorFlame {
    0%, 100% { transform: scale(0.8); opacity: 0.7; filter: hue-rotate(0deg); }
    50% { transform: scale(1.2); opacity: 1; filter: hue-rotate(60deg); }
}

@keyframes missileGlow {
    0%, 100% { transform: translateX(-50%) scale(0.8); opacity: 0.6; }
    50% { transform: translateX(-50%) scale(1.1); opacity: 1; }
}

@keyframes sonicBoom {
    0%, 100% { transform: scale(0.9) translateX(0); opacity: 0.4; }
    50% { transform: scale(1.3) translateX(-5px); opacity: 0.8; }
}

        `;
    }

    // Créer un objet avec ID unique
    createObject(type, x = 0, y = 0) {
        if (!this.objects[type]) {
            console.error(`Objet ${type} non trouvé !`);
            return null;
        }

        const id = `${type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const objData = this.objects[type];

        const element = document.createElement('div');
        element.id = id;
        element.className = `kawaii-object obj-${type}`;
        element.style.left = x + 'px';
        element.style.top = y + 'px';
        element.dataset.type = type;
        element.dataset.canShoot = objData.canShoot;

        // Ajouter événement de clic pour nettoyer les "idées noires"
        element.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Animation de nettoyage mental
            element.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            element.style.transform = 'scale(0) rotate(720deg)';
            element.style.opacity = '0';
            element.style.filter = 'brightness(2) blur(5px)';

            // Messages de nettoyage selon le type d'objet
            const messages = {
                'tank': '🚗✨ Pensées de guerre nettoyées ! Paix mentale restaurée.',
                'asteroide': '☄️💫 Anxiété spatiale évacuée ! Sérénité retrouvée.',
                'avion': '✈️🌤️ Stress de voyage dissipé ! Calme aérien.',
                'banane': '🍌😊 Doute alimentaire effacé ! Confiance nutritionnelle.',
                'baleine': '🐋💙 Mélancolie océanique apaisée ! Joie marine.',
                'etoile': '⭐🌟 Négativité cosmique purifiée ! Espoir stellaire.',
                'lune': '🌙✨ Tristesse nocturne chassée ! Lumière lunaire.',
                'smartphone': '📱🧘 Addiction digitale nettoyée ! Liberté mentale.',
                'poubelle': '🗑️💚 Pensées toxiques recyclées ! Écologie mentale.'
            };

            const message = messages[type] || `🧹✨ Idée négative "${type}" nettoyée !`;
            console.log(`🧼 Nettoyage mental: ${message}`);

            // Particules de purification (si disponible)
            if (typeof window !== 'undefined' && window.gameState && window.gameState.ajouterParticules) {
                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                window.gameState.ajouterParticules(centerX, centerY, '#87CEEB', 12);
            }

            // Supprimer l'élément après l'animation de purification
            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }, 600);
        });

        // Ajouter éléments spécifiques
        this.addSpecificElements(element, type);

        return {
            element,
            id,
            type,
            data: objData
        };
    }

    // Ajouter éléments spécifiques par objet
    addSpecificElements(element, type) {
        switch(type) {
            case 'baleine':
                this.addBaleineElements(element);
                break;
            case 'tank':
                this.addTankTracks(element);
                break;
            case 'asteroide':
                this.addAsteroideElements(element);
                break;
            case 'etoile':
                this.addEtoileElements(element);
                break;
            case 'lune':
                this.addLuneElements(element);
                break;
            case 'avion':
                this.addAvionElements(element);
                break;
        }
    }

    addTankTracks(element) {
        // Une seule chenille au centre
        const track = document.createElement('div');
        track.className = 'tank-track center';
        element.appendChild(track);

        // Fumée animée
        const smoke = document.createElement('div');
        smoke.className = 'tank-smoke';
        element.appendChild(smoke);
    }

    addBaleineElements(element) {
        // Nageoires animées
        const nageoireG = document.createElement('div');
        nageoireG.className = 'baleine-nageoire-gauche';
        element.appendChild(nageoireG);

        const nageoireD = document.createElement('div');
        nageoireD.className = 'baleine-nageoire-droite';
        element.appendChild(nageoireD);

        // Cœurs flottants
        const heart1 = document.createElement('div');
        heart1.innerHTML = '💕';
        heart1.style.cssText = 'position:absolute;top:-15px;right:-10px;font-size:10px;animation:heartFloat 2s ease-in-out infinite;';
        element.appendChild(heart1);

        const heart2 = document.createElement('div');
        heart2.innerHTML = '💖';
        heart2.style.cssText = 'position:absolute;bottom:10px;left:-15px;font-size:8px;animation:heartFloat 2s ease-in-out infinite 0.7s;';
        element.appendChild(heart2);
    }

    addTankElements(element) {
        // 4 roues
        for (let i = 0; i < 4; i++) {
            const roue = document.createElement('div');
            roue.className = `tank-roue ${(i === 0 || i === 3) ? 'grande' : 'petite'}`;
            roue.style.left = (i === 0 ? '5px' : i === 1 ? '20px' : i === 2 ? '42px' : '53px');
            element.appendChild(roue);
        }

        // Chenille
        const chenille = document.createElement('div');
        chenille.className = 'tank-chenille';
        element.appendChild(chenille);

        // Tourelle
        const tourelle = document.createElement('div');
        tourelle.className = 'tank-tourelle';
        element.appendChild(tourelle);

        // Fumée
        const fumee = document.createElement('div');
        fumee.innerHTML = '☁️';
        fumee.className = 'tank-fumee';
        fumee.style.cssText = 'position:absolute;bottom:-5px;left:50%;transform:translateX(-50%);';
        element.appendChild(fumee);

        // Éclair
        const eclair = document.createElement('div');
        eclair.innerHTML = '⚡';
        eclair.style.cssText = 'position:absolute;top:-12px;right:-8px;font-size:14px;animation:powerPulse 1.2s ease-in-out infinite;';
        element.appendChild(eclair);
    }

    addAsteroideElements(element) {
        // Effet feu principal
        const feu = document.createElement('div');
        feu.innerHTML = '🔥';
        feu.style.cssText = 'position:absolute;top:-8px;left:-8px;font-size:12px;animation:fireWave 1s ease-in-out infinite 0.5s;';
        element.appendChild(feu);

        // Débris volants autour
        const debris1 = document.createElement('div');
        debris1.innerHTML = '🪨';
        debris1.style.cssText = 'position:absolute;top:-15px;right:-10px;font-size:8px;animation:debrisFloat 2s ease-in-out infinite;';
        element.appendChild(debris1);

        const debris2 = document.createElement('div');
        debris2.innerHTML = '⚡';
        debris2.style.cssText = 'position:absolute;bottom:-12px;left:-12px;font-size:10px;animation:debrisFloat 1.5s ease-in-out infinite 0.7s;';
        element.appendChild(debris2);

        // Traînée de poussière
        const dust = document.createElement('div');
        dust.innerHTML = '💨';
        dust.style.cssText = 'position:absolute;bottom:-8px;right:-15px;font-size:12px;animation:dustTrail 2.5s ease-in-out infinite;';
        element.appendChild(dust);
    }

    addEtoileElements(element) {
        // Étincelles supplémentaires
        const etincelle = document.createElement('div');
        etincelle.innerHTML = '✨';
        etincelle.style.cssText = 'position:absolute;bottom:-8px;right:-8px;font-size:12px;animation:sparkleKawaii 1.5s ease-in-out infinite 1s;';
        element.appendChild(etincelle);
    }

    addLuneElements(element) {
        // Étoiles autour
        const etoile = document.createElement('div');
        etoile.innerHTML = '⭐';
        etoile.style.cssText = 'position:absolute;top:-10px;left:-10px;font-size:10px;animation:sparkleKawaii 3s ease-in-out infinite;';
        element.appendChild(etoile);
    }

    addAvionElements(element) {
        // Réacteurs avec flammes bleues
        const reacteur1 = document.createElement('div');
        reacteur1.innerHTML = '🔥';
        reacteur1.style.cssText = 'position:absolute;bottom:-5px;left:15px;font-size:8px;color:#00BFFF;animation:reactorFlame 0.5s ease-in-out infinite;';
        element.appendChild(reacteur1);

        const reacteur2 = document.createElement('div');
        reacteur2.innerHTML = '🔥';
        reacteur2.style.cssText = 'position:absolute;bottom:-5px;right:15px;font-size:8px;color:#00BFFF;animation:reactorFlame 0.5s ease-in-out infinite 0.2s;';
        element.appendChild(reacteur2);

        // Missile furtif
        const missile = document.createElement('div');
        missile.innerHTML = '🚀';
        missile.style.cssText = 'position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);font-size:6px;animation:missileGlow 2s ease-in-out infinite;';
        element.appendChild(missile);

        // Traînée supersonique
        const sonic = document.createElement('div');
        sonic.innerHTML = '💨';
        sonic.style.cssText = 'position:absolute;top:-8px;right:-12px;font-size:10px;animation:sonicBoom 1s ease-in-out infinite;';
        element.appendChild(sonic);
    }

    // Obtenir la liste complète des objets
    getObjectsList() {
        return Object.keys(this.objects).map(key => ({
            id: key,
            ...this.objects[key]
        }));
    }

    // Exploser un objet
    explodeObject(element) {
        element.classList.add('explode');
        setTimeout(() => {
            if (element.parentNode) {
                element.remove();
            }
        }, 600);
    }
}

// ====================================
// UTILISATION DU MODULE
// ====================================

// Exemple d'utilisation :
/*
// Initialiser le module
const kawaiiObjects = new KawaiiObjects();

// Injecter le CSS
const style = document.createElement('style');
style.textContent = kawaiiObjects.getCSS();
document.head.appendChild(style);

// Créer un objet
const baleine = kawaiiObjects.createObject('baleine', 100, 50);
document.body.appendChild(baleine.element);

// Lister tous les objets disponibles
console.log(kawaiiObjects.getObjectsList());

// Exploser un objet
baleine.element.onclick = () => {
    kawaiiObjects.explodeObject(baleine.element);
};
*/

// Export pour Claude Code
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KawaiiObjects;
} else if (typeof window !== 'undefined') {
    window.KawaiiObjects = KawaiiObjects;
}
