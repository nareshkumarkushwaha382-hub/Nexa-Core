/**
 * @file auth.js
 * @description Nexa Supabase Google Authentication controller.
 */

import { supabase } from '../supabase-config.js';

(function () {
    'use strict';

    const googleSignInBtn = document.getElementById('google-signin-btn');
    const authLoading = document.getElementById('auth-loading');

    const splashScreen = document.getElementById('splash-screen');
    const welcomeScreen = document.getElementById('welcome-screen');
    const authScreen = document.getElementById('auth-screen');
    const usernameScreen = document.getElementById('username-screen');
    const profileScreen = document.getElementById('profile-screen');
    const homeScreen = document.getElementById('home-screen');

    function showOnly(screen) {
        const screens = [
            splashScreen,
            welcomeScreen,
            authScreen,
            usernameScreen,
            profileScreen,
            homeScreen
        ];

        screens.forEach((element) => {
            if (!element) return;

            if (element === screen) {
                element.classList.remove('hidden');
                element.classList.add('active');
            } else {
                element.classList.add('hidden');
                element.classList.remove('active');
            }
        });
    }

    async function routeUser(session) {
        console.log('[Nexa Auth] Routing session:', session);

        if (!session || !session.user) {
            console.log('[Nexa Auth] No active session.');

            showOnly(welcomeScreen);
            return;
        }

        const user = session.user;

        console.log('[Nexa Auth] Signed in user:', user.email);
        console.log('[Nexa Auth] User ID:', user.id);

        // Check whether this user already has a Nexa profile.
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

        if (error) {
            console.error('[Nexa Auth] Profile lookup failed:', error);
        }

        if (profile && profile.username) {
            console.log('[Nexa Auth] Existing profile found.');

            sessionStorage.setItem(
                'nexa_chosen_username',
                profile.username
            );

            window.dispatchEvent(
                new CustomEvent('nexa:userLoaded', {
                    detail: profile
                })
            );

            showOnly(homeScreen);
            return;
        }

        // New user
        console.log('[Nexa Auth] New user. Showing username screen.');

        sessionStorage.setItem('nexa_temp_uid', user.id);
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

        showOnly(usernameScreen);
    }

    // Google Sign In
    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', async () => {
            console.log('[Nexa Auth] Starting Google sign-in...');

            if (authLoading) {
                authLoading.classList.remove('hidden');
            }

            googleSignInBtn.disabled = true;

            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo:
                        'https://nareshkumarkushwaha382-hub.github.io/Nexa-Core/'
                }
            });

            if (error) {
                console.error(
                    '[Nexa Auth] Google sign-in error:',
                    error
                );

                if (authLoading) {
                    authLoading.classList.add('hidden');
                }

                googleSignInBtn.disabled = false;
            }
        });
    }

    // IMPORTANT:
    // Handle OAuth returning from Google.
    supabase.auth.onAuthStateChange((event, session) => {
        console.log('[Nexa Auth] Auth event:', event);

        if (event === 'SIGNED_IN' && session) {
            routeUser(session);
        }

        if (event === 'INITIAL_SESSION') {
            if (session) {
                routeUser(session);
            } else {
                showOnly(welcomeScreen);
            }
        }

        if (event === 'SIGNED_OUT') {
            showOnly(welcomeScreen);
        }
    });

})();
