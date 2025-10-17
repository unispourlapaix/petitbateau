// 🚀 COMMANDES RAPIDES - NAVIGATION PHASES

// ═══════════════════════════════════════════════════════════
// 🎯 ALLER À LA PHASE 22 (Avant la finale)
// ═══════════════════════════════════════════════════════════

// Méthode 1: Directe (recommandée)
narrationManager.currentPhase = 22;
narrationManager.nextPhase();

// ═══════════════════════════════════════════════════════════
// 🎆 ALLER À LA PHASE 23 (Finale avec feux d'artifice)
// ═══════════════════════════════════════════════════════════

// Méthode 1: Via phase 22
narrationManager.currentPhase = 22;
narrationManager.nextPhase();

// Méthode 2: Directe à la phase 23
narrationManager.currentPhase = 23;

// Méthode 3: Lancer directement la finalisation
narrationManager.finalizeNarration();

// ═══════════════════════════════════════════════════════════
// 📊 VÉRIFIER LA PHASE ACTUELLE
// ═══════════════════════════════════════════════════════════

console.log('Phase actuelle:', narrationManager.currentPhase);

// ═══════════════════════════════════════════════════════════
// 🎮 NAVIGATION RAPIDE
// ═══════════════════════════════════════════════════════════

// Aller à n'importe quelle phase (1-23)
function goToPhase(n) {
    narrationManager.currentPhase = n - 1;
    narrationManager.nextPhase();
    console.log(`✅ Passage à la phase ${n}`);
}

// Exemples d'utilisation:
goToPhase(22);  // Phase 22 (mur final)
goToPhase(23);  // Phase 23 (finale)
goToPhase(1);   // Retour au début

// ═══════════════════════════════════════════════════════════
// 🔧 COMMANDES UTILES POUR TESTER PHASE 23
// ═══════════════════════════════════════════════════════════

// 1. Aller à la phase 23
narrationManager.finalizeNarration();

// 2. Vérifier le batching des traînées
console.log('Batching:', droneModule.options.batchTrails);
console.log('Traînées:', droneModule.options.showTrails);
console.log('Longueur:', droneModule.options.trailLength);

// 3. Mesurer les FPS
let fc=0, lt=Date.now();
setInterval(()=>{
    console.log('FPS:', (fc*1000/(Date.now()-lt)).toFixed(1));
    fc=0; lt=Date.now();
}, 1000);
requestAnimationFrame(function c(){fc++;requestAnimationFrame(c)});

// 4. Afficher le formulaire de fin
afficherFormulaireFinDeJeuAvecResume(2000, 8000, 10000, 100, 'TEST123');

// ═══════════════════════════════════════════════════════════
// 📝 COMMANDES EN UNE LIGNE (copier/coller)
// ═══════════════════════════════════════════════════════════

// Phase 22:
narrationManager.currentPhase=22; narrationManager.nextPhase();

// Phase 23:
narrationManager.finalizeNarration();

// Test complet (phase 23 + infos):
narrationManager.finalizeNarration(); setTimeout(()=>console.log('FPS Test - Observez pendant 10s'), 2000);

// ═══════════════════════════════════════════════════════════
// 🎯 SCRIPT COMPLET POUR TESTER OPTIMISATIONS
// ═══════════════════════════════════════════════════════════

// Tout-en-un: Phase 23 + mesure FPS + vérification batching
(function testOptimisations() {
    console.log('🚀 Lancement test optimisations Phase 23...\n');
    
    // 1. Aller à la phase 23
    narrationManager.finalizeNarration();
    
    // 2. Vérifier configuration
    setTimeout(() => {
        console.log('📊 Configuration:');
        console.log('  Batching:', droneModule.options.batchTrails ? '✅' : '❌');
        console.log('  Traînées:', droneModule.options.showTrails ? '✅' : '❌');
        console.log('  Longueur:', droneModule.options.trailLength);
        console.log('  Drones:', droneModule.drones.length);
        
        // 3. Mesure FPS
        let fc=0, lt=Date.now(), count=0;
        const interval = setInterval(()=>{
            const fps = (fc*1000/(Date.now()-lt)).toFixed(1);
            console.log(`  FPS: ${fps} ${fps>=50?'✅':'⚠️'}`);
            fc=0; lt=Date.now(); count++;
            if(count>=10) {
                clearInterval(interval);
                console.log('\n✅ Test terminé!');
            }
        }, 1000);
        requestAnimationFrame(function c(){fc++;requestAnimationFrame(c)});
    }, 3000);
})();
