/**
 * @file settings.js
 * @description Handles session termination and sign out.
 */

import { auth } from '../firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const logoutBtn = document.getElementById('logout-btn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                window.sessionStorage.clear();
                location.reload();
            } catch (err) {
                console.error('[SignOut Error]', err);
            }
        });
    }
});
