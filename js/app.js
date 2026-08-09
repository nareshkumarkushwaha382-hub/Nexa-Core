/**
 * @file app.js
 * @description Master application router and event coordinator for Nexa.
 */

import { supabase } from '../supabase.js';

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const splashScreen = document.getElementById('splash-screen');
    const welcomeScreen = document.getElementById('welcome-screen');
    const authScreen = document.getElementById('auth-screen');
    const usernameScreen = document.getElementById('username-screen');
    const profileScreen = document.getElementById('profile-screen');
    const homeScreen = document.getElementById('home-screen');
    const getStartedBtn = document.getElementById('get-started-btn');

    // 1. Handle Welcome Screen "Get Started" click
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            if (welcomeScreen) welcomeScreen.classList.add('hidden');
            if (authScreen) authScreen.classList.remove('hidden');
        });
    }

    // 2. Listen for custom user loaded event fired from auth/profile modules
    window.addEventListener('nexa:userLoaded', (e) => {
        const profile = e.detail;
        if (!profile) return;

        // Update settings UI dynamically if available
        const displayNameEl = document.getElementById('settings-display-name');
        const usernameHandleEl = document.getElementById('settings-username-handle');

        if (displayNameEl) displayNameEl.textContent = profile.display_name || 'Pioneer';
        if (usernameHandleEl) usernameHandleEl.textContent = `@${profile.username || 'user'}`;
    });

    // 3. Handle Sidebar Navigation (Chats vs Settings tabs)
    const navItems = document.querySelectorAll('.nav-item');
    const chatsPanel = document.getElementById('primary-home-panel');
    const chatWorkspace = document.getElementById('workspace-area');
    const settingsView = document.getElementById('settings-view');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tab = item.getAttribute('data-tab');

            // Update active state on nav buttons
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

    // 4. Global Supabase Auth State Change Listener
    supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT') {
            if (homeScreen) homeScreen.classList.add('hidden');
            if (authScreen) authScreen.classList.remove('hidden');
        }
    });
});

