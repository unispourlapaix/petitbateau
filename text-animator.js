<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Module d'Animation de Texte Optimisé - Emmanuel Payet</title>
    <style>
        /* Module d'Animation de Texte - Version Optimisée */
        .text-animator {
            font-family: 'Courier New', monospace;
            color: #fff;
            position: relative;
            display: inline-block;
            min-height: 1.2em;
        }

        .text-animator-display {
            font-size: 1.2em;
            line-height: 1.6;
            position: relative;
            background: transparent;
        }

        /* Animations de base */
        .ta-typewriter { border-right: 2px solid #64ffda; animation: ta-blink 1s infinite; }
        .ta-digital { color: #00cc44; text-shadow: 0 0 8px #00cc44; font-family: 'Courier New', monospace; letter-spacing: 2px; }
        .ta-fade-in { animation: ta-fadeIn 1s ease-in; }
        .ta-glitch { position: relative; color: #fff; animation: ta-glitch 2s infinite; }
        .ta-scroll-up { animation: ta-scrollUp 0.8s ease-out; }

        /* Styles narration */
        .ta-narration-style { background: transparent; border: none; border-radius: 15px; padding: 25px; box-shadow: none; line-height: 1.8; }
        .ta-character-line { margin: 15px 0; padding: 10px 15px; border-radius: 10px; background: transparent; border-left: 4px solid; animation: ta-slideInLeft 0.6s ease-out; }
        .ta-character-name { font-weight: bold; font-size: 1.1em; margin-bottom: 5px; }
        .ta-action-line { font-style: italic; opacity: 0.8; text-align: center; margin: 20px 0; color: #aaa; }
        .ta-thought-line { font-style: italic; opacity: 0.9; background: transparent; border-left: 4px solid #666; }

        /* Effets 3D optimisés */
        .ta-effect-shadow3d { text-shadow: 2px 2px 0px var(--ta-effect-color, #64ffda), 4px 4px 0px rgba(0,0,0,0.5), 6px 6px 10px rgba(0,0,0,0.8); transform: perspective(500px) rotateX(15deg); }
        .ta-effect-neon { text-shadow: 0 0 5px var(--ta-text-color, #fff), 0 0 10px var(--ta-text-color, #fff), 0 0 20px var(--ta-effect-color, #64ffda), 0 0 40px var(--ta-effect-color, #64ffda), 0 0 80px var(--ta-effect-color, #64ffda); animation: ta-neonPulse 2s ease-in-out infinite alternate; }
        .ta-effect-emboss { text-shadow: 1px 1px 0px var(--ta-effect-color, #64ffda), -1px -1px 0px rgba(0,0,0,0.8), 2px 2px 5px rgba(0,0,0,0.6); color: var(--ta-text-color, #fff); }
        .ta-effect-outline { text-shadow: -2px -2px 0 var(--ta-effect-color, #64ffda), 2px -2px 0 var(--ta-effect-color, #64ffda), -2px 2px 0 var(--ta-effect-color, #64ffda), 2px 2px 0 var(--ta-effect-color, #64ffda), 0 0 10px rgba(0,0,0,0.5); }
        .ta-effect-fire { background: linear-gradient(45deg, #ff4500, #ff8c00, #ffd700); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-shadow: 0 0 10px #ff4500, 0 0 20px #ff8c00, 0 0 30px #ffd700; animation: ta-fireFlicker 1.5s ease-in-out infinite alternate; }
        .ta-effect-ice { background: linear-gradient(45deg, #87ceeb, #add8e6, #e0ffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-shadow: 0 0 10px #87ceeb, 0 0 20px #add8e6, 2px 2px 4px rgba(135, 206, 235, 0.8); animation: ta-iceShimmer 3s ease-in-out infinite; }

        /* Keyframes optimisées */
        @keyframes ta-blink { 0%, 50% { border-color: transparent; } 51%, 100% { border-color: #64ffda; } }
        @keyframes ta-fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ta-scrollUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes ta-slideInLeft { from { transform: translateX(-50px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes ta-glitch { 0%, 100% { text-shadow: 0 0 5px #ff0000, 0 0 10px #ff0000; transform: translate(0); } 20% { text-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00; transform: translate(-2px, 2px); } 40% { text-shadow: 0 0 5px #0000ff, 0 0 10px #0000ff; transform: translate(-2px, -2px); } 60% { text-shadow: 0 0 5px #ffff00, 0 0 10px #ffff00; transform: translate(2px, 2px); } 80% { text-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff; transform: translate(2px, -2px); } }
        @keyframes ta-neonPulse { from { text-shadow: 0 0 5px var(--ta-text-color, #fff), 0 0 10px var(--ta-text-color, #fff), 0 0 20px var(--ta-effect-color, #64ffda), 0 0 40px var(--ta-effect-color, #64ffda); } to { text-shadow: 0 0 10px var(--ta-text-color, #fff), 0 0 20px var(--ta-text-color, #fff), 0 0 30px var(--ta-effect-color, #64ffda), 0 0 60px var(--ta-effect-color, #64ffda), 0 0 100px var(--ta-effect-color, #64ffda); } }
        @keyframes ta-fireFlicker { 0%, 100% { text-shadow: 0 0 10px #ff4500, 0 0 20px #ff8c00, 0 0 30px #ffd700; } 50% { text-shadow: 0 0 5px #ff4500, 0 0 15px #ff8c00, 0 0 25px #ffd700, 0 0 35px #ff4500; } }
        @keyframes ta-iceShimmer { 0%, 100% { text-shadow: 0 0 10px #87ceeb, 0 0 20px #add8e6, 2px 2px 4px rgba(135, 206, 235, 0.8); } 50% { text-shadow: 0 0 15px #87ceeb, 0 0 30px #add8e6, 0 0 40px #e0ffff, 4px 4px 8px rgba(135, 206, 235, 1); } }

        /* Styles de démonstration */
        body { background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%); font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #fff; }
        .demo-container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .demo-section { margin: 40px 0; padding: 20px; background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .demo-code { background: #1e1e1e; color: #f8f8f2; padding: 15px; border-radius: 5px; font-family: 'Courier New', monospace; overflow-x: auto; margin: 10px 0; font-size: 0.9em; }
        .controls button { background: linear-gradient(45deg, #64ffda, #26a69a); border: none; border-radius: 8px; padding: 10px 20px; color: #000; font-weight: bold; cursor: pointer; transition: transform 0.2s; margin: 5px; }
        .controls button:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(100, 255, 218, 0.4); }
    </style>
</head>
<body>
    <div class="demo-container">
        <h1 style="text-align: center; color: #64ffda;">🎮 Module d'Animation de Texte Optimisé</h1>
        <p style="text-align: center;">Version optimisée pour Emmanuel Payet - Artiste Chrétien & Passionné de Robotique</p>

        <div class="demo-section">
            <h2>🚀 Démonstration Live</h2>
            <div id="demo1" class="text-animator" style="min-height: 80px; margin: 20px 0;"></div>
            <div class="controls">
                <button onclick="demoTypewriter()">Machine à écrire</button>
                <button onclick="demoDigital()">Code Digital</button>
                <button onclick="demoFade()">Apparition</button>
                <button onclick="demoGlitch()">Glitch</button>
                <button onclick="demoNarration()">Narration</button>
            </div>
        </div>

        <div class="demo-section">
            <h2>💻 Usage Simplifié</h2>
            <div class="demo-code">
&lt;!-- HTML --&gt;
&lt;div id="monTexte" class="text-animator"&gt;&lt;/div&gt;

&lt;script&gt;
// JavaScript optimisé
const anim = new TextAnimator('monTexte');

// Animations disponibles
anim.typewriter('Texte avec &lt;strong&gt;HTML&lt;/strong&gt;&lt;br/&gt;Support complet !', {
    speed: 50, effect: 'neon', textColor: '#ffd700'
});

anim.digital('CODE &lt;em&gt;DIGITAL&lt;/em&gt; !', { effect: 'shadow3d' });
anim.fade('&lt;h2&gt;Apparition magique&lt;/h2&gt;', { effect: 'fire' });
anim.glitch('SYSTÈME &lt;strong&gt;CORROMPU&lt;/strong&gt; !', { effect: 'ice' });
&lt;/script&gt;
            </div>
        </div>

        <div class="demo-section">
            <h2>🎨 Effets 3D Disponibles</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0;">
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
                    <strong style="color: #64ffda;">shadow3d</strong><br/>
                    <small>Ombre 3D avec relief</small>
                </div>
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
                    <strong style="color: #ff0080;">neon</strong><br/>
                    <small>Effet néon lumineux</small>
                </div>
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
                    <strong style="color: #ffd700;">emboss</strong><br/>
                    <small>Relief gravé</small>
                </div>
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
                    <strong style="color: #00cc44;">outline</strong><br/>
                    <small>Contour coloré</small>
                </div>
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
                    <strong style="color: #ff4500;">fire</strong><br/>
                    <small>Flammes animées</small>
                </div>
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
                    <strong style="color: #87ceeb;">ice</strong><br/>
                    <small>Effet de glace</small>
                </div>
            </div>
        </div>

        <div class="demo-section">
            <h2>🤖 Claude Code - Setup Rapide</h2>
            <div class="demo-code">
# Installation complète en une commande
claude-code init mon-projet-animation && cd mon-projet-animation

# Génère le projet avec le module
claude-code generate "Site avec TextAnimator pour Emmanuel Payet artiste chrétien"

# Lance le serveur
claude-code serve --watch

# Build optimisé
claude-code build --minify

# Déploiement
claude-code deploy --platform netlify
            </div>
        </div>

        <div class="demo-section">
            <h2>🎵 Exemples pour Emmanuel</h2>
            <div class="demo-code">
// Pour tes créations Gospel
const gospel = new TextAnimator('gospel');
gospel.typewriter('🎵 &lt;strong&gt;Louange Éternelle&lt;/strong&gt; 🎵&lt;br/&gt;Par Emmanuel Payet', {
    speed: 80, effect: 'neon', textColor: '#ffd700'
});

// Pour tes livres avec Béthanie
const livre = new TextAnimator('livre');
livre.narration([
    '[Narrateur] Chapitre 1 : La Lumière',
    '[Béthanie] Papa, raconte-moi une histoire !',
    '[Emmanuel] Avec plaisir ma chérie...'
], { 'Narrateur': '#64ffda', 'Béthanie': '#ff6b9d', 'Emmanuel': '#ffd700' });

// Pour tes projets robotique
const robot = new TextAnimator('robot');
robot.digital('🤖 DREAMER UNISONA 🤖&lt;br/&gt;Intelligence Artificielle Créative', {
    effect: 'shadow3d', textColor: '#00cc44'
});

// Message d'unité
const unity = new TextAnimator('unity');
unity.fade('✝️ &lt;strong&gt;Unité dans la Diversité&lt;/strong&gt; ✝️&lt;br/&gt;Respect et Amour', {
    effect: 'ice', textColor: '#87ceeb'
});
            </div>
        </div>
    </div>

    <script>
        // Module TextAnimator - Version Optimisée
        class TextAnimator {
            constructor(elementId) {
                this.element = document.getElementById(elementId);
                if (!this.element) {
                    console.error('TextAnimator: Element non trouvé:', elementId);
                    return;
                }
                this.element.classList.add('text-animator-display');
                this.reset();
            }

            // État et méthodes utilitaires optimisées
            reset() {
                this.stop();
                this.currentIndex = 0;
                this.element.innerHTML = '';
                this.element.className = 'text-animator-display';
            }

            stop() {
                this.isRunning = false;
                if (this.timeoutId) clearTimeout(this.timeoutId);
            }

            setColors(textColor = '#ffffff', effectColor = '#64ffda') {
                this.element.style.setProperty('--ta-text-color', textColor);
                this.element.style.setProperty('--ta-effect-color', effectColor);
                this.element.style.color = textColor;
            }

            applyEffect(effect = 'none') {
                const effects = ['shadow3d', 'neon', 'emboss', 'outline', 'fire', 'ice'];
                effects.forEach(e => this.element.classList.remove(`ta-effect-${e}`));
                if (effect !== 'none') this.element.classList.add(`ta-effect-${effect}`);
            }

            // Animation machine à écrire optimisée
            typewriter(text, options = {}) {
                this.setupAnimation(text, options);
                this.element.classList.add('ta-typewriter');
                this.isRunning = true;
                this._typewriterStep();
            }

            _typewriterStep() {
                if (!this.isRunning || this.currentIndex >= this.text.length) {
                    this.element.classList.remove('ta-typewriter');
                    this.isRunning = false;
                    if (this.options.onComplete) this.options.onComplete();
                    return;
                }

                const char = this.text.charAt(this.currentIndex);
                if (char === '<') {
                    const tagEnd = this.text.indexOf('>', this.currentIndex);
                    if (tagEnd !== -1) {
                        this.element.innerHTML += this.text.substring(this.currentIndex, tagEnd + 1);
                        this.currentIndex = tagEnd + 1;
                    } else {
                        this.element.innerHTML += char;
                        this.currentIndex++;
                    }
                } else {
                    this.element.innerHTML += char;
                    this.currentIndex++;
                }
                
                this.timeoutId = setTimeout(() => this._typewriterStep(), this.options.speed);
            }

            // Animation code digital optimisée
            digital(text, options = {}) {
                this.setupAnimation(text, options);
                this.element.classList.add('ta-digital');
                this.isRunning = true;
                this._digitalStep();
            }

            _digitalStep() {
                if (!this.isRunning) return;
                
                const textOnly = this.text.replace(/<[^>]*>/g, '');
                if (this.currentIndex >= textOnly.length) {
                    this.element.innerHTML = this.text;
                    this.isRunning = false;
                    if (this.options.onComplete) this.options.onComplete();
                    return;
                }

                let displayText = this._buildHtmlText(this.currentIndex);
                const digitalChars = '01230456789ABCDEF<>{}[]()+-=*/\\|~^&%$#@!?';
                displayText += digitalChars[Math.floor(Math.random() * digitalChars.length)];
                
                this.element.innerHTML = displayText;
                
                setTimeout(() => {
                    this.currentIndex++;
                    if (this.currentIndex < textOnly.length) {
                        this.timeoutId = setTimeout(() => this._digitalStep(), this.options.speed);
                    } else {
                        this.element.innerHTML = this.text;
                        this.isRunning = false;
                        if (this.options.onComplete) this.options.onComplete();
                    }
                }, this.options.speed / 2);
            }

            // Animation fade
            fade(text, options = {}) {
                this.setupAnimation(text, options);
                this.element.classList.add('ta-fade-in');
                this.element.innerHTML = text;
                
                setTimeout(() => {
                    this.element.classList.remove('ta-fade-in');
                    if (this.options.onComplete) this.options.onComplete();
                }, 1000);
            }

            // Animation glitch optimisée
            glitch(text, options = {}) {
                this.setupAnimation(text, options);
                this.element.classList.add('ta-glitch');
                
                const glitchText = this._createGlitchText(text);
                this.element.innerHTML = glitchText;
                
                this.timeoutId = setTimeout(() => {
                    this.element.innerHTML = text;
                    this.element.classList.remove('ta-glitch');
                    if (this.options.onComplete) this.options.onComplete();
                }, this.options.speed * 5);
            }

            // Mode narration optimisé
            narration(lines, characters = {}, options = {}) {
                this.options = { speed: options.speed || 100, onComplete: options.onComplete };
                this.reset();
                this.element.classList.add('ta-narration-style');
                this.currentIndex = 0;
                this.isRunning = true;
                this._narrationStep(lines, characters);
            }

            _narrationStep(lines, characters) {
                if (!this.isRunning || this.currentIndex >= lines.length) {
                    this.isRunning = false;
                    if (this.options.onComplete) this.options.onComplete();
                    return;
                }
                
                const line = lines[this.currentIndex].trim();
                if (line) {
                    const lineDiv = this._createNarrationLine(line, characters);
                    this.element.appendChild(lineDiv);
                }
                
                this.currentIndex++;
                this.timeoutId = setTimeout(() => this._narrationStep(lines, characters), this.options.speed * 15);
            }

            // Méthodes utilitaires optimisées
            setupAnimation(text, options) {
                this.text = text;
                this.options = {
                    speed: options.speed || 50,
                    textColor: options.textColor || '#ffffff',
                    effectColor: options.effectColor || '#64ffda',
                    effect: options.effect || 'none',
                    onComplete: options.onComplete
                };
                this.reset();
                this.setColors(this.options.textColor, this.options.effectColor);
                this.applyEffect(this.options.effect);
            }

            _buildHtmlText(index) {
                let result = '';
                let textIndex = 0;
                for (let i = 0; i < this.text.length && textIndex < index; i++) {
                    if (this.text[i] === '<') {
                        const tagEnd = this.text.indexOf('>', i);
                        if (tagEnd !== -1) {
                            result += this.text.substring(i, tagEnd + 1);
                            i = tagEnd;
                        }
                    } else {
                        result += this.text[i];
                        textIndex++;
                    }
                }
                return result;
            }

            _createGlitchText(text) {
                const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?`~';
                let result = '';
                for (let i = 0; i < text.length; i++) {
                    if (text[i] === '<') {
                        const tagEnd = text.indexOf('>', i);
                        if (tagEnd !== -1) {
                            result += text.substring(i, tagEnd + 1);
                            i = tagEnd;
                        }
                    } else if (Math.random() < 0.1 && text[i] !== ' ') {
                        result += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                    } else {
                        result += text[i];
                    }
                }
                return result;
            }

            _createNarrationLine(line, characters) {
                const lineDiv = document.createElement('div');
                const match = line.match(/\[([^\]]+)\]\s*(.*)/);
                
                if (match) {
                    const [, speaker, text] = match;
                    const lowerSpeaker = speaker.toLowerCase();
                    
                    if (lowerSpeaker.includes('action')) {
                        lineDiv.className = 'ta-action-line';
                        lineDiv.innerHTML = `✨ ${text} ✨`;
                    } else if (lowerSpeaker.includes('pensée')) {
                        const character = speaker.split(' ')[1];
                        lineDiv.className = 'ta-thought-line ta-character-line';
                        lineDiv.style.borderLeftColor = characters[character] || '#666';
                        lineDiv.innerHTML = `<div class="ta-character-name" style="color: ${characters[character] || '#666'}">💭 ${speaker}</div><div>${text}</div>`;
                    } else {
                        lineDiv.className = 'ta-character-line';
                        const color = characters[speaker] || '#fff';
                        lineDiv.style.borderLeftColor = color;
                        lineDiv.innerHTML = `<div class="ta-character-name" style="color: ${color}">${speaker}</div><div>${text}</div>`;
                    }
                } else {
                    lineDiv.className = 'ta-character-line';
                    lineDiv.style.borderLeftColor = characters['Narrateur'] || '#64ffda';
                    lineDiv.innerHTML = `<div class="ta-character-name" style="color: ${characters['Narrateur'] || '#64ffda'}">Narrateur</div><div>${line}</div>`;
                }
                
                return lineDiv;
            }
        }

        // Export global optimisé
        window.TextAnimator = TextAnimator;

        // Fonctions de démonstration optimisées
        const demos = {
            typewriter: () => new TextAnimator('demo1').typewriter('🎵 <strong>Emmanuel Payet</strong> - Artiste Chrétien<br/>Créateur d\'art et passionné de <em>robotique</em> ! ✨', { speed: 60, effect: 'neon', textColor: '#ffd700' }),
            digital: () => new TextAnimator('demo1').digital('🤖 <em>DREAMER UNISONA</em><br/>Intelligence Artificielle <strong>Créative</strong> !', { speed: 50, effect: 'shadow3d', textColor: '#00cc44' }),
            fade: () => new TextAnimator('demo1').fade('<h2>✝️ Message d\'Unité ✝️</h2><p>Respect de la <strong>diversité</strong> et <em>amour</em> pour tous</p>', { effect: 'ice', textColor: '#87ceeb' }),
            glitch: () => new TextAnimator('demo1').glitch('<h2>🔥 SYSTÈME ÉVOLUTIF 🔥</h2><p>Créativité <strong>augmentée</strong> par l\'IA !</p>', { speed: 80, effect: 'fire' }),
            narration: () => new TextAnimator('demo1').narration(['[Narrateur] Histoire d\'Emmanuel et Béthanie', '[Béthanie] Papa, raconte-moi une histoire !', '[Emmanuel] Avec plaisir ma chérie...', '[Action] Emmanuel ouvre un livre magique', '[Pensée Béthanie] Cette histoire sera merveilleuse !'], { 'Narrateur': '#64ffda', 'Béthanie': '#ff6b9d', 'Emmanuel': '#ffd700' })
        };

        // Fonctions globales
        const demoTypewriter = demos.typewriter;
        const demoDigital = demos.digital;
        const demoFade = demos.fade;
        const demoGlitch = demos.glitch;
        const demoNarration = demos.narration;

        // Auto-start optimisé
        addEventListener('load', () => setTimeout(demos.typewriter, 500));
    </script>
</body>
</html>