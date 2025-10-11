/**
 * Module Info Auteur
 * Emmanuel Payet – Auteur chrétien, artiste numérique et compositeur spirituel
 * @version 1.0.0
 */

class InfoAuteur {
    constructor() {
        this.infos = {
            nom: "Emmanuel Payet",
            titre: "Auteur chrétien, artiste numérique et compositeur spirituel",
            email: "emmanuelpayet888@gmail.com",
            website: "https://www.emmanuelpayet.art/",
            galleries: {
                games: "emmanuel.gallery",
                audio: "audiomac"
            },
            specialites: [
                "Création d'expériences interactives spirituelles",
                "Développement de jeux narratifs chrétiens",
                "Composition musicale inspirante",
                "Art numérique contemplatif"
            ],
            projets: [
                "PETIT BATEAU - Expérience narrative interactive",
                "Petit Bateau - Canvas éducatif modulaire",
                "Brian - Système de jeu avancé"
            ],
            message_accueil: "Bienvenue dans mon univers",
            presentation: "Je suis Emmanuel Payet, auteur chrétien, artiste numérique et compositeur. À travers mes livres, mes œuvres visuelles et mes musiques, je cherche à transmettre un message de lumière, d'amour et d'unité.",
            projet_phare: "Mon projet Unisona incarne cette vision : une fable moderne où le véritable superpouvoir est celui d'aimer.",
            methodes_creation: "Je crée des textes inspirés, des images numériques porteuses de sens, et des musiques générées par intelligence artificielle, pour éveiller les consciences et nourrir l'âme.",
            invitation: "Explorez mes créations, découvrez mes inspirations, et entrez dans un monde où l'art devient prière, et la spiritualité devient expérience.",
            signature_artistique: "Dreamer Unisa",
            copyright: "© 2025 Emmanuel Payet - Tous droits réservés"
        };

        this.styles = {
            container: {
                background: 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(248,250,255,0.9))',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255,255,255,0.3)',
                maxWidth: '500px',
                margin: '20px auto',
                textAlign: 'center'
            },
            title: {
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#2c3e50',
                marginBottom: '10px',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            },
            subtitle: {
                fontSize: '16px',
                color: '#7c3aed',
                fontStyle: 'italic',
                marginBottom: '20px'
            },
            section: {
                marginBottom: '15px',
                textAlign: 'left'
            },
            label: {
                fontWeight: 'bold',
                color: '#4f46e5',
                fontSize: '14px'
            },
            content: {
                color: '#2c3e50',
                fontSize: '13px',
                lineHeight: '1.5'
            }
        };
    }

    // Créer l'élément d'information visuel
    creerElementInfo() {
        const container = document.createElement('div');
        container.id = 'info-auteur';
        container.style.cssText = this.convertirStylesCSS(this.styles.container);

        container.innerHTML = `
            <div style="${this.convertirStylesCSS(this.styles.title)}">
                ${this.infos.nom}
            </div>
            <div style="${this.convertirStylesCSS(this.styles.subtitle)}">
                ${this.infos.titre}
            </div>

            <div style="${this.convertirStylesCSS(this.styles.section)}">
                <div style="${this.convertirStylesCSS(this.styles.label)}">✨ Spécialités:</div>
                <div style="${this.convertirStylesCSS(this.styles.content)}">
                    ${this.infos.specialites.map(s => `• ${s}`).join('<br>')}
                </div>
            </div>

            <div style="${this.convertirStylesCSS(this.styles.section)}">
                <div style="${this.convertirStylesCSS(this.styles.label)}">🎮 Projets actuels:</div>
                <div style="${this.convertirStylesCSS(this.styles.content)}">
                    ${this.infos.projets.map(p => `• ${p}`).join('<br>')}
                </div>
            </div>

            <div style="${this.convertirStylesCSS(this.styles.section)}">
                <div style="${this.convertirStylesCSS(this.styles.label)}">✨ ${this.infos.message_accueil}</div>
                <div style="${this.convertirStylesCSS(this.styles.content)}">
                    ${this.infos.presentation}
                </div>
            </div>

            <div style="${this.convertirStylesCSS(this.styles.section)}">
                <div style="${this.convertirStylesCSS(this.styles.label)}">🌟 Projet Unisona:</div>
                <div style="${this.convertirStylesCSS(this.styles.content)}">
                    ${this.infos.projet_phare}
                </div>
            </div>

            <div style="${this.convertirStylesCSS(this.styles.section)}">
                <div style="${this.convertirStylesCSS(this.styles.label)}">🎨 Méthodes de création:</div>
                <div style="${this.convertirStylesCSS(this.styles.content)}">
                    ${this.infos.methodes_creation}
                </div>
            </div>

            <div style="${this.convertirStylesCSS(this.styles.section)}">
                <div style="${this.convertirStylesCSS(this.styles.label)}">🚀 Invitation:</div>
                <div style="${this.convertirStylesCSS(this.styles.content)}">
                    ${this.infos.invitation}
                </div>
            </div>

            <div style="${this.convertirStylesCSS(this.styles.section)}">
                <div style="${this.convertirStylesCSS(this.styles.label)}">🌐 Portfolio:</div>
                <div style="${this.convertirStylesCSS(this.styles.content)}">
                    <a href="${this.infos.website}" target="_blank" style="color: #7c3aed; text-decoration: none;">
                        emmanuelpayet.art
                    </a>
                </div>
            </div>

            <div style="${this.convertirStylesCSS(this.styles.section)}">
                <div style="${this.convertirStylesCSS(this.styles.label)}">🎮 Espaces de création:</div>
                <div style="${this.convertirStylesCSS(this.styles.content)}">
                    • ${this.infos.galleries.games} (Jeux artistiques)<br>
                    • ${this.infos.galleries.audio} (Compositions musicales)
                </div>
            </div>

            <div style="${this.convertirStylesCSS(this.styles.section)}">
                <div style="${this.convertirStylesCSS(this.styles.label)}">📧 Contact:</div>
                <div style="${this.convertirStylesCSS(this.styles.content)}">
                    <a href="mailto:${this.infos.email}" style="color: #7c3aed; text-decoration: none;">
                        ${this.infos.email}
                    </a>
                </div>
            </div>

            <div style="margin-top: 20px; font-size: 12px; color: #7c3aed; font-style: italic;">
                ~ ${this.infos.signature_artistique} ~
            </div>
            <div style="margin-top: 5px; font-size: 10px; color: #6b7280;">
                ${this.infos.copyright}
            </div>
        `;

        return container;
    }

    // Afficher les infos dans le canvas
    dessinerInfoCanvas(ctx, x, y, largeur = 400) {
        ctx.save();

        // Fond semi-transparent
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(x, y, largeur, 300);

        // Bordure
        ctx.strokeStyle = 'rgba(79, 70, 229, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, largeur, 300);

        // Titre principal
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.infos.nom, x + largeur/2, y + 30);

        // Sous-titre
        ctx.fillStyle = '#7c3aed';
        ctx.font = 'italic 14px Arial';
        ctx.fillText(this.infos.titre, x + largeur/2, y + 55);

        // Contact
        ctx.fillStyle = '#4f46e5';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('📧 Contact:', x + 20, y + 85);

        ctx.fillStyle = '#2c3e50';
        ctx.font = '12px Arial';
        ctx.fillText(this.infos.email, x + 20, y + 105);

        // Philosophie
        ctx.fillStyle = '#4f46e5';
        ctx.font = 'bold 12px Arial';
        ctx.fillText('🙏 Philosophie:', x + 20, y + 135);

        ctx.fillStyle = '#2c3e50';
        ctx.font = '11px Arial';
        const lignes = this.diviserTexte(ctx, this.infos.philosophie, largeur - 40);
        lignes.forEach((ligne, i) => {
            ctx.fillText(ligne, x + 20, y + 155 + i * 15);
        });

        // Copyright
        ctx.fillStyle = '#6b7280';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.infos.copyright, x + largeur/2, y + 280);

        ctx.restore();
    }

    // Utilitaire pour diviser le texte en lignes
    diviserTexte(ctx, texte, largeurMax) {
        const mots = texte.split(' ');
        const lignes = [];
        let ligneActuelle = '';

        mots.forEach(mot => {
            const test = ligneActuelle + mot + ' ';
            if (ctx.measureText(test).width > largeurMax && ligneActuelle !== '') {
                lignes.push(ligneActuelle.trim());
                ligneActuelle = mot + ' ';
            } else {
                ligneActuelle = test;
            }
        });

        if (ligneActuelle.trim() !== '') {
            lignes.push(ligneActuelle.trim());
        }

        return lignes;
    }

    // Convertir les styles JS en CSS
    convertirStylesCSS(styles) {
        return Object.entries(styles)
            .map(([key, value]) => {
                const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                return `${cssKey}: ${value}`;
            })
            .join('; ');
    }

    // API publique
    getInfos() {
        return this.infos;
    }

    afficherDansElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.appendChild(this.creerElementInfo());
        }
    }

    // Signature Emmanuel Payet
    static signature() {
        console.log(`
🙏 ========================================== 🙏
   Emmanuel Payet - Créateur spirituel numérique

   "Utiliser la technologie pour partager
    la lumière et l'espoir"

   🌐 https://www.emmanuelpayet.art/
   🎨 emmanuel.gallery (Jeux artistiques) | audiomac (Musiques)
   📧 emmanuelpayet888@gmail.com
🙏 ========================================== 🙏
        `);
    }
}

// Export du module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InfoAuteur;
} else {
    window.InfoAuteur = InfoAuteur;
}

// Signature automatique en console
InfoAuteur.signature();