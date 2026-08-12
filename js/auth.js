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
     * Navigate to a NEXA screen.
     *
     * Uses nexaRouter if available.
     * Otherwise directly changes the screen classes.
     */
    function navigate(screenName) {

        console.log('[Nexa Auth] Navigating to:', screenName);

        // Preferred: use NEXA router
        if (
            window.nexaRouter &&
            typeof window.nexaRouter.showScreen === 'function'
        ) {
            window.nexaRouter.showScreen(screenName);
            return;
        }

        /*
         * Fallback navigation.
         * This prevents auth.js from getting stuck forever
         * when app.js has not created the router yet.
         */
        const screenMap = {
            splash: 'splash-screen',
            welcome: 'welcome-screen',
            auth: 'auth-screen',
            username: 'username-screen',
            profile: 'profile-screen',
            home: 'home-screen'
        };

        const targetId = screenMap[screenName];

        if (!targetId) {
            console.error(
                '[Nexa Auth] Unknown screen:',
                screenName
            );
            return;
        }

        const screens = [
            'splash-screen',
            'welcome-screen',
            'auth-screen',
            'username-screen',
            'profile-screen',
            'home-screen'
        ];

        screens.forEach(id => {
            const element = document.getElementById(id);

            if (element) {
                element.classList.add('hidden');
                element.classList.remove('active');
            }
        });

        const target = document.getElementById(targetId);

        if (target) {
            target.classList.remove('hidden');
            target.classList.add('active');

            console.log(
                '[Nexa Auth] Direct navigation successful:',
                screenName
            );
        } else {
            console.error(
                '[Nexa Auth] Screen not found:',
                targetId
            );
        }
    }


    /*
     * GOOGLE SIGN-IN
     */
    if (googleBtn) {

        googleBtn.addEventListener('click', async () => {

            try {

                if (authLoading) {
                    authLoading.classList.remove('hidden');
                }

                console.log(
                    '[Nexa Auth] Starting Google sign-in...'
                );

                const { error } =
                    await supabase.auth.signInWithOAuth({
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

            } catch (error) {

                console.error(
                    '[Nexa Auth] Sign-in error:',
                    error
                );

                if (authLoading) {
                    authLoading.classList.add('hidden');
                }
            }
        });

    } else {

        console.warn(
            '[Nexa Auth] Google sign-in button not found.'
        );

    }


    /*
     * AUTH STATE
     */
    supabase.auth.onAuthStateChange(
        async (event, session) => {

            console.log(
                '[Nexa Auth] Auth event:',
                event
            );

            if (!session) {
                return;
            }

            /*
             * Only handle an authenticated session.
             */
            if (
                event !== 'SIGNED_IN' &&
                event !== 'INITIAL_SESSION'
            ) {
                return;
            }

            const user = session.user;

            console.log(
                '[Nexa Auth] User authenticated:',
                user.id
            );


            /*
             * Look for the user's NEXA profile.
             */
            const {
                data: profile,
                error: profileError
            } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();


            if (profileError) {

                console.error(
                    '[Nexa Auth] Profile lookup error:',
                    profileError
                );

                if (authLoading) {
                    authLoading.classList.add('hidden');
                }

                return;
            }


            /*
             * EXISTING USER
             */
            if (
                profile &&
                profile.username
            ) {

                console.log(
                    '[Nexa Auth] Existing user:',
                    profile.username
                );

                sessionStorage.setItem(
                    'nexa_chosen_username',
                    profile.username
                );

                window.dispatchEvent(
                    new CustomEvent(
                        'nexa:userLoaded',
                        {
                            detail: profile
                        }
                    )
                );

                if (authLoading) {
                    authLoading.classList.add('hidden');
                }

                navigate('home');

                return;
            }


            /*
             * NEW USER
             */
            console.log(
                '[Nexa Auth] New user. Opening username screen.'
            );

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
                user.user_metadata?.full_name ||
                'Pioneer'
            );

            if (authLoading) {
                authLoading.classList.add('hidden');
            }

            navigate('username');
        }
    );

});
