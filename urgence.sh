#!/bin/bash

echo "🚨 RÉCUPÉRATION D'URGENCE - Quête de Vérité"
echo "==========================================="
echo ""

echo "💡 OPTIONS DE RÉCUPÉRATION:"
echo ""
echo "1️⃣  🌐 Ouvrir version de secours"
echo "2️⃣  🔍 Chercher dans l'historique navigateur"
echo "3️⃣  📝 Recréer à partir de conversation Claude"
echo "4️⃣  💾 Utiliser version minimale"
echo "5️⃣  🔄 Récupérer depuis fichiers temporaires"
echo "0️⃣  ❌ Annuler"
echo ""
read -p "👉 Votre choix (0-5) : " choix

case $choix in
    1)
        echo ""
        echo "🌐 Ouverture de la version de secours..."
        if command -v start &> /dev/null; then
            start version-stable.html
        elif command -v xdg-open &> /dev/null; then
            xdg-open version-stable.html
        else
            echo "💡 Ouvrez manuellement : version-stable.html"
        fi
        ;;
    2)
        echo ""
        echo "🔍 GUIDE RÉCUPÉRATION HISTORIQUE:"
        echo "================================"
        echo "1. Ouvrez votre navigateur"
        echo "2. Appuyez sur CTRL+H (historique)"
        echo "3. Cherchez 'voir-la-verite' ou 'localhost:8080'"
        echo "4. Trouvez une version récente"
        echo "5. Clic droit > Afficher source (CTRL+U)"
        echo "6. Copiez tout le code"
        echo "7. Sauvegardez dans un nouveau fichier"
        ;;
    3)
        echo ""
        echo "📝 RECRÉATION DEPUIS CLAUDE:"
        echo "============================"
        echo "1. Ouvrez votre conversation Claude"
        echo "2. Cherchez le dernier code complet"
        echo "3. Copiez le code HTML"
        echo "4. Créez un nouveau fichier:"
        echo ""
        read -p "   Nom du fichier (ex: recupere.html): " filename
        if [ -n "$filename" ]; then
            echo "<!DOCTYPE html>" > "$filename"
            echo "<!-- COLLEZ ICI LE CODE DEPUIS CLAUDE -->" >> "$filename"
            echo "✅ Fichier $filename créé!"
            echo "💡 Maintenant collez le code dedans"
        fi
        ;;
    4)
        echo ""
        echo "💾 Création de la version minimale..."
        # Créer un jeu de base
        cat > "jeu-minimal.html" << 'EOF'
<!DOCTYPE html>
<html>
<head><title>Voir la Vérité - Minimal</title></head>
<body style="margin:0;background:#000;display:flex;justify-content:center;align-items:center;height:100vh;">
<canvas id="jeu" width="800" height="600" style="border:2px solid #fff;"></canvas>
<script>
const canvas=document.getElementById('jeu'),ctx=canvas.getContext('2d');
let bateau={x:400,y:500,largeur:60,hauteur:30};
let balle={x:400,y:480,rayon:10,dx:3,dy:-3};
let briques=[];
for(let i=0;i<10;i++)for(let j=0;j<5;j++)briques.push({x:i*80+10,y:j*30+50,largeur:70,hauteur:25,actif:true});
function dessiner(){
ctx.clearRect(0,0,canvas.width,canvas.height);
ctx.fillStyle='#8B4513';ctx.fillRect(bateau.x-bateau.largeur/2,bateau.y,bateau.largeur,bateau.hauteur);
ctx.fillStyle='#FFD700';ctx.beginPath();ctx.arc(balle.x,balle.y,balle.rayon,0,Math.PI*2);ctx.fill();
briques.forEach(b=>{if(b.actif){ctx.fillStyle='#FF6B6B';ctx.fillRect(b.x,b.y,b.largeur,b.hauteur);}});
}
function animer(){
balle.x+=balle.dx;balle.y+=balle.dy;
if(balle.x<=balle.rayon||balle.x>=canvas.width-balle.rayon)balle.dx=-balle.dx;
if(balle.y<=balle.rayon)balle.dy=-balle.dy;
if(balle.y+balle.rayon>=bateau.y&&balle.x>=bateau.x-bateau.largeur/2&&balle.x<=bateau.x+bateau.largeur/2)balle.dy=-Math.abs(balle.dy);
if(balle.y>canvas.height){balle.x=400;balle.y=480;balle.dy=-3;}
briques.forEach(b=>{if(b.actif&&balle.x>b.x&&balle.x<b.x+b.largeur&&balle.y>b.y&&balle.y<b.y+b.hauteur){b.actif=false;balle.dy=-balle.dy;}});
dessiner();requestAnimationFrame(animer);
}
canvas.addEventListener('mousemove',e=>{const rect=canvas.getBoundingClientRect();bateau.x=e.clientX-rect.left;});
animer();
</script>
</body>
</html>
EOF
        echo "✅ Version minimale créée: jeu-minimal.html"
        echo "🎮 Vous pouvez développer à partir de cette base!"
        ;;
    5)
        echo ""
        echo "🔄 RECHERCHE FICHIERS TEMPORAIRES:"
        echo "=================================="
        echo "📁 Recherche dans les dossiers temporaires..."

        # Chercher des fichiers temporaires
        find /tmp -name "*voir*" 2>/dev/null | head -10
        find /var/tmp -name "*verite*" 2>/dev/null | head -10

        echo ""
        echo "💡 Autres endroits à vérifier:"
        echo "- Corbeille/Recycle Bin"
        echo "- Dossier Téléchargements"
        echo "- Documents récents"
        echo "- Cache navigateur"
        ;;
    0)
        echo "❌ Annulé"
        ;;
    *)
        echo "❌ Choix invalide!"
        ;;
esac

echo ""
echo "💡 CONSEIL: Activez toujours la surveillance automatique!"
echo "   ./surveillance.sh"
echo ""