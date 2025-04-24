/**
 * Hulpfuncties voor de klimroute applicatie
 */

const utils = {
    /**
     * Verwerkt een gradatie string naar een CSS-klasse
     * @param {string} gradatie - De gradatie string (bijv. "6a+", "7b", "5c")
     * @returns {string} Een CSS-klasse voor de gradatie
     */
    getGradeClass: function(gradatie) {
        // Verwijder spaties en maak lowercase
        const cleanGradatie = gradatie.trim().toLowerCase();
        
        // Vervang '+' door 'plus' en '-' door 'minus' voor CSS-klasse
        return 'grade-' + cleanGradatie.replace('+', 'plus').replace('-', 'minus');
    },
    
    /**
     * Bepaalt de basisgradatie voor filtering (bijv. 6a+ -> 6)
     * @param {string} gradatie - De gradatie string
     * @returns {string} De basisgradatie (alleen het cijfer)
     */
    getBaseGrade: function(gradatie) {
        // Extraheer het eerste cijfer uit de gradatie
        const match = gradatie.match(/^(\d+)/);
        return match ? match[1] : '';
    },
    
    /**
     * Vergelijkt twee gradaties voor sortering
     * @param {string} a - Eerste gradatie
     * @param {string} b - Tweede gradatie
     * @returns {number} Vergelijkingsresultaat (-1, 0, 1)
     */
    compareGrades: function(a, b) {
        // Helper functie om een numerieke waarde toe te kennen aan een gradatie
        const gradeValue = (grade) => {
            const base = parseInt(grade.match(/^(\d+)/)[1]) * 100;
            
            if (grade.includes('a')) {
                if (grade.includes('+')) return base + 40;
                return base + 30;
            }
            if (grade.includes('b')) {
                if (grade.includes('+')) return base + 60;
                return base + 50;
            }
            if (grade.includes('c')) {
                if (grade.includes('+')) return base + 80;
                return base + 70;
            }
            if (grade.includes('+')) return base + 20;
            if (grade.includes('-')) return base - 20;
            
            return base;
        };
        
        return gradeValue(a) - gradeValue(b);
    },
    
    /**
     * Verwerkt en formateert de beschrijving voor weergave
     * @param {string} beschrijving - De volledige beschrijving
     * @returns {Object} Korte en volledige beschrijving
     */
    formatDescription: function(beschrijving) {
        const maxLength = 100;
        
        if (beschrijving.length <= maxLength) {
            return {
                short: beschrijving,
                full: beschrijving,
                isExpanded: false
            };
        }
        
        // Knip de tekst af bij de maximale lengte en zoek het laatste volledige woord
        const truncated = beschrijving.substring(0, maxLength);
        const lastSpaceIndex = truncated.lastIndexOf(' ');
        
        // Kort de beschrijving in tot het laatste volledige woord
        const shortDesc = truncated.substring(0, lastSpaceIndex) + '...';
        
        return {
            short: shortDesc,
            full: beschrijving,
            isExpanded: false
        };
    },
    
    /**
     * Classificeert een route op basis van lengte
     * @param {number} lengte - De lengte van de route in meters
     * @returns {string} Classificatie (short, medium, long)
     */
    getLengthCategory: function(lengte) {
        if (lengte < 20) return 'short';
        if (lengte <= 35) return 'medium';
        return 'long';
    },
    
    /**
     * Extraheert unieke waarden uit een array van objecten
     * @param {Array} array - De array met objecten
     * @param {string} property - De eigenschap om unieke waarden van te verzamelen
     * @returns {Array} Een array met unieke waarden
     */
    getUniqueValues: function(array, property) {
        return [...new Set(array.map(item => item[property]))].sort();
    },
    
    /**
     * Debounce functie voor het beperken van frequente functie-aanroepen
     * @param {Function} func - De functie om te debounce
     * @param {number} delay - De vertraging in milliseconden
     * @returns {Function} De gedebounce functie
     */
    debounce: function(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }
};
