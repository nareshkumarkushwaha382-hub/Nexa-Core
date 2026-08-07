/**
 * @file chat.js
 * @description Real-time messaging controller.
 */

import { db } from '../firebase-config.js';
import { ref, push, onChildAdded, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const messageInput = document.getElementById('message-text-input');
    const sendBtn = document.getElementById('send-message-btn');
    const scrollArea = document.getElementById('message-scroll-area');
    const activeChatRoomId = 'global_room';

    onChildAdded(ref(db, `chats/${activeChatRoomId}/messages`), (snapshot) => {
        const msgData = snapshot.val();
        if (msgData) {
            appendMessage(msgData.text, msgData.senderName);
        }
    });

    async function handleSendMessage() {
        if (!messageInput) return;
        const text = messageInput.value.trim();
        if (!text) return;

        const senderName = window.sessionStorage.getItem('nexa_chosen_username') || 'Pioneer';

        try {
            await push(ref(db, `chats/${activeChatRoomId}/messages`), {
                text: text,
                senderName: senderName,
                timestamp: serverTimestamp()
            });
            messageInput.value = '';
            messageInput.focus();
        } catch (err) {
            console.error('[Chat Send Error]', err);
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
