/**
 * @file welcome.js
 * @description Safe screen transition from Welcome to Auth.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const getStartedBtn = document.getElementById('get-started-btn');
    const welcomeScreen = document.getElementById('welcome-screen');
    const authScreen = document.getElementById('auth-screen');

    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            getStartedBtn.blur(); // Remove focus to clear accessibility warnings

            if (welcomeScreen) {
                welcomeScreen.classList.add('hidden');
                welcomeScreen.setAttribute('aria-hidden', 'true');
            }

            if (authScreen) {
                authScreen.classList.remove('hidden');
                authScreen.removeAttribute('aria-hidden');
            }
        });
    }
});
