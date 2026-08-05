/**
 * @file welcome.js
 * @description Module 2 controller managing the Welcome Screen interactions and handoff to Authentication.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const welcomeScreen = document.getElementById('welcome-screen');
    const getStartedBtn = document.getElementById('get-started-btn');

    // Listen for Module 1 completion event dispatched by splash.js
    window.addEventListener('nexa:module1Complete', () => {
        if (!welcomeScreen) return;

        // Unhide and trigger entrance transition
        welcomeScreen.classList.remove('hidden');
        
        // Force reflow for hardware acceleration handoff
        void welcomeScreen.offsetWidth;
        
        welcomeScreen.classList.add('active');
        welcomeScreen.setAttribute('aria-hidden', 'false');
        
        console.info('[Module 2] Welcome Screen successfully loaded and mounted.');
    });

    // Handle "Get Started" action button click
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            console.info('[Module 2] Get Started clicked. Initiating transition to Module 3 (Authentication)...');
            
            // Fade out welcome screen
            welcomeScreen.classList.remove('active');
            welcomeScreen.setAttribute('aria-hidden', 'true');

            setTimeout(() => {
                welcomeScreen.remove();
                
                // Dispatch custom event indicating Module 2 is finished, ready for Module 3
                window.dispatchEvent(new CustomEvent('nexa:module2Complete'));
            }, 600);
        });
    }
});
