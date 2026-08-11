/**
 * @file username.js
 * @description Unique handle validation and database check.
 */

import { supabase } from '../supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    const usernameInput = document.getElementById('username-input');
    const submitBtn = document.getElementById('username-submit-btn');
    const feedback = document.getElementById('username-feedback');

    let isAvailable = false;

    if (usernameInput) {
        usernameInput.addEventListener('input', async (e) => {
            const val = e.target.value.toLowerCase().trim();
            const regex = /^[a-z0-9_]{3,24}$/;

            if (!regex.test(val)) {
                feedback.textContent = 'Use 3-24 lowercase letters, numbers, underscores.';
                feedback.style.color = '#ff4d4d';
                submitBtn.disabled = true;
                isAvailable = false;
                return;
            }

            const { data, error } = await supabase
                .from('profiles')
                .select('username')
                .eq('username', val)
                .maybeSingle();

            if (error) {
                console.error('[Username Check Error]', error);
                return;
            }

            if (data) {
                feedback.textContent = 'Username is already taken.';
                feedback.style.color = '#ff4d4d';
                submitBtn.disabled = true;
                isAvailable = false;
            } else {
                feedback.textContent = 'Username is available!';
                feedback.style.color = '#00C853';
                submitBtn.disabled = false;
                isAvailable = true;
            }
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            if (!isAvailable) return;
            const chosen = usernameInput.value.toLowerCase().trim();
            window.sessionStorage.setItem('nexa_chosen_username', chosen);
            window.nexaRouter.showScreen('profile');
        });
    }
});
