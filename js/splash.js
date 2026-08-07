/**
 * @file splash.js
 * @description Splash screen timing control.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const splashScreen = document.getElementById('splash-screen');
    const welcomeScreen = document.getElementById('welcome-screen');

    setTimeout(() => {
        if (splashScreen) splashScreen.classList.add('hidden');
        if (welcomeScreen) welcomeScreen.classList.remove('hidden');
    }, 1500);
});
