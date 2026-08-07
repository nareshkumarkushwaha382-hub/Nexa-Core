/**
 * @file welcome.js
 * @description Welcome screen action handler.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const getStartedBtn = document.getElementById('get-started-btn');
    const welcomeScreen = document.getElementById('welcome-screen');
    const authScreen = document.getElementById('auth-screen');

    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            getStartedBtn.blur();
            if (welcomeScreen) welcomeScreen.classList.add('hidden');
            if (authScreen) authScreen.classList.remove('hidden');
        });
    }
});
