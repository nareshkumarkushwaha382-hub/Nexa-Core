/**
 * @file chat.js
 * @description Manages messaging, chat rendering, and Supabase Realtime synchronization.
 */

import { supabase } from '../supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const messageInput = document.getElementById('message-text-input');
    const sendBtn = document.getElementById('send-message-btn');
    const scrollArea = document.getElementById('message-scroll-area');
    
    let activeConversationId = null;
    let currentUserId = null;

    async function initChatModule() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        currentUserId = session.user.id;

        // Default to a global bootstrap conversation or fetch user's first conversation
        await loadOrCreateGlobalConversation();
    }

    async function loadOrCreateGlobalConversation() {
        // Find or create a default global room for V1 fallback
        const { data: convs } = await supabase
            .from('conversations')
            .select('id')
            .limit(1);

        if (convs && convs.length > 0) {
            activeConversationId = convs[0].id;
        } else {
            const { data: newConv } = await supabase
                .from('conversations')
                .insert({})
                .select()
                .single();
            if (newConv) activeConversationId = newConv.id;
        }

        if (activeConversationId) {
            fetchMessages();
            subscribeToRealtime();
        }
    }

    async function fetchMessages() {
        if (!activeConversationId || !scrollArea) return;

        const { data, error } = await supabase
            .from('messages')
            .select(`
                id,
                text,
                created_at,
                sender_id,
                profiles:sender_id (username, display_name, avatar_url)
            `)
            .eq('conversation_id', activeConversationId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('[Chat Fetch Error]', error);
            return;
        }

        scrollArea.innerHTML = '';
        if (data) {
            data.forEach(msg => appendMessageElement(msg));
        }
    }

    function subscribeToRealtime() {
        supabase
            .channel(`public:messages:conv=eq.${activeConversationId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${activeConversationId}`
            }, async (payload) => {
                const newMessage = payload.new;
                // Fetch sender profile info
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('username, display_name, avatar_url')
                    .eq('id', newMessage.sender_id)
                    .single();

                appendMessageElement({
                    ...newMessage,
                    profiles: profileData
                });
            })
            .subscribe();
    }

    async function handleSendMessage() {
        if (!messageInput || !activeConversationId || !currentUserId) return;
        const text = messageInput.value.trim();
        if (!text) return;

        const { error } = await supabase.from('messages').insert({
            conversation_id: activeConversationId,
            sender_id: currentUserId,
            text: text
        });

        if (error) {
            console.error('[Send Message Error]', error);
            return;
        }

        messageInput.value = '';
        messageInput.focus();
    }

    function appendMessageElement(msg) {
        if (!scrollArea) return;

        const isOutgoing = msg.sender_id === currentUserId;
        const bubble = document.createElement('div');
        bubble.className = `message-bubble ${isOutgoing ? 'outgoing' : 'incoming'}`;

        const textPara = document.createElement('p');
        textPara.textContent = msg.text;

        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        bubble.appendChild(textPara);
        bubble.appendChild(timeSpan);
        scrollArea.appendChild(bubble);
        scrollArea.scrollTop = scrollArea.scrollHeight;
    }

    if (sendBtn) sendBtn.addEventListener('click', handleSendMessage);
    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
            }
        });
    }

    initChatModule();
});
                
