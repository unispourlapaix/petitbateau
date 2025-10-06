// ========================================
// FLYING BIRDS GAME - VERSION MODULAIRE
// Par Emmanuel Payet avec Dreamer Unisona
// ========================================

// ============ MODULES ANIMAUX ============

// Module Corbeau Badass
const CrowModule = {
    id: 'crow',
    name: 'Corbeau Badass',
    emoji: '🐦',

    // Structure CSS du corbeau
    getCSS() {
        return `
            .crow {
                width: 45px;
                height: 30px;
                background: linear-gradient(135deg, #1A1A1A, #000000);
                clip-path: polygon(10% 15%, 25% 0%, 75% 5%, 90% 25%, 95% 60%, 85% 90%, 15% 95%, 5% 70%);
                position: relative;
                animation: badass-wing-beat 0.15s infinite alternate;
                filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6));
            }

            .crow::before {
                content: '';
                width: 8px;
                height: 5px;
                background: linear-gradient(135deg, #FF0000, #8B0000);
                position: absolute;
                top: 9px;
                right: 8px;
                clip-path: polygon(0% 40%, 30% 0%, 100% 20%, 80% 100%, 20% 80%);
                box-shadow: 0 0 6px rgba(255, 0, 0, 0.8);
                animation: evil-glow 1.5s infinite;
            }

            .crow::after {
                content: '';
                position: absolute;
                top: 12px;
                right: -8px;
                width: 0;
                height: 0;
                border-left: 12px solid #FFD700;
                border-top: 4px solid transparent;
                border-bottom: 4px solid transparent;
                filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.4));
            }

            .crow-wing {
                position: absolute;
                width: 28px;
                height: 18px;
                background: linear-gradient(45deg, #4A4A4A, #2F2F2F, #1A1A1A);
                clip-path: polygon(0% 20%, 30% 0%, 70% 5%, 100% 30%, 90% 70%, 60% 100%, 20% 85%, 5% 50%);
                top: 5px;
                left: 2px;
                transform-origin: 85% 65%;
                animation: badass-wing-visible 0.15s infinite alternate;
                z-index: 1;
                filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.5));
                border: 1px solid #666;
            }

            .crow-scar {
                position: absolute;
                width: 2px;
                height: 8px;
                background: linear-gradient(180deg, #666, #999);
                top: 4px;
                right: 12px;
                transform: rotate(20deg);
                border-radius: 1px;
                box-shadow: 0 0 2px rgba(255, 255, 255, 0.3);
            }

            @keyframes badass-wing-beat {
                0% {
                    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6)) brightness(1);
                    transform: rotate(0deg);
                }
                100% {
                    filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.8)) brightness(1.1);
                    transform: rotate(1deg);
                }
            }

            @keyframes badass-wing-visible {
                0% {
                    transform: rotateY(0deg) rotateZ(-15deg) scaleX(1);
                }
                100% {
                    transform: rotateY(-20deg) rotateZ(10deg) scaleX(1.1);
                }
            }

            @keyframes evil-glow {
                0%, 100% {
                    box-shadow: 0 0 6px rgba(255, 0, 0, 0.8);
                }
                50% {
                    box-shadow: 0 0 12px rgba(255, 0, 0, 1);
                }
            }
        `;
    },

    // Structure HTML du corbeau
    getHTML() {
        return `
            <div class="bird crow" id="crow">
                <div class="crow-wing"></div>
                <div class="crow-scar"></div>
            </div>
        `;
    }
};

