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
    return fetch('data/routes.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
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
    // Initialiseer de route renderer
    if (!routeRenderer) {
        routeRenderer = new RouteRenderer(routesContainer);
    }
    
    // Initialiseer de filter manager
    filterManager = new FilterManager(routes, (filteredRoutes) => {
        // Deze callback wordt aangeroepen wanneer filters veranderen
        routeRenderer.renderRoutes(filteredRoutes);
    });
    
    // Render de routes voor de eerste keer
    routeRenderer.renderRoutes(routes);
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
 */
function showErrorMessage() {
    routesContainer.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Er is een fout opgetreden</h3>
            <p>De klimroutes konden niet worden geladen. Probeer het later opnieuw.</p>
        </div>
    `;
}

// Start de applicatie zodra het DOM geladen is
document.addEventListener('DOMContentLoaded', initApp);
