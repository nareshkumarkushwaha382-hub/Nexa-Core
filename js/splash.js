/**
 * @file splash.js
 * @description Handles splash screen timing control and transition to Welcome screen.
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
    }, 1500); // 1.5 seconds delay before transitioning
});
