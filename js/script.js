// js/script.js - Version simplifiée et corrigée

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== CHARGEMENT DU TRADUCTEUR ===');
    
    // Vérification des dictionnaires
    if (!CREOLE_FRENCH_DICTIONARY || !CREOLE_ENGLISH_DICTIONARY || !FRENCH_ENGLISH_DICTIONARY) {
        console.error('Dictionnaires manquants !');
        return;
    }

    // Construction des maps de traduction
    const translationMaps = {};
    
    function initializeTranslationMaps() {
        console.log('Initialisation des maps de traduction...');
        
        // Créole vers Français et Anglais (direct)
        translationMaps['creole-fr'] = CREOLE_FRENCH_DICTIONARY['creole-fr'] || {};
        translationMaps['creole-en'] = CREOLE_ENGLISH_DICTIONARY['creole-en'] || {};
        
        // Français vers Créole et Anglais
        translationMaps['fr-creole'] = {};
        translationMaps['fr-en'] = FRENCH_ENGLISH_DICTIONARY['fr-en'] || {};
        
        // Anglais vers Créole et Français
        translationMaps['en-creole'] = {};
        translationMaps['en-fr'] = {};
        
        // Inverser les dictionnaires
        for (const [creoleWord, frenchWord] of Object.entries(translationMaps['creole-fr'])) {
            translationMaps['fr-creole'][frenchWord.toLowerCase()] = creoleWord;
        }
        
        for (const [creoleWord, englishWord] of Object.entries(translationMaps['creole-en'])) {
            translationMaps['en-creole'][englishWord.toLowerCase()] = creoleWord;
        }
        
        for (const [frenchWord, englishWord] of Object.entries(translationMaps['fr-en'])) {
            translationMaps['en-fr'][englishWord.toLowerCase()] = frenchWord;
        }
        
        console.log('Maps de traduction initialisées');
    }

    initializeTranslationMaps();

    // Fonction de traduction SIMPLIFIÉE
    function translateText(text, fromLang, toLang) {
        if (fromLang === toLang) {
            return text; // Pas besoin de traduire
        }
        
        const mapKey = `${fromLang}-${toLang}`;
        const dictionary = translationMaps[mapKey];
        
        if (!dictionary) {
            return `[Erreur: traduction ${mapKey} non disponible]`;
        }
        
        console.log(`Traduction: "${text}" de ${fromLang} vers ${toLang}`);
        
        // Séparer le texte en mots
        const words = text.split(' ');
        const translatedWords = [];
        
        for (const originalWord of words) {
            // Nettoyer le mot (enlever la ponctuation)
            const cleanWord = originalWord.toLowerCase().replace(/[.,!?;:]/g, '');
            
            if (cleanWord && dictionary[cleanWord]) {
                // Traduction trouvée
                let translated = dictionary[cleanWord];
                
                // Conserver la casse originale
                if (originalWord[0] === originalWord[0].toUpperCase()) {
                    translated = translated.charAt(0).toUpperCase() + translated.slice(1);
                }
                
                translatedWords.push(translated);
                console.log(`  "${cleanWord}" -> "${translated}"`);
            } else {
                // Mot non trouvé, garder l'original
                translatedWords.push(originalWord);
                console.log(`  "${cleanWord}" -> [non trouvé]`);
            }
        }
        
        const result = translatedWords.join(' ');
        console.log(`Résultat: "${result}"`);
        return result;
    }

    // RÉFÉRENCES DOM
    const elements = {
        sourceText: document.getElementById('source-text'),
        sourceLang: document.getElementById('source-lang'),
        targetLang1: document.getElementById('target-lang-1'),
        targetLang2: document.getElementById('target-lang-2'),
        output1: document.getElementById('output-1'),
        output2: document.getElementById('output-2'),
        translateBtn: document.getElementById('translate-btn'),
        copyBtns: document.querySelectorAll('.copy-btn')
    };

    // FONCTION DE TRADUCTION PRINCIPALE
    function performTranslation() {
        const sourceText = elements.sourceText.value.trim();
        const sourceLang = elements.sourceLang.value;
        const targetLang1 = elements.targetLang1.value;
        const targetLang2 = elements.targetLang2.value;
        
        if (!sourceText) {
            elements.output1.textContent = '';
            elements.output2.textContent = '';
            return;
        }
        
        console.log('=== DÉBUT TRADUCTION ===');
        console.log(`Source: "${sourceText}"`);
        console.log(`Langues: ${sourceLang} -> ${targetLang1} et ${targetLang2}`);
        
        // Traduire vers la première cible
        const translation1 = translateText(sourceText, sourceLang, targetLang1);
        elements.output1.textContent = translation1;
        
        // Traduire vers la deuxième cible
        const translation2 = translateText(sourceText, sourceLang, targetLang2);
        elements.output2.textContent = translation2;
        
        console.log('=== FIN TRADUCTION ===');
    }

    // MISE À JOUR DES OPTIONS DE LANGUE
    function updateLanguageOptions() {
        const sourceLang = elements.sourceLang.value;
        const availableLangs = ['fr', 'en', 'creole'].filter(lang => lang !== sourceLang);
        
        // Mettre à jour les listes déroulantes
        elements.targetLang1.innerHTML = availableLangs.map(lang => 
            `<option value="${lang}">${getLanguageName(lang)}</option>`
        ).join('');
        
        elements.targetLang2.innerHTML = availableLangs.map(lang => 
            `<option value="${lang}">${getLanguageName(lang)}</option>`
        ).join('');
        
        // S'assurer que les cibles sont différentes
        if (elements.targetLang1.value === elements.targetLang2.value && availableLangs.length > 1) {
            elements.targetLang2.value = availableLangs[1];
        }
        
        performTranslation();
    }

    function getLanguageName(code) {
        const names = {
            'fr': 'Français',
            'en': 'English',
            'creole': 'Kréol Réyoné'
        };
        return names[code] || code;
    }

    // FONCTIONNALITÉ COPIER
    elements.copyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            const textToCopy = targetElement.textContent;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = this.textContent;
                this.textContent = 'Copié!';
                setTimeout(() => {
                    this.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Erreur de copie:', err);
            });
        });
    });

    // ÉVÉNEMENTS
    elements.translateBtn.addEventListener('click', performTranslation);
    elements.sourceText.addEventListener('input', performTranslation);
    elements.sourceLang.addEventListener('change', updateLanguageOptions);
    elements.targetLang1.addEventListener('change', performTranslation);
    elements.targetLang2.addEventListener('change', performTranslation);

    // INITIALISATION
    console.log('Initialisation du traducteur...');
    updateLanguageOptions();
    console.log('Traducteur prêt!');
    
    // Test automatique
    setTimeout(() => {
        console.log('=== TEST AUTOMATIQUE ===');
        elements.sourceText.value = 'bonzour';
        performTranslation();
    }, 1000);
});