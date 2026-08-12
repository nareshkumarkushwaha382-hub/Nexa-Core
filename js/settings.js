/**
 * @file settings.js
 * @description Sign out and settings actions.
 */

import { supabase } from '../supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const logoutBtn = document.getElementById('logout-btn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await supabase.auth.signOut();
            window.sessionStorage.clear();

            if (window.nexaRouter) {
                window.nexaRouter.showScreen('auth');
            }
        });
    }
});
