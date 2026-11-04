import { supabase } from '../supabase-config.js';
import { escapeHTML } from './ui.js';

let incomingChannel = null;
let currentUserId = null;
let activeRecipient = null;
let renderedIds = new Set();

// Called once after login: listens for messages sent TO me
export function initChat(userId) {
    currentUserId = userId;
    if (incomingChannel) supabase.removeChannel(incomingChannel);

    incomingChannel = supabase
        .channel(`inbox_${userId}`)
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${userId}` },
            (payload) => {
                // Only show if that conversation is currently open
                if (activeRecipient && payload.new.sender_id === activeRecipient.id) {
                    appendMessageToDOM(payload.new);
                    scrollToBottom();
                }
            }
        )
        .subscribe();
}

export async function openChat(senderId, recipient) {
    currentUserId = senderId;
    activeRecipient = recipient;
    renderedIds = new Set();

    document.getElementById('no-chat-selected')?.classList.add('hidden');
    document.getElementById('active-chat-container')?.classList.remove('hidden');
    document.querySelector('.app-layout')?.classList.add('chat-open');

    document.getElementById('chat-header-name').textContent = recipient.display_name || 'User';
    document.getElementById('chat-header-username').textContent = '@' + (recipient.username || '');

    await loadMessages(recipient);
    document.getElementById('message-input')?.focus();
}

async function loadMessages(recipient) {
    const container = document.getElementById('messages-container');
    if (!container) return;

    container.innerHTML = '<p class="loading-text">Loading history...</p>';
    const me = currentUserId;

    try {
        const { data: messages, error } = await supabase
            .from('messages')
            .select('*')
            .or(`and(sender_id.eq.${me},receiver_id.eq.${recipient.id}),and(sender_id.eq.${recipient.id},receiver_id.eq.${me})`)
            .order('created_at', { ascending: true })
            .limit(500);
        if (error) throw error;

        // User may have opened another chat while this was loading
        if (!activeRecipient || activeRecipient.id !== recipient.id) return;

        container.innerHTML = '';
        if (messages && messages.length > 0) {
            messages.forEach(appendMessageToDOM);
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
    if (msg.id != null) {
        if (renderedIds.has(msg.id)) return; // dedupe (realtime + insert result)
        renderedIds.add(msg.id);
    }

    container.querySelector('.empty-text, .loading-text, .error-text')?.remove();

    const isMe = msg.sender_id === currentUserId;
    const msgDiv = document.createElement('div');
    msgDiv.className = `message-bubble ${isMe ? 'sent' : 'received'}`;
    msgDiv.innerHTML = `
        <p>${escapeHTML(msg.content)}</p>
        <span class="timestamp">${new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    `;
    container.appendChild(msgDiv);
}

document.getElementById('message-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('message-input');
    const content = input.value.trim();
    if (!content || !activeRecipient || !currentUserId) return;

    input.value = '';

    try {
        const { data, error } = await supabase
            .from('messages')
            .insert({
                sender_id: currentUserId,
                receiver_id: activeRecipient.id,
                content
            })
            .select()
            .single();
        if (error) throw error;

        appendMessageToDOM(data);
        scrollToBottom();
    } catch (err) {
        console.error('Error sending message:', err);
        input.value = content; // give the text back
        alert('Failed to send message.');
    }
});

// Mobile: back to the user list
document.getElementById('chat-back-btn')?.addEventListener('click', () => {
    document.querySelector('.app-layout')?.classList.remove('chat-open');
});

function scrollToBottom() {
    const container = document.getElementById('messages-container');
    if (container) container.scrollTop = container.scrollHeight;
}