// Module Colombe Élégante
const DoveModule = {
    id: 'dove',
    name: 'Colombe Élégante',
    emoji: '🕊️',

    getCSS() {
        return `
            .dove {
                width: 40px;
                height: 25px;
                background: linear-gradient(135deg, #FFFFFF, #F8F8FF, #E6E6FA);
                clip-path: polygon(15% 10%, 40% 0%, 85% 8%, 95% 35%, 90% 65%, 75% 90%, 25% 95%, 5% 60%, 10% 30%);
                position: relative;
                animation: elegant-wing-beat 0.4s infinite alternate ease-in-out;
                filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.15));
                box-shadow: inset 0 1px 3px rgba(230, 230, 250, 0.5);
            }

            .dove::before {
                content: '';
                width: 6px;
                height: 6px;
                background: radial-gradient(circle at 30% 30%, #87CEEB, #4169E1);
                position: absolute;
                top: 8px;
                right: 8px;
                clip-path: polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%);
                box-shadow: 0 0 4px rgba(65, 105, 225, 0.4);
                animation: elegant-sparkle 3s infinite;
            }

            .dove::after {
                content: '';
                position: absolute;
                top: 10px;
                right: -6px;
                width: 0;
                height: 0;
                border-left: 8px solid #FFA500;
                border-top: 3px solid transparent;
                border-bottom: 3px solid transparent;
                filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
            }

            .dove-wing {
                position: absolute;
                width: 30px;
                height: 12px;
                background: linear-gradient(45deg, #F8F8FF, #E6E6FA, #D6D6EA);
                clip-path: polygon(0% 30%, 25% 0%, 60% 5%, 85% 15%, 100% 40%, 95% 70%, 75% 100%, 40% 95%, 15% 85%, 5% 60%);
                top: 6px;
                left: 6px;
                transform-origin: 85% 50%;
                animation: elegant-wing-streamlined 0.4s infinite alternate;
                z-index: 1;
                filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.2));
                border: 1px solid rgba(230, 230, 250, 0.6);
            }

            .dove-detail {
                position: absolute;
                width: 4px;
                height: 2px;
                background: linear-gradient(90deg, rgba(230, 230, 250, 0.8), transparent);
                top: 12px;
                left: 15px;
                border-radius: 2px;
                animation: shimmer 2s infinite;
            }

            @keyframes elegant-wing-beat {
                0% {
                    filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.15));
                    transform: rotateY(0deg);
                }
                100% {
                    filter: drop-shadow(0 5px 12px rgba(0, 0, 0, 0.2));
                    transform: rotateY(-5deg);
                }
            }

            @keyframes elegant-wing-streamlined {
                0% {
                    transform: rotateY(0deg) rotateZ(-8deg) translateX(0px);
                }
                100% {
                    transform: rotateY(-12deg) rotateZ(5deg) translateX(1px);
                }
            }

            @keyframes elegant-sparkle {
                0%, 100% {
                    box-shadow: 0 0 4px rgba(65, 105, 225, 0.4);
                }
                50% {
                    box-shadow: 0 0 8px rgba(135, 206, 235, 0.8);
                }
            }

            @keyframes shimmer {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 0.8; }
            }
        `;
    },

    getHTML() {
        return `
            <div class="bird dove hidden" id="dove">
                <div class="dove-wing"></div>
                <div class="dove-detail"></div>
            </div>
        `;
    }
};

// Module Batman
const BatModule = {
    id: 'bat',
    name: 'Batman',
    emoji: '🦇',

    getCSS() {
        return `
            .bat {
                width: 52px;
                height: 26px;
                background: linear-gradient(135deg, #000000, #1A1A1A, #000000);
                clip-path: polygon(50% 0%, 65% 12%, 85% 8%, 100% 25%, 95% 45%, 85% 65%, 75% 100%, 50% 85%, 25% 100%, 15% 65%, 5% 45%, 0% 25%, 15% 8%, 35% 12%);
                position: relative;
                animation: batman-hover-improved 0.1s infinite alternate;
                filter: drop-shadow(0 0 15px rgba(0, 0, 0, 0.9));
                border: 1px solid #333;
            }

            .bat::before {
                content: '';
                width: 4px;
                height: 4px;
                background: radial-gradient(circle, #FF0000, #8B0000);
                border-radius: 50%;
                position: absolute;
                top: 8px;
                left: 30px;
                box-shadow: 0 0 8px rgba(255, 0, 0, 1);
                animation: red-pulse-improved 1.2s infinite;
                z-index: 2;
            }

            .bat::after {
                content: '';
                width: 4px;
                height: 4px;
                background: radial-gradient(circle, #FF0000, #8B0000);
                border-radius: 50%;
                position: absolute;
                top: 8px;
                left: 18px;
                box-shadow: 0 0 8px rgba(255, 0, 0, 1);
                animation: red-pulse-improved 1.2s infinite 0.1s;
                z-index: 2;
            }

            .bat.moving-right {
                animation: fly-right 2s infinite;
                transform: translate(-50%, -50%) rotate(15deg);
            }

            .bat.moving-left {
                animation: fly-left 2s infinite;
                transform: translate(-50%, -50%) scaleX(-1) rotate(-15deg);
            }

            @keyframes batman-hover-improved {
                0% {
                    transform: translate(-50%, -50%) translateY(0px) scale(1);
                    filter: drop-shadow(0 0 15px rgba(0, 0, 0, 0.9));
                }
                100% {
                    transform: translate(-50%, -50%) translateY(-3px) scale(1.03);
                    filter: drop-shadow(0 0 20px rgba(0, 0, 0, 1));
                }
            }

            @keyframes red-pulse-improved {
                0%, 100% {
                    box-shadow: 0 0 8px rgba(255, 0, 0, 1);
                    transform: scale(1);
                }
                50% {
                    box-shadow: 0 0 15px rgba(255, 0, 0, 1);
                    transform: scale(1.2);
                }
            }
        `;
    },

    getHTML() {
        return `
            <div class="bird bat hidden" id="bat"></div>
        `;
    }
};

