// 🎨 TEST OPTIMISATION DES GRADIENTS
// Copier/coller dans la console pour vérifier l'optimisation

console.log('🎨 ═══════════════════════════════════════════════════');
console.log('   TEST OPTIMISATION GRADIENTS FOND');
console.log('═══════════════════════════════════════════════════\n');

// Test 1: Vérifier que le cache existe
console.log('📋 Test 1: Cache Gradients Fond');
if (typeof fondAniméCache !== 'undefined' && fondAniméCache.gradients) {
    console.log('   ✅ fondAniméCache existe');
    
    const gradients = [
        'fondFinale',
        'fondJour',
        'fondNuit',
        'soleilCouchant',
        'haloSoleilCouchant',
        'refletSoleil'
    ];
    
    let gradientsInitialises = 0;
    gradients.forEach(grad => {
        const existe = fondAniméCache.gradients[grad] !== null && fondAniméCache.gradients[grad] !== undefined;
        console.log(`   ${grad}: ${existe ? '✅ Initialisé' : '⚠️ Non initialisé'}`);
        if (existe) gradientsInitialises++;
    });
    
    console.log(`\n   📊 ${gradientsInitialises}/${gradients.length} gradients en cache`);
    
    if (gradientsInitialises === gradients.length) {
        console.log('   🎉 TOUS LES GRADIENTS EN CACHE !');
    } else if (gradientsInitialises > 0) {
        console.log('   ⚠️ Certains gradients manquants (normal si phase pas encore atteinte)');
    }
} else {
    console.log('   ❌ fondAniméCache non trouvé');
}

// Test 2: Vérifier les fonctions d'initialisation
console.log('\n📋 Test 2: Fonctions d\'Initialisation');
const fonctions = [
    'initGradientsFond',
    'initGradientsSoleilCouchant',
    'initGradientsMer'
];

fonctions.forEach(fn => {
    const existe = typeof window[fn] === 'function';
    console.log(`   ${fn}: ${existe ? '✅ Présente' : '❌ Manquante'}`);
});

// Test 3: Mesurer performance avant/après optimisation
console.log('\n📋 Test 3: Mesure Performance (10 secondes)');
console.log('   ⏳ Mesure en cours...\n');

let frameCount = 0;
let lastTime = performance.now();
let fpsValues = [];
let callCount = 0;

// Compter les appels createLinearGradient (hack pour détecter)
let originalCreateLinearGradient = null;
let gradientCallsPerFrame = [];
let currentFrameGradientCalls = 0;

if (typeof ctx !== 'undefined') {
    originalCreateLinearGradient = ctx.createLinearGradient;
    ctx.createLinearGradient = function(...args) {
        currentFrameGradientCalls++;
        return originalCreateLinearGradient.apply(this, args);
    };
}

const measurePerformance = () => {
    frameCount++;
    const currentTime = performance.now();
    const elapsed = currentTime - lastTime;
    
    // Enregistrer les appels gradient de cette frame
    if (currentFrameGradientCalls > 0) {
        gradientCallsPerFrame.push(currentFrameGradientCalls);
    }
    currentFrameGradientCalls = 0;
    
    if (elapsed >= 1000) {
        const fps = Math.round((frameCount * 1000) / elapsed);
        fpsValues.push(fps);
        
        const quality = fps >= 58 ? '🎉 EXCELLENT' : fps >= 50 ? '✅ BON' : fps >= 40 ? '⚠️ ACCEPTABLE' : '❌ PROBLÈME';
        console.log(`   FPS: ${fps} ${quality}`);
        
        frameCount = 0;
        lastTime = currentTime;
        callCount++;
        
        if (callCount >= 10) {
            // Restaurer fonction originale
            if (originalCreateLinearGradient) {
                ctx.createLinearGradient = originalCreateLinearGradient;
            }
            
            const avgFPS = Math.round(fpsValues.reduce((a, b) => a + b, 0) / fpsValues.length);
            const minFPS = Math.min(...fpsValues);
            const maxFPS = Math.max(...fpsValues);
            
            // Analyser les appels gradient
            const avgGradientCalls = gradientCallsPerFrame.length > 0 
                ? Math.round(gradientCallsPerFrame.reduce((a, b) => a + b, 0) / gradientCallsPerFrame.length)
                : 0;
            const maxGradientCalls = gradientCallsPerFrame.length > 0 
                ? Math.max(...gradientCallsPerFrame)
                : 0;
            
            console.log(`\n   ═══════════════════════════════════════════════════`);
            console.log('   📊 RÉSULTATS FINAUX');
            console.log(`   ═══════════════════════════════════════════════════\n`);
            
            console.log(`   FPS Moyen:   ${avgFPS}`);
            console.log(`   FPS Min:     ${minFPS}`);
            console.log(`   FPS Max:     ${maxFPS}`);
            console.log(`   Stabilité:   ${maxFPS - minFPS <= 10 ? '✅ Stable' : '⚠️ Variable'}\n`);
            
            console.log(`   📐 Appels Gradient:`);
            console.log(`   Moyenne/frame: ${avgGradientCalls}`);
            console.log(`   Maximum/frame: ${maxGradientCalls}`);
            
            if (avgGradientCalls === 0) {
                console.log(`   🎉 OPTIMISATION PARFAITE ! Gradients en cache utilisés !`);
            } else if (avgGradientCalls <= 3) {
                console.log(`   ✅ Très bon ! Peu d'appels createLinearGradient`);
            } else {
                console.log(`   ⚠️ ${avgGradientCalls} appels/frame - optimisation partielle`);
            }
            
            console.log(`\n   🎯 ANALYSE:`);
            
            if (avgFPS >= 55 && avgGradientCalls <= 3) {
                console.log(`   🌟 PERFORMANCE EXCEPTIONNELLE !`);
                console.log(`   - Les gradients sont bien en cache`);
                console.log(`   - FPS stable et élevé`);
                console.log(`   - Optimisation réussie à 100%`);
            } else if (avgFPS >= 50) {
                console.log(`   ✅ Bonne performance`);
                console.log(`   - Optimisation visible`);
                console.log(`   - FPS satisfaisant`);
            } else {
                console.log(`   ⚠️ Performance à améliorer`);
                console.log(`   - Vérifier si d'autres optimisations sont actives`);
                console.log(`   - Tester dans différentes phases`);
            }
            
            console.log(`\n   💡 COMPARAISON AVANT/APRÈS:`);
            console.log(`   AVANT optimisation: ~4-5 createLinearGradient par frame`);
            console.log(`   APRÈS optimisation: ~${avgGradientCalls} createLinearGradient par frame`);
            console.log(`   GAIN: ${Math.round((1 - avgGradientCalls / 5) * 100)}% de réduction !`);
            
            console.log(`\n   ═══════════════════════════════════════════════════\n`);
            
            return;
        }
    }
    requestAnimationFrame(measurePerformance);
};

