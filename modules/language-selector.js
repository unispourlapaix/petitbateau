/**
 * 🌍 Composant de Sélection de Langue
 */

class LanguageSelector {
    constructor() {
        this.isVisible = false;
        this.buttonElement = null;
        this.overlayElement = null;
        this.wasMessageActive = false;
        this.savedMessageTime = null;
        this.gameWasPaused = false;
    }

    /**
     * Créer le sélecteur de langue
     */
    create() {
        // Bouton de langue
        this.buttonElement = document.createElement('div');
        this.buttonElement.id = 'language-button';
        this.buttonElement.innerHTML = '🌍';
        this.buttonElement.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 60px;
            background: linear-gradient(145deg, rgba(100,255,218,0.2), rgba(100,255,218,0.1));
            border: 2px solid rgba(100,255,218,0.4);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 28px;
            z-index: 1000;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            opacity: 1;
        `;

        // Hover effect
        this.buttonElement.addEventListener('mouseenter', () => {
            this.buttonElement.style.transform = 'translateX(-50%) scale(1.1)';
            this.buttonElement.style.background = 'linear-gradient(145deg, rgba(100,255,218,0.3), rgba(100,255,218,0.2))';
        });

        this.buttonElement.addEventListener('mouseleave', () => {
            this.buttonElement.style.transform = 'translateX(-50%) scale(1)';
            this.buttonElement.style.background = 'linear-gradient(145deg, rgba(100,255,218,0.2), rgba(100,255,218,0.1))';
        });

        // GRILLE DE LANGUES POUR 13 LANGUES
        this.overlayElement = document.createElement('div');
        this.overlayElement.id = 'language-dropdown';
        this.overlayElement.style.cssText = `
            position: fixed;
            top: 150px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(145deg, rgba(255,255,255,0.95), rgba(248,250,252,0.9));
            border: 2px solid rgba(100,255,218,0.4);
            border-radius: 12px;
            padding: 15px;
            z-index: 2000;
            display: none;
            backdrop-filter: blur(15px);
            width: 320px;
            max-height: 400px;
            overflow-y: auto;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        `;

        // Container en grille pour les langues
        const gridContainer = document.createElement('div');
        gridContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
        `;

        // Créer les options de langue
        const languages = window.i18n.getSupportedLanguages();
        Object.entries(languages).forEach(([code, name]) => {
            const option = document.createElement('div');
            option.className = 'language-option-simple';
            option.dataset.lang = code;
            option.innerHTML = `
                <span style="font-size: 18px; margin-right: 8px;">${this.getFlagEmoji(code)}</span>
                <span style="font-size: 14px; font-weight: 500; color: #334155;">${name}</span>
            `;
            option.style.cssText = `
                padding: 10px 12px;
                cursor: pointer;
                border-radius: 8px;
                display: flex;
                align-items: center;
                transition: all 0.2s ease;
                margin: 2px 0;
                min-height: 40px;
                font-size: 13px;
            `;

            option.addEventListener('mouseenter', () => {
                option.style.background = 'rgba(100,255,218,0.2)';
            });

            option.addEventListener('mouseleave', () => {
                option.style.background = 'transparent';
            });

            option.addEventListener('click', () => {
                this.selectLanguage(code);
            });

            gridContainer.appendChild(option);
        });

        this.overlayElement.appendChild(gridContainer);

        // Event listeners
        this.buttonElement.addEventListener('click', () => {
            this.show();
        });

        // Fermer avec Escape ou clic ailleurs
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });

        document.addEventListener('click', (e) => {
            if (this.isVisible && !this.buttonElement.contains(e.target) && !this.overlayElement.contains(e.target)) {
                this.hide();
            }
        });

        // Ajouter au DOM
        document.body.appendChild(this.buttonElement);
        document.body.appendChild(this.overlayElement);

        // DISPARITION AUTOMATIQUE APRÈS 12 SECONDES (comportement normal)
        setTimeout(() => {
            this.hideButton();
        }, 12000);

        console.log('🌍 Sélecteur de langue créé - disparition dans 12s');
    }

    /**
     * Obtenir l'emoji du drapeau pour chaque langue
     */
    getFlagEmoji(code) {
        const flags = {
            'fr': '🇫🇷',
            'en': '🇬🇧',
            'jp': '🇯🇵',
            'uk': '🇺🇦',
            'es': '🇪🇸',
            'de': '🇩🇪',
            'it': '🇮🇹',
            'pt': '🇵🇹',
            'ru': '🇷🇺',
            'zh': '🇨🇳',
            'ko': '🇰🇷',
            'ar': '🇸🇦',
            'he': '🇮🇱'
        };
        return flags[code] || '🌍';
    }

    /**
     * Sélectionner une langue
     */
    async selectLanguage(code) {
        console.log(`🌍 Changement de langue vers: ${code}`);

        const success = await window.i18n.setLanguage(code);
        if (success) {
            // Mettre à jour l'émoji du bouton
            this.buttonElement.innerHTML = this.getFlagEmoji(code);

            // Déclencher un événement pour que le jeu se mette à jour
            window.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { language: code }
            }));

            this.hide();

            // Attendre que le menu se ferme avant d'afficher le message
            setTimeout(() => {
                if (window.afficherMessageNarratifSimple) {
                    const messages = {
                        'fr': '🌍 Langue changée en Français',
                        'en': '🌍 Language changed to English',
                        'jp': '🌍 言語が日本語に変更されました',
                        'uk': '🌍 Мову змінено на українську'
                    };
                    window.afficherMessageNarratifSimple(messages[code] || messages['fr'], 2500);
                }
            }, 500);
        }
    }

    /**
     * Afficher la liste avec pause du jeu
     */
    show() {
        // PAUSE ANIMATIONS, MESSAGES ET TIMINGS
        this.gameWasPaused = window.jeuEnPause || false;

        // Démarrer la pause des timings
        if (!this.gameWasPaused) {
            window.debutPause = Date.now();
        }
        window.jeuEnPause = true;

        // Pauser les animations CSS
        document.body.classList.add('game-paused');

        // Pause des messages narratifs
        this.wasMessageActive = false;
        if (window.messageNarratifActif) {
            this.wasMessageActive = true;
            this.savedMessageTime = window.messageNarratifActif.temps;
            // Étendre le temps pour "pauser" le message
            window.messageNarratifActif.temps = window.now() + 999999999;
            console.log('🌍 Message narratif mis en pause');
        }

        this.overlayElement.style.display = 'block';
        this.isVisible = true;

        // Animation simple
        this.overlayElement.style.opacity = '0';
        this.overlayElement.style.transform = 'translateX(-50%) translateY(-10px)';

        setTimeout(() => {
            this.overlayElement.style.transition = 'all 0.3s ease';
            this.overlayElement.style.opacity = '1';
            this.overlayElement.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);

        console.log('🌍 Liste langue ouverte - jeu en pause');
    }

    /**
     * Masquer la liste et reprendre le jeu
     */
    hide() {
        this.overlayElement.style.opacity = '0';
        this.overlayElement.style.transform = 'translateX(-50%) translateY(-10px)';

        setTimeout(() => {
            this.overlayElement.style.display = 'none';
            this.isVisible = false;

            // REPRENDRE LES TIMINGS ET ANIMATIONS
            if (!this.gameWasPaused) {
                // Calculer le temps pausé
                const dureePause = Date.now() - window.debutPause;
                window.tempsPause += dureePause;
                window.jeuEnPause = false;
                console.log(`🌍 Pause de ${dureePause}ms ajoutée au total (${window.tempsPause}ms)`);
            }

            // REPRENDRE LE MESSAGE NARRATIF
            if (this.wasMessageActive && window.messageNarratifActif && this.savedMessageTime) {
                const timeElapsed = window.now() - this.savedMessageTime;
                const remainingTime = this.savedMessageTime - timeElapsed;
                // Restaurer le temps restant (minimum 2 secondes)
                window.messageNarratifActif.temps = window.now() + Math.max(remainingTime, 2000);
                console.log('🌍 Message narratif repris');
            }

            console.log('🌍 Liste langue fermée - timings, animations et jeu repris');
        }, 300);
    }

    /**
     * Masquer complètement le bouton (disparition après 12s)
     */
    hideButton() {
        if (this.buttonElement) {
            this.buttonElement.style.opacity = '0';
            this.buttonElement.style.pointerEvents = 'none';
            this.hide(); // Masquer aussi le menu s'il est ouvert
            console.log('🌍 Bouton langue masqué - accessible dans le menu énigmes');
        }
    }

    /**
     * Réafficher le bouton (pour le menu énigmes plus tard)
     */
    showButton() {
        if (this.buttonElement) {
            this.buttonElement.style.opacity = '1';
            this.buttonElement.style.pointerEvents = 'auto';
        }
    }

    /**
     * Mettre à jour le bouton avec la langue actuelle
     */
    updateButton() {
        const currentLang = window.i18n.getCurrentLanguage();
        this.buttonElement.innerHTML = this.getFlagEmoji(currentLang);
    }
}

// Instance globale
window.languageSelector = new LanguageSelector();

console.log('🌍 Module LanguageSelector chargé');