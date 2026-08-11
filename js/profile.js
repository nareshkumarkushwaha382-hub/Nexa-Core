/**
 * @file profile.js
 * @description Saves user profile details to Supabase Postgres.
 */

import { supabase } from '../supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const profileSubmitBtn = document.getElementById('profile-submit-btn');
    const profileScreen = document.getElementById('profile-screen');
    const homeScreen = document.getElementById('home-screen');
    const displayNameInput = document.getElementById('display-name-input');
    const bioInput = document.getElementById('bio-input');

    if (profileSubmitBtn) {
        profileSubmitBtn.addEventListener('click', async () => {
            const id = window.sessionStorage.getItem('nexa_temp_uid');
            const username = window.sessionStorage.getItem('nexa_chosen_username');
            const avatar_url = window.sessionStorage.getItem('nexa_temp_photo') || '';
            const display_name = displayNameInput ? displayNameInput.value.trim() : 'Pioneer';
            const bio = bioInput ? bioInput.value.trim() : '';

            const userProfile = { id, username, display_name, bio, avatar_url };

            try {
                const { error } = await supabase.from('profiles').upsert(userProfile);
                if (error) throw error;

                if (profileScreen) profileScreen.classList.add('hidden');
                if (homeScreen) homeScreen.classList.remove('hidden');
                window.dispatchEvent(new CustomEvent('nexa:userLoaded', { detail: userProfile }));
            } catch (err) {
                console.error('[Profile Save Error]', err.message);
                alert(`Error saving profile: ${err.message}`);
            }
        });
    }
});
