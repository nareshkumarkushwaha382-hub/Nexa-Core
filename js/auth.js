/**
 * @file auth.js
 * @description Google OAuth authentication controller.
 */

import { supabase } from '../supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const googleBtn =
        document.getElementById('google-signin-btn');

    const authLoading =
        document.getElementById('auth-loading');


    // --------------------------------
    // GOOGLE SIGN IN
    // --------------------------------

    if (googleBtn) {

        googleBtn.addEventListener('click', async () => {

            try {

                if (authLoading) {
                    authLoading.classList.remove('hidden');
                }

                googleBtn.disabled = true;

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

            } catch (err) {

                console.error(
                    '[Nexa Auth Error]',
                    err
                );

                if (authLoading) {
                    authLoading.classList.add('hidden');
                }

                googleBtn.disabled = false;
            }
        });
    }


    // --------------------------------
    // AUTH STATE
    // --------------------------------

    supabase.auth.onAuthStateChange(
        async (event, session) => {

            console.log(
                '[Nexa Auth]',
                event
            );

            if (!session) {
                return;
            }

            if (
                event !== 'SIGNED_IN' &&
                event !== 'INITIAL_SESSION'
            ) {
                return;
            }


            const user = session.user;


            // --------------------------------
            // GET PROFILE
            // --------------------------------

            const { data: profile, error } =
                await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .maybeSingle();


            if (error) {

                console.error(
                    '[Nexa Profile Error]',
                    error
                );

                return;
            }


            // --------------------------------
            // WAIT FOR ROUTER
            // --------------------------------

            function navigate(screen) {

                if (
                    window.nexaRouter &&
                    typeof window.nexaRouter.showScreen === 'function'
                ) {

                    window.nexaRouter.showScreen(screen);

                } else {

                    console.warn(
                        '[Nexa Auth] Router not ready. Retrying...'
                    );

                    setTimeout(() => {
                        navigate(screen);
                    }, 100);
                }
            }


            // --------------------------------
            // EXISTING USER
            // --------------------------------

            if (profile && profile.username) {

                window.sessionStorage.setItem(
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

                navigate('home');

                return;
            }


            // --------------------------------
            // NEW USER
            // --------------------------------

            window.sessionStorage.setItem(
                'nexa_temp_uid',
                user.id
            );

            window.sessionStorage.setItem(
                'nexa_temp_email',
                user.email || ''
            );

            window.sessionStorage.setItem(
                'nexa_temp_photo',
                user.user_metadata?.avatar_url || ''
            );

            window.sessionStorage.setItem(
                'nexa_temp_name',
                user.user_metadata?.full_name ||
                'Pioneer'
            );


            navigate('username');
        }
    );
});
