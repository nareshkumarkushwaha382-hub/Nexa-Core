import { supabase } from '../supabase-config.js';
import { openChat, initChat } from './chat.js';

let currentUserId = null;
let searchBound = false;
let searchTimer = null;

export async function initHome(userId) {
    currentUserId = userId;
    initChat(userId);
    await loadConversations();
    setupSearch();
}

async function loadConversations() {
    const listContainer = document.getElementById('conversations-list');
    if (!listContainer) return;

    listContainer.innerHTML = '<p class="loading-text">Loading chats...</p>';

    try {
        const { data: users, error } = await supabase
            .from('profiles')
            .select('id, username, display_name')
            .neq('id', currentUserId)
            .not('username', 'is', null)
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

    if (users.length === 0) {
        listContainer.innerHTML = '<p class="empty-text">No users match your search.</p>';
        return;
    }

    users.forEach(user => {
        const item = document.createElement('div');
        item.className = 'conversation-item';

        const avatar = document.createElement('div');
        avatar.className = 'avatar-placeholder';
        avatar.textContent = (user.display_name || user.username || 'U').charAt(0).toUpperCase();

        const info = document.createElement('div');
        info.className = 'conv-info';
        const name = document.createElement('h4');
        name.textContent = user.display_name || 'Unnamed';
        const handle = document.createElement('span');
        handle.textContent = '@' + (user.username || '');
        info.append(name, handle);

        item.append(avatar, info);
        item.addEventListener('click', () => openChat(currentUserId, user));
        listContainer.appendChild(item);
    });
}

function setupSearch() {
    if (searchBound) return;
    const searchInput = document.getElementById('user-search-input');
    if (!searchInput) return;
    searchBound = true;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => runSearch(e.target.value), 250);
    });
}

async function runSearch(raw) {
    // Strip characters that could break PostgREST filter syntax
    const query = raw.trim().toLowerCase().replace(/[^a-z0-9_ ]/g, '');
    if (!query) {
        loadConversations();
        return;
    }
    try {
        const { data: users, error } = await supabase
            .from('profiles')
            .select('id, username, display_name')
            .neq('id', currentUserId)
            .not('username', 'is', null)
            .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
            .limit(10);
        if (error) throw error;
        renderConversationList(users || []);
    } catch (err) {
        console.error('Search error:', err);
    }
}
