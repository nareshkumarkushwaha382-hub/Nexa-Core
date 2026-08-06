/**
 * @file splash.js
 * @description Handles splash screen display timing and transition to Welcome screen.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const splashScreen = document.getElementById('splash-screen');
    const welcomeScreen = document.getElementById('welcome-screen');

    setTimeout(() => {
        if (splashScreen) {
            splashScreen.classList.add('hidden');
        }
        if (welcomeScreen) {
            welcomeScreen.classList.remove('hidden');
        }
    }, 2000); // Transitions after 2 seconds
});
