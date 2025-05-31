/* 

   ===================
    1. SHARED CONTENT
   ===================

*/

console.log('script.js loaded successfully!');

/* Hamburger menu functionality */

const hamMenu = document.querySelector('.ham-menu');
const offScreenMenu = document.querySelector('.off-screen-menu');

/* Toggle visibility */
hamMenu.addEventListener('click', () =>{
    hamMenu.classList.toggle('active');
    offScreenMenu.classList.toggle('active');

    /* Informing screen reader that nav menu is open */
    const isExpanded = hamMenu.getAttribute('aria-expanded') === 'true';
    hamMenu.setAttribute('aria-expanded', !isExpanded);
})



/* 

   =================
    2. PRODUCT PAGE
   =================

*/

/* Google Maps integration */

const Maps_API_KEY = 'YOUR_API_HERE';   /** <-- PLACEHOLDER – ENTER YOUR OWN GOOGLE MAP API KEY HERE / */

/* Reference to DOM elements that displays the map & loading/error state */
const mapElement = document.getElementById('map');
const loadingStateElement = document.getElementById('loading-state');
const errorStateElement = document.getElementById('error-state');

function loadGoogleMapsAPI() {
    return new Promise((resolve, reject) => {
        /* Prevent redundant loading */
        if (typeof google !== 'undefined' && google.maps) {
            resolve(google.maps);
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${Maps_API_KEY}&loading=async&callback=initMapPlaceholder`;
        script.async = true; /* Load script asynchronously –  prevent blocking the parser */
        script.defer = true; /* Defer script execution til HTML parsing is complete */

        /* Resolve promise with successful loading */
        script.onload = () => {
            resolve(google.maps);
        };

        /* Reject promise if network/API key error */
        script.onerror = (e) => {
            console.error("Error loading Google Maps API:", e);
            reject(new Error("Failed to load Google Maps. Please check your API key and/or network connection."));
        };

        document.head.appendChild(script);
    });
}

/* Open Google Maps with custom style + marker */
async function initMap() {
    try {
        /* Hide loading/error indicator with successful loading */
        loadingStateElement.style.display = 'none'; 
        errorStateElement.style.display = 'none'; 

        /* Import map library  */
        const { Map } = await google.maps.importLibrary("maps");

        /* Define config + central coordinates & custom ID */
        const mapOptions = {
            center: { lat: 60.30420, lng: 10.63595 }, 
            zoom: 8,
            mapId: "YOUR_MAP_ID_HERE",  /* <-- PLACEHOLDER – ENTER YOUR MAP ID HERE */
        };

        /* Render map */
        const map = new Map(mapElement, mapOptions);

        /* Import AdvancedMarkerElement for better markers */
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker"); 

        new AdvancedMarkerElement({ 
            position: mapOptions.center,
            map: map,
            title: "Braastad Gaard",
        });

        console.log("Google Map initialized successfully!");

    } catch (error) {
        /* Catch & show specific error */
        console.error("Error during map initialization:", error);
        errorStateElement.textContent = `Error initializing map: ${error.message}`;
        errorStateElement.style.display = 'block';
        /* Hide map if errors occurs */
        mapElement.style.display = 'none';
    }
}

/* Global callback function required by Google Maps API */
window.initMapPlaceholder = () => {
    initMap();
};

/* IIFE to initiate the map loading */
(async () => {
    loadingStateElement.style.display = 'block'; 

    try {
        await loadGoogleMapsAPI();
    } catch (error) {
        /* Handle errors if the API script doesn't load  */
        console.error("Critical error before map initialization:", error);
        loadingStateElement.style.display = 'none'; 
        errorStateElement.textContent = `Critical error: ${error.message}`;
        errorStateElement.style.display = 'block';
        /* Hide map if the API doesn't load */
        mapElement.style.display = 'none'; 
    }
})();


/* 

   ============
    3. CHATBOT
   ============

*/

/* Makes sure DOM is loaded before execution */
document.addEventListener('DOMContentLoaded', () => {
    /* Reference to DOM elements */
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessage');
    const statusMessage = document.getElementById('statusMessage');

    const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';   /* <-- PLACEHOLDER – ENTER YOUR OWN OPENAI API KEY HERE */

    const API_URL = 'YOUR_OPENAI_API_ENDPOINT';     /* <-- PLACEHOLDER – E.g., 'https://api.openai.com/v1/chat/completions' */
    const MODEL_NAME = 'YOUR_GPT_MODEL';   /* <-- PLACEHOLDER – E.g., 'gpt-3.5-turbo', 'gpt-4o', 'gpt-4-turbo', etc. */

    /* Stores conversation */
    let conversationHistory = [];

    /* Displays the messages */
    function displayMessage(message, sender) {
        if (sender === 'user') {
            const messageElement = document.createElement('div');
            /* Apply CSS styling */
            messageElement.classList.add('message', 'user-message');
            messageElement.textContent = message;
            chatMessages.appendChild(messageElement);
        } else if (sender === 'bot') {
            const messageWrapper = document.createElement('div');
            messageWrapper.classList.add('bot-message-wrapper');

            const logoText = document.createElement('span');
            logoText.classList.add('bot-logo-text');
            logoText.textContent = 'FRAM'; 

            const messageBubble = document.createElement('div');
            messageBubble.classList.add('message', 'bot-message-bubble');
            messageBubble.textContent = message;

            messageWrapper.appendChild(logoText);
            messageWrapper.appendChild(messageBubble);
            chatMessages.appendChild(messageWrapper);
        }
        
        /* Makes sure DOM has rendered the message before attempting to scroll – for smoother auto-scroll */
        requestAnimationFrame(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
    }

    /* Temporary status message */
    function showStatus(message, isError = false) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${isError ? 'error-message' : ''}`;
        setTimeout(() => {
            statusMessage.textContent = '';
            statusMessage.className = 'status-message';
        }, 3000);
    }

    /* Sends message to OpenAI API – manages UI state & process bot answer */
    async function sendMessageToOpenAI(userMessage) {
        displayMessage(userMessage, 'user');
        conversationHistory.push({ role: 'user', content: userMessage });
        messageInput.value = '';
        messageInput.disabled = true;
        sendMessageBtn.disabled = true;
        showStatus('...');

        try {
            /* Make API call to the chat completions endpoint */
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: MODEL_NAME,
                    messages: conversationHistory,
                    max_tokens: 150,
                    temperature: 0.7
                })
            });

            /* Check if API response indicate an error */
            if (!response.ok) {
                const errorData = await response.json();
                console.error('OpenAI API Error:', errorData);
                let errorMessage = 'An unexpected error occurred.';

                /* Provide specific error message */
                if (response.status === 401) {
                    errorMessage = 'Failed to connect. Wait and try again later.';
                } else if (response.status >= 500) {
                    errorMessage = 'Server error. Please try again later.';
                } else if (errorData && errorData.error && errorData.error.message) {
                    errorMessage = `API Error: ${errorData.error.message}`;
                }
                throw new Error(errorMessage);
            }

            /* Parse JSON response from API */
            const data = await response.json();
            /* Gets bot's answer content */
            const botMessage = data.choices[0].message.content.trim();
            displayMessage(botMessage, 'bot');
            conversationHistory.push({ role: 'assistant', content: botMessage });
            showStatus('Response received.');

        } catch (error) {
            /* Catch & handle errors */
            console.error('Fetch error:', error);
            displayMessage(`${error.message}`, 'bot');
            showStatus(`${error.message}`, true);
        } finally {
            /* Reenable input field & send button – UI is ready for next user interaction */
            messageInput.disabled = false;
            sendMessageBtn.disabled = false;
            messageInput.focus();
        }
    }

    /* Event listener for send button click – prevents empty message */
    sendMessageBtn.addEventListener('click', () => {
        const userMessage = messageInput.value.trim();
        if (userMessage) {
            sendMessageToOpenAI(userMessage);
        }
    });

    /* Even listener for keyboard input  – allows sending chat by pressing Enter (- Shift) */
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            /* Prevent the default newline behavious of Enter in textarea */
            e.preventDefault();
            const userMessage = messageInput.value.trim();
            if (userMessage) {
                sendMessageToOpenAI(userMessage);
            }
        }
    });

    /* Initial greeting */
    displayMessage('What can I help you with today?', 'bot');
});