/* 

   ===================
    1. SHARED CONTENT
   ===================

*/

console.log('script.js loaded successfully!');

/* Hamburger menu */

const hamMenu = document.querySelector('.ham-menu');
const offScreenMenu = document.querySelector('.off-screen-menu');

hamMenu.addEventListener('click', () =>{
    hamMenu.classList.toggle('active');
    offScreenMenu.classList.toggle('active');

    const isExpanded = hamMenu.getAttribute('aria-expanded') === 'true';
    hamMenu.setAttribute('aria-expanded', !isExpanded);
})


/* 

   =================
    2. PRODUCT PAGE
   =================

*/

/* Map */

const Maps_API_KEY = 'YOUR_API_HERE';   /** <-- PLACEHOLDER – ENTER YOUR OWN GOOGLE MAP API KEY HERE / */

const mapElement = document.getElementById('map');
const loadingStateElement = document.getElementById('loading-state');
const errorStateElement = document.getElementById('error-state');

function loadGoogleMapsAPI() {
    return new Promise((resolve, reject) => {
        if (typeof google !== 'undefined' && google.maps) {
            resolve(google.maps);
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${Maps_API_KEY}&loading=async&callback=initMapPlaceholder`;
        script.async = true;
        script.defer = true; 

        script.onload = () => {
            resolve(google.maps);
        };

        script.onerror = (e) => {
            console.error("Error loading Google Maps API:", e);
            reject(new Error("Failed to load Google Maps. Please check your API key and/or network connection."));
        };

        document.head.appendChild(script);
    });
}

async function initMap() {
    try {
        loadingStateElement.style.display = 'none'; 
        errorStateElement.style.display = 'none'; 

        const { Map } = await google.maps.importLibrary("maps");

        const mapOptions = {
            center: { lat: 60.30420, lng: 10.63595 }, 
            zoom: 8,
            mapId: "YOUR_MAP_ID_HERE",  /* <-- PLACEHOLDER – ENTER YOUR MAP ID HERE */
        };

        const map = new Map(mapElement, mapOptions);

        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker"); 

        new AdvancedMarkerElement({ 
            position: mapOptions.center,
            map: map,
            title: "Braastad Gaard",
        });

        console.log("Google Map initialized successfully!");

    } catch (error) {
        console.error("Error during map initialization:", error);
        errorStateElement.textContent = `Error initializing map: ${error.message}`;
        errorStateElement.style.display = 'block';
        mapElement.style.display = 'none';
    }
}

window.initMapPlaceholder = () => {
    initMap();
};

(async () => {
    loadingStateElement.style.display = 'block'; 

    try {
        await loadGoogleMapsAPI();
    } catch (error) {
        console.error("Critical error before map initialization:", error);
        loadingStateElement.style.display = 'none'; 
        errorStateElement.textContent = `Critical error: ${error.message}`;
        errorStateElement.style.display = 'block';
        mapElement.style.display = 'none'; 
    }
})();