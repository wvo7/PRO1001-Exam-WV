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

/* Product page – Map */

