/**
 * @file welcome.js
 * @description Welcome screen action handler.
 */

(function () {
    'use strict';

    function initWelcome() {
        const getStartedBtn = document.getElementById('get-started-btn');
        const welcomeScreen = document.getElementById('welcome-screen');
        const authScreen = document.getElementById('auth-screen');

        if (!getStartedBtn) {
            console.error('[Nexa] Get Started button not found.');
            return;
        }

        getStartedBtn.addEventListener('click', () => {
            getStartedBtn.blur();

            if (welcomeScreen) {
                welcomeScreen.classList.remove('active');
                welcomeScreen.classList.add('hidden');
            }

            if (authScreen) {
                authScreen.classList.remove('hidden');
                authScreen.classList.add('active');
            }

            console.info('[Nexa] Welcome → Authentication transition complete.');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWelcome);
    } else {
        initWelcome();
    }
})();
