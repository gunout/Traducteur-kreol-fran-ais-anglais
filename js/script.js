// js/script.js - Version corrigée
class CyberTraducteur {
    constructor() {
        this.translationMaps = {};
        this.isInitialized = false;
        this.init();
    }

    init() {
        console.log('🚀 Initialisation du CyberTraducteur...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            setTimeout(() => this.start(), 100);
        }
    }

    start() {
        console.log('🔍 Démarrage du traducteur...');
        
        if (!this.checkDictionaries()) {
            this.showError('Dictionnaires non chargés - Vérifiez la console');
            return;
        }

        this.initializeTranslationMaps();
        this.setupDOM();
        this.setupEvents();
        this.isInitialized = true;
        
        console.log('✅ CyberTraducteur prêt!');
        this.testTranslation();
    }

    checkDictionaries() {
        console.log('📚 Vérification des dictionnaires...');
        
        const requiredDicts = [
            { name: 'CREOLE_FRENCH_DICTIONARY', obj: window.CREOLE_FRENCH_DICTIONARY },
            { name: 'CREOLE_ENGLISH_DICTIONARY', obj: window.CREOLE_ENGLISH_DICTIONARY },
            { name: 'FRENCH_ENGLISH_DICTIONARY', obj: window.FRENCH_ENGLISH_DICTIONARY }
        ];

        let allValid = true;

        for (const dict of requiredDicts) {
            if (!dict.obj) {
                console.error(`❌ ${dict.name} est indéfini`);
                allValid = false;
                continue;
            }

            console.log(`✅ ${dict.name} existe`);
            
            const keys = Object.keys(dict.obj);
            console.log(`   ${keys.length} clé(s) trouvée(s):`, keys);
            
            if (keys.length === 0) {
                console.warn(`⚠️ ${dict.name} est vide`);
            }
        }

        return allValid;
    }

    initializeTranslationMaps() {
        console.log('🔄 Construction des maps de traduction...');
        
        try {
            this.translationMaps['creole-fr'] = this.extractDictionaryData(window.CREOLE_FRENCH_DICTIONARY);
            this.translationMaps['creole-en'] = this.extractDictionaryData(window.CREOLE_ENGLISH_DICTIONARY);
            this.translationMaps['fr-en'] = this.extractDictionaryData(window.FRENCH_ENGLISH_DICTIONARY);
            
            this.translationMaps['fr-creole'] = this.reverseDictionary(this.translationMaps['creole-fr']);
            this.translationMaps['en-creole'] = this.reverseDictionary(this.translationMaps['creole-en']);
            this.translationMaps['en-fr'] = this.reverseDictionary(this.translationMaps['fr-en']);
            
            console.log('📊 Statistiques:');
            Object.entries(this.translationMaps).forEach(([key, dict]) => {
                console.log(`   ${key}: ${Object.keys(dict).length} entrées`);
            });
            
        } catch (error) {
            console.error('❌ Erreur lors de la construction des maps:', error);
            throw error;
        }
    }

    extractDictionaryData(dict) {
        const keys = Object.keys(dict);
        if (keys.length === 0) return {};
        
        const mainKey = keys[0];
        const data = dict[mainKey];
        
        if (typeof data === 'object' && data !== null) {
            return data;
        }
        
        return dict;
    }

    reverseDictionary(dict) {
        const reversed = {};
        let count = 0;
        
        for (const [key, value] of Object.entries(dict)) {
            if (value && typeof value === 'string') {
                reversed[value.toLowerCase()] = key;
                count++;
            }
        }
        
        console.log(`   ${count} entrées inversées`);
        return reversed;
    }

    setupDOM() {
        console.log('🎯 Configuration des éléments DOM...');
        
        this.elements = {
            sourceText: document.getElementById('source-text'),
            sourceLang: document.getElementById('source-lang'),
            targetLang1: document.getElementById('target-lang-1'),
            targetLang2: document.getElementById('target-lang-2'),
            output1: document.getElementById('output-1'),
            output2: document.getElementById('output-2'),
            translateBtn: document.getElementById('translate-btn'),
            copyBtns: document.querySelectorAll('.copy-btn')
        };

        const requiredElements = ['sourceText', 'sourceLang', 'targetLang1', 'targetLang2', 'output1', 'output2', 'translateBtn'];
        let allElementsExist = true;

        requiredElements.forEach(key => {
            if (!this.elements[key]) {
                console.error(`❌ Élément manquant: ${key}`);
                allElementsExist = false;
            }
        });

        if (!allElementsExist) {
            throw new Error('Éléments DOM manquants');
        }

        console.log('✅ Tous les éléments DOM trouvés');
    }

