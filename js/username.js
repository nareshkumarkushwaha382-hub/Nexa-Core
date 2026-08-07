/**
 * @file username.js
 * @description Unique handle reservation controller.
 */

import { db } from '../firebase-config.js';
import { ref, get, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

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
                const snapshot = await get(ref(db, `handles/${val}`));
                if (snapshot.exists()) {
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
        usernameSubmitBtn.addEventListener('click', async () => {
            if (!isAvailable) return;
            const chosenUsername = usernameInput.value.trim().toLowerCase();
            const uid = window.sessionStorage.getItem('nexa_temp_uid');

            try {
                await set(ref(db, `handles/${chosenUsername}`), uid);
                window.sessionStorage.setItem('nexa_chosen_username', chosenUsername);
                if (usernameScreen) usernameScreen.classList.add('hidden');
                if (profileScreen) profileScreen.classList.remove('hidden');

                const displayNameInput = document.getElementById('display-name-input');
                const avatarImg = document.getElementById('profile-avatar-img');
                if (displayNameInput) displayNameInput.value = window.sessionStorage.getItem('nexa_temp_name') || '';
                if (avatarImg) avatarImg.src = window.sessionStorage.getItem('nexa_temp_photo') || '';
            } catch (err) {
                console.error('[Handle Save Error]', err);
            }
        });
    }
});
