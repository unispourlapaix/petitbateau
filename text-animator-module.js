// Module d'Animation de Texte - Version complète avec support HTML
class TextAnimationModule {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentIndex = 0;
        this.timeoutId = null;
        this.text = '';
        this.options = {};
    }

    // Configuration des couleurs
    setColors(element, textColor = '#ffffff', effectColor = '#64ffda') {
        element.style.setProperty('--ta-text-color', textColor);
        element.style.setProperty('--ta-effect-color', effectColor);
        element.style.color = textColor;
    }

    // Arrête l'animation
    stop() {
        this.isRunning = false;
        this.isPaused = false;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    // Reset
    reset() {
        this.stop();
        this.currentIndex = 0;
        this.text = '';
    }

    // Animation machine à écrire avec support HTML complet
    typewriter(element, text, speed = 50, onComplete = null) {
        this.text = text;
        this.options = {
            speed: speed,
            onComplete: onComplete
        };

        this.reset();
        element.innerHTML = '';
        element.style.borderRight = '2px solid #64ffda';
        this.isRunning = true;

        this._typewriterStep(element);
    }

    _typewriterStep(element) {
        if (!this.isRunning) return;

        if (this.currentIndex < this.text.length) {
            // Gestion des balises HTML et des \n
            let currentChar = this.text.charAt(this.currentIndex);

            // Si on trouve une balise HTML, on l'ajoute entièrement
            if (currentChar === '<') {
                let tagEnd = this.text.indexOf('>', this.currentIndex);
                if (tagEnd !== -1) {
                    let fullTag = this.text.substring(this.currentIndex, tagEnd + 1);
                    element.innerHTML += fullTag;
                    this.currentIndex = tagEnd + 1;
                } else {
                    element.innerHTML += currentChar;
                    this.currentIndex++;
                }
            } else if (currentChar === '\n') {
                // Gérer les sauts de ligne
                element.innerHTML += '<br>';
                this.currentIndex++;
            } else {
                element.innerHTML += currentChar;
                this.currentIndex++;
            }

            this.timeoutId = setTimeout(() => this._typewriterStep(element), this.options.speed);
        } else {
            element.style.borderRight = 'none';
            this.isRunning = false;
            if (this.options.onComplete) this.options.onComplete();
        }
    }

    // Animation fade avec support HTML
    fadeIn(element, text, duration = 1000, onComplete = null) {
        this.reset();
        element.innerHTML = text.replace(/\n/g, '<br>');
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease-in`;

        setTimeout(() => {
            element.style.opacity = '1';
        }, 50);

        setTimeout(() => {
            element.style.transition = '';
            if (onComplete) onComplete();
        }, duration);
    }

    // Animation digital avec support HTML
    digital(element, text, speed = 50, onComplete = null) {
        this.text = text;
        this.options = {
            speed: speed,
            onComplete: onComplete
        };

        this.reset();
        element.style.color = '#00cc44';
        element.style.textShadow = '0 0 8px #00cc44';
        this.isRunning = true;

        this._digitalStep(element);
    }

    _digitalStep(element) {
        if (!this.isRunning) return;

        if (this.currentIndex < this.text.length) {
            let displayText = '';
            let textOnly = this.text.replace(/<[^>]*>/g, '').replace(/\n/g, ' '); // Texte sans balises
            let currentTextIndex = 0;

            // Reconstitue le texte avec balises jusqu'à la position actuelle
            for (let i = 0; i < this.text.length && currentTextIndex < this.currentIndex; i++) {
                if (this.text.charAt(i) === '<') {
                    let tagEnd = this.text.indexOf('>', i);
                    if (tagEnd !== -1) {
                        displayText += this.text.substring(i, tagEnd + 1);
                        i = tagEnd;
                    }
                } else if (this.text.charAt(i) === '\n') {
                    displayText += '<br>';
                    currentTextIndex++;
                } else {
                    displayText += this.text.charAt(i);
                    currentTextIndex++;
                }
            }

            // Ajoute un caractère aléatoire si on n'est pas à la fin
            if (this.currentIndex < textOnly.length) {
                const digitalChars = '01230456789ABCDEF<>{}[]()+-=*/\\|~^&%$#@!?';
                displayText += digitalChars.charAt(Math.floor(Math.random() * digitalChars.length));
            }

            element.innerHTML = displayText;

            setTimeout(() => {
                this.currentIndex++;
                if (this.currentIndex < textOnly.length) {
                    this.timeoutId = setTimeout(() => this._digitalStep(element), this.options.speed);
                } else {
                    element.innerHTML = this.text.replace(/\n/g, '<br>');
                    this.isRunning = false;
                    if (this.options.onComplete) this.options.onComplete();
                }
            }, this.options.speed / 2);
        }
    }

    // Animation glitch avec support HTML
    glitch(element, text, duration = 2000, onComplete = null) {
        this.reset();

        // Effet de glitch en préservant le HTML
        let textOnly = text.replace(/<[^>]*>/g, '').replace(/\n/g, ' ');
        let glitchText = '';
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?`~';

        // Reconstitue le texte avec des caractères glitch
        for (let i = 0; i < text.length; i++) {
            if (text.charAt(i) === '<') {
                let tagEnd = text.indexOf('>', i);
                if (tagEnd !== -1) {
                    glitchText += text.substring(i, tagEnd + 1);
                    i = tagEnd;
                }
            } else if (text.charAt(i) === '\n') {
                glitchText += '<br>';
            } else {
                if (Math.random() < 0.1 && text.charAt(i) !== ' ') {
                    glitchText += glitchChars.charAt(Math.floor(Math.random() * glitchChars.length));
                } else {
                    glitchText += text.charAt(i);
                }
            }
        }

        element.innerHTML = glitchText;
        element.style.animation = 'ta-glitch 0.3s infinite';

        // Ajouter les keyframes pour l'animation glitch si pas déjà présentes
        if (!document.querySelector('#glitch-keyframes')) {
            const style = document.createElement('style');
            style.id = 'glitch-keyframes';
            style.textContent = `
                @keyframes ta-glitch {
                    0%, 100% {
                        text-shadow: 0 0 5px #ff0000, 0 0 10px #ff0000;
                        transform: translate(0);
                    }
                    20% {
                        text-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00;
                        transform: translate(-2px, 2px);
                    }
                    40% {
                        text-shadow: 0 0 5px #0000ff, 0 0 10px #0000ff;
                        transform: translate(-2px, -2px);
                    }
                    60% {
                        text-shadow: 0 0 5px #ffff00, 0 0 10px #ffff00;
                        transform: translate(2px, 2px);
                    }
                    80% {
                        text-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff;
                        transform: translate(2px, -2px);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            element.innerHTML = text.replace(/\n/g, '<br>');
            element.style.animation = 'none';
            if (onComplete) onComplete();
        }, duration);
    }

    // Vérifier si une animation est en cours
    isAnimating() {
        return this.isRunning;
    }
}