/**
 * @file auth.js
 * @description Google OAuth authentication controller.
 */

import { supabase } from '../supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    const googleBtn = document.getElementById('google-signin-btn');
    const authLoading = document.getElementById('auth-loading');

    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            try {
                if (authLoading) authLoading.classList.remove('hidden');
                const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: window.location.origin + window.location.pathname
                    }
                });
                if (error) throw error;
            } catch (err) {
                console.error('[Auth Error]', err.message);
                if (authLoading) authLoading.classList.add('hidden');
            }
        });
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
            const user = session.user;
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();

            if (profile && profile.username) {
                window.sessionStorage.setItem('nexa_chosen_username', profile.username);
                window.dispatchEvent(new CustomEvent('nexa:userLoaded', { detail: profile }));
                window.nexaRouter.showScreen('home');
            } else {
                window.sessionStorage.setItem('nexa_temp_uid', user.id);
                window.sessionStorage.setItem('nexa_temp_email', user.email || '');
                window.sessionStorage.setItem('nexa_temp_photo', user.user_metadata?.avatar_url || '');
                window.sessionStorage.setItem('nexa_temp_name', user.user_metadata?.full_name || 'Pioneer');
                window.nexaRouter.showScreen('username');
            }
        }
    });
});

