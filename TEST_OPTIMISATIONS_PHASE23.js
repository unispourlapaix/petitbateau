// 🧪 SCRIPT DE TEST - OPTIMISATIONS PHASE 23
// À exécuter dans la console du navigateur pendant la phase 23

console.log('🧪 ═══════════════════════════════════════════════════');
console.log('   TEST DES OPTIMISATIONS PHASE 23');
console.log('═══════════════════════════════════════════════════');

// Test 1: Vérifier que les traînées sont désactivées
console.log('\n📋 Test 1: Traînées');
if (droneModule && droneModule.options) {
    const trailsEnabled = droneModule.options.showTrails;
    console.log(`   showTrails: ${trailsEnabled}`);
    console.log(`   ${trailsEnabled ? '❌ ERREUR: Traînées actives!' : '✅ OK: Traînées désactivées'}`);
} else {
    console.log('   ⚠️ droneModule non disponible');
}

// Test 2: Compter les drones actifs
console.log('\n📋 Test 2: Nombre de Drones');
if (droneModule && droneModule.drones) {
    const totalDrones = droneModule.drones.length;
    const aliveDrones = droneModule.drones.filter(d => d.life > 0).length;
    console.log(`   Total: ${totalDrones} drones`);
    console.log(`   Vivants: ${aliveDrones} drones`);
    console.log(`   ${totalDrones <= 45 ? '✅ OK: Nombre optimisé' : '⚠️ ATTENTION: Plus de 45 drones'}`);
} else {
    console.log('   ⚠️ droneModule.drones non disponible');
}

// Test 3: Vérifier le cache temporel
console.log('\n📋 Test 3: Cache Temporel');
if (droneModule) {
    const hasCachedTime = droneModule._cachedFrameTime !== undefined;
    const hasCachedPulse = droneModule._cachedHeartPulse !== undefined;
    console.log(`   _cachedFrameTime: ${hasCachedTime ? '✅ Présent' : '❌ Absent'}`);
    console.log(`   _cachedHeartPulse: ${hasCachedPulse ? '✅ Présent' : '❌ Absent'}`);
    console.log(`   _cachedClockPulse: ${droneModule._cachedClockPulse !== undefined ? '✅ Présent' : '❌ Absent'}`);
    console.log(`   _cachedBrightnessPulse: ${droneModule._cachedBrightnessPulse !== undefined ? '✅ Présent' : '❌ Absent'}`);
} else {
    console.log('   ⚠️ droneModule non disponible');
}

// Test 4: Mesurer les FPS
console.log('\n📋 Test 4: Performance FPS');
let frameCount = 0;
let lastTime = performance.now();
let fpsValues = [];

const measureFPS = () => {
    frameCount++;
    const currentTime = performance.now();
    const elapsed = currentTime - lastTime;
    
    if (elapsed >= 1000) {
        const fps = Math.round((frameCount * 1000) / elapsed);
        fpsValues.push(fps);
        console.log(`   FPS actuel: ${fps} ${fps >= 50 ? '✅' : fps >= 30 ? '⚠️' : '❌'}`);
        frameCount = 0;
        lastTime = currentTime;
        
        // Arrêter après 10 mesures
        if (fpsValues.length >= 10) {
            const avgFPS = Math.round(fpsValues.reduce((a, b) => a + b, 0) / fpsValues.length);
            console.log(`\n   📊 FPS moyen: ${avgFPS}`);
            console.log(`   ${avgFPS >= 50 ? '✅ EXCELLENT: Performance optimale!' : avgFPS >= 30 ? '⚠️ CORRECT: Performance acceptable' : '❌ PROBLÈME: Performance insuffisante'}`);
            return;
        }
    }
    requestAnimationFrame(measureFPS);
};

console.log('   ⏳ Mesure en cours pendant 10 secondes...');
requestAnimationFrame(measureFPS);

// Test 5: Vérifier la phase actuelle
console.log('\n📋 Test 5: Phase Actuelle');
if (narrationManager) {
    const currentPhase = narrationManager.currentPhase;
    console.log(`   Phase: ${currentPhase}`);
    console.log(`   ${currentPhase === 23 ? '✅ Phase 23 active' : '⚠️ Pas en phase 23'}`);
} else {
    console.log('   ⚠️ narrationManager non disponible');
}

// Test 6: Formation actuelle
console.log('\n📋 Test 6: Formation Active');
if (droneModule) {
    const formation = droneModule.currentFormation;
    console.log(`   Formation: ${formation || 'aucune'}`);
    
    // Afficher le nombre attendu pour cette formation
    const expectedCounts = {
        'heart': 20,
        'star': 25,
        'clock': 40,
        'star5': 35,
        'cross_christian': 20,
        'double_heart': 45
    };
    
    if (formation && expectedCounts[formation]) {
        console.log(`   Drones attendus: ${expectedCounts[formation]}`);
    }
}

console.log('\n═══════════════════════════════════════════════════');
console.log('🎯 Test terminé ! Vérifiez les résultats ci-dessus.');
console.log('═══════════════════════════════════════════════════\n');

// Commandes utiles
console.log('📚 COMMANDES UTILES:');
console.log('   • droneModule.drones.length                  → Nombre de drones');
console.log('   • droneModule.options.showTrails             → État des traînées');
console.log('   • narrationManager.currentPhase              → Phase actuelle');
console.log('   • performance.now()                          → Temps précis');
console.log('   • narrationManager.finalizeNarration()       → Lancer phase 23');
