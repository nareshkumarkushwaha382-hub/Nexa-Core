/**
 * @file splash.js
 * @description Splash screen transition controller.
 */

(function () {
    'use strict';

    function hideSplash() {
        const splashScreen = document.getElementById('splash-screen');
        const welcomeScreen = document.getElementById('welcome-screen');

        if (splashScreen) {
            splashScreen.classList.add('hidden');
        }

        if (welcomeScreen) {
            welcomeScreen.classList.remove('hidden');
            welcomeScreen.classList.add('active');
        }

        console.info('[Nexa] Splash → Welcome transition complete.');
    }

    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(hideSplash, 1200);
    });
})();
