/**
 * @file auth.js
 * @description Supabase Google Authentication controller.
 */

import { supabase } from '../supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const googleSignInBtn = document.getElementById('google-signin-btn');
    const authLoading = document.getElementById('auth-loading');
    const splashScreen = document.getElementById('splash-screen');
    const authScreen = document.getElementById('auth-screen');
    const usernameScreen = document.getElementById('username-screen');
    const homeScreen = document.getElementById('home-screen');

    // Handle Google Sign In
    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', async () => {
            if (authLoading) authLoading.classList.remove('hidden');
            googleSignInBtn.style.opacity = '0.5';
            googleSignInBtn.style.pointerEvents = 'none';

            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + window.location.pathname
                }
            });

            if (error) {
                console.error('[Supabase Auth Error]', error.message);
                if (authLoading) authLoading.classList.add('hidden');
                googleSignInBtn.style.opacity = '1';
                googleSignInBtn.style.pointerEvents = 'auto';
            }
        });
    }

    // Check active session on load
    async function checkSession() {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            const user = session.user;
            if (splashScreen) splashScreen.classList.add('hidden');
            if (authScreen) authScreen.classList.add('hidden');

            // Check if user already set up a profile/username
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profile && profile.username) {
                if (homeScreen) homeScreen.classList.remove('hidden');
                window.sessionStorage.setItem('nexa_chosen_username', profile.username);
                window.dispatchEvent(new CustomEvent('nexa:userLoaded', { detail: profile }));
            } else {
                if (usernameScreen) usernameScreen.classList.remove('hidden');
                window.sessionStorage.setItem('nexa_temp_uid', user.id);
                window.sessionStorage.setItem('nexa_temp_email', user.email || '');
                window.sessionStorage.setItem('nexa_temp_photo', user.user_metadata?.avatar_url || '');
                window.sessionStorage.setItem('nexa_temp_name', user.user_metadata?.full_name || 'Pioneer');
            }
        }
    }

    checkSession();
});
