/**
 * Verantwoordelijk voor het visualiseren van klimroutes in de UI
 */

class RouteRenderer {
    constructor(container) {
        this.container = container;
    }
    
    /**
     * Rendert alle routes in de container
     * @param {Array} routes - De array met route-objecten
     */
    renderRoutes(routes) {
        // Leeg eerst de container
        this.container.innerHTML = '';
        
        // Als er geen routes zijn, toon een bericht
        if (routes.length === 0) {
            this._renderNoResults();
            return;
        }
        
        // Rendert elke route
        routes.forEach(route => {
            const routeCard = this._createRouteCard(route);
            this.container.appendChild(routeCard);
        });
        
        // Update de route-teller
        this._updateRouteCounter(routes.length);
    }
    
    /**
     * Maakt een individuele route-kaart aan
     * @param {Object} route - Het route-object
     * @returns {HTMLElement} De route-kaart DOM-element
     */
    _createRouteCard(route) {
        const card = document.createElement('div');
        card.className = 'route-card';
        card.dataset.id = route.id;
        
        // Beschrijving verwerken
        const descriptionData = utils.formatDescription(route.beschrijving);
        
        // Gradatie CSS klasse
        const gradeClass = utils.getGradeClass(route.gradatie);
        
        // HTML opbouwen
        card.innerHTML = `
            <div class="route-header">
                <h3 class="route-name">${route.naam}</h3>
                <span class="route-grade ${gradeClass}">${route.gradatie}</span>
            </div>
            <div class="route-body">
                <div class="route-info">
                    <div class="route-info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${route.deelmassief}</span>
                    </div>
                    <div class="route-info-item">
                        <i class="fas fa-ruler-vertical"></i>
                        <span>${route.lengte}m</span>
                    </div>
                    <div class="route-info-item">
                        <i class="fas fa-compass"></i>
                        <span>${route.orientatie}</span>
                    </div>
                    ${route.benodigdMateriaal ? `
                    <div class="route-info-item">
                        <i class="fas fa-toolbox"></i>
                        <span>${route.benodigdMateriaal}</span>
                    </div>` : ''}
                </div>
                <div class="route-description">
                    <p class="route-description-short">${descriptionData.short}</p>
                    <p class="route-description-full">${descriptionData.full}</p>
                    ${descriptionData.short !== descriptionData.full ? 
                        `<span class="route-description-toggle">Lees meer</span>` : ''}
                </div>
            </div>
        `;
        
        // Event listener voor "Lees meer" / "Lees minder" toggle
        const toggleEl = card.querySelector('.route-description-toggle');
        if (toggleEl) {
            toggleEl.addEventListener('click', () => {
                this._toggleDescription(card, toggleEl);
            });
        }
        
        return card;
    }
    
    /**
     * Toont/verbergt de volledige beschrijving
     */
    _toggleDescription(card, toggleEl) {
        const shortDesc = card.querySelector('.route-description-short');
        const fullDesc = card.querySelector('.route-description-full');
        
        if (fullDesc.style.display === 'block') {
            // Verberg volledige beschrijving
            shortDesc.style.display = 'block';
            fullDesc.style.display = 'none';
            toggleEl.textContent = 'Lees meer';
        } else {
            // Toon volledige beschrijving
            shortDesc.style.display = 'none';
            fullDesc.style.display = 'block';
            toggleEl.textContent = 'Lees minder';
        }
    }
    
    /**
     * Toont een boodschap als er geen resultaten zijn
     */
    _renderNoResults() {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <i class="fas fa-search"></i>
            <h3>Geen routes gevonden</h3>
            <p>Probeer andere zoek- of filtercriteria.</p>
        `;
        
        this.container.appendChild(noResults);
        this._updateRouteCounter(0);
    }
    
    /**
     * Toont een laad-indicator
     */
    showLoading() {
        this.container.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                <p>Routes worden geladen...</p>
            </div>
        `;
    }
    
    /**
     * Update de route teller in de UI
     */
    _updateRouteCounter(count) {
        const counterEl = document.getElementById('route-count');
        if (counterEl) {
            counterEl.textContent = `(${count})`;
        }
    }
}
