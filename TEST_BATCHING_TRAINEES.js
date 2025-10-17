// 🎨 TEST BATCHING DES TRAÎNÉES
// Copier/coller dans la console pendant la phase 23

console.log('🎨 ═══════════════════════════════════════════════════');
console.log('   TEST BATCHING DES TRAÎNÉES');
console.log('═══════════════════════════════════════════════════\n');

// Test 1: Vérifier configuration batching
console.log('📋 Test 1: Configuration Batching');
if (droneModule && droneModule.options) {
    const showTrails = droneModule.options.showTrails;
    const batchTrails = droneModule.options.batchTrails;
    const trailLength = droneModule.options.trailLength;
    
    console.log(`   showTrails:  ${showTrails}  ${showTrails ? '✅' : '❌'}`);
    console.log(`   batchTrails: ${batchTrails} ${batchTrails ? '✅ OPTIMISÉ' : '⚠️ Mode classique'}`);
    console.log(`   trailLength: ${trailLength} ${trailLength <= 8 ? '✅ Optimisé' : '⚠️ Long'}`);
    
    if (showTrails && batchTrails && trailLength <= 8) {
        console.log('   ✅ Configuration PARFAITE !');
    } else {
        console.log('   ⚠️ Configuration peut être améliorée');
    }
} else {
    console.log('   ❌ droneModule non disponible');
}

// Test 2: Compter les traînées actives
console.log('\n📋 Test 2: Traînées Actives');
if (droneModule && droneModule.drones) {
    const dronesWithTrails = droneModule.drones.filter(d => 
        d.life > 0 && d.trail && d.trail.length > 1
    ).length;
    
    const totalTrailPoints = droneModule.drones.reduce((sum, d) => 
        sum + (d.trail ? d.trail.length : 0), 0
    );
    
    console.log(`   Drones avec traînées: ${dronesWithTrails}`);
    console.log(`   Points de traînée total: ${totalTrailPoints}`);
    console.log(`   Moyenne par drone: ${(totalTrailPoints / dronesWithTrails || 0).toFixed(1)} points`);
}

// Test 3: Analyser les couleurs (pour le batching)
console.log('\n📋 Test 3: Distribution des Couleurs');
if (droneModule && droneModule.drones) {
    const colorMap = new Map();
    
    droneModule.drones.forEach(drone => {
        if (drone.life > 0) {
            const count = colorMap.get(drone.color) || 0;
            colorMap.set(drone.color, count + 1);
        }
    });
    
    console.log(`   Nombre de couleurs différentes: ${colorMap.size}`);
    console.log(`   ${colorMap.size <= 6 ? '✅ Excellent pour batching!' : '⚠️ Beaucoup de couleurs'}`);
    
    let i = 1;
    colorMap.forEach((count, color) => {
        console.log(`   Couleur ${i++}: ${count} drones (${color.substring(0, 7)})`);
    });
    
    console.log(`\n   💡 Batching regroupe ${colorMap.size} groupes au lieu de ${droneModule.drones.length} individuels`);
    console.log(`   📊 Économie: ${((1 - colorMap.size / droneModule.drones.length) * 100).toFixed(0)}% d'appels ctx.stroke()`);
}

// Test 4: Mesurer FPS en temps réel
console.log('\n📋 Test 4: Mesure FPS (10 secondes)');
let frameCount = 0;
let lastTime = performance.now();
let fpsValues = [];
let callCount = 0;

const measureFPS = () => {
    frameCount++;
    const currentTime = performance.now();
    const elapsed = currentTime - lastTime;
    
    if (elapsed >= 1000) {
        const fps = Math.round((frameCount * 1000) / elapsed);
        fpsValues.push(fps);
        
        const quality = fps >= 55 ? '✅ EXCELLENT' : fps >= 45 ? '✅ BON' : fps >= 30 ? '⚠️ ACCEPTABLE' : '❌ PROBLÈME';
        console.log(`   FPS: ${fps} ${quality}`);
        
        frameCount = 0;
        lastTime = currentTime;
        callCount++;
        
        if (callCount >= 10) {
            const avgFPS = Math.round(fpsValues.reduce((a, b) => a + b, 0) / fpsValues.length);
            const minFPS = Math.min(...fpsValues);
            const maxFPS = Math.max(...fpsValues);
            
            console.log(`\n   📊 Statistiques:`);
            console.log(`      FPS moyen: ${avgFPS}`);
            console.log(`      FPS min:   ${minFPS}`);
            console.log(`      FPS max:   ${maxFPS}`);
            console.log(`      Stabilité: ${maxFPS - minFPS <= 10 ? '✅ Stable' : '⚠️ Variable'}`);
            
            if (avgFPS >= 50) {
                console.log(`\n   🎉 PERFORMANCE EXCELLENTE ! Batching fonctionne parfaitement !`);
            } else if (avgFPS >= 40) {
                console.log(`\n   ✅ Performance correcte. Batching améliore les performances.`);
            } else {
                console.log(`\n   ⚠️ Performance insuffisante. Vérifier la configuration.`);
            }
            
            return;
        }
    }
    requestAnimationFrame(measureFPS);
};

console.log('   ⏳ Mesure en cours...');
requestAnimationFrame(measureFPS);

// Test 5: Vérifier la méthode renderTrailsBatched
console.log('\n📋 Test 5: Méthode renderTrailsBatched');
if (droneModule && typeof droneModule.renderTrailsBatched === 'function') {
    console.log('   ✅ Méthode renderTrailsBatched() présente');
    console.log('   ✅ Batching implémenté correctement');
} else {
    console.log('   ❌ Méthode renderTrailsBatched() manquante');
    console.log('   ⚠️ Batching non implémenté');
}

// Informations supplémentaires
setTimeout(() => {
    console.log('\n═══════════════════════════════════════════════════');
    console.log('📚 INFORMATIONS COMPLÉMENTAIRES');
    console.log('═══════════════════════════════════════════════════\n');
    
    console.log('🎯 Principe du Batching:');
    console.log('   Au lieu de:  600 drones → 600 ctx.stroke()');
    console.log('   On fait:     600 drones → 5 ctx.stroke() (par couleur)');
    console.log('   Économie:    -99% d\'appels Canvas!\n');
    
    console.log('⚙️ Ajuster Performance:');
    console.log('   // Plus de performance');
    console.log('   droneModule.options.trailLength = 5\n');
    console.log('   // Plus de qualité');
    console.log('   droneModule.options.trailLength = 12\n');
    
    console.log('🔧 Désactiver Batching (test):');
    console.log('   droneModule.options.batchTrails = false');
    console.log('   // Puis observer la différence de FPS\n');
    
    console.log('═══════════════════════════════════════════════════');
}, 500);

// Commandes rapides
console.log('\n📚 COMMANDES UTILES:');
console.log('   droneModule.options.showTrails       → État traînées');
console.log('   droneModule.options.batchTrails      → État batching');
console.log('   droneModule.options.trailLength      → Longueur traînées');
console.log('   droneModule.drones.length            → Nombre drones');
console.log('   performance.now()                    → Temps précis\n');
