/**
 * Configuration Jest pour les tests
 */

// Mock pour requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => {
    return setTimeout(cb, 16);
});

global.cancelAnimationFrame = jest.fn((id) => {
    clearTimeout(id);
});

// Mock pour performance.now
global.performance = {
    now: jest.fn(() => Date.now())
};

// Mock pour window
Object.defineProperty(window, 'devicePixelRatio', {
    writable: true,
    value: 1
});

// Mock pour canvas context
const mockContext = {
    fillRect: jest.fn(),
    strokeRect: jest.fn(),
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    closePath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    arc: jest.fn(),
    ellipse: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    fillText: jest.fn(),
    strokeText: jest.fn(),
    measureText: jest.fn(() => ({ width: 100 })),
    translate: jest.fn(),
    rotate: jest.fn(),
    scale: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    createLinearGradient: jest.fn(() => ({
        addColorStop: jest.fn()
    })),
    createRadialGradient: jest.fn(() => ({
        addColorStop: jest.fn()
    })),
    getImageData: jest.fn(),
    putImageData: jest.fn(),
    drawImage: jest.fn()
};

// Mock pour HTMLCanvasElement
global.HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

// Mock pour getBoundingClientRect
global.HTMLElement.prototype.getBoundingClientRect = jest.fn(() => ({
    top: 0,
    left: 0,
    right: 480,
    bottom: 600,
    width: 480,
    height: 600,
    x: 0,
    y: 0
}));

// Mock pour les événements
global.addEventListener = jest.fn();
global.removeEventListener = jest.fn();

// Suppression des logs de console pour les tests
global.console.log = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();

// Configuration des timeouts pour Jest
jest.setTimeout(10000);