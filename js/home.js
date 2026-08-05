/**
 * @file home.js
 * @description Module 6 controller managing the Home Screen dashboard, sidebar navigation, and conversation feed.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const homeScreen = document.getElementById('home-screen');
    const homeAvatarImg = document.getElementById('home-avatar-img');
    const welcomeDisplayName = document.getElementById('welcome-display-name');
    const navItems = document.querySelectorAll('.home-sidebar .nav-item[data-tab]');
    const activePanelTitle = document.getElementById('active-panel-title');
    const chatsListContainer = document.getElementById('chats-list');
    const homeSearchInput = document.getElementById('home-search-input');

    let currentUserSession = null;

    // Mock initial chats data
    const mockChats = [
        {
            id: 'chat_1',
            name: 'Sarah Jenkins',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
            snippet: 'The encryption handshake verified successfully! 🔒',
            time: '10:42 AM',
            unread: 2,
            online: true
        },
        {
            id: 'chat_2',
            name: 'Elena Rostova',
            avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
            snippet: 'Let’s review the architecture specs for Module 7.',
            time: 'Yesterday',
            unread: 0,
            online: false
        },
        {
            id: 'chat_3',
            name: 'Nexa Security Team',
            avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
            snippet: 'System update v0.1 Alpha deployed seamlessly.',
            time: 'Aug 3',
            unread: 0,
            online: true
        },
        {
            id: 'chat_4',
            name: 'Marcus Vance',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
            snippet: 'Voice call quality is exceptionally crisp.',
            time: 'Aug 1',
            unread: 0,
            online: false
        }
    ];

    // Listen for Module 5 completion event dispatched by profile.js
    window.addEventListener('nexa:module5Complete', (event) => {
        if (!homeScreen) return;

        currentUserSession = event.detail;
        console.info('[Module 6] Initializing Home Dashboard for user:', currentUserSession.username);

        // Populate user profile info in home UI
        if (currentUserSession.photoURL) {
            homeAvatarImg.src = currentUserSession.photoURL;
        } else {
            homeAvatarImg.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
        }
        if (currentUserSession.displayName) {
            welcomeDisplayName.textContent = currentUserSession.displayName;
        }

        // Render initial chats list
        renderChats(mockChats);

        homeScreen.classList.remove('hidden');
        void homeScreen.offsetWidth; // Force reflow
        homeScreen.classList.add('active');
        homeScreen.setAttribute('aria-hidden', 'false');
    });

    // Handle Sidebar Navigation Tab Switching
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabName = item.getAttribute('data-tab');

            // Update active state classes
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Update panel title
            const formattedTitle = tabName.charAt(0).toUpperCase() + tabName.slice(1);
            activePanelTitle.textContent = formattedTitle;

            console.info(`[Module 6] Switched active tab to: ${tabName}`);

            // Dynamic panel view content adjustments based on tab selection
            if (tabName === 'chats') {
                renderChats(mockChats);
            } else if (tabName === 'calls') {
                renderCallsPlaceholder();
            } else if (tabName === 'communities') {
                renderCommunitiesPlaceholder();
            } else if (tabName === 'updates') {
                renderUpdatesPlaceholder();
            } else if (tabName === 'settings') {
                renderSettingsPlaceholder();
            }
        });
    });

    // Render Chat list cards
    function renderChats(chats) {
        chatsListContainer.innerHTML = '';

        if (chats.length === 0) {
            chatsListContainer.innerHTML = '<div style="padding: 24px; text-align: center; color: rgba(255,255,255,0.4); font-size: 0.85rem;">No conversations found</div>';
            return;
        }

        chats.forEach(chat => {
            const card = document.createElement('div');
            card.className = 'chat-card';
            card.innerHTML = `
                <div class="chat-avatar-wrapper">
                    <img src="${chat.avatar}" alt="${chat.name}">
                    ${chat.online ? '<div class="online-indicator" aria-hidden="true"></div>' : ''}
                </div>
                <div class="chat-info">
                    <div class="chat-header-row">
                        <span class="chat-name">${chat.name}</span>
                        <span class="chat-time">${chat.time}</span>
                    </div>
                    <div class="chat-preview-row">
                        <span class="chat-snippet">${chat.snippet}</span>
                        ${chat.unread > 0 ? `<span class="unread-badge">${chat.unread}</span>` : ''}
                    </div>
                </div>
            `;

            // Click listener for selecting active chat (future Module 7 integration hook)
            card.addEventListener('click', () => {
                document.querySelectorAll('.chat-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                console.info('[Module 6] Selected conversation ID:', chat.id);
            });

            chatsListContainer.appendChild(card);
        });
    }

    // Search filter listener
    if (homeSearchInput) {
        homeSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const filtered = mockChats.filter(chat => 
                chat.name.toLowerCase().includes(query) || 
                chat.snippet.toLowerCase().includes(query)
            );
            renderChats(filtered);
        });
    }

    // Placeholders for secondary tabs
    function renderCallsPlaceholder() {
        chatsListContainer.innerHTML = `
            <div style="padding: 32px 16px; text-align: center; display: flex; flex-direction: column; gap: 8px;">
                <span style="font-size: 0.95rem; font-weight: 600; color: var(--color-text);">Call History</span>
                <span style="font-size: 0.8rem; color: rgba(255,255,255,0.4);">Voice and video call logs will appear here in Module 7.</span>
            </div>
        `;
    }

    function renderCommunitiesPlaceholder() {
        chatsListContainer.innerHTML = `
            <div style="padding: 32px 16px; text-align: center; display: flex; flex-direction: column; gap: 8px;">
                <span style="font-size: 0.95rem; font-weight: 600; color: var(--color-text);">Communities</span>
                <span style="font-size: 0.8rem; color: rgba(255,255,255,0.4);">Group channels and communities are ready for deployment.</span>
            </div>
        `;
    }

    function renderUpdatesPlaceholder() {
        chatsListContainer.innerHTML = `
            <div style="padding: 32px 16px; text-align: center; display: flex; flex-direction: column; gap: 8px;">
                <span style="font-size: 0.95rem; font-weight: 600; color: var(--color-text);">Status Updates</span>
                <span style="font-size: 0.8rem; color: rgba(255,255,255,0.4);">Broadcast stories and secure updates from your network.</span>
            </div>
        `;
    }

    function renderSettingsPlaceholder() {
        chatsListContainer.innerHTML = `
            <div style="padding: 32px 16px; text-align: center; display: flex; flex-direction: column; gap: 8px;">
                <span style="font-size: 0.95rem; font-weight: 600; color: var(--color-text);">Preferences & Security</span>
                <span style="font-size: 0.8rem; color: rgba(255,255,255,0.4);">Manage theme, notifications, storage, and E2EE keys in Module 8.</span>
            </div>
        `;
    }
});
