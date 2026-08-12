import { supabase } from '../supabase-config.js';

document.addEventListener('DOMContentLoaded', async () => {
    'use strict';

    const logoutBtn = document.getElementById('logout-btn');
    const nameElement = document.getElementById('settings-display-name');
    const usernameElement = document.getElementById('settings-username-handle');

    // Load current user
    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
        console.log('No logged-in user.');
        return;
    }

    // Load profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('display_name, username')
        .eq('id', user.id)
        .single();

    if (profileError) {
        console.error('[Settings Profile Error]', profileError);
        return;
    }

    // Display profile information
    if (nameElement) {
        nameElement.textContent = profile.display_name || 'Nexa User';
    }

    if (usernameElement) {
        usernameElement.textContent =
            profile.username ? '@' + profile.username : '@username';
    }

    // Sign out
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {

            logoutBtn.disabled = true;
            logoutBtn.textContent = 'Signing out...';

            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error('[Logout Error]', error);

                logoutBtn.disabled = false;
                logoutBtn.textContent = 'Sign Out';
                return;
            }

            sessionStorage.clear();

            if (window.nexaRouter) {
                window.nexaRouter.showScreen('auth');
            } else {
                window.location.reload();
            }
        });
    }
});
