import { supabase } from '../supabase-config.js';
import { openChat } from './chat.js';

let currentUserId = null;

export async function initHome(userId) {
    currentUserId = userId;
    await loadConversations();
    setupSearch();
}

// Load recent conversations or user connections
async function loadConversations() {
    const listContainer = document.getElementById('conversations-list');
    if (!listContainer) return;

    listContainer.innerHTML = '<p class="loading-text">Loading chats...</p>';

    try {
        // Fetch profiles excluding the current user to populate searchable/recent contacts
        const { data: users, error } = await supabase
            .from('profiles')
            .select('*')
            .neq('id', currentUserId)
            .limit(20);

        if (error) throw error;

        if (!users || users.length === 0) {
            listContainer.innerHTML = '<p class="empty-text">No users found. Use search to find friends.</p>';
            return;
        }

        renderConversationList(users);
    } catch (err) {
        console.error('Error loading conversations:', err);
        listContainer.innerHTML = '<p class="error-text">Failed to load chats.</p>';
    }
}

function renderConversationList(users) {
    const listContainer = document.getElementById('conversations-list');
    listContainer.innerHTML = '';

    users.forEach(user => {
        const item = document.createElement('div');
        item.className = 'conversation-item';
        item.innerHTML = `
            <div class="avatar-placeholder">${user.display_name ? user.display_name.charAt(0).toUpperCase() : 'U'}</div>
            <div class="conv-info">
                <h4>${user.display_name || 'Unnamed'}</h4>
                <span>@${user.username}</span>
            </div>
        `;
        item.addEventListener('click', () => {
            openChat(currentUserId, user);
        });
        listContainer.appendChild(item);
    });
}

// User Search functionality
function setupSearch() {
    const searchInput = document.getElementById('user-search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', async (e) => {
        const query = e.target.value.trim().toLowerCase();
        const listContainer = document.getElementById('conversations-list');

        if (!query) {
            loadConversations();
            return;
        }

        try {
            const { data: users, error } = await supabase
                .from('profiles')
                .select('*')
                .neq('id', currentUserId)
                .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
                .limit(10);

            if (error) throw error;
            renderConversationList(users || []);
        } catch (err) {
            console.error('Search error:', err);
        }
    });
}
