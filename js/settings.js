/**
 * @file settings.js
 * @description Supabase sign out controller.
 */

import { supabase } from '/Nexa-Core/supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const logoutBtn = document.getElementById('logout-btn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await supabase.auth.signOut();
                window.sessionStorage.clear();
                location.reload();
            } catch (err) {
                console.error('[SignOut Error]', err);
            }
        });
    }
});
