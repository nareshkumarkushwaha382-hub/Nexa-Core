/**
 * @file splash.js
 * @description Module 1 logic controlling the Splash Screen timing and transition handoff.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const SPLASH_DURATION_MS = 2400; // Optimal presentation duration for branding
    const splashScreen = document.getElementById('splash-screen');

    const dismissSplash = () => {
        if (!splashScreen) return;

        // Trigger CSS fade out
        splashScreen.classList.add('fade-out');

        // Completely remove from DOM tree after transition finishes to optimize layout performance
        setTimeout(() => {
            splashScreen.remove();
            console.info('[Module 1] Splash Screen completed and unmounted.');
            
            // Dispatch custom event indicating Module 1 is finished, ready for Module 2
            window.dispatchEvent(new CustomEvent('nexa:module1Complete'));
        }, 600);
    };

    // Enforce minimum brand display time while performing initial setup
    window.setTimeout(dismissSplash, SPLASH_DURATION_MS);
});
