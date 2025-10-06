<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flying Birds Module - Ready for Game Integration</title>
    <style>
        /* ===========================================
           FLYING BIRDS MODULE - GAME READY
           Par Emmanuel Payet / Dreamer Unisona
           Fond transparent, animations automatiques
           ========================================== */

        /* Variables CSS pour personnalisation facile */
        :root {
            --bird-scale: 1;
            --animation-speed: 1;
            --crow-color: #1A1A1A;
            --dove-color: #FFFFFF;
            --bat-color: #000000;
        }

        /* Container principal - FOND TRANSPARENT */
        .flying-birds-container {
            position: relative;
            width: 100%;
            height: 100%;
            background: transparent;
            pointer-events: none;
            overflow: visible;
        }

        /* Base commune pour tous les oiseaux */
        .bird-base {
            position: absolute;
            transform-origin: center;
            pointer-events: auto;
            transition: all 0.3s ease;
            transform: scale(var(--bird-scale));
        }

        /* États de visibilité */
        .bird-hidden {
            opacity: 0;
            transform: scale(0) scale(var(--bird-scale));
        }

        .bird-visible {
            opacity: 1;
            transform: scale(1) scale(var(--bird-scale));
        }

        /* ===========================================
           CORBEAU BADASS - ID: crow
           ========================================== */
        #crow {
            width: 45px;
            height: 30px;
            background: linear-gradient(135deg, var(--crow-color), #000000);
            clip-path: polygon(10% 15%, 25% 0%, 75% 5%, 90% 25%, 95% 60%, 85% 90%, 15% 95%, 5% 70%);
            animation: crow-auto-flight calc(2s / var(--animation-speed)) infinite;
            filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6));
        }

        /* Aile du corbeau */
        #crow::before {
            content: '';
            position: absolute;
            width: 28px;
            height: 18px;
            background: linear-gradient(45deg, #4A4A4A, #2F2F2F, #1A1A1A);
            clip-path: polygon(0% 20%, 30% 0%, 70% 5%, 100% 30%, 90% 70%, 60% 100%, 20% 85%, 5% 50%);
            top: 5px;
            left: 2px;
            z-index: -1;
            animation: crow-wing-beat calc(0.15s / var(--animation-speed)) infinite alternate;
            filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.5));
        }

        /* Œil et bec du corbeau */
        #crow::after {
            content: '';
            position: absolute;
            width: 8px;
            height: 5px;
            background: linear-gradient(135deg, #FF0000, #8B0000);
            clip-path: polygon(0% 40%, 30% 0%, 100% 20%, 80% 100%, 20% 80%);
            top: 9px;
            right: 8px;
            box-shadow: 0 0 6px rgba(255, 0, 0, 0.8);
            animation: crow-evil-glow calc(1.5s / var(--animation-speed)) infinite;
        }

        /* ===========================================
           COLOMBE ÉLÉGANTE - ID: dove
           ========================================== */
        #dove {
            width: 40px;
            height: 25px;
            background: linear-gradient(135deg, var(--dove-color), #F8F8FF, #E6E6FA);
            clip-path: polygon(15% 10%, 40% 0%, 85% 8%, 95% 35%, 90% 65%, 75% 90%, 25% 95%, 5% 60%, 10% 30%);
            animation: dove-auto-flight calc(3s / var(--animation-speed)) infinite;
            filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.15));
        }

        /* Aile de la colombe */
        #dove::before {
            content: '';
            position: absolute;
            width: 30px;
            height: 12px;
            background: linear-gradient(45deg, #F8F8FF, #E6E6FA, #D6D6EA);
            clip-path: polygon(0% 30%, 25% 0%, 60% 5%, 85% 15%, 100% 40%, 95% 70%, 75% 100%, 40% 95%, 15% 85%, 5% 60%);
            top: 6px;
            left: 6px;
            z-index: -1;
            animation: dove-wing-beat calc(0.4s / var(--animation-speed)) infinite alternate;
            filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.2));
        }

        /* Œil de la colombe */
        #dove::after {
            content: '';
            position: absolute;
            width: 6px;
            height: 6px;
            background: radial-gradient(circle at 30% 30%, #87CEEB, #4169E1);
            clip-path: polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%);
            top: 8px;
            right: 8px;
            box-shadow: 0 0 4px rgba(65, 105, 225, 0.4);
            animation: dove-sparkle calc(3s / var(--animation-speed)) infinite;
        }

        /* ===========================================
           BATMAN - ID: bat
           ========================================== */
        #bat {
            width: 52px;
            height: 26px;
            background: linear-gradient(135deg, var(--bat-color), #1A1A1A, #000000);
            clip-path: polygon(50% 0%, 65% 12%, 85% 8%, 100% 25%, 95% 45%, 85% 65%, 75% 100%, 50% 85%, 25% 100%, 15% 65%, 5% 45%, 0% 25%, 15% 8%, 35% 12%);
            animation: bat-auto-flight calc(1.5s / var(--animation-speed)) infinite;
            filter: drop-shadow(0 0 15px rgba(0, 0, 0, 0.9));
            transform: rotate(15deg);
        }

        /* Yeux rouges de Batman */
        #bat::before {
            content: '';
            position: absolute;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, #FF0000, #8B0000);
            border-radius: 50%;
            top: 8px;
            left: 30px;
            box-shadow: 0 0 8px rgba(255, 0, 0, 1);
            animation: bat-red-pulse calc(1.2s / var(--animation-speed)) infinite;
        }

        #bat::after {
            content: '';
            position: absolute;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, #FF0000, #8B0000);
            border-radius: 50%;
            top: 8px;
            left: 18px;
            box-shadow: 0 0 8px rgba(255, 0, 0, 1);
            animation: bat-red-pulse calc(1.2s / var(--animation-speed)) infinite 0.1s;
        }

        /* ===========================================
           ANIMATIONS AUTOMATIQUES
           ========================================== */

        /* Vol automatique du corbeau */
        @keyframes crow-auto-flight {
            0%, 100% {
                transform: translateY(0px) rotate(0deg) scale(var(--bird-scale));
            }
            25% {
                transform: translateY(-15px) rotate(2deg) scale(var(--bird-scale));
            }
            50% {
                transform: translateY(-8px) rotate(-1deg) scale(var(--bird-scale));
            }
            75% {
                transform: translateY(-20px) rotate(1deg) scale(var(--bird-scale));
            }
        }

        /* Vol automatique du corbeau vers la gauche (inversé) */
        @keyframes crow-auto-flight-left {
            0%, 100% {
                transform: scaleX(-1) scale(var(--bird-scale)) translateY(0px) rotate(0deg);
            }
            25% {
                transform: scaleX(-1) scale(var(--bird-scale)) translateY(-15px) rotate(-2deg);
            }
            50% {
                transform: scaleX(-1) scale(var(--bird-scale)) translateY(-8px) rotate(1deg);
            }
            75% {
                transform: scaleX(-1) scale(var(--bird-scale)) translateY(-20px) rotate(-1deg);
            }
        }

        /* Battement d'aile du corbeau */
        @keyframes crow-wing-beat {
            0% { 
                transform: rotateY(0deg) rotateZ(-15deg) scaleX(1);
            }
            100% { 
                transform: rotateY(-20deg) rotateZ(10deg) scaleX(1.1);
            }
        }

        /* Lueur maléfique du corbeau */
        @keyframes crow-evil-glow {
            0%, 100% { 
                box-shadow: 0 0 6px rgba(255, 0, 0, 0.8);
                filter: brightness(1);
            }
            50% { 
                box-shadow: 0 0 12px rgba(255, 0, 0, 1);
                filter: brightness(1.3);
            }
        }

        /* Vol automatique de la colombe */
        @keyframes dove-auto-flight {
            0%, 100% { 
                transform: translateY(0px) translateX(0px) scale(var(--bird-scale));
            }
            33% { 
                transform: translateY(-12px) translateX(2px) scale(var(--bird-scale));
            }
            66% { 
                transform: translateY(-8px) translateX(-1px) scale(var(--bird-scale));
            }
        }

        /* Battement d'aile de la colombe */
        @keyframes dove-wing-beat {
            0% { 
                transform: rotateY(0deg) rotateZ(-8deg) translateX(0px);
            }
            100% { 
                transform: rotateY(-12deg) rotateZ(5deg) translateX(1px);
            }
        }

        /* Étincelle de la colombe */
        @keyframes dove-sparkle {
            0%, 100% { 
                box-shadow: 0 0 4px rgba(65, 105, 225, 0.4);
                filter: brightness(1);
            }
            50% { 
                box-shadow: 0 0 8px rgba(135, 206, 235, 0.8);
                filter: brightness(1.2);
            }
        }

        /* Vol automatique de Batman */
        @keyframes bat-auto-flight {
            0%, 100% { 
                transform: rotate(15deg) translateY(0px) scale(var(--bird-scale));
            }
            50% { 
                transform: rotate(15deg) translateY(-5px) scale(calc(1.02 * var(--bird-scale)));
            }
        }

        /* Pulsation des yeux rouges */
        @keyframes bat-red-pulse {
            0%, 100% { 
                box-shadow: 0 0 8px rgba(255, 0, 0, 1);
                transform: scale(1);
                opacity: 1;
            }
            50% { 
                box-shadow: 0 0 15px rgba(255, 0, 0, 1);
                transform: scale(1.2);
                opacity: 0.8;
            }
        }

        /* ===========================================
           CLASSES UTILITAIRES POUR JEUX
           ========================================== */

        /* Positions prédéfinies */
        .bird-top-left { top: 10%; left: 10%; }
        .bird-top-right { top: 10%; right: 10%; }
        .bird-center { top: 50%; left: 50%; transform: translate(-50%, -50%) scale(var(--bird-scale)); }
        .bird-bottom-left { bottom: 10%; left: 10%; }
        .bird-bottom-right { bottom: 10%; right: 10%; }

        /* Directions de vol */
        .bird-fly-left { transform: scaleX(-1) scale(var(--bird-scale)); }
        .bird-fly-right { transform: scaleX(1) scale(var(--bird-scale)); }

        /* Tailles */
        .bird-small { --bird-scale: 0.7; }
        .bird-normal { --bird-scale: 1; }
        .bird-large { --bird-scale: 1.3; }

        /* Vitesses d'animation */
        .bird-slow { --animation-speed: 0.5; }
        .bird-normal-speed { --animation-speed: 1; }
        .bird-fast { --animation-speed: 2; }

        /* États d'interaction */
        .bird-clickable {
            cursor: pointer;
            transition: transform 0.2s ease;
        }

        .bird-clickable:hover {
            transform: scale(calc(1.1 * var(--bird-scale)));
        }

        .bird-clickable:active {
            transform: scale(calc(0.9 * var(--bird-scale)));
        }

        /* ===========================================
           DEMO - À SUPPRIMER POUR INTÉGRATION
           ========================================== */
        body {
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #87CEEB, #E0F6FF);
            min-height: 100vh;
            font-family: Arial, sans-serif;
        }

        .demo-container {
            width: 800px;
            height: 400px;
            border: 2px dashed #666;
            margin: 0 auto;
            position: relative;
            background: rgba(255, 255, 255, 0.1);
        }

        .demo-info {
            text-align: center;
            margin: 20px 0;
            padding: 15px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 10px;
            max-width: 800px;
            margin: 20px auto;
        }

        .demo-controls {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin: 20px 0;
        }

        .demo-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 20px;
            background: #4682B4;
            color: white;
            cursor: pointer;
            font-weight: bold;
        }

        .demo-btn:hover {
            background: #5A9BD4;
        }
    </style>
