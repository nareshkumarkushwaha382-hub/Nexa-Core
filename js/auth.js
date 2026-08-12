/**
 * @file auth.js
 * @description Google OAuth authentication controller for NEXA.
 */

import { supabase } from '../supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    console.log('[Nexa Auth] AUTH.JS LOADED');

    const googleBtn = document.getElementById('google-signin-btn');
    const authLoading = document.getElementById('auth-loading');

    /*
     * Wait until app.js has created the NEXA router.
     * This prevents:
     * "Cannot read properties of undefined (reading 'showScreen')"
     */
    function waitForRouter(screenName, attempts = 0) {
        if (
            window.nexaRouter &&
            typeof window.nexaRouter.showScreen === 'function'
        ) {
            console.log('[Nexa Auth] Router ready. Opening:', screenName);
            window.nexaRouter.showScreen(screenName);
            return;
        }

        if (attempts >= 50) {
            console.error('[Nexa Auth] Router failed to initialize.');
            return;
        }

        setTimeout(() => {
            waitForRouter(screenName, attempts + 1);
        }, 100);
    }

    /*
     * Google Sign In
     */
    if (googleBtn) {
        googleBtn.addEventListener('click', async () => {
            try {
                if (authLoading) {
                    authLoading.classList.remove('hidden');
                }

                console.log('[Nexa Auth] Starting Google sign-in...');

                const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo:
                            window.location.origin +
                            window.location.pathname
                    }
                });

                if (error) {
                    throw error;
                }

            } catch (err) {
                console.error('[Nexa Auth] Sign-in error:', err);

                if (authLoading) {
                    authLoading.classList.add('hidden');
                }
            }
        });
    }

    /*
     * Authentication state listener
     */
    supabase.auth.onAuthStateChange(async (event, session) => {

        console.log('[Nexa Auth] Auth event:', event);

        if (!session) {
            return;
        }

        if (
            event === 'SIGNED_IN' ||
            event === 'INITIAL_SESSION'
        ) {
            const user = session.user;

            console.log('[Nexa Auth] User:', user.id);

            /*
             * Get NEXA profile
             */
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();

            if (error) {
                console.error(
                    '[Nexa Auth] Profile error:',
                    error
                );
            }

            /*
             * Existing NEXA profile
             */
            if (profile && profile.username) {

                console.log(
                    '[Nexa Auth] Existing profile:',
                    profile.username
                );

                sessionStorage.setItem(
                    'nexa_chosen_username',
                    profile.username
                );

                window.dispatchEvent(
                    new CustomEvent('nexa:userLoaded', {
                        detail: profile
                    })
                );

                waitForRouter('home');

                return;
            }

            /*
             * New user
             */
            console.log('[Nexa Auth] New user. Username required.');

            sessionStorage.setItem(
                'nexa_temp_uid',
                user.id
            );

            sessionStorage.setItem(
                'nexa_temp_email',
                user.email || ''
            );

            sessionStorage.setItem(
                'nexa_temp_photo',
                user.user_metadata?.avatar_url || ''
            );

            sessionStorage.setItem(
                'nexa_temp_name',
                user.user_metadata?.full_name || 'Pioneer'
            );

            waitForRouter('username');
        }
    });
});
