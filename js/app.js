/**
 * @file app.js
 * @description Centralized application router and state machine for Nexa.
 */

import { supabase } from '../supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // Screen elements
    const screens = {
        splash: document.getElementById('splash-screen'),
        welcome: document.getElementById('welcome-screen'),
        auth: document.getElementById('auth-screen'),
        username: document.getElementById('username-screen'),
        profile: document.getElementById('profile-screen'),
        home: document.getElementById('home-screen')
    };

    // Central screen router function
    function showScreen(screenName) {
    Object.entries(screens).forEach(([name, el]) => {
        if (!el) return;

        if (name === screenName) {
            el.classList.remove('hidden');
            el.classList.add('active');
        } else {
            el.classList.add('hidden');
            el.classList.remove('active');
        }
    });

    console.info(`[Nexa Router] Showing screen: ${screenName}`);
    }

    // Expose router globally so auth/profile modules can trigger navigation safely
    window.nexaRouter = { showScreen };

    // 1. Initialize App & Check Session (Eliminates the Splash Loop)
    async function initApp() {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            // Keep splash visible for a brief moment for branding, then route
            setTimeout(async () => {
                if (!session) {
                    // No session -> Show Welcome screen
                    showScreen('welcome');
                } else {
                    // Has session -> Check if profile/username exists
                    const user = session.user;
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .maybeSingle();

                    if (profile && profile.username) {
                        window.sessionStorage.setItem('nexa_chosen_username', profile.username);
                        window.dispatchEvent(new CustomEvent('nexa:userLoaded', { detail: profile }));
                        showScreen('home');
                    } else {
                        // Logged in via Google, but hasn't picked a username yet
                        window.sessionStorage.setItem('nexa_temp_uid', user.id);
                        window.sessionStorage.setItem('nexa_temp_email', user.email || '');
                        window.sessionStorage.setItem('nexa_temp_photo', user.user_metadata?.avatar_url || '');
                        window.sessionStorage.setItem('nexa_temp_name', user.user_metadata?.full_name || 'Pioneer');
                        showScreen('username');
                    }
                }
            }, 1000);
        } catch (err) {
            console.error('[App Init Error]', err);
            showScreen('welcome');
        }
    }

    // 2. Handle Welcome Screen "Get Started" click
    const getStartedBtn = document.getElementById('get-started-btn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            showScreen('auth');
        });
    }

    // 3. Handle Sidebar Navigation (Chats vs Settings tabs)
    const navItems = document.querySelectorAll('.nav-item');
    const chatsPanel = document.getElementById('primary-home-panel');
    const chatWorkspace = document.getElementById('workspace-area');
    const settingsView = document.getElementById('settings-view');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tab = item.getAttribute('data-tab');
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            if (tab === 'chats') {
                if (chatsPanel) chatsPanel.classList.remove('hidden');
                if (chatWorkspace) chatWorkspace.classList.remove('hidden');
                if (settingsView) settingsView.classList.add('hidden');
            } else if (tab === 'settings') {
    if (chatsPanel) chatsPanel.classList.add('hidden');
    if (chatWorkspace) chatWorkspace.classList.add('hidden');
    if (settingsView) settingsView.classList.remove('hidden');
            }
        });
    });

    // 4. Listen for User Load to update Settings UI
    window.addEventListener('nexa:userLoaded', (e) => {
        const profile = e.detail;
        if (!profile) return;
        const displayNameEl = document.getElementById('settings-display-name');
        const usernameHandleEl = document.getElementById('settings-username-handle');

        if (displayNameEl) displayNameEl.textContent = profile.display_name || 'Pioneer';
        if (usernameHandleEl) usernameHandleEl.textContent = `@${profile.username || 'user'}`;
    });

    // Run initialization
    initApp();
});
                                                      