</head>
<body>
    <!-- DÉMO - À SUPPRIMER POUR INTÉGRATION -->
    <div class="demo-info">
        <h2>🎮 Flying Birds Module - Prêt pour intégration</h2>
        <p><strong>Module créé par Emmanuel Payet / Dreamer Unisona</strong></p>
        <p>✅ Fond transparent • ✅ Animations automatiques • ✅ Structure modulaire • ✅ IDs uniques</p>
        <p><strong>IDs:</strong> #crow (corbeau badass), #dove (colombe élégante), #bat (Batman mystérieux)</p>
    </div>

    <div class="demo-controls">
        <button class="demo-btn" onclick="toggleBird('crow')">🐦 Corbeau</button>
        <button class="demo-btn" onclick="toggleBird('dove')">🕊️ Colombe</button>
        <button class="demo-btn" onclick="toggleBird('bat')">🦇 Batman</button>
        <button class="demo-btn" onclick="changeSpeed()">⚡ Vitesse</button>
    </div>

    <div class="demo-container">
        <!-- MODULE FLYING BIRDS - COPIER CETTE PARTIE -->
        <div class="flying-birds-container">
            <!-- Corbeau Badass -->
            <div id="crow" class="bird-base bird-visible bird-center bird-clickable"></div>
            
            <!-- Colombe Élégante -->
            <div id="dove" class="bird-base bird-hidden bird-top-right bird-clickable"></div>
            
            <!-- Batman Mystérieux -->
            <div id="bat" class="bird-base bird-hidden bird-bottom-left bird-clickable"></div>
        </div>
        <!-- FIN MODULE FLYING BIRDS -->
    </div>

    <div class="demo-info">
        <h3>📋 Instructions d'intégration :</h3>
        <p>1. Copiez le CSS (lignes 11-280)</p>
        <p>2. Copiez le HTML du module (lignes 310-320)</p>
        <p>3. Utilisez les IDs : #crow, #dove, #bat</p>
        <p>4. Classes utiles : .bird-hidden/.bird-visible, .bird-fly-left/.bird-fly-right</p>
        <p>5. Personnalisation : Variables CSS --bird-scale, --animation-speed</p>
    </div>

    <script>
        // DÉMO JAVASCRIPT - POUR TEST SEULEMENT
        let currentSpeed = 1;
        
        function toggleBird(birdId) {
            const bird = document.getElementById(birdId);
            const allBirds = document.querySelectorAll('.bird-base');
            
            // Cacher tous les oiseaux
            allBirds.forEach(b => {
                b.classList.remove('bird-visible');
                b.classList.add('bird-hidden');
            });
            
            // Montrer l'oiseau sélectionné
            setTimeout(() => {
                bird.classList.remove('bird-hidden');
                bird.classList.add('bird-visible');
            }, 200);
        }
        
        function changeSpeed() {
            currentSpeed = currentSpeed === 1 ? 2 : currentSpeed === 2 ? 0.5 : 1;
            document.documentElement.style.setProperty('--animation-speed', currentSpeed);
        }
        
        // Exemple d'interaction pour jeu
        document.querySelectorAll('.bird-clickable').forEach(bird => {
            bird.addEventListener('click', (e) => {
                console.log(`Oiseau cliqué: ${e.target.id}`);
                // Ici vous pouvez ajouter votre logique de jeu
            });
        });
    </script>
</body>
</html>