/**
 * @file username.js
 * @description Unique handle validation via Supabase database.
 */

import { supabase } from '/Nexa-Core/supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const usernameInput = document.getElementById('username-input');
    const usernameSubmitBtn = document.getElementById('username-submit-btn');
    const usernameFeedback = document.getElementById('username-feedback');
    const usernameScreen = document.getElementById('username-screen');
    const profileScreen = document.getElementById('profile-screen');

    let isAvailable = false;

    if (usernameInput) {
        usernameInput.addEventListener('input', async () => {
            const val = usernameInput.value.trim().toLowerCase();
            if (val.length < 3 || val.length > 24 || !/^[a-z0-9_]+$/.test(val)) {
                if (usernameFeedback) {
                    usernameFeedback.textContent = 'Use 3-24 lowercase letters, numbers, underscores.';
                    usernameFeedback.style.color = 'rgba(255, 255, 255, 0.5)';
                }
                if (usernameSubmitBtn) usernameSubmitBtn.disabled = true;
                isAvailable = false;
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('username', val)
                    .maybeSingle();

                if (data) {
                    if (usernameFeedback) {
                        usernameFeedback.textContent = `@${val} is already taken.`;
                        usernameFeedback.style.color = '#FF453A';
                    }
                    if (usernameSubmitBtn) usernameSubmitBtn.disabled = true;
                    isAvailable = false;
                } else {
                    if (usernameFeedback) {
                        usernameFeedback.textContent = `@${val} is available!`;
                        usernameFeedback.style.color = '#34A853';
                    }
                    if (usernameSubmitBtn) usernameSubmitBtn.disabled = false;
                    isAvailable = true;
                }
            } catch (err) {
                console.error('[Handle Check Error]', err);
            }
        });
    }

    if (usernameSubmitBtn) {
        usernameSubmitBtn.addEventListener('click', () => {
            if (!isAvailable) return;
            const chosenUsername = usernameInput.value.trim().toLowerCase();
            window.sessionStorage.setItem('nexa_chosen_username', chosenUsername);
            
            if (usernameScreen) usernameScreen.classList.add('hidden');
            if (profileScreen) profileScreen.classList.remove('hidden');

            const displayNameInput = document.getElementById('display-name-input');
            const avatarImg = document.getElementById('profile-avatar-img');
            if (displayNameInput) displayNameInput.value = window.sessionStorage.getItem('nexa_temp_name') || '';
            if (avatarImg) avatarImg.src = window.sessionStorage.getItem('nexa_temp_photo') || '';
        });
    }
});
