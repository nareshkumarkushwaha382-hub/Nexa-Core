import { supabase } from '../supabase-config.js';

let activeChannel = null;
let currentSenderId = null;
let activeRecipient = null;

export async function openChat(senderId, recipient) {
    currentSenderId = senderId;
    activeRecipient = recipient;

    // Toggle UI views for mobile/desktop chat area
    document.getElementById('no-chat-selected')?.classList.add('hidden');
    document.getElementById('active-chat-container')?.classList.remove('hidden');

    // Set chat header details
    document.getElementById('chat-header-name').textContent = recipient.display_name || 'User';
    document.getElementById('chat-header-username').textContent = '@' + recipient.username;

    await loadMessages();
    subscribeToRealtimeMessages();
}

// Fetch historical messages between current user and recipient
async function loadMessages() {
    const container = document.getElementById('messages-container');
    if (!container) return;

    container.innerHTML = '<p class="loading-text">Loading history...</p>';

    try {
        const { data: messages, error } = await supabase
            .from('messages')
            .select('*')
            .or(`and(sender_id.eq.${currentSenderId},receiver_id.eq.${activeRecipient.id}),and(sender_id.eq.${activeRecipient.id},receiver_id.eq.${currentSenderId})`)
            .order('created_at', { ascending: true });

        if (error) throw error;

        container.innerHTML = '';
        if (messages && messages.length > 0) {
            messages.forEach(msg => appendMessageToDOM(msg));
        } else {
            container.innerHTML = '<p class="empty-text">No messages yet. Say hello!</p>';
        }
        scrollToBottom();
    } catch (err) {
        console.error('Error loading messages:', err);
        container.innerHTML = '<p class="error-text">Failed to load chat history.</p>';
    }
}

function appendMessageToDOM(msg) {
    const container = document.getElementById('messages-container');
    if (!container) return;

    // Remove empty state text if present
    const emptyText = container.querySelector('.empty-text, .loading-text, .error-text');
    if (emptyText) emptyText.remove();

    const isMe = msg.sender_id === currentSenderId;
    const msgDiv = document.createElement('div');
    msgDiv.className = `message-bubble ${isMe ? 'sent' : 'received'}`;
    msgDiv.innerHTML = `
        <p>${escapeHTML(msg.content)}</p>
        <span class="timestamp">${new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    `;
    container.appendChild(msgDiv);
}

// Send message handler
document.getElementById('message-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('message-input');
    const content = input.value.trim();

    if (!content || !activeRecipient || !currentSenderId) return;

    input.value = '';

    try {
        const { error } = await supabase
            .from('messages')
            .insert({
                sender_id: currentSenderId,
                receiver_id: activeRecipient.id,
                content: content
            });

        if (error) throw error;
    } catch (err) {
        console.error('Error sending message:', err);
        alert('Failed to send message.');
    }
});

// Setup Supabase Realtime channel subscription with proper cleanup
function subscribeToRealtimeMessages() {
    if (activeChannel) {
        supabase.removeChannel(activeChannel);
    }

    activeChannel = supabase
        .channel(`chat_${currentSenderId}_${activeRecipient.id}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `or(and(sender_id.eq.${currentSenderId},receiver_id.eq.${activeRecipient.id}),and(sender_id.eq.${activeRecipient.id},receiver_id.eq.${currentSenderId}))`
            },
            (payload) => {
                appendMessageToDOM(payload.new);
                scrollToBottom();
            }
        )
        .subscribe();
}

function scrollToBottom() {
    const container = document.getElementById('messages-container');
    if (container) {
        container.scrollTop = container.scrollHeight;
    }
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}