// ============ CLASSE PRINCIPALE DU JEU ============

class FlyingBirdsGame {
    constructor(containerId) {
        this.containerId = containerId;
        this.currentBird = 'crow';
        this.currentDirection = 'right';
        this.animals = [CrowModule, DoveModule, BatModule];
        this.elements = {};

        this.init();
    }

    // Initialisation du jeu
    init() {
        this.createGameStructure();
        this.injectStyles();
        this.bindEvents();
        this.updateStatus();
        console.log('🎮 Flying Birds Game initialisé !');
    }

    // Création de la structure HTML complète
    createGameStructure() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Conteneur ${this.containerId} introuvable !`);
            return;
        }

        container.innerHTML = `
            <div class="game-container">
                ${this.animals.map(animal => animal.getHTML()).join('')}
            </div>

            <div class="controls">
                ${this.animals.map(animal =>
                    `<button class="btn btn-${animal.id} ${animal.id === 'crow' ? 'active' : ''}"
                             id="btn-${animal.id}">
                        ${animal.emoji} ${animal.name}
                    </button>`
                ).join('')}
                <button class="btn btn-direction" id="btn-direction">➡️ Droite</button>
            </div>

            <div class="status" id="status"></div>
        `;

        // Récupération des éléments
        this.elements = {
            gameContainer: container.querySelector('.game-container'),
            status: container.querySelector('#status')
        };

        // Récupération des éléments animaux et boutons
        this.animals.forEach(animal => {
            this.elements[animal.id] = container.querySelector(`#${animal.id}`);
            this.elements[`btn-${animal.id}`] = container.querySelector(`#btn-${animal.id}`);
        });

        this.elements.btnDirection = container.querySelector('#btn-direction');
    }

    // Injection des styles CSS
    injectStyles() {
        const existingStyle = document.getElementById('flying-birds-styles');
        if (existingStyle) existingStyle.remove();

        const style = document.createElement('style');
        style.id = 'flying-birds-styles';

        style.textContent = `
            /* Styles de base */
            .game-container {
                width: 100%;
                max-width: 800px;
                height: 400px;
                border: 2px solid #4682B4;
                border-radius: 10px;
                position: relative;
                overflow: hidden;
                background: linear-gradient(135deg, #87CEEB, #E0F6FF);
                margin: 20px auto;
            }

            .bird {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                transition: all 0.3s ease;
            }

            .bird.hidden {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.5);
            }

            .bird.moving-right {
                animation: fly-right 2s infinite;
            }

            .bird.moving-left {
                animation: fly-left 2s infinite;
                transform: translate(-50%, -50%) scaleX(-1);
            }

            @keyframes fly-right {
                0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
                25% { transform: translate(-50%, -50%) translateY(-10px); }
                75% { transform: translate(-50%, -50%) translateY(-15px); }
            }

            @keyframes fly-left {
                0%, 100% { transform: translate(-50%, -50%) scaleX(-1) translateY(0px); }
                25% { transform: translate(-50%, -50%) scaleX(-1) translateY(-12px); }
                75% { transform: translate(-50%, -50%) scaleX(-1) translateY(-8px); }
            }

            /* Contrôles */
            .controls {
                display: flex;
                gap: 10px;
                margin: 20px 0;
                flex-wrap: wrap;
                justify-content: center;
            }

            .btn {
                padding: 10px 20px;
                border: none;
                border-radius: 20px;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 3px 6px rgba(0,0,0,0.2);
            }

            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 10px rgba(0,0,0,0.3);
            }

            .btn.active {
                transform: scale(1.1);
                box-shadow: 0 0 15px rgba(255,215,0,0.5);
            }

            .btn-crow {
                background: linear-gradient(45deg, #2C2C2C, #1A1A1A);
                color: white;
            }

            .btn-dove {
                background: linear-gradient(45deg, #F8F8FF, #E6E6FA);
                color: #2C2C2C;
            }

            .btn-bat {
                background: linear-gradient(45deg, #2A0A0A, #000000);
                color: #FF4444;
            }

            .btn-direction {
                background: linear-gradient(45deg, #4682B4, #87CEEB);
                color: white;
            }

            .status {
                text-align: center;
                margin: 10px 0;
                padding: 8px;
                background: rgba(255,255,255,0.8);
                border-radius: 10px;
                font-weight: bold;
                color: #2C2C2C;
            }

            ${this.animals.map(animal => animal.getCSS()).join('\n')}
        `;

        document.head.appendChild(style);
    }

    // Gestion des événements
    bindEvents() {
        // Boutons animaux
        this.animals.forEach(animal => {
            this.elements[`btn-${animal.id}`].addEventListener('click', () => {
                this.switchBird(animal.id);
            });
        });

        // Bouton direction
        this.elements.btnDirection.addEventListener('click', () => {
            this.switchDirection();
        });

        // Contrôles clavier
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    // Changement d'animal
    switchBird(birdId) {
        // Masquer tous les animaux
        this.animals.forEach(animal => {
            this.elements[animal.id].className = `bird ${animal.id} hidden`;
            this.elements[`btn-${animal.id}`].classList.remove('active');
        });

        this.currentBird = birdId;

        setTimeout(() => {
            this.elements[birdId].className = `bird ${birdId} moving-${this.currentDirection}`;
            this.elements[`btn-${birdId}`].classList.add('active');
            this.updateStatus();
        }, 200);

        console.log(`🔄 Changement vers: ${this.getAnimalName(birdId)}`);
    }

    // Changement de direction
    switchDirection() {
        this.currentDirection = this.currentDirection === 'right' ? 'left' : 'right';
        this.elements.btnDirection.innerHTML = this.currentDirection === 'right' ? '➡️ Droite' : '⬅️ Gauche';

        const activeBird = this.elements[this.currentBird];
        activeBird.className = `bird ${this.currentBird} moving-${this.currentDirection}`;

        this.updateStatus();
        console.log(`🔄 Direction: ${this.currentDirection}`);
    }

    // Mise à jour du statut
    updateStatus() {
        const animalName = this.getAnimalName(this.currentBird);
        const direction = this.currentDirection === 'right' ? 'droite' : 'gauche';
        this.elements.status.textContent = `${animalName} actif - Vol vers la ${direction}`;
    }

    // Récupération du nom d'animal
    getAnimalName(id) {
        const animal = this.animals.find(a => a.id === id);
        return animal ? animal.name : 'Inconnu';
    }

    // Gestion des touches clavier
    handleKeyPress(e) {
        switch(e.key) {
            case '1':
                this.switchBird('crow');
                break;
            case '2':
                this.switchBird('dove');
                break;
            case '3':
                this.switchBird('bat');
                break;
            case ' ':
            case 'ArrowLeft':
            case 'ArrowRight':
                e.preventDefault();
                this.switchDirection();
                break;
        }
    }

    // Méthodes publiques pour l'API
    getBirdInfo(birdId) {
        const animal = this.animals.find(a => a.id === birdId);
        return animal ? {
            id: animal.id,
            name: animal.name,
            emoji: animal.emoji,
            active: this.currentBird === birdId
        } : null;
    }

    getAllBirds() {
        return this.animals.map(animal => this.getBirdInfo(animal.id));
    }

    getCurrentState() {
        return {
            currentBird: this.currentBird,
            currentDirection: this.currentDirection,
            birds: this.getAllBirds()
        };
    }
}