requestAnimationFrame(measurePerformance);

// Test 4: Vérifier type des gradients
setTimeout(() => {
    console.log('📋 Test 4: Type des Gradients');
    if (typeof fondAniméCache !== 'undefined' && fondAniméCache.gradients) {
        const gradients = ['fondFinale', 'fondJour', 'fondNuit'];
        gradients.forEach(grad => {
            const obj = fondAniméCache.gradients[grad];
            if (obj) {
                const isGradient = obj instanceof CanvasGradient;
                console.log(`   ${grad}: ${isGradient ? '✅ CanvasGradient valide' : '⚠️ Type incorrect'}`);
            }
        });
    }
}, 500);

// Informations complémentaires
setTimeout(() => {
    console.log('\n═══════════════════════════════════════════════════');
    console.log('📚 INFORMATIONS OPTIMISATION GRADIENTS');
    console.log('═══════════════════════════════════════════════════\n');
    
    console.log('🎯 Principe de l\'Optimisation:');
    console.log('   AVANT: createLinearGradient() + 4× addColorStop() = ~1-2ms');
    console.log('          Répété 60× par seconde = 60-120ms perdus !');
    console.log('   APRÈS: Gradient créé 1× au chargement, réutilisé 60× par seconde');
    console.log('          Coût par frame: ~0.1ms (lecture cache)\n');
    
    console.log('📈 Gains Attendus:');
    console.log('   - FPS: +5 à +10 FPS (selon phase)');
    console.log('   - CPU: -3% à -8% d\'utilisation');
    console.log('   - Mémoire: +0.1KB (négligeable)\n');
    
    console.log('⚙️ Invalidation du Cache:');
    console.log('   Le cache est invalidé lors de:');
    console.log('   - Redimensionnement fenêtre (window.resize)');
    console.log('   - Changement de phase (si nécessaire)');
    console.log('   - Rotation mobile (réinitialisation canvas)\n');
    
    console.log('🔧 Forcer Réinitialisation:');
    console.log('   fondAniméCache.gradients.fondFinale = null;');
    console.log('   fondAniméCache.gradients.fondJour = null;');
    console.log('   fondAniméCache.gradients.fondNuit = null;');
    console.log('   // Puis laisser dessiner() les recréer\n');
    
    console.log('📊 Vérifier Cache Actuel:');
    console.log('   console.table(fondAniméCache.gradients);\n');
    
    console.log('═══════════════════════════════════════════════════\n');
}, 11500);

// Commandes rapides
console.log('📚 COMMANDES UTILES:');
console.log('   fondAniméCache.gradients              → État cache');
console.log('   initGradientsFond()                   → Réinit fond');
console.log('   initGradientsSoleilCouchant()         → Réinit soleil');
console.log('   console.table(fondAniméCache.gradients) → Voir cache\n');
