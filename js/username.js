/**
 * @file username.js
 * @description Validates and reserves unique handles in Firebase Realtime Database.
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

    let isUsernameAvailable = false;

    if (usernameInput) {
        usernameInput.addEventListener('input', async () => {
            const val = usernameInput.value.trim().toLowerCase();
            
            if (val.length < 3 || val.length > 24 || !/^[a-z0-9_]+$/.test(val)) {
                usernameFeedback.textContent = 'Use 3-24 characters (lowercase letters, numbers, underscores).';
                usernameFeedback.style.color = 'rgba(255, 255, 255, 0.5)';
                usernameSubmitBtn.disabled = true;
                isUsernameAvailable = false;
                return;
            }

            try {
                const snapshot = await get(ref(db, `handles/${val}`));
                if (snapshot.exists()) {
                    usernameFeedback.textContent = `@${val} is already taken.`;
                    usernameFeedback.style.color = '#FF453A';
                    usernameSubmitBtn.disabled = true;
                    isUsernameAvailable = false;
                } else {
                    usernameFeedback.textContent = `@${val} is available!`;
                    usernameFeedback.style.color = '#34A853';
                    usernameSubmitBtn.disabled = false;
                    isUsernameAvailable = true;
                }
            } catch (err) {
                console.error('[Firebase Error]', err);
            }
        });
    }

    if (usernameSubmitBtn) {
        usernameSubmitBtn.addEventListener('click', async () => {
            if (!isUsernameAvailable) return;

            const chosenUsername = usernameInput.value.trim().toLowerCase();
            const uid = window.sessionStorage.getItem('nexa_temp_uid');

            try {
                await set(ref(db, `handles/${chosenUsername}`), uid);
                window.sessionStorage.setItem('nexa_chosen_username', chosenUsername);

                usernameScreen.classList.add('hidden');
                profileScreen.classList.remove('hidden');

                const displayNameInput = document.getElementById('display-name-input');
                const avatarImg = document.getElementById('profile-avatar-img');
                if (displayNameInput) displayNameInput.value = window.sessionStorage.getItem('nexa_temp_name') || '';
                if (avatarImg) avatarImg.src = window.sessionStorage.getItem('nexa_temp_photo') || '';
            } catch (err) {
                console.error('[Firebase Error]', err);
            }
        });
    }
});
