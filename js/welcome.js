/**
 * @file welcome.js
 * @description Transitions user from Welcome to Authentication screen and handles focus safely.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const getStartedBtn = document.getElementById('get-started-btn');
    const welcomeScreen = document.getElementById('welcome-screen');
    const authScreen = document.getElementById('auth-screen');

    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            // 1. Remove focus from the button to clear accessibility warnings
            getStartedBtn.blur();

            // 2. Hide welcome screen and update accessibility attributes
            if (welcomeScreen) {
                welcomeScreen.classList.add('hidden');
                welcomeScreen.setAttribute('aria-hidden', 'true');
            }

            // 3. Reveal auth screen and update accessibility attributes
            if (authScreen) {
                authScreen.classList.remove('hidden');
                authScreen.removeAttribute('aria-hidden');
            }
        });
    }
});
