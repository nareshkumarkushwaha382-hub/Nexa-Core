/**
 * @file home.js
 * @description Dashboard navigation controller.
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
                if (primaryPanel) primaryPanel.classList.remove('hidden');
                if (activeChatContainer) activeChatContainer.classList.remove('hidden');
                if (settingsView) settingsView.classList.add('hidden');
            } else if (tab === 'settings') {
                if (primaryPanel) primaryPanel.classList.add('hidden');
                if (activeChatContainer) activeChatContainer.classList.add('hidden');
                if (settingsView) settingsView.classList.remove('hidden');
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
