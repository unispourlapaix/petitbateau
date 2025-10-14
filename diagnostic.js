// ============================================
// DIAGNOSTIC COMPLET - Copier dans la Console
// ============================================

console.log("=== DIAGNOSTIC SYSTÈME PROJECTILES ===");
console.log("");

// 1. État du jeu
console.log("📊 ÉTAT ACTUEL:");
console.log("  Phase actuelle:", narrationManager ? narrationManager.currentPhase : "N/A");
console.log("  Mode de jeu:", phaseJeu);
console.log("  Jeu actif:", jeu);
console.log("");

// 2. État du tir
console.log("🎯 SYSTÈME DE TIR:");
console.log("  modeTirStars existe:", typeof window.modeTirStars);
if (window.modeTirStars) {
    console.log("  modeTirStars.actif:", window.modeTirStars.actif);
    console.log("  modeTirStars.fin:", window.modeTirStars.fin);
    console.log("  Temps restant:", Math.max(0, window.modeTirStars.fin - Date.now()) / 1000, "secondes");
}
console.log("  Munitions:", munitions);
console.log("");

// 3. Projectiles
console.log("🚀 PROJECTILES:");
console.log("  Nombre de projectiles:", projectiles.length);
if (projectiles.length > 0) {
    console.log("  Premier projectile:", projectiles[0]);
}
console.log("  Nombre de starsProjectiles:", starsProjectiles ? starsProjectiles.length : 0);
console.log("");

// 4. Petits cœurs
console.log("💖 PETITS CŒURS:");
console.log("  Nombre:", petitsCoeurs.length);
console.log("  Visibles:", petitsCoeurs.filter(c => c.visible).length);
console.log("");

// 5. Briques
console.log("🧱 BRIQUES:");
console.log("  Nombre total:", briques.length);
console.log("  Visibles:", briques.filter(b => b.visible).length);
console.log("");

// 6. Configuration phase 17
console.log("⚙️ CONFIG PHASE 17:");
try {
    const config17 = getProjectileConfig(17);
    console.log("  Type:", config17.type);
    console.log("  Emoji:", config17.emoji);
    console.log("  Couleurs:", config17.color);
} catch(e) {
    console.error("  ERREUR:", e.message);
}
console.log("");

// 7. Vérification fonction
console.log("🔧 FONCTIONS:");
console.log("  getProjectileConfig existe:", typeof getProjectileConfig === 'function');
console.log("  tirerProjectile existe:", typeof tirerProjectile === 'function');
console.log("  dessinerProjectiles existe:", typeof dessinerProjectiles === 'function');
console.log("");

console.log("=== FIN DIAGNOSTIC ===");
console.log("");
console.log("📋 INTERPRÉTATION:");
if (!narrationManager || narrationManager.currentPhase < 17) {
    console.log("❌ Vous êtes en phase < 17");
    console.log("   Les nouveaux projectiles ne sont PAS actifs");
    console.log("   C'est NORMAL de voir les anciennes étoiles");
    console.log("");
    console.log("✅ SOLUTION: Exécuter le setup complet (voir ci-dessous)");
} else if (phaseJeu !== 'mur') {
    console.log("❌ Vous n'êtes pas en mode 'mur'");
    console.log("   Mode actuel:", phaseJeu);
    console.log("   Les nouveaux projectiles ne fonctionnent qu'en mode 'mur'");
} else if (!window.modeTirStars || !window.modeTirStars.actif) {
    console.log("❌ Mode tir non activé");
    console.log("   Il faut activer window.modeTirStars.actif = true");
} else {
    console.log("✅ Configuration correcte!");
    console.log("   Si vous voyez encore des étoiles, vérifiez:");
    console.log("   1. Avez-vous RECHARGÉ la page (F5) ?");
    console.log("   2. Les modifications sont-elles sauvegardées ?");
}