// ============ INITIALISATION ============

// Auto-initialisation si DOM prêt
document.addEventListener('DOMContentLoaded', () => {
    // Recherche automatique d'un conteneur
    let container = document.getElementById('flying-birds-game');

    // Si pas de conteneur spécifique, créer un conteneur par défaut
    if (!container) {
        container = document.createElement('div');
        container.id = 'flying-birds-game';
        document.body.appendChild(container);
    }

    // Initialisation du jeu
    window.FlyingBirdsGame = new FlyingBirdsGame('flying-birds-game');

    console.log('🎮 Jeu d\'oiseaux volants chargé !');
    console.log('📖 Utilisez les touches 1, 2, 3 ou Espace pour jouer');
});

// Export pour modules ES6 si nécessaire
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FlyingBirdsGame, CrowModule, DoveModule, BatModule };
}

// ============ API PUBLIQUE ============

// Fonctions globales pour faciliter l'utilisation
window.switchToCrow = () => window.FlyingBirdsGame?.switchBird('crow');
window.switchToDove = () => window.FlyingBirdsGame?.switchBird('dove');
window.switchToBat = () => window.FlyingBirdsGame?.switchBird('bat');
window.toggleDirection = () => window.FlyingBirdsGame?.switchDirection();
window.getGameState = () => window.FlyingBirdsGame?.getCurrentState();