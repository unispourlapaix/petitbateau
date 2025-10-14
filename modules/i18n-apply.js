/**
 * 🌍 Module d'Application des Traductions
 * Applique automatiquement les traductions aux éléments HTML
 * Par Emmanuel Payet / Claude
 */

class I18nApplicator {
    constructor(i18nManager) {
        this.i18n = i18nManager;
        this.observedElements = new Set();
    }

    /**
     * Appliquer toutes les traductions au chargement
     */
    async applyAll(lang) {
        console.log(`🌍 Application des traductions pour: ${lang}`);

        // 1. Charger la langue
        await this.i18n.setLanguage(lang);

        // 2. Appliquer aux éléments avec data-i18n
        this.applyToElements();

        // 3. Appliquer aux placeholders
        this.applyToPlaceholders();

        // 4. Appliquer aux titres
        this.applyToTitles();

        // 5. Mettre à jour les objets JavaScript du jeu
        this.updateGameObjects();

        console.log(`✅ Traductions appliquées avec succès`);
    }

    /**
     * Appliquer aux éléments avec data-i18n
     */
    applyToElements() {
        const elements = document.querySelectorAll('[data-i18n]');
        let count = 0;

        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (!key) return;

            const translation = this.i18n.t(key);

            // Si la traduction est trouvée et différente de la clé
            if (translation && translation !== key) {
                el.textContent = translation;
                count++;
            }
        });

        console.log(`  📝 ${count} éléments traduits [data-i18n]`);
    }

    /**
     * Appliquer aux placeholders avec data-i18n-placeholder
     */
    applyToPlaceholders() {
        const elements = document.querySelectorAll('[data-i18n-placeholder]');
        let count = 0;

        elements.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (!key) return;

            const translation = this.i18n.t(key);

            if (translation && translation !== key) {
                el.placeholder = translation;
                count++;
            }
        });

        console.log(`  📝 ${count} placeholders traduits`);
    }

    /**
     * Appliquer aux titres avec data-i18n-title
     */
    applyToTitles() {
        const elements = document.querySelectorAll('[data-i18n-title]');
        let count = 0;

        elements.forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (!key) return;

            const translation = this.i18n.t(key);

            if (translation && translation !== key) {
                el.title = translation;
                count++;
            }
        });

        console.log(`  📝 ${count} titres traduits`);
    }

    /**
     * Mettre à jour les objets JavaScript du jeu
     */
    updateGameObjects() {
        // Mettre à jour les briques si elles existent
        if (window.brickTexts) {
            this.updateBricks();
        }

        // Mettre à jour les énigmes si elles existent
        if (window.enigmes || window.enigmesData) {
            this.updateEnigmes();
        }

        // Mettre à jour les niveaux si ils existent
        if (window.niveauxSagesse) {
            this.updateLevels();
        }
    }

    /**
     * Mettre à jour les briques du jeu
     */
    updateBricks() {
        const lang = this.i18n.currentLanguage;

        // Si français, pas besoin de traduire (textes en dur)
        if (lang === 'fr') return;

        // Briques du jour
        if (window.brickTexts && window.brickTexts.day) {
            const dayKeys = [
                'told', 'monsters', 'prejudice', 'fears', 'distrust',
                'who_are_they', 'i_saw', 'father', 'mother', 'children',
                'humanity', 'love', 'compassion', 'hope', 'peace',
                'like_me', 'truth', 'courage', 'precious'
            ];

            dayKeys.forEach((key, index) => {
                if (window.brickTexts.day[index]) {
                    const nameKey = `bricks.day.${key}.name`;
                    const msgKey = `bricks.day.${key}.msg`;

                    const name = this.i18n.t(nameKey);
                    const msg = this.i18n.t(msgKey);

                    if (name !== nameKey) window.brickTexts.day[index].nom = name;
                    if (msg !== msgKey) window.brickTexts.day[index].msg = msg;
                }
            });

            console.log(`  🧱 Briques du jour traduites`);
        }

        // Briques de la nuit
        if (window.brickTexts && window.brickTexts.night) {
            const nightKeys = [
                'discord', 'hatred', 'destruction', 'theft', 'lies',
                'manipulation', 'greed', 'avarice', 'chains', 'iron_walls',
                'jealousy', 'pride', 'anger', 'revenge', 'indifference',
                'selfishness', 'ignorance', 'resistance', 'light',
                'hope_reborn', 'inner_strength', 'wisdom'
            ];

            nightKeys.forEach((key, index) => {
                if (window.brickTexts.night[index]) {
                    const nameKey = `bricks.night.${key}.name`;
                    const msgKey = `bricks.night.${key}.msg`;

                    const name = this.i18n.t(nameKey);
                    const msg = this.i18n.t(msgKey);

                    if (name !== nameKey) window.brickTexts.night[index].nom = name;
                    if (msg !== msgKey) window.brickTexts.night[index].msg = msg;
                }
            });

            console.log(`  🌙 Briques de la nuit traduites`);
        }
    }

    /**
     * Mettre à jour les énigmes
     */
    updateEnigmes() {
        const lang = this.i18n.currentLanguage;
        if (lang === 'fr') return;

        const enigmeKeys = [
            'humanity', 'wall_of_fear', 'peace', 'diversity', 'freedom',
            'faith', 'respect', 'mutual_aid', 'healing', 'restoration',
            'avarice', 'prison_freedom', 'refusal', 'pride', 'inequality',
            'hope', 'lighthouse', 'lamp', 'heart', 'humanity_no_borders',
            'right_to_happiness', 'precious_life', 'communitarianism'
        ];

        const enigmesArray = window.enigmes || window.enigmesData || [];

        enigmeKeys.forEach((key, index) => {
            if (enigmesArray[index]) {
                const baseKey = `enigmes.${key}`;

                const name = this.i18n.t(`${baseKey}.name`);
                const desc = this.i18n.t(`${baseKey}.description`);
                const mystery = this.i18n.t(`${baseKey}.mystery`);
                const revelation = this.i18n.t(`${baseKey}.revelation`);
                const wisdom = this.i18n.t(`${baseKey}.wisdom`);

                if (name !== `${baseKey}.name`) enigmesArray[index].nom = name;
                if (desc !== `${baseKey}.description`) enigmesArray[index].description = desc;
                if (mystery !== `${baseKey}.mystery`) enigmesArray[index].mystere = mystery;
                if (revelation !== `${baseKey}.revelation`) enigmesArray[index].revelation = revelation;
                if (wisdom !== `${baseKey}.wisdom`) enigmesArray[index].sagesse = wisdom;
            }
        });

        console.log(`  🧩 ${enigmeKeys.length} énigmes traduites`);
    }

    /**
     * Mettre à jour les niveaux de sagesse
     */
    updateLevels() {
        const lang = this.i18n.currentLanguage;
        if (lang === 'fr') return;

        const levelKeys = [
            'pilgrim', 'cabin_boy', 'apprentice', 'initiate', 'enlightened_sailor',
            'navigator', 'captain', 'meditating', 'guardian', 'contemplative',
            'disciple', 'illuminated', 'prophet', 'saint_navigator', 'robe_blanche'
        ];

        if (window.niveauxSagesse && Array.isArray(window.niveauxSagesse)) {
            levelKeys.forEach((key, index) => {
                if (window.niveauxSagesse[index]) {
                    const nameKey = `levels.${key}.name`;
                    const name = this.i18n.t(nameKey);

                    if (name !== nameKey) {
                        window.niveauxSagesse[index].nom = name;
                    }
                }
            });

            console.log(`  🏆 ${levelKeys.length} niveaux traduits`);
        }
    }

    /**
     * Traduire un texte avec variables
     */
    translate(key, params = {}) {
        return this.i18n.t(key, params);
    }

    /**
     * Réappliquer les traductions (utile après changement de langue)
     */
    async reapply() {
        const currentLang = this.i18n.getCurrentLanguage();
        await this.applyAll(currentLang);
    }
}

// Créer l'instance globale une fois i18n chargé
if (window.i18n) {
    window.i18nApplicator = new I18nApplicator(window.i18n);

    // Fonction globale pour changer de langue
    window.changeLanguage = async (lang) => {
        console.log(`🌍 Changement de langue vers: ${lang}`);
        await window.i18nApplicator.applyAll(lang);

        // Sauvegarder le choix
        localStorage.setItem('petit_bateau_lang', lang);

        return true;
    };

    console.log('✅ Module i18n-apply chargé');
} else {
    console.warn('⚠️ i18n non disponible, i18n-apply en attente');
}
