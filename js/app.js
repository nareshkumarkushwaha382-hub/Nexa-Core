import { supabase } from '../supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('NEXA APP.JS LOADED');

    const splash = document.getElementById('splash-screen');
    const welcome = document.getElementById('welcome-screen');
    const auth = document.getElementById('auth-screen');
    const username = document.getElementById('username-screen');
    const profile = document.getElementById('profile-screen');
    const home = document.getElementById('home-screen');

    function show(screen) {
        [splash, welcome, auth, username, profile, home].forEach(el => {
            if (el) el.classList.add('hidden');
        });

        if (screen) {
            screen.classList.remove('hidden');
            screen.classList.add('active');
        }
    }

    window.nexaRouter = {
        showScreen: name => {
            const screens = {
                splash,
                welcome,
                auth,
                username,
                profile,
                home
            };

            show(screens[name]);
        }
    };

    // Show something immediately.
    show(welcome);

    // Get Started
    const getStarted = document.getElementById('get-started-btn');

    if (getStarted) {
        getStarted.addEventListener('click', () => {
            show(auth);
        });
    }

    console.log('NEXA ROUTER READY');
    // Nexa sidebar navigation
const navItems = document.querySelectorAll('.nav-item');

const chatsPanel = document.getElementById('primary-home-panel');
const chatWorkspace = document.getElementById('workspace-area');
const settingsView = document.getElementById('settings-view');

navItems.forEach(item => {
    item.addEventListener('click', () => {

        const tab = item.getAttribute('data-tab');

        // Update active button
        navItems.forEach(nav => {
            nav.classList.remove('active');
        });

        item.classList.add('active');

        // Chats
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
        }

        // Settings
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
        }
    });
});
});