    setupEvents() {
        console.log('🔗 Configuration des événements...');
        
        this.elements.translateBtn.addEventListener('click', () => this.translate());
        this.elements.sourceText.addEventListener('input', () => this.debouncedTranslate());
        this.elements.sourceLang.addEventListener('change', () => this.updateLanguageOptions());
        this.elements.targetLang1.addEventListener('change', () => this.translate());
        this.elements.targetLang2.addEventListener('change', () => this.translate());

        this.elements.copyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = e.target.getAttribute('data-target');
                this.copyToClipboard(targetId, e.target);
            });
        });

        this.updateLanguageOptions();
    }

    debouncedTranslate() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => this.translate(), 300);
    }

    translate() {
        if (!this.isInitialized) return;

        const sourceText = this.elements.sourceText.value.trim();
        const sourceLang = this.elements.sourceLang.value;
        const targetLang1 = this.elements.targetLang1.value;
        const targetLang2 = this.elements.targetLang2.value;

        if (!sourceText) {
            this.elements.output1.textContent = '';
            this.elements.output2.textContent = '';
            return;
        }

        console.log(`🌐 Traduction: "${sourceText}"`);

        try {
            const translation1 = this.translateText(sourceText, sourceLang, targetLang1);
            const translation2 = this.translateText(sourceText, sourceLang, targetLang2);

            this.elements.output1.textContent = translation1;
            this.elements.output2.textContent = translation2;

            this.elements.output1.style.color = '';
            this.elements.output2.style.color = '';

        } catch (error) {
            console.error('❌ Erreur de traduction:', error);
            this.showError('Erreur de traduction');
        }
    }

    // CORRECTION : Cette méthode est maintenant correctement définie comme méthode de classe
    translateText(text, fromLang, toLang) {
        if (fromLang === toLang) return text;
        
        const mapKey = `${fromLang}-${toLang}`;
        const dictionary = this.translationMaps[mapKey]; // CORRECTION : utilisation de this.translationMaps
        
        if (!dictionary) {
            return `[Erreur: traduction ${mapKey} non disponible]`;
        }
        
        console.log(`🔍 Recherche dans ${mapKey}: "${text}"`);
        
        const words = text.split(/(\s+)/);
        const translatedWords = [];
        
        for (const originalWord of words) {
            if (!originalWord.trim()) {
                translatedWords.push(originalWord);
                continue;
            }
            
            const variants = [
                originalWord.toLowerCase(),
                originalWord,
                originalWord.charAt(0).toUpperCase() + originalWord.slice(1).toLowerCase()
            ];
            
            let translated = null;
            
            for (const variant of variants) {
                if (dictionary[variant]) {
                    translated = dictionary[variant];
                    console.log(`✅ Trouvé avec variante "${variant}": "${translated}"`);
                    break;
                }
            }
            
            if (translated) {
                let cleanTranslation = translated;
                if (cleanTranslation.endsWith('.')) {
                    cleanTranslation = cleanTranslation.slice(0, -1);
                }
                
                if (originalWord[0] === originalWord[0].toUpperCase()) {
                    cleanTranslation = cleanTranslation.charAt(0).toUpperCase() + cleanTranslation.slice(1);
                }
                
                translatedWords.push(cleanTranslation);
            } else {
                console.log(`❌ Aucune variante trouvée pour "${originalWord}"`);
                translatedWords.push(originalWord);
            }
        }
        
        return translatedWords.join('');
    }

    updateLanguageOptions() {
        const sourceLang = this.elements.sourceLang.value;
        const availableLangs = ['fr', 'en', 'creole'].filter(lang => lang !== sourceLang);

        this.elements.targetLang1.innerHTML = availableLangs.map(lang => 
            `<option value="${lang}">${this.getLanguageName(lang)}</option>`
        ).join('');

        this.elements.targetLang2.innerHTML = availableLangs.map(lang => 
            `<option value="${lang}">${this.getLanguageName(lang)}</option>`
        ).join('');

        if (this.elements.targetLang1.value === this.elements.targetLang2.value && availableLangs.length > 1) {
            this.elements.targetLang2.value = availableLangs[1];
        }

        this.translate();
    }

    getLanguageName(code) {
        const names = {
            'fr': 'Français',
            'en': 'English', 
            'creole': 'Kréol Réyoné'
        };
        return names[code] || code;
    }

    copyToClipboard(targetId, button) {
        const element = document.getElementById(targetId);
        const text = element.textContent;

        navigator.clipboard.writeText(text).then(() => {
            const originalText = button.textContent;
            button.textContent = '✓ Copié';
            button.style.background = '#00ff00';
            button.style.color = '#000';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
                button.style.color = '';
            }, 2000);
        }).catch(err => {
            console.error('Erreur de copie:', err);
            button.textContent = '❌ Erreur';
        });
    }

    showError(message) {
        [this.elements.output1, this.elements.output2].forEach(output => {
            if (output) {
                output.textContent = message;
                output.style.color = '#EF4135';
            }
        });
    }

    testTranslation() {
        console.log('🧪 Test de traduction automatique...');
        setTimeout(() => {
            this.elements.sourceText.value = 'bonzour';
            this.translate();
        }, 500);
    }
}

// Initialiser l'application
let traducteur;

document.addEventListener('DOMContentLoaded', function() {
    console.log('⚡ CyberTraducteur - Chargement...');
    traducteur = new CyberTraducteur();
});

window.addEventListener('error', function(e) {
    console.error('💥 Erreur globale:', e.error);
});