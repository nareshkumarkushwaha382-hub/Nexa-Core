/**
 * @file chat.js
 * @description Nexa realtime private chat
 */

import { supabase } from '../supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const messageInput = document.getElementById('message-text-input');
    const sendBtn = document.getElementById('send-message-btn');
    const scrollArea = document.getElementById('message-scroll-area');

    let currentUserId = null;
    let receiverId = null;
    let realtimeChannel = null;

    // --------------------------------------------------
    // START CHAT
    // --------------------------------------------------

    async function initChat() {
        const {
            data: { session },
            error
        } = await supabase.auth.getSession();

        if (error) {
            console.error('[Nexa Chat] Session error:', error);
            return;
        }

        if (!session) {
            console.log('[Nexa Chat] User is not logged in.');
            return;
        }

        currentUserId = session.user.id;

        /*
         * Get receiver ID from the chat page.
         *
         * You can set it in HTML like:
         *
         * <body data-receiver-id="USER-UUID">
         *
         * OR:
         *
         * <div id="chat-app" data-receiver-id="USER-UUID">
         */
        receiverId =
            document.body.dataset.receiverId ||
            document.getElementById('chat-app')?.dataset.receiverId ||
            null;

        if (!receiverId) {
            console.log('[Nexa Chat] No receiver selected yet.');
            setupRealtime();
            return;
        }

        await loadMessages();
        setupRealtime();
    }

    // --------------------------------------------------
    // LOAD MESSAGES
    // --------------------------------------------------

    async function loadMessages() {
        if (!currentUserId || !receiverId || !scrollArea) {
            return;
        }

        const { data, error } = await supabase
            .from('chat_messages')
            .select('id, sender_id, receiver_id, content, created_at')
            .or(
                `and(sender_id.eq.${currentUserId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${currentUserId})`
            )
            .order('created_at', {
                ascending: true
            });

        if (error) {
            console.error('[Nexa Chat] Load error:', error);
            return;
        }

        scrollArea.innerHTML = '';

        if (!data) {
            return;
        }

        data.forEach(message => {
            addMessageToScreen(message);
        });

        scrollToBottom();
    }

    // --------------------------------------------------
    // SEND MESSAGE
    // --------------------------------------------------

    async function sendMessage() {
        if (!messageInput) {
            return;
        }

        if (!currentUserId) {
            console.error('[Nexa Chat] User is not logged in.');
            return;
        }

        if (!receiverId) {
            console.error('[Nexa Chat] No receiver selected.');
            return;
        }

        const content = messageInput.value.trim();

        if (!content) {
            return;
        }

        const { data, error } = await supabase
            .from('chat_messages')
            .insert({
                sender_id: currentUserId,
                receiver_id: receiverId,
                content: content
            })
            .select()
            .single();

        if (error) {
            console.error('[Nexa Chat] Send error:', error);
            return;
        }

        messageInput.value = '';
        messageInput.focus();

        /*
         * Realtime will normally add the message.
         *
         * We don't add it here to prevent duplicates.
         */
    }

    // --------------------------------------------------
    // REALTIME
    // --------------------------------------------------

    function setupRealtime() {
        if (realtimeChannel) {
            supabase.removeChannel(realtimeChannel);
        }

        realtimeChannel = supabase
            .channel('nexa-chat-messages')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_messages'
                },
                payload => {
                    const message = payload.new;

                    if (!currentUserId) {
                        return;
                    }

                    /*
                     * Only show messages belonging
                     * to the currently open conversation.
                     */
                    const belongsToChat =
                        (
                            message.sender_id === currentUserId &&
                            message.receiver_id === receiverId
                        ) ||
                        (
                            message.sender_id === receiverId &&
                            message.receiver_id === currentUserId
                        );

                    if (!belongsToChat) {
                        return;
                    }

                    addMessageToScreen(message);
                    scrollToBottom();
                }
            )
            .subscribe(status => {
                console.log('[Nexa Chat] Realtime:', status);
            });
    }

    // --------------------------------------------------
    // DISPLAY MESSAGE
    // --------------------------------------------------

    function addMessageToScreen(message) {
        if (!scrollArea) {
            return;
        }

        /*
         * Prevent duplicate messages.
         */
        if (
            message.id &&
            scrollArea.querySelector(
                `[data-message-id="${message.id}"]`
            )
        ) {
            return;
        }

        const isOutgoing =
            message.sender_id === currentUserId;

        const bubble = document.createElement('div');

        bubble.className =
            isOutgoing
                ? 'message-bubble outgoing'
                : 'message-bubble incoming';

        if (message.id) {
            bubble.dataset.messageId = message.id;
        }

        const text = document.createElement('p');

        text.className = 'message-content';
        text.textContent = message.content;

        const time = document.createElement('span');

        time.className = 'message-time';

        time.textContent = new Date(
            message.created_at
        ).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });

        bubble.appendChild(text);
        bubble.appendChild(time);

        scrollArea.appendChild(bubble);
    }

    // --------------------------------------------------
    // SCROLL
    // --------------------------------------------------

    function scrollToBottom() {
        if (!scrollArea) {
            return;
        }

        scrollArea.scrollTop =
            scrollArea.scrollHeight;
    }

    // --------------------------------------------------
    // SEND BUTTON
    // --------------------------------------------------

    if (sendBtn) {
        sendBtn.addEventListener(
            'click',
            sendMessage
        );
    }

    // --------------------------------------------------
    // ENTER TO SEND
    // --------------------------------------------------

    if (messageInput) {
        messageInput.addEventListener(
            'keydown',
            event => {
                if (
                    event.key === 'Enter' &&
                    !event.shiftKey
                ) {
                    event.preventDefault();
                    sendMessage();
                }
            }
        );
    }

    // --------------------------------------------------
    // START
    // --------------------------------------------------

    initChat();
});            
