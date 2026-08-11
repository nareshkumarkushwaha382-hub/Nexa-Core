/**
 * @file profile.js
 * @description Saves user profile details to Supabase Postgres.
 */

import { supabase } from '../supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const profileSubmitBtn =
        document.getElementById('profile-submit-btn');

    const displayNameInput =
        document.getElementById('display-name-input');

    const bioInput =
        document.getElementById('bio-input');

    if (!profileSubmitBtn) {
        console.error('[Nexa Profile] Submit button not found.');
        return;
    }

    profileSubmitBtn.addEventListener('click', async () => {

        const id =
            window.sessionStorage.getItem('nexa_temp_uid');

        const username =
            window.sessionStorage.getItem('nexa_chosen_username');

        const avatar_url =
            window.sessionStorage.getItem('nexa_temp_photo') || '';

        const display_name =
            displayNameInput?.value.trim() || 'Pioneer';

        const bio =
            bioInput?.value.trim() || '';

        if (!id || !username) {
            console.error(
                '[Nexa Profile] Missing user ID or username.'
            );

            alert('Your session information is missing. Please sign in again.');
            return;
        }

        profileSubmitBtn.disabled = true;
        profileSubmitBtn.textContent = 'Creating profile...';

        const userProfile = {
            id,
            username,
            display_name,
            bio,
            avatar_url
        };

        try {
            const { data, error } = await supabase
                .from('profiles')
                .upsert(userProfile)
                .select()
                .single();

            if (error) {
                throw error;
            }

            console.info(
                '[Nexa Profile] Profile created successfully.'
            );

            const savedProfile = data || userProfile;

            // Store the permanent username.
            window.sessionStorage.setItem(
                'nexa_chosen_username',
                savedProfile.username
            );

            // Tell the rest of Nexa that the profile now exists.
            window.dispatchEvent(
                new CustomEvent('nexa:userLoaded', {
                    detail: savedProfile
                })
            );

            // Temporary Google data is no longer needed.
            window.sessionStorage.removeItem('nexa_temp_uid');
            window.sessionStorage.removeItem('nexa_temp_email');
            window.sessionStorage.removeItem('nexa_temp_photo');
            window.sessionStorage.removeItem('nexa_temp_name');

            // Centralized navigation.
            if (
                window.nexaRouter &&
                typeof window.nexaRouter.showScreen === 'function'
            ) {
                window.nexaRouter.showScreen('home');
            } else {
                console.error(
                    '[Nexa Profile] Router unavailable.'
                );
            }

        } catch (err) {

            console.error(
                '[Nexa Profile Save Error]',
                err
            );

            alert(
                `Error saving profile: ${err.message}`
            );

            profileSubmitBtn.disabled = false;
            profileSubmitBtn.textContent = 'Enter Nexa Home';
        }
    });
});
