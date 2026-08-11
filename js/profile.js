/**
 * @file profile.js
 * @description Profile creation and database persistence.
 */

import { supabase } from '../supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    const avatarImg = document.getElementById('profile-avatar-img');
    const nameInput = document.getElementById('display-name-input');
    const bioInput = document.getElementById('bio-input');
    const submitBtn = document.getElementById('profile-submit-btn');

    const tempName = window.sessionStorage.getItem('nexa_temp_name') || '';
    const tempPhoto = window.sessionStorage.getItem('nexa_temp_photo') || '';

    if (nameInput) nameInput.value = tempName;
    if (avatarImg && tempPhoto) avatarImg.src = tempPhoto;

    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            const uid = window.sessionStorage.getItem('nexa_temp_uid');
            const username = window.sessionStorage.getItem('nexa_chosen_username');
            const displayName = nameInput ? nameInput.value.trim() : tempName;
            const bio = bioInput ? bioInput.value.trim() : '';

            if (!uid || !username) return;

            try {
                const { error } = await supabase.from('profiles').upsert({
                    id: uid,
                    username: username,
                    display_name: displayName,
                    bio: bio,
                    avatar_url: tempPhoto,
                    updated_at: new Date()
                });

                if (error) throw error;

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', uid)
                    .single();

                window.dispatchEvent(new CustomEvent('nexa:userLoaded', { detail: profile }));
                window.nexaRouter.showScreen('home');
            } catch (err) {
                console.error('[Profile Save Error]', err.message);
            }
        });
    }
});

