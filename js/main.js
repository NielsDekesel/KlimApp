/**
 * Hoofdbestand voor de klimroute-applicatie
 * Initialiseert alle componenten en laadt de data
 */

// Globale variabelen voor de app-componenten
let routeRenderer;
let filterManager;

// DOM elementen
const routesContainer = document.getElementById('routes-container');
const sortSelect = document.getElementById('sort');

/**
 * Initialiseert de applicatie
 */
function initApp() {
    // Toon een laad-indicator
    routeRenderer = new RouteRenderer(routesContainer);
    routeRenderer.showLoading();
    
    // Laad de route-data
    loadRouteData()
        .then(routes => {
            // Initialiseer componenten met de geladen routes
            initComponents(routes);
            
            // Bind events voor sorteren
            bindSortEvents();
        })
        .catch(error => {
            console.error('Fout bij het laden van de routes:', error);
            showErrorMessage();
        });
}

/**
 * Laadt de route-data uit het JSON-bestand
 * @returns {Promise} Een promise die de routes teruggeeft
 */
function loadRouteData() {
    return fetch('./data/routes.json')  // Gebruik relatief pad
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Controleer of de data juist is gestructureerd
            if (!data || !data.klimRoutes || !Array.isArray(data.klimRoutes)) {
                throw new Error('Ongeldig data formaat in routes.json');
            }
            
            // Simuleer een kleine vertraging om de loading state te tonen
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(data.klimRoutes);
                }, 500);
            });
        });
}

/**
 * Initialiseert alle app-componenten met de geladen routes
 * @param {Array} routes - De geladen klimroutes
 */
function initComponents(routes) {
    // Controleer of er routes zijn
    if (!routes || routes.length === 0) {
        console.warn('Geen routes gevonden om weer te geven');
        showErrorMessage('Geen klimroutes gevonden in het databestand.');
        return;
    }
    
    // Initialiseer de route renderer
    if (!routeRenderer) {
        routeRenderer = new RouteRenderer(routesContainer);
    }
    
    // Toon eerst de routes voordat filterManager wordt geïnitialiseerd
    routeRenderer.renderRoutes(routes);
    
    // Initialiseer de filter manager
    filterManager = new FilterManager(routes, (filteredRoutes) => {
        // Deze callback wordt aangeroepen wanneer filters veranderen
        routeRenderer.renderRoutes(filteredRoutes);
    });
}

/**
 * Bindt events voor het sorteren van routes
 */
function bindSortEvents() {
    sortSelect.addEventListener('change', (e) => {
        if (filterManager) {
            filterManager.sortRoutes(e.target.value);
        }
    });
}

/**
 * Toont een foutmelding als de routes niet konden worden geladen
 * @param {string} message - Optioneel aangepast foutbericht
 */
function showErrorMessage(message = 'De klimroutes konden niet worden geladen. Probeer het later opnieuw.') {
    routesContainer.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Er is een fout opgetreden</h3>
            <p>${message}</p>
        </div>
    `;
}

// Start de applicatie zodra het DOM geladen is
document.addEventListener('DOMContentLoaded', initApp);
