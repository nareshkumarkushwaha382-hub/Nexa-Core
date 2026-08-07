/**
 * @file profile.js
 * @description Profile creation controller.
 */

import { db } from '../firebase-config.js';
import { ref, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const profileSubmitBtn = document.getElementById('profile-submit-btn');
    const profileScreen = document.getElementById('profile-screen');
    const homeScreen = document.getElementById('home-screen');
    const displayNameInput = document.getElementById('display-name-input');
    const bioInput = document.getElementById('bio-input');

    if (profileSubmitBtn) {
        profileSubmitBtn.addEventListener('click', async () => {
            const uid = window.sessionStorage.getItem('nexa_temp_uid');
            const username = window.sessionStorage.getItem('nexa_chosen_username');
            const email = window.sessionStorage.getItem('nexa_temp_email') || '';
            const avatar = window.sessionStorage.getItem('nexa_temp_photo') || '';
            const displayName = displayNameInput ? displayNameInput.value.trim() : 'Pioneer';
            const bio = bioInput ? bioInput.value.trim() : '';

            const userProfile = { uid, username, email, avatar, displayName, bio, createdAt: Date.now() };

            try {
                await set(ref(db, `users/${uid}`), userProfile);
                if (profileScreen) profileScreen.classList.add('hidden');
                if (homeScreen) homeScreen.classList.remove('hidden');
                window.dispatchEvent(new CustomEvent('nexa:userLoaded', { detail: userProfile }));
            } catch (err) {
                console.error('[Profile Save Error]', err);
            }
        });
    }
});
