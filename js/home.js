/**
 * @file home.js
 * @description Manages dashboard navigation tabs and UI bindings.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const navItems = document.querySelectorAll('.nav-item');
    const primaryPanel = document.getElementById('primary-home-panel');
    const activeChatContainer = document.getElementById('active-chat-container');
    const settingsView = document.getElementById('settings-view');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            const tab = item.getAttribute('data-tab');
            if (tab === 'chats') {
                primaryPanel.classList.remove('hidden');
                activeChatContainer.classList.remove('hidden');
                settingsView.classList.add('hidden');
            } else if (tab === 'settings') {
                primaryPanel.classList.add('hidden');
                activeChatContainer.classList.add('hidden');
                settingsView.classList.remove('hidden');
            }
        });
    });

    window.addEventListener('nexa:userLoaded', (e) => {
        const user = e.detail;
        const nameEl = document.getElementById('settings-display-name');
        const handleEl = document.getElementById('settings-username-handle');
        if (nameEl) nameEl.textContent = user.displayName;
        if (handleEl) handleEl.textContent = `@${user.username}`;
    });
});
