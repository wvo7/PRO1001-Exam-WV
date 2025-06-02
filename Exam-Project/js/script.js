/*
    === script.js ===
    This file contains the main JavaScript logic for interactive elements
    across various pages, including the navigation, hamburger menu,
    Google Maps integration, and the OpenAI-powered chatbot functionality.
    Note: This is the original script. A minified version will be linked
    in all the HTML files.
*/


/* 

   =====================================
    1. SHARED & UNIVERSAL FUNCTIONALITY
   =====================================

*/

/* Makes sure HTML document is fully loaded before JavaScript interact with DOM */
document.addEventListener('DOMContentLoaded', () => {
    console.log('script.js loaded successfully!');

    /* Hamburger menu functionality */
    const hamMenu = document.querySelector('.ham-menu');
    const offScreenMenu = document.querySelector('.off-screen-menu');
    /* Get main content area - if it's not found use 'main' tag as fallback */
    const mainContent = document.getElementById('MainContent') || document.querySelector('main');
    const focusableElements = offScreenMenu.querySelectorAll('a, button');

    /* Function to open menu */
    const openMenu = () => {
        offScreenMenu.classList.add('active');
        hamMenu.classList.add('active');
        hamMenu.setAttribute('aria-expanded', 'true');
        /* Check if mainContent exists before setting aria-hidden */
        if (mainContent) {
            mainContent.setAttribute('aria-hidden', 'true');
        }
        /* Focus the first focusable element in the menu - better accessibility */
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    };

    /* Function to close the menu */
    const closeMenu = () => {
        offScreenMenu.classList.remove('active');
        hamMenu.classList.remove('active');
        hamMenu.setAttribute('aria-expanded', 'false');
        if (mainContent) {
            mainContent.setAttribute('aria-hidden', 'false');
        }
        /* Return focus to hamburger button */
        hamMenu.focus(); 
    };

    /* Toggles active class for visual & functional state changes */
    hamMenu.addEventListener('click', () => {
        const isExpanded = hamMenu.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
            closeMenu();
        } else {
            openMenu();
        }
    })

    /* Close menu when clicking outside of it (on main content) */
    if (mainContent) {
        mainContent.addEventListener('click', () => {
            if (offScreenMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    /* Keyboard accessibility for menu - closing with Escape & Tab trapping */
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && offScreenMenu.classList.contains('active')) {
            closeMenu();
        }

        if (event.key === 'Tab' && offScreenMenu.classList.contains('active')) {
            const currentActiveElement = document.activeElement;
            const firstFocusableElement = focusableElements[0];
            const lastFocusableElement = focusableElements[focusableElements.length - 1];

            /* Prevent default tab behaviour */
            if (event.shiftKey) { 
                if (currentActiveElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    event.preventDefault(); 
                }
            } else { 
                if (currentActiveElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    event.preventDefault(); 
                }
            }
        }
    });


    /* 

       =================
        2. PRODUCT PAGE
       =================

    */

    /* Google Maps integration */

    /* Only run code if the map element is on the page */
    if (document.getElementById('map')) {
        const Maps_API_KEY = 'YOUR_API_HERE';   /** <-- PLACEHOLDER - ENTER YOUR OWN GOOGLE MAP API KEY HERE / */

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
                script.async = true; /* Load script asynchronously -  prevent blocking the parser */
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

                const { Map } = await google.maps.importLibrary("maps");

                /* Define config + central coordinates & custom ID */
                const mapOptions = {
                    center: { lat: 60.30420, lng: 10.63595 }, 
                    zoom: 8,
                    mapId: "YOUR_MAP_ID_HERE",  /* <-- PLACEHOLDER - ENTER YOUR MAP ID HERE */
                };

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
    }


    /* 

       ============
        3. CHATBOT
       ============

    */

    /* Only run code if the chatMessages element is on the page */
    if (document.getElementById('chatMessages')) {
        /* Reference to DOM elements */
        const chatMessages = document.getElementById('chatMessages');
        const messageInput = document.getElementById('messageInput');
        const sendMessageBtn = document.getElementById('sendMessage');
        const statusMessage = document.getElementById('statusMessage');

        const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';   /* <-- PLACEHOLDER - ENTER YOUR OWN OPENAI API KEY HERE */

        const API_URL = 'YOUR_OPENAI_API_ENDPOINT';     /* <-- PLACEHOLDER - E.g., 'https://api.openai.com/v1/chat/completions' */
        const MODEL_NAME = 'YOUR_GPT_MODEL';   /* <-- PLACEHOLDER - E.g., 'gpt-3.5-turbo', 'gpt-4o', 'gpt-4-turbo', etc. */

        /* 'Fram' (fictional) company knowledge base, providing the bot with context to answer customer questions accurately 
        + politely state that it cannot answer if customers ask questions outside the bot's scope */
        const companyKnowledge = `
        You are a helpful and friendly customer service chatbot named FRAM for Fram.
        Fram is a fictional circular service based in Norway that specializes in high-quality, ethically sourced, organic produce.

        Our Products:
        - Oats: Hearty and wholesome, our organic oats are perfect for a nourishing breakfast or baking. Price: 16 kr/kg.
        - Red Onions: Our vibrant organic red onions offer a crisp texture and a sweet, pungent flavor ideal for any dish. Price: 45 kr/kg.
        - Garlic: Potent and aromatic, our organic garlic bulbs are essential for adding depth to your cooking. Price: 38 kr/kg.
        - Potatoes: Versatile and nutritious, our organic potatoes are sustainably grown and perfect for roasting, mashing, or baking. Price: 32 kr/kg.
        - Carrots: Sweet and crunchy, our organic carrots are packed with flavor and make a healthy addition to any meal. Price: 48 kr/kg.
        - New produce is added continuously as time goes by and the seasons change. Customers can stay updated by signing up for our newsletter.

        Ordering and Shipping:
        - We currently only deliver in Norway.
        - Shipping is free!
        - Orders are typically processed within 1-2 business days and delivered within 3-7 business days depending on destination.
        - Customers can keep the containers that the produce is stored in. If they later want a refill, they can scan the QR code on the container to instantly add the items back to their cart. When we deliver a new order, the customer can leave their empty containers outside, and we will pick them up, clean them thoroughly, and reuse them for further deliveries.

        Return Policy:
        - We offer a 30-day return policy for unopened and unused products, starting from the date of delivery.
        - A valid proof of purchase (receipt or order number) is required for all returns.
        - Customers are responsible for return shipping costs unless the product is defective or incorrect.
        - To initiate a return, please contact our customer service.

        Customer Service Contact:
        - Email: info@framsorganic.com
        - Phone: +47 123 45 678 (fictional)

        Always prioritize providing information based ONLY on the details provided here. If a question is outside this scope, politely state that you cannot answer.
        `;

        /* Stores conversation history for API context */
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
            
            /* Makes sure DOM has rendered the message before attempting to scroll - for smoother auto-scroll */
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

        /* Sends message to OpenAI API - manages UI state & process bot answer */
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
                        messages: [
                            /* Lets the chatbot know its role & spreading conversation history after system message
                             to make sure the API calls both the foundational knowledge & ongoing chat history */
                            { role: 'system', content: companyKnowledge },
                            ...conversationHistory
                        ],
                        max_tokens: 350,
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
                        errorMessage = 'Authentication failed. Please check your API key.';
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
                /* Reenable input field & send button - UI is ready for next user interaction */
                messageInput.disabled = false;
                sendMessageBtn.disabled = false;
                messageInput.focus();
            }
        }

        /* Event listener for send button click - prevents empty message */
        sendMessageBtn.addEventListener('click', () => {
            const userMessage = messageInput.value.trim();
            if (userMessage) {
                sendMessageToOpenAI(userMessage);
            }
        });

        /* Even listener for keyboard input  - allows sending chat by pressing Enter (- Shift) */
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
    }
});