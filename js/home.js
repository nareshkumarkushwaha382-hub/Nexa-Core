/**
 * @file home.js
 * @description Manages Home screen sidebar navigation, tabs, and responsive mobile switching.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const navItems = document.querySelectorAll('.home-sidebar .nav-item');
    const chatsPanel = document.getElementById('primary-home-panel');
    const chatWorkspace = document.getElementById('workspace-area');
    const settingsView = document.getElementById('settings-view');

    if (navItems.length > 0) {
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
                    if (chatWorkspace) chatsPanel.classList.add('hidden');
                    if (settingsView) settingsView.classList.remove('hidden');
                }
            });
        });
    }

    // Mobile responsive chat drawer support
    const chatItems = document.querySelectorAll('.chat-item');
    chatItems.forEach(chat => {
        chat.addEventListener('click', () => {
            if (window.innerWidth <= 900) {
                if (chatsPanel) chatsPanel.classList.add('mobile-hidden');
                if (chatWorkspace) chatWorkspace.classList.remove('mobile-hidden');
            }
        });
    });

    window.addEventListener('nexa:userLoaded', (e) => {
        const profile = e.detail;
        if (!profile) return;
        const displayNameEl = document.getElementById('settings-display-name');
        const usernameHandleEl = document.getElementById('settings-username-handle');

        if (displayNameEl) displayNameEl.textContent = profile.display_name || 'Pioneer';
        if (usernameHandleEl) usernameHandleEl.textContent = `@${profile.username || 'user'}`;
    });
});
