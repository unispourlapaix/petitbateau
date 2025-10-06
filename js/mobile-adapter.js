/**
 * Adaptateur Mobile pour La Quête de Vérité
 * Optimise l'expérience pour les appareils mobiles avec design élégant
 */

export class MobileAdapter {
    constructor() {
        this.isTouch = 'ontouchstart' in window;
        this.viewport = this.getViewport();
        this.orientation = this.getOrientation();
        this.devicePixelRatio = window.devicePixelRatio || 1;
        
        this.setupMobileOptimizations();
        this.setupEventListeners();
    }

    // Obtenir les dimensions de viewport
    getViewport() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            safeArea: {
                top: this.getSafeAreaInset('top'),
                bottom: this.getSafeAreaInset('bottom'),
                left: this.getSafeAreaInset('left'),
                right: this.getSafeAreaInset('right')
            }
        };
    }

    // Obtenir les insets de zone sécurisée
    getSafeAreaInset(side) {
        const element = document.createElement('div');
        element.style.position = 'fixed';
        element.style.top = '0';
        element.style.visibility = 'hidden';
        document.body.appendChild(element);
        
        const inset = getComputedStyle(element).getPropertyValue(`env(safe-area-inset-${side})`) || '0px';
        document.body.removeChild(element);
        
        return parseInt(inset) || 0;
    }

    // Détecter l'orientation
    getOrientation() {
        return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    }

    // Configuration des optimisations mobiles
    setupMobileOptimizations() {
        // Désactiver le zoom sur les inputs
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 
                'width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover'
            );
        }

        // Optimiser le rendu
        document.body.style.webkitTextSizeAdjust = '100%';
        document.body.style.webkitTapHighlightColor = 'transparent';
        
        // Configuration PWA
        this.setupPWA();
    }

    // Configuration Progressive Web App
    setupPWA() {
        // Couleur de la barre de statut
        let themeColor = document.querySelector('meta[name="theme-color"]');
        if (!themeColor) {
            themeColor = document.createElement('meta');
            themeColor.name = 'theme-color';
            document.head.appendChild(themeColor);
        }
        themeColor.content = '#ffffff';

        // Couleur de la barre de statut Safari
        let appleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
        if (!appleStatusBar) {
            appleStatusBar = document.createElement('meta');
            appleStatusBar.name = 'apple-mobile-web-app-status-bar-style';
            document.head.appendChild(appleStatusBar);
        }
        appleStatusBar.content = 'light-content';
    }

    // Configuration des événements
    setupEventListeners() {
        // Gestion du redimensionnement et rotation
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });

        // Gestion des gestes tactiles
        this.setupTouchHandling();
        
        // Prévention des comportements par défaut
        this.preventDefaultBehaviors();
    }

    // Gestion du redimensionnement
    handleResize() {
        this.viewport = this.getViewport();
        this.resizeCanvas();
        this.updateUI();
    }

    // Gestion du changement d'orientation
    handleOrientationChange() {
        const newOrientation = this.getOrientation();
        
        if (newOrientation !== this.orientation) {
            this.orientation = newOrientation;
            this.handleResize();
            
            // Notification pour le jeu
            this.dispatchCustomEvent('orientationchange', {
                orientation: newOrientation,
                viewport: this.viewport
            });
        }
    }

    // Redimensionnement du canvas pour mobile
    resizeCanvas() {
        const canvas = document.getElementById('canvas');
        if (!canvas) return;

        const container = canvas.parentElement;
        const containerRect = container.getBoundingClientRect();
        
        // Calculer les dimensions optimales
        const maxWidth = this.viewport.width - 40; // 20px de marge de chaque côté
        const maxHeight = this.viewport.height - 160; // Espace pour l'interface
        
        // Ratio optimisé pour mobile (plus vertical)
        const aspectRatio = this.orientation === 'portrait' ? 3/4 : 4/3;
        
        let canvasWidth = maxWidth;
        let canvasHeight = canvasWidth / aspectRatio;
        
        if (canvasHeight > maxHeight) {
            canvasHeight = maxHeight;
            canvasWidth = canvasHeight * aspectRatio;
        }
        
        // Appliquer les dimensions
        canvas.style.width = canvasWidth + 'px';
        canvas.style.height = canvasHeight + 'px';
        
        // Résolution interne haute qualité
        canvas.width = canvasWidth * this.devicePixelRatio;
        canvas.height = canvasHeight * this.devicePixelRatio;
        
        const ctx = canvas.getContext('2d');
        ctx.scale(this.devicePixelRatio, this.devicePixelRatio);
        
        return { width: canvasWidth, height: canvasHeight };
    }

    // Gestion des gestes tactiles
    setupTouchHandling() {
        let touchStartY = 0;
        let touchStartX = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            const canvas = document.getElementById('canvas');
            if (!canvas) return;

            const canvasRect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            
            // Si le toucher est sur le canvas, empêcher le défilement
            if (touch.clientX >= canvasRect.left && 
                touch.clientX <= canvasRect.right && 
                touch.clientY >= canvasRect.top && 
                touch.clientY <= canvasRect.bottom) {
                e.preventDefault();
            }
        }, { passive: false });

        // Gestion des gestes de balayage
        document.addEventListener('touchend', (e) => {
            if (!e.changedTouches.length) return;
            
            const touch = e.changedTouches[0];
            const deltaY = touch.clientY - touchStartY;
            const deltaX = touch.clientX - touchStartX;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // Détecter les balayages
            if (distance > 50) {
                const direction = Math.abs(deltaX) > Math.abs(deltaY) 
                    ? (deltaX > 0 ? 'right' : 'left')
                    : (deltaY > 0 ? 'down' : 'up');
                
                this.dispatchCustomEvent('swipe', { direction, distance });
            }
        }, { passive: true });
    }

    // Prévention des comportements par défaut
    preventDefaultBehaviors() {
        // Empêcher le zoom par double-tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Empêcher le menu contextuel sur mobile
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        }, false);

        // Empêcher la sélection de texte pendant les gestes
        document.addEventListener('selectstart', (e) => {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
            }
        });
    }

    // Mise à jour de l'interface utilisateur
    updateUI() {
        // Mettre à jour les statistiques affichées
        const stats = this.getGameStats();
        if (window.mobileUI && stats) {
            window.mobileUI.updateStats(
                stats.level,
                stats.hearts,
                `${stats.progress}/${stats.total}`,
                stats.expPercentage
            );
        }

        // Ajuster la position des éléments UI
        this.adjustUIElements();
    }

    // Ajustement des éléments d'interface
    adjustUIElements() {
        const safeAreaTop = this.viewport.safeArea.top;
        const safeAreaBottom = this.viewport.safeArea.bottom;
        
        // Ajuster l'en-tête
        const header = document.querySelector('.mobile-header, .header');
        if (header) {
            header.style.paddingTop = `${Math.max(safeAreaTop, 16)}px`;
        }

        // Ajuster les contrôles du bas
        const bottomControls = document.querySelector('.mobile-progress-container');
        if (bottomControls) {
            bottomControls.style.paddingBottom = `${Math.max(safeAreaBottom, 16)}px`;
        }
    }

    // Obtenir les statistiques du jeu
    getGameStats() {
        // Cette méthode sera connectée au système de jeu réel
        if (window.game && window.game.getPerformanceStats) {
            const stats = window.game.getPerformanceStats();
            return {
                level: stats.angel?.level || 1,
                hearts: stats.angel?.hearts || '❤️❤️❤️',
                progress: stats.quest?.progress || 0,
                total: stats.quest?.total || 10,
                expPercentage: (stats.angel?.exp || 0) % 100
            };
        }

        return null;
    }

    // Dispatch d'événements personnalisés
    dispatchCustomEvent(eventName, detail) {
        const event = new CustomEvent(`mobile:${eventName}`, {
            detail,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(event);
    }

    // Afficher un message de quête mobile
    showMobileMessage(title, text, buttonText = 'Continuer') {
        if (window.mobileUI) {
            window.mobileUI.showQuestMessage(title, text, buttonText);
        }
    }

    // Cacher le message de quête
    hideMobileMessage() {
        if (window.mobileUI) {
            window.mobileUI.hideQuestMessage();
        }
    }

    // Vibration haptique (si supportée)
    vibrate(pattern = [100]) {
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }

    // Notification de succès avec vibration
    celebrateSuccess() {
        this.vibrate([100, 50, 100, 50, 200]);
        
        // Effet visuel de célébration
        this.dispatchCustomEvent('celebrate', {
            type: 'success',
            timestamp: Date.now()
        });
    }

    // Gestion des performances mobiles
    optimizePerformance() {
        // Réduire la qualité graphique sur les appareils moins performants
        const isLowEnd = navigator.hardwareConcurrency < 4 || 
                         this.devicePixelRatio < 2;
        
        if (isLowEnd) {
            this.devicePixelRatio = 1;
            // Autres optimisations pour appareils moins performants
        }

        // Mise en cache des éléments DOM
        this.cacheDOMElements();
    }

    // Cache des éléments DOM fréquemment utilisés
    cacheDOMElements() {
        this.cachedElements = {
            canvas: document.getElementById('canvas'),
            header: document.querySelector('.mobile-header, .header'),
            stats: document.querySelector('.mobile-stats'),
            progressBar: document.querySelector('.mobile-progress-fill, #expBar'),
            messageContainer: document.querySelector('.mobile-message, .quest-message')
        };
    }

    // Obtenir les capacités de l'appareil
    getDeviceCapabilities() {
        return {
            isTouch: this.isTouch,
            hasVibration: 'vibrate' in navigator,
            hasOrientation: 'orientation' in window,
            hasDeviceMotion: 'DeviceMotionEvent' in window,
            hasWakeLock: 'wakeLock' in navigator,
            connectionType: navigator.connection?.effectiveType || 'unknown',
            memory: navigator.deviceMemory || 'unknown',
            cores: navigator.hardwareConcurrency || 'unknown'
        };
    }

    // Prévention de la mise en veille pendant le jeu
    async preventSleep() {
        if ('wakeLock' in navigator) {
            try {
                this.wakeLock = await navigator.wakeLock.request('screen');
                console.log('Wake lock active');
            } catch (err) {
                console.log('Wake lock failed:', err);
            }
        }
    }

    // Libération du wake lock
    releaseSleep() {
        if (this.wakeLock) {
            this.wakeLock.release();
            this.wakeLock = null;
        }
    }

    // Nettoyage des ressources
    destroy() {
        this.releaseSleep();
        // Nettoyer les event listeners si nécessaire
    }
}

// Export de la classe et création de l'instance globale
export default MobileAdapter;

// Auto-initialisation si nous sommes sur mobile
if (typeof window !== 'undefined') {
    window.mobileAdapter = new MobileAdapter();
}