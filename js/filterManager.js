/**
 * Beheert alle filter-functionaliteit voor klimroutes
 */

class FilterManager {
    constructor(routes, onFilterChange) {
        // Data en callbacks
        this.allRoutes = routes;
        this.filteredRoutes = [...routes];
        this.onFilterChange = onFilterChange;
        
        // State voor actieve filters
        this.activeFilters = {
            search: '',
            sector: '',
            grade: '',
            length: ''
        };
        
        // Verzamel unieke waarden voor dropdowns
        this.uniqueSectors = utils.getUniqueValues(routes, 'deelmassief');
        this.uniqueGrades = this._getUniqueGrades(routes);
        
        // DOM-elementen
        this.searchInput = document.getElementById('search');
        this.sectorSelect = document.getElementById('sector');
        this.gradeSelect = document.getElementById('grade');
        this.lengthSelect = document.getElementById('length');
        this.clearFiltersBtn = document.getElementById('clear-filters');
        this.filterCountEl = document.querySelector('.filter-count');
        
        // Initialisatie
        this._initFilterOptions();
        this._bindEvents();
        
        // Belangrijk: Toon alle routes bij initialisatie
        if (this.onFilterChange) {
            this.onFilterChange(this.filteredRoutes);
        }
        
        // Update de filter teller
        this._updateFilterCount();
    }
    
    /**
     * Vult de filter dropdowns met opties
     */
    _initFilterOptions() {
        // Vul sector dropdown
        this.uniqueSectors.forEach(sector => {
            const option = document.createElement('option');
            option.value = sector;
            option.textContent = sector;
            this.sectorSelect.appendChild(option);
        });
        
        // Vul gradatie dropdown
        this.uniqueGrades.forEach(grade => {
            const option = document.createElement('option');
            option.value = grade;
            option.textContent = grade;
            this.gradeSelect.appendChild(option);
        });
    }
    
    /**
     * Koppelt event listeners aan de filter-elementen
     */
    _bindEvents() {
        // Debounce search input voor betere prestaties
        const debouncedSearch = utils.debounce((e) => {
            this._updateFilter('search', e.target.value.toLowerCase());
        }, 300);
        
        this.searchInput.addEventListener('input', debouncedSearch);
        
        // Dropdown events
        this.sectorSelect.addEventListener('change', (e) => {
            this._updateFilter('sector', e.target.value);
        });
        
        this.gradeSelect.addEventListener('change', (e) => {
            this._updateFilter('grade', e.target.value);
        });
        
        this.lengthSelect.addEventListener('change', (e) => {
            this._updateFilter('length', e.target.value);
        });
        
        // Clear filters knop
        this.clearFiltersBtn.addEventListener('click', () => {
            this._clearAllFilters();
        });
    }
    
    /**
     * Haalt unieke gradaties op en sorteert deze correct
     */
    _getUniqueGrades(routes) {
        const baseGrades = [...new Set(routes.map(route => utils.getBaseGrade(route.gradatie)))];
        
        // Sorteer de gradaties numeriek
        return baseGrades.sort((a, b) => parseInt(a) - parseInt(b));
    }
    
    /**
     * Werkt een specifiek filter bij en past de routes aan
     */
    _updateFilter(filterName, value) {
        this.activeFilters[filterName] = value;
        this._applyFilters();
        this._updateFilterCount();
    }
    
    /**
     * Past alle actieve filters toe op de routes
     */
    _applyFilters() {
        this.filteredRoutes = this.allRoutes.filter(route => {
            // Zoekfilter
            if (this.activeFilters.search && 
                !route.naam.toLowerCase().includes(this.activeFilters.search) && 
                !route.beschrijving.toLowerCase().includes(this.activeFilters.search)) {
                return false;
            }
            
            // Sectorfilter
            if (this.activeFilters.sector && route.deelmassief !== this.activeFilters.sector) {
                return false;
            }
            
            // Gradatiefilter (op basisniveau, bijv. 6a, 6b, 6c zijn allemaal "6")
            if (this.activeFilters.grade && utils.getBaseGrade(route.gradatie) !== this.activeFilters.grade) {
                return false;
            }
            
            // Lengtefilter
            if (this.activeFilters.length) {
                const lengthCategory = utils.getLengthCategory(route.lengte);
                if (lengthCategory !== this.activeFilters.length) {
                    return false;
                }
            }
            
            return true;
        });
        
        // Roep de callback aan om de UI bij te werken
        if (this.onFilterChange) {
            this.onFilterChange(this.filteredRoutes);
        }
    }
    
    /**
     * Werkt het aantal actieve filters bij in de UI
     */
    _updateFilterCount() {
        let activeCount = 0;
        
        // Tel actieve filters
        Object.values(this.activeFilters).forEach(value => {
            if (value) activeCount++;
        });
        
        // Update tekst in UI
        this.filterCountEl.textContent = `${activeCount} filter${activeCount !== 1 ? 's' : ''} actief`;
        
        // Toon of verberg de clear knop
        this.clearFiltersBtn.style.display = activeCount > 0 ? 'block' : 'none';
    }
    
    /**
     * Reset alle filters naar hun oorspronkelijke staat
     */
    _clearAllFilters() {
        // Reset form elementen
        this.searchInput.value = '';
        this.sectorSelect.selectedIndex = 0;
        this.gradeSelect.selectedIndex = 0;
        this.lengthSelect.selectedIndex = 0;
        
        // Reset filter state
        Object.keys(this.activeFilters).forEach(key => {
            this.activeFilters[key] = '';
        });
        
        // Pas toe en update UI
        this._applyFilters();
        this._updateFilterCount();
    }
    
    /**
     * Sorteert de gefilterde routes volgens het gegeven criterium
     */
    sortRoutes(sortBy) {
        switch(sortBy) {
            case 'name':
                this.filteredRoutes.sort((a, b) => a.naam.localeCompare(b.naam));
                break;
            case 'grade-asc':
                this.filteredRoutes.sort((a, b) => utils.compareGrades(a.gradatie, b.gradatie));
                break;
            case 'grade-desc':
                this.filteredRoutes.sort((a, b) => utils.compareGrades(b.gradatie, a.gradatie));
                break;
            case 'position':
            default:
                this.filteredRoutes.sort((a, b) => a.positie - b.positie);
                break;
        }
        
        // Update UI via callback
        if (this.onFilterChange) {
            this.onFilterChange(this.filteredRoutes);
        }
    }
    
    /**
     * Geeft het huidige aantal gefilterde routes terug
     */
    getFilteredCount() {
        return this.filteredRoutes.length;
    }
}
