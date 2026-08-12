import { supabase } from '../supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const displayName =
        document.getElementById('settings-display-name');

    const usernameHandle =
        document.getElementById('settings-username-handle');

    const logoutBtn =
        document.getElementById('logout-btn');


    // -----------------------------
    // LOAD USER PROFILE
    // -----------------------------

    async function loadSettings() {

        const {
            data: { session },
            error: sessionError
        } = await supabase.auth.getSession();

        if (sessionError) {
            console.error(
                '[Nexa Settings] Session error:',
                sessionError
            );
            return;
        }

        if (!session) {
            console.log('[Nexa Settings] No active user.');
            return;
        }

        const user = session.user;

        console.log(
            '[Nexa Settings] User:',
            user.id
        );


        const { data: profile, error } =
            await supabase
                .from('profiles')
                .select('username, display_name')
                .eq('id', user.id)
                .maybeSingle();


        if (error) {
            console.error(
                '[Nexa Settings] Profile error:',
                error
            );
            return;
        }


        if (profile) {

            if (displayName) {
                displayName.textContent =
                    profile.display_name ||
                    user.user_metadata?.full_name ||
                    'Pioneer';
            }

            if (usernameHandle) {
                usernameHandle.textContent =
                    '@' +
                    (profile.username || 'user');
            }

        } else {

            // Fallback if profile isn't found
            if (displayName) {
                displayName.textContent =
                    user.user_metadata?.full_name ||
                    'Pioneer';
            }

            if (usernameHandle) {
                usernameHandle.textContent = '@user';
            }
        }
    }


    // -----------------------------
    // SIGN OUT
    // -----------------------------

    if (logoutBtn) {

        logoutBtn.addEventListener(
            'click',
            async () => {

                logoutBtn.disabled = true;
                logoutBtn.textContent = 'Signing out...';

                const { error } =
                    await supabase.auth.signOut();

                if (error) {

                    console.error(
                        '[Nexa Settings] Sign out error:',
                        error
                    );

                    logoutBtn.disabled = false;
                    logoutBtn.textContent = 'Sign Out';

                    return;
                }

                window.sessionStorage.clear();

                if (window.nexaRouter) {
                    window.nexaRouter.showScreen('welcome');
                }
            }
        );
    }


    // Load profile
    loadSettings();

});
