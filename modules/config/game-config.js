/**
 * GAME CONFIG MODULE - Voir la Vérité
 * Configuration centralisée du jeu
 */

const GameConfig = {
    // === CHAPITRES ET VOYAGES ===
    CHAPITRE1: [
        { nom: 'ON M\'A DIT...', couleur: '#FFB6C1', msg: '🗣️ Les manipulations s\'effacent devant la vérité !' },
        { nom: 'DES MONSTRES', couleur: '#87CEEB', msg: '👨‍👩‍👧‍👦 Non... des humains comme nous !' },
        { nom: 'PRÉJUGÉS', couleur: '#DDA0DD', msg: '🎭 Les masques tombent un à un...' },
        { nom: 'PEURS', couleur: '#98FB98', msg: '👁️ J\'ai choisi de voir par moi-même !' },
        { nom: 'MÉFIANCE', couleur: '#FFCCCB', msg: '🤝 La méfiance cède à la compation...' },
        { nom: 'QUI SONT-ILS ?', couleur: '#F0E68C', msg: '❓ Cette question hante mes nuits...' },
        { nom: 'J\'AI VU...', couleur: '#E6E6FA', msg: '👁️ Et mes yeux se sont ouverts...' },
        { nom: 'UN PÈRE', couleur: '#FFDAB9', msg: '👨 Un homme qui aime ses enfants...' },
        { nom: 'UNE MÈRE', couleur: '#AFEEEE', msg: '👩 Une femme courageuse...' },
        { nom: 'DES ENFANTS', couleur: '#F5DEB3', msg: '👶 Des rires purs et innocents...' },
        { nom: 'L\'HUMANITÉ', couleur: '#FFE4E1', msg: '💫 L\'essence même de ce que nous sommes...' },
        { nom: 'L\'AMOUR', couleur: '#E0FFFF', msg: '❤️ Plus fort que toutes les barrières...' },
        { nom: 'LA COMPASSION', couleur: '#FFF8DC', msg: '🤗 Qui unit au-delà des différences...' },
        { nom: 'L\'ESPOIR', couleur: '#F0FFF0', msg: '🌅 Une lumière dans l\'obscurité...' },
        { nom: 'LA PAIX', couleur: '#F5F5DC', msg: '🕊️ Possible quand on choisis d\'aimer...' },
        { nom: 'COMME MOI', couleur: '#FFFACD', msg: '🌍 On est tous des immigrés...' }
    ],

    CHAPITRE2: [
        { nom: 'DISCORD', couleur: '#8B0000', msg: '⚡ On m\'a dit de ne pas les écouter...' },
        { nom: 'HAINE', couleur: '#4B0000', msg: '🌩️ Ne pas laisser l\'orage me faire peur...' },
        { nom: 'DESTRUCTION', couleur: '#2F1B14', msg: '🦈 Mais les requins rodent dans les eaux sombres...' },
        { nom: 'MENSONGE', couleur: '#36454F', msg: '⛈️ Les mensonges éclatent comme la foudre...' },
        { nom: 'MANIPULATION', couleur: '#2F2F2F', msg: '🕷️ Les fils invisibles tirent les cœurs...' },
        { nom: 'CUPIDITÉ', couleur: '#654321', msg: '💰 L\'or ternit même la plus pure lumière...' },
        { nom: 'AVIDITÉ', couleur: '#483C32', msg: '🕳️ L\'avidité dévore tout sur son passage...' },
        { nom: 'JALOUSIE', couleur: '#2E4B2E', msg: '💚 Le poison vert de l\'envie...' },
        { nom: 'ORGUEIL', couleur: '#191970', msg: '👑 La couronne qui aveugle...' },
        { nom: 'COLÈRE', couleur: '#8B1538', msg: '🔥 Les flammes qui consument la raison...' },
        { nom: 'VENGEANCE', couleur: '#4A4A4A', msg: '⚔️ La spirale sans fin de la souffrance...' },
        { nom: 'INDIFFÉRENCE', couleur: '#708090', msg: '🧊 Le froid qui glace les âmes...' },
        { nom: 'ÉGOÏSME', couleur: '#5D5D5D', msg: '🪞 Ne voir que son propre reflet...' },
        { nom: 'IGNORANCE', couleur: '#2F4F4F', msg: '🙈 Choisir de fermer les yeux...' },
        { nom: 'RÉSISTANCE', couleur: '#1C1C1C', msg: '🛡️ Mais je garde mon cœur pur dans la tempête...' },
        { nom: 'LUMIÈRE', couleur: '#483D8B', msg: '✨ Car au-delà des nuages, elle existe toujours...' }
    ],

    // === MESSAGES D'INTRODUCTION ===
    MESSAGES_INTRO: [
        '👁️✨ VOIR LA VÉRITÉ ✨👁️<br><br>🌅 CHAPITRE 1 : LA LUMIÈRE<br><br>💭 "On m\'a dit qu\'ils étaient tous des monstres...<br>On m\'a dit tant de mal, tant de malheurs sur eux...<br>Mais moi, j\'ai préféré aller voir de mes propres yeux.<br>Qui étaient ces gens-là ?..."',
        '💭 "Et j\'ai vu...<br>Un père... une mère... des enfants...<br>Tous cherchant simplement à vivre leur meilleure vie... Comme moi."',
        '🌑 Puis viendra l\'obscurité... ⛈️<br>🎮 Brise les préjugés, résiste aux tempêtes !<br><br>👆 Touchez pour commencer le voyage !'
    ],

    // === COULEURS ET THEMES ===
    COLORS: {
        // Couleurs des cœurs volants
        HEART_COLORS: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'],

        // Couleurs des petits cœurs décoratifs
        DECORATIVE_COLORS: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#FFA502', '#26de81', '#fd79a8'],

        // Couleurs des briques
        BRICK_COLORS: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#FFA502'],

        // Couleurs d'environnement
        BACKGROUNDS: {
            CHAPITRE1: {
                gradient: [
                    'rgba(135, 206, 250, 0.98)', // Ciel diurne
                    'rgba(176, 224, 230, 0.98)',
                    'rgba(240,248,255,0.98)'
                ]
            },
            CHAPITRE2: {
                gradient: [
                    'rgba(25, 25, 112, 0.98)', // Ciel nocturne orageux
                    'rgba(47, 79, 79, 0.98)',
                    'rgba(105, 105, 105, 0.98)'
                ]
            }
        }
    },

    // === PARAMETRES DE JEU ===
    GAMEPLAY: {
        // Timing des animations
        ANIMATION_BATEAU: {
            DUREE_ARRIVEE: 2000,    // 2 secondes pour arriver
            DUREE_ARRET: 20000,     // 20 secondes d'arrêt
            DUREE_DEPART: 1500      // 1.5 secondes pour partir
        },

        // Vies et scoring
        VIES_INITIALES: 3,
        POINTS_PAR_COUP: 50,
        POINTS_PAR_DESTRUCTION: 100,
        POINTS_CONNAISSANCE: 10,
        POINTS_CORBEAU: 100,
        POINTS_CORBEAU_TRANSFORMATION: 1000,
        POINTS_VICTOIRE_SECRET: 5000,

        // Munitions et rechargement
        MUNITIONS_INITIALES: 10,
        TEMPS_RECHARGEMENT: 20,

        // Particules
        MAX_PARTICULES: 200,

        // Corbeau secret
        CORBEAU: {
            INTERVALLE_APPARITION: 30000, // 30 secondes
            TOUCHES_POUR_TRANSFORMATION: 3,
            VITESSE: 0.8 / 1.5 // 1.5x plus lent
        },

        // Mode secret
        MODE_SECRET: {
            DUREE_SURVIE: 30000, // 30 secondes
            MAX_OBSTACLES: 3,
            INTERVALLE_OBSTACLES: 1500
        }
    },

    // === MESSAGES DE JEU ===
    MESSAGES: {
        CORBEAU_RIGOLO: [
            'NO GREAT! HAAAH!',
            'BOOOO! PAS BIEN!',
            'OOOH NON! VILAIN!',
            'HAAAH! CATASTROPHE!',
            'BEURK! MECHANT!',
            'AIEEEE! MONSTER!',
            'GRRRR! STUPID!',
            'PFFFFFF! IDIOT!',
            'TSSS TSSS! SHAME!'
        ],

        CORBEAU_VIE: [
            '🚫 Les baleines sont protégées !<br>💔 Vie perdue : {vies} restantes<br>😤 Tire seulement sur les icebergs !<br>🙄 TSSS TSSS!',
            '🚫 BALEINE = INTERDITE !<br>💔 Oups : {vies} vies restantes<br>😤 ICEBERGS SEULEMENT !<br>🤦‍♂️ PFFFFFF!',
            '🚫 PAUVRE BALEINE !<br>💔 Punition : {vies} vies left<br>😤 GLACE = OK, BALEINE = NON !<br>😂 HAHAHAHA!'
        ]
    },

    // === CALCULS RESPONSIFS ===
    RESPONSIVE: {
        // Fonction pour calculer les constantes du jeu
        calculateConstants(canvasWidth, canvasHeight) {
            return {
                W: canvasWidth,
                H: canvasHeight,
                PW: Math.max(canvasWidth * 0.3, 100),     // Largeur du bateau
                PH: Math.max(canvasHeight * 0.025, 15),   // Hauteur du bateau
                BS: Math.max(Math.min(canvasWidth, canvasHeight) * 0.025, 10), // Taille de la balle
                SP: Math.max(Math.min(canvasWidth, canvasHeight) * 0.0005, 0.3)  // Vitesse équilibrée
            };
        },

        // Configuration du canvas
        setupCanvas(container) {
            // Format 9:16 portrait uniforme pour tous les appareils
            let width = Math.min(container.clientWidth, 450);
            let height = Math.min(container.clientHeight, 800);

            // Respecter le ratio 9:16
            const aspectRatio = 9 / 16;
            if (width / height > aspectRatio) {
                width = height * aspectRatio;
            } else {
                height = width / aspectRatio;
            }

            // Dimensions minimales
            width = Math.max(width, 360);
            height = Math.max(height, 640);

            return { width: Math.round(width), height: Math.round(height) };
        }
    }
};

// Export pour usage comme module ES6
export default GameConfig;

// Export pour usage CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameConfig;
}