/**
 * Nexa - Realtime Chat
 */

import { supabase } from '../supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const messageInput = document.getElementById('message-text-input');
    const sendBtn = document.getElementById('send-message-btn');
    const scrollArea = document.getElementById('message-scroll-area');

    let currentUserId = null;
    let activeReceiverId = null;
    let realtimeChannel = null;

    // -----------------------------------------
    // 1. Get logged-in user
    // -----------------------------------------

    async function initChat() {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            console.error('[Nexa Auth Error]', error);
            return;
        }

        if (!data.session) {
            console.log('[Nexa Chat] No logged-in user');
            return;
        }

        currentUserId = data.session.user.id;

        console.log('[Nexa Chat] User:', currentUserId);
    }

    // -----------------------------------------
    // 2. Open a chat with another user
    // -----------------------------------------

    window.openRealtimeChat = async function (receiverId) {

        if (!currentUserId) {
            console.error('[Nexa Chat] User is not logged in');
            return;
        }

        if (!receiverId) {
            console.error('[Nexa Chat] No receiver ID');
            return;
        }

        activeReceiverId = receiverId;

        console.log('[Nexa Chat] Opening chat with:', receiverId);

        await loadMessages();
        subscribeToRealtime();
    };

    // -----------------------------------------
    // 3. Load messages
    // -----------------------------------------

    async function loadMessages() {

        if (!currentUserId || !activeReceiverId || !scrollArea) {
            return;
        }

        const { data, error } = await supabase
            .from('chat_messages')
            .select('id, sender_id, receiver_id, content, created_at')
            .or(
                `and(sender_id.eq.${currentUserId},receiver_id.eq.${activeReceiverId}),` +
                `and(sender_id.eq.${activeReceiverId},receiver_id.eq.${currentUserId})`
            )
            .order('created_at', { ascending: true });

        if (error) {
            console.error('[Nexa Load Messages Error]', error);
            return;
        }

        scrollArea.innerHTML = '';

        data.forEach(message => {
            appendMessage(message);
        });

        scrollToBottom();
    }

    // -----------------------------------------
    // 4. Realtime messages
    // -----------------------------------------

    function subscribeToRealtime() {

        if (!activeReceiverId) {
            return;
        }

        // Remove previous subscription
        if (realtimeChannel) {
            supabase.removeChannel(realtimeChannel);
        }

        realtimeChannel = supabase
            .channel(`chat-${currentUserId}-${activeReceiverId}`)

            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_messages'
                },
                payload => {

                    const message = payload.new;

                    // Only show messages belonging to this conversation
                    const belongsToChat =
                        (
                            message.sender_id === currentUserId &&
                            message.receiver_id === activeReceiverId
                        ) ||
                        (
                            message.sender_id === activeReceiverId &&
                            message.receiver_id === currentUserId
                        );

                    if (!belongsToChat) {
                        return;
                    }

                    appendMessage(message);
                    scrollToBottom();
                }
            )

            .subscribe(status => {
                console.log('[Nexa Realtime]', status);
            });
    }

    // -----------------------------------------
    // 5. Send message
    // -----------------------------------------

    async function sendMessage() {

        if (!currentUserId) {
            console.error('[Nexa Chat] User not logged in');
            return;
        }

        if (!activeReceiverId) {
            console.error('[Nexa Chat] No receiver selected');
            return;
        }

        if (!messageInput) {
            return;
        }

        const content = messageInput.value.trim();

        if (!content) {
            return;
        }

        const { error } = await supabase
            .from('chat_messages')
            .insert({
                sender_id: currentUserId,
                receiver_id: activeReceiverId,
                content: content
            });

        if (error) {
            console.error('[Nexa Send Message Error]', error);
            return;
        }

        messageInput.value = '';
        messageInput.focus();
    }

    // -----------------------------------------
    // 6. Display message
    // -----------------------------------------

    function appendMessage(message) {

        if (!scrollArea) {
            return;
        }

        const isOutgoing =
            message.sender_id === currentUserId;

        const row = document.createElement('div');

        row.className =
            `message-bubble-row ${isOutgoing ? 'outgoing' : 'incoming'}`;

        const bubble = document.createElement('div');

        bubble.className = 'message-bubble';

        const text = document.createElement('div');

        text.className = 'message-text';

        text.textContent = message.content;

        const meta = document.createElement('div');

        meta.className = 'message-meta';

        const time = document.createElement('span');

        time.textContent =
            new Date(message.created_at)
                .toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                });

        meta.appendChild(time);

        bubble.appendChild(text);
        bubble.appendChild(meta);

        row.appendChild(bubble);

        scrollArea.appendChild(row);
    }

    // -----------------------------------------
    // 7. Scroll to newest message
    // -----------------------------------------

    function scrollToBottom() {

        if (!scrollArea) {
            return;
        }

        scrollArea.scrollTop =
            scrollArea.scrollHeight;
    }

    // -----------------------------------------
    // 8. Send button
    // -----------------------------------------

    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    // -----------------------------------------
    // 9. Enter key
    // -----------------------------------------

    if (messageInput) {

        messageInput.addEventListener('keydown', event => {

            if (event.key === 'Enter') {

                event.preventDefault();

                sendMessage();
            }
        });
    }

    // -----------------------------------------
    // Start
    // -----------------------------------------

    initChat();

});             
