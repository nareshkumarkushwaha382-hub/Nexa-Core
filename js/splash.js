/**
 * @file splash.js
 * @description Immediate execution splash screen controller.
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
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hideSplash);
    } else {
        setTimeout(hideSplash, 1200); // Triggers even if DOM is already loaded
    }
})();
