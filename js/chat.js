/**
 * @file chat.js
 * @description Real-time chat via Supabase Realtime Channels.
 */

import { supabase } from '../supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const messageInput = document.getElementById('message-text-input');
    const sendBtn = document.getElementById('send-message-btn');
    const scrollArea = document.getElementById('message-scroll-area');
    const activeRoomId = 'global_room';

    // 1. Fetch initial existing messages
    async function loadInitialMessages() {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('room_id', activeRoomId)
            .order('created_at', { ascending: true });

        if (!error && data) {
            scrollArea.innerHTML = '';
            data.forEach(msg => appendMessage(msg.text, msg.sender_name));
        }
    }
    loadInitialMessages();

    // 2. Subscribe to real-time incoming messages
    supabase
        .channel('public:messages')
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `room_id=eq.${activeRoomId}`
        }, payload => {
            const newMsg = payload.new;
            if (newMsg) {
                appendMessage(newMsg.text, newMsg.sender_name);
            }
        })
        .subscribe();

    // 3. Send message handler
    async function handleSendMessage() {
        if (!messageInput) return;
        const text = messageInput.value.trim();
        if (!text) return;

        const senderName = window.sessionStorage.getItem('nexa_chosen_username') || 'Pioneer';

        try {
            const { error } = await supabase.from('messages').insert({
                room_id: activeRoomId,
                sender_name: senderName,
                text: text
            });

            if (error) throw error;
            messageInput.value = '';
            messageInput.focus();
        } catch (err) {
            console.error('[Chat Send Error]', err.message);
        }
    }

    function appendMessage(text, senderName) {
        if (!scrollArea) return;

        const msgEl = document.createElement('div');
        msgEl.className = 'message-bubble received';
        
        const content = document.createElement('p');
        content.textContent = `${senderName}: ${text}`;
        
        const time = document.createElement('span');
        time.className = 'message-time';
        time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        msgEl.appendChild(content);
        msgEl.appendChild(time);
        scrollArea.appendChild(msgEl);
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
});
