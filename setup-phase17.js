// ============================================
// SETUP COMPLET PHASE 17 - Copier/Coller
// ============================================

console.log("🚀 Démarrage setup phase 17...");

// 1. FORCER phase 17
if (!narrationManager) {
    console.error("❌ narrationManager n'existe pas!");
} else {
    narrationManager.currentPhase = 17;
    console.log("✅ Phase 17 activée");
}

// 2. FORCER mode mur
phaseJeu = 'mur';
console.log("✅ Mode 'mur' activé");

// 3. NETTOYER tout
projectiles = [];
starsProjectiles = [];
petitsCoeurs = [];
coeursBateau = [];
console.log("✅ Éléments nettoyés");

// 4. CRÉER briques du mur
briques = [];
for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 8; col++) {
        briques.push({
            x: 50 + col * 90,
            y: 50 + row * 40,
            w: 80,
            h: 35,
            visible: true,
            vie: 3,
            couleur: '#FFD700',
            clignotement: 0,
            dernierCoup: 0
        });
    }
}
console.log("✅", briques.length, "briques créées");

// 5. ACTIVER mode tir
window.modeTirStars = {
    actif: true,
    fin: Date.now() + 999999999 // Quasi-infini
};
console.log("✅ Mode tir activé (infini)");

// 6. MUNITIONS infinies
munitions = 9999;
rechargement = 0;
console.log("✅ Munitions infinies");

// 7. VÉRIFIER configuration
console.log("");
console.log("📊 VÉRIFICATION:");
console.log("  Phase:", narrationManager.currentPhase);
console.log("  Mode:", phaseJeu);
console.log("  Tir actif:", window.modeTirStars.actif);
console.log("  Briques:", briques.length);
console.log("  Projectiles:", projectiles.length);
console.log("  Petits cœurs:", petitsCoeurs.length);
console.log("");

// 8. TESTER config phase 17
try {
    const config = getProjectileConfig(17);
    console.log("✅ Config phase 17:");
    console.log("  Type:", config.type);
    console.log("  Emoji:", config.emoji);
    console.log("  Couleur:", config.color[0]);
    console.log("  Taille:", config.size);
} catch(e) {
    console.error("❌ ERREUR config:", e.message);
}

console.log("");
console.log("🎮 PRÊT À TESTER!");
console.log("━━━━━━━━━━━━━━━━━━━━━━");
console.log("👆 CLIQUEZ SUR LE CANVAS");
console.log("━━━━━━━━━━━━━━━━━━━━━━");
console.log("");
console.log("Vous DEVRIEZ voir: ⭐ (pièce d'or avec glow)");
console.log("Vous NE devriez PAS voir: ★ (étoile à 5 branches)");
console.log("");

// 9. TEST AUTOMATIQUE (optionnel)
console.log("Pour tester AUTOMATIQUEMENT, tapez:");
console.log("tirerProjectile(400, 300);");
console.log("console.log('Projectiles après tir:', projectiles.length);");
