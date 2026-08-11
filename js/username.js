/**
 * @file username.js
 * @description Unique username validation and profile navigation.
 */

import { supabase } from '../supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const usernameInput = document.getElementById('username-input');
    const usernameSubmitBtn = document.getElementById('username-submit-btn');
    const usernameFeedback = document.getElementById('username-feedback');

    let isAvailable = false;
    let checkingUsername = false;

    if (!usernameInput || !usernameSubmitBtn) {
        console.error('[Nexa Username] Required elements not found.');
        return;
    }

    usernameInput.addEventListener('input', async () => {
        const val = usernameInput.value.trim().toLowerCase();

        isAvailable = false;
        usernameSubmitBtn.disabled = true;

        if (
            val.length < 3 ||
            val.length > 24 ||
            !/^[a-z0-9_]+$/.test(val)
        ) {
            if (usernameFeedback) {
                usernameFeedback.textContent =
                    'Use 3-24 lowercase letters, numbers, underscores.';
                usernameFeedback.style.color =
                    'rgba(255, 255, 255, 0.5)';
            }
            return;
        }

        if (checkingUsername) return;

        checkingUsername = true;

        if (usernameFeedback) {
            usernameFeedback.textContent = 'Checking availability...';
            usernameFeedback.style.color =
                'rgba(255, 255, 255, 0.5)';
        }

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('username')
                .eq('username', val)
                .maybeSingle();

            if (error) {
                throw error;
            }

            if (data) {
                if (usernameFeedback) {
                    usernameFeedback.textContent =
                        `@${val} is already taken.`;
                    usernameFeedback.style.color = '#FF453A';
                }

                isAvailable = false;
                usernameSubmitBtn.disabled = true;
            } else {
                if (usernameFeedback) {
                    usernameFeedback.textContent =
                        `@${val} is available!`;
                    usernameFeedback.style.color = '#34A853';
                }

                isAvailable = true;
                usernameSubmitBtn.disabled = false;
            }

        } catch (err) {
            console.error('[Nexa Username Check Error]', err);

            if (usernameFeedback) {
                usernameFeedback.textContent =
                    'Unable to check username. Try again.';
                usernameFeedback.style.color = '#FF453A';
            }

            isAvailable = false;
            usernameSubmitBtn.disabled = true;

        } finally {
            checkingUsername = false;
        }
    });

    usernameSubmitBtn.addEventListener('click', () => {
        if (!isAvailable) return;

        const chosenUsername =
            usernameInput.value.trim().toLowerCase();

        window.sessionStorage.setItem(
            'nexa_chosen_username',
            chosenUsername
        );

        console.info(
            `[Nexa Username] Username selected: @${chosenUsername}`
        );

        /*
         * Centralized navigation.
         * app.js owns screen transitions.
         */
        if (
            window.nexaRouter &&
            typeof window.nexaRouter.showScreen === 'function'
        ) {
            window.nexaRouter.showScreen('profile');
        } else {
            console.error(
                '[Nexa Username] Router unavailable.'
            );
        }

        // Pre-fill profile information from Google.
        const displayNameInput =
            document.getElementById('display-name-input');

        const avatarImg =
            document.getElementById('profile-avatar-img');

        if (displayNameInput) {
            displayNameInput.value =
                window.sessionStorage.getItem('nexa_temp_name') || '';
        }

        if (avatarImg) {
            const photo =
                window.sessionStorage.getItem('nexa_temp_photo');

            if (photo) {
                avatarImg.src = photo;
            }
        }
    });
});
