/**
 * 🌍 Module de Traduction Multi-Langues
 * Support: FR, EN, JP, UK
 */

class I18nManager {
    constructor() {
        this.currentLanguage = 'fr'; // Langue par défaut
        this.translations = {};
        this.supportedLanguages = {
            'fr': 'Français',
            'en': 'English',
            'jp': '日本語',
            'uk': 'Українська',
            'es': 'Español',
            'de': 'Deutsch',
            'it': 'Italiano',
            'pt': 'Português',
            'ru': 'Русский',
            'zh': '中文',
            'ko': '한국어',
            'ar': 'العربية',
            'he': 'עברית'
        };
        this.fallbackLanguage = 'fr';
    }

    /**
     * Charger les traductions pour une langue
     */
    async loadLanguage(lang) {
        if (this.translations[lang]) {
            return; // Déjà chargé
        }

        try {
            const response = await fetch(`modules/lang/${lang}.json`);
            const translations = await response.json();
            this.translations[lang] = translations;
            console.log(`🌍 Langue ${lang} chargée avec succès`);
        } catch (error) {
            console.warn(`⚠️ Impossible de charger la langue ${lang}:`, error);
            // Fallback vers le français si erreur
            if (lang !== this.fallbackLanguage) {
                await this.loadLanguage(this.fallbackLanguage);
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

        await this.loadLanguage(lang);
        this.currentLanguage = lang;

        // Sauvegarder le choix
        localStorage.setItem('selectedLanguage', lang);
        console.log(`🌍 Langue changée vers: ${this.supportedLanguages[lang]}`);

        return true;
    }

    /**
     * Récupérer une traduction
     */
    t(key, params = {}) {
        const lang = this.currentLanguage;

        // Chercher dans la langue actuelle
        let text = this.getNestedValue(this.translations[lang], key);

        // Fallback vers le français si pas trouvé
        if (!text && lang !== this.fallbackLanguage) {
            text = this.getNestedValue(this.translations[this.fallbackLanguage], key);
        }

        // Si toujours pas trouvé, retourner la clé
        if (!text) {
            console.warn(`⚠️ Traduction manquante: ${key}`);
            return `[${key}]`;
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
        const savedLang = localStorage.getItem('selectedLanguage') || 'fr';
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
}

// Instance globale
window.i18n = new I18nManager();

// Fonction raccourci globale
window.t = (key, params) => window.i18n.t(key, params);

console.log('🌍 Module i18n chargé');