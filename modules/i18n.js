/**
 * 🌍 Module de Traduction Multi-Langues
 * Support: 15 langues dont FR (défaut), EN, ES, DE, IT, PT, RU, UK, ZH, JP, KO, RC, LG, AR, HE
 */

class I18nManager {
    constructor() {
        this.currentLanguage = 'fr'; // Langue par défaut
        this.translations = {};
        this.supportedLanguages = {
            'fr': 'Français',
            'en': 'English',
            'es': 'Español',
            'de': 'Deutsch',
            'it': 'Italiano',
            'pt': 'Português',
            'ru': 'Русский',
            'uk': 'Українська',
            'zh': '中文',
            'jp': '日本語',
            'ko': '한국어',
            'rc': 'Kréol Rényoné',
            'lg': 'Lingala',
            'ar': 'العربية',
            'he': 'עברית'
        };
        this.fallbackLanguage = 'fr';
        
        // Traductions françaises intégrées (fallback)
        this.translations.fr = {
            // Les traductions françaises sont gérées directement dans le jeu
            // Ceci sert de fallback si le fichier JSON n'est pas accessible
            loaded: true
        };
    }

    /**
     * Charger les traductions pour une langue
     */
    async loadLanguage(lang) {
        if (this.translations[lang] && !this.translations[lang].loaded) return;
        try {
            const response = await fetch(`modules/lang/${lang}.json`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const translations = await response.json();
            this.translations[lang] = translations;
            console.log(`🌍 Langue ${lang} chargée avec succès depuis JSON`);
        } catch (error) {
            console.warn(`⚠️ Impossible de charger la langue ${lang}:`, error.message);
            // Pour le français, utiliser un objet vide pour fallback aux textes HTML
            if (lang === 'fr') {
                this.translations.fr = { loaded: true };
                console.log(`🇫🇷 Français utilise les textes intégrés dans le jeu (fallback)`);
            }
        }
    }

    /**
     * Changer la langue active
     */
    async setLanguage(lang) {
        if (!this.supportedLanguages[lang]) {
            console.warn(`⚠️ Langue non supportée: ${lang}`);
            return false;
        }

        // Charger toutes les langues depuis JSON, y compris le français
        await this.loadLanguage(lang);
        
        this.currentLanguage = lang;

        // Sauvegarder le choix
        localStorage.setItem('petit_bateau_lang', lang);
        console.log(`🌍 Langue changée vers: ${this.supportedLanguages[lang]}`);

        // Mettre à jour automatiquement tous les éléments HTML avec data-i18n
        this.updateDOM();

        return true;
    }

    /**
     * Récupérer une traduction
     */
    t(key, params = {}) {
        const lang = this.currentLanguage;

        // Chercher dans la langue actuelle
        let text = this.getNestedValue(this.translations[lang], key);

        // Si pas trouvé, retourner la clé pour signaler qu'il faut le fallback
        if (!text) {
            return key; // Signal pour utiliser le fallback français
        }

        // Si c'est un objet (pas une chaîne), retourner la clé
        // Cela arrive quand on demande "game.share_texts" au lieu de "game.share_texts.text1_title"
        if (typeof text !== 'string') {
            console.warn(`⚠️ La clé "${key}" pointe vers un objet, pas une chaîne. Utilisez une clé plus spécifique.`);
            return key;
        }

        // Remplacer les paramètres {param}
        return this.interpolate(text, params);
    }

    /**
     * Récupérer une valeur imbriquée dans un objet (ex: "phase1.narrative")
     */
    getNestedValue(obj, path) {
        if (!obj) return null;
        return path.split('.').reduce((current, key) => current && current[key], obj);
    }

    /**
     * Interpoler les paramètres dans le texte
     */
    interpolate(text, params) {
        return text.replace(/\{(\w+)\}/g, (match, key) => {
            return params[key] !== undefined ? params[key] : match;
        });
    }

    /**
     * Initialiser avec la langue sauvegardée
     */
    async init() {
        const savedLang = localStorage.getItem('petit_bateau_lang') || 'fr';
        await this.setLanguage(savedLang);
    }

    /**
     * Obtenir la liste des langues supportées
     */
    getSupportedLanguages() {
        return this.supportedLanguages;
    }

    /**
     * Obtenir la langue actuelle
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Mettre à jour tous les éléments DOM avec data-i18n
     */
    updateDOM() {
        // Texte des éléments
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            if (translation && translation !== key) {
                element.textContent = translation;
            }
        });

        // Placeholders des inputs
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.t(key);
            if (translation && translation !== key) {
                element.placeholder = translation;
            }
        });

        // Attributs title
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const translation = this.t(key);
            if (translation && translation !== key) {
                element.title = translation;
            }
        });

        // Attributs alt pour images
        document.querySelectorAll('[data-i18n-alt]').forEach(element => {
            const key = element.getAttribute('data-i18n-alt');
            const translation = this.t(key);
            if (translation && translation !== key) {
                element.alt = translation;
            }
        });

        console.log(`🌍 DOM mis à jour avec la langue: ${this.currentLanguage}`);
    }
}

// Instance globale
window.i18n = new I18nManager();

// Fonction raccourci globale
window.t = (key, params) => window.i18n.t(key, params);

// Fonction globale pour charger les traductions (compatibilité avec le HTML)
window.loadTranslations = async (lang) => {
    try {
        await window.i18n.setLanguage(lang);
        console.log(`🌍 Traductions ${lang} chargées avec succès`);
        return true;
    } catch (error) {
        console.error(`❌ Erreur chargement traductions ${lang}:`, error);
        return false;
    }
};

console.log('🌍 Module i18n chargé');