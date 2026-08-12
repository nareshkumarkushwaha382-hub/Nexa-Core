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

const navItems = document.querySelectorAll('.nav-item');

const chatsPanel = document.getElementById('primary-home-panel');
const chatWorkspace = document.getElementById('workspace-area');
const activeChat = document.getElementById('active-chat-container');
const settingsView = document.getElementById('settings-view');

navItems.forEach(item => {

    item.addEventListener('click', () => {

        const tab = item.getAttribute('data-tab');

        console.log('[Nexa] Navigation:', tab);

        // Update active button
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

            // Keep workspace visible
            if (chatWorkspace) {
                chatWorkspace.classList.remove('hidden');
            }

            // Show actual chat
            if (activeChat) {
                activeChat.classList.remove('hidden');
            }

            // Hide settings
            if (settingsView) {
                settingsView.classList.add('hidden');
            }

            console.log('[Nexa] Chats opened');
        }

        // -------------------------
        // SETTINGS
        // -------------------------

        if (tab === 'settings') {

            // Hide chat list
            if (chatsPanel) {
                chatsPanel.classList.add('hidden');
            }

            // IMPORTANT:
            // Do NOT hide workspace-area.
            // Settings is INSIDE workspace-area.
            if (chatWorkspace) {
                chatWorkspace.classList.remove('hidden');
            }

            // Hide actual chat
            if (activeChat) {
                activeChat.classList.add('hidden');
            }

            // Show settings
            if (settingsView) {
                settingsView.classList.remove('hidden');
            }

            console.log('[Nexa] Settings opened');
        }
    });
});
