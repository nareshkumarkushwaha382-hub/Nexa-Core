import { supabase } from '../supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    console.log('[Nexa] App started');

    const screens = {
        splash: document.getElementById('splash-screen'),
        welcome: document.getElementById('welcome-screen'),
        auth: document.getElementById('auth-screen'),
        username: document.getElementById('username-screen'),
        profile: document.getElementById('profile-screen'),
        home: document.getElementById('home-screen')
    };

    function showScreen(name) {
        Object.values(screens).forEach(screen => {
            if (screen) {
                screen.classList.add('hidden');
                screen.classList.remove('active');
            }
        });

        const screen = screens[name];

        if (screen) {
            screen.classList.remove('hidden');
            screen.classList.add('active');
        }

        console.log('[Nexa] Screen:', name);
    }

    window.nexaRouter = {
        showScreen
    };

    // Start at Welcome
    showScreen('welcome');

    // -----------------------------
    // GET STARTED
    // -----------------------------

    const getStartedBtn =
        document.getElementById('get-started-btn');

    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            showScreen('auth');
        });
    }

    // -----------------------------
    // HOME NAVIGATION
    // -----------------------------

    const navItems =
        document.querySelectorAll('.nav-item');

    const chatsPanel =
        document.getElementById('primary-home-panel');

    const chatWorkspace =
        document.getElementById('workspace-area');

    const settingsView =
        document.getElementById('settings-view');

    console.log('[Nexa] Nav items:', navItems.length);
    console.log('[Nexa] Chats panel:', !!chatsPanel);
    console.log('[Nexa] Chat workspace:', !!chatWorkspace);
    console.log('[Nexa] Settings view:', !!settingsView);

    navItems.forEach(item => {

        item.addEventListener('click', () => {

            const tab =
                item.getAttribute('data-tab');

            console.log('[Nexa] Navigation:', tab);

            // Active button
            navItems.forEach(nav => {
                nav.classList.remove('active');
            });

            item.classList.add('active');

            // -------------------------
            // CHATS
            // -------------------------

            if (tab === 'chats') {

                if (chatsPanel) {
                    chatsPanel.classList.remove('hidden');
                }

                if (chatWorkspace) {
                    chatWorkspace.classList.remove('hidden');
                }

                if (settingsView) {
                    settingsView.classList.add('hidden');
                }

                console.log('[Nexa] Chats opened');
            }

            // -------------------------
            // SETTINGS
            // -------------------------

            if (tab === 'settings') {

                if (chatsPanel) {
                    chatsPanel.classList.add('hidden');
                }

                if (chatWorkspace) {
                    chatWorkspace.classList.add('hidden');
                }

                if (settingsView) {
                    settingsView.classList.remove('hidden');
                }

                console.log('[Nexa] Settings opened');
            }
        });
    });

    console.log('[Nexa] Router ready');
});
