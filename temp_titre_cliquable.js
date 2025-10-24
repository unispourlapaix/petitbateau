// Code pour remplacer le titre par un titre cliquable dans petitbateauRouge.html
// À remplacer dans la section classement vers la ligne 4211

// ANCIEN CODE (à supprimer):
/*
                // Titre
                ctx.font = 'bold 18px "Segoe UI", system-ui, sans-serif';
                ctx.fillStyle = '#1e293b';
                ctx.fillText(getTranslatedText('ui.leaderboard_title', '🌍 Scores Mondiaux - Petit Bateau'), C.W / 2, yPos);
                yPos += 30;
*/

// NOUVEAU CODE (à ajouter):
                // Titre cliquable (remplace l'ancien bouton en bas)
                const titleText = '🌍 Scores Mondiaux - Petit Bateau';
                ctx.font = 'bold 18px "Segoe UI", system-ui, sans-serif';
                
                // Créer zone cliquable pour le titre
                if (!menuEnigmesCanvas.scoresButton) {
                    const titleMetrics = ctx.measureText(titleText);
                    menuEnigmesCanvas.scoresButton = {
                        x: C.W / 2 - titleMetrics.width / 2 - 10,
                        y: yPos - 25,
                        width: titleMetrics.width + 20,
                        height: 30
                    };
                } else {
                    // Mettre à jour position
                    const titleMetrics = ctx.measureText(titleText);
                    menuEnigmesCanvas.scoresButton.x = C.W / 2 - titleMetrics.width / 2 - 10;
                    menuEnigmesCanvas.scoresButton.y = yPos - 25;
                    menuEnigmesCanvas.scoresButton.width = titleMetrics.width + 20;
                }
                
                // Fond cliquable subtil
                ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
                ctx.beginPath();
                ctx.roundRect(menuEnigmesCanvas.scoresButton.x, menuEnigmesCanvas.scoresButton.y, 
                             menuEnigmesCanvas.scoresButton.width, menuEnigmesCanvas.scoresButton.height, 8);
                ctx.fill();
                
                // Bordure
                ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
                ctx.lineWidth = 1;
                ctx.stroke();
                
                // Texte du titre (bleu pour indiquer cliquable)
                ctx.fillStyle = '#3b82f6';
                ctx.fillText(titleText, C.W / 2, yPos);
                yPos += 30;

// ÉGALEMENT SUPPRIMER l'ancien bouton en bas vers les lignes 4370-4410:
// Tout le bloc "✅ Bouton Voir Scores Mondiaux en bas" jusqu'à ctx.restore();