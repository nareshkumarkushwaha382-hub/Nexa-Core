/**
 * @file chat.js
 * @description Module 7 & 9 controller managing active chat workspaces, real-time Socket.io message broadcasting, connection resilience, and optimistic UI rendering.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // Initialize Socket Connection (provided by socket.io script loaded in index.html)
    const socket = typeof io !== 'undefined' ? io() : null;

    const messageInput = document.getElementById('message-text-input');
    const sendBtn = document.getElementById('send-message-btn');
    const scrollArea = document.getElementById('message-scroll-area');
    
    let currentUsername = 'Pioneer'; // Default fallback, updated via module state if available

    // Listen for state updates from earlier user profile modules
    window.addEventListener('nexa:module5Complete', (event) => {
        if (event.detail && event.detail.username) {
            currentUsername = event.detail.username;
            if (socket) {
                socket.emit('user_connected', { username: currentUsername });
            }
        }
    });

    if (socket) {
        // Handle successful connection feedback
        socket.on('connect', () => {
            console.info('[Nexa Real-Time] Connected to socket server with ID:', socket.id);
            socket.emit('user_connected', { username: currentUsername });
        });

        // Handle disconnection feedback
        socket.on('disconnect', (reason) => {
            console.warn('[Nexa Real-Time] Disconnected from server:', reason);
        });

        // Listen for incoming messages from peer clients
        socket.on('receive_message', (data) => {
            appendMessage(data.content, 'received', data.timestamp);
        });
    } else {
        console.warn('[Nexa Real-Time] Socket.io client not detected. Running in offline UI mode.');
    }

    /**
     * Handles sending an outgoing message (optimistic UI render + socket emit)
     */
    function handleSendMessage() {
        const text = messageInput.value.trim();
        if (!text) return;

        const timestamp = new Date().toISOString();

        // 1. Render message locally immediately (optimistic UI update)
        appendMessage(text, 'sent', timestamp);

        // 2. Emit encrypted payload to the backend server
        if (socket) {
            socket.emit('send_message', { content: text });
        }

        // 3. Clear input field and restore focus
        messageInput.value = '';
        messageInput.focus();
    }

    /**
     * Appends a formatted message bubble to the chat scroll area
     * @param {string} text - Message content
     * @param {string} type - 'sent' or 'received'
     * @param {string} timeString - ISO timestamp string
     */
    function appendMessage(text, type, timeString) {
        if (!scrollArea) return;

        const msgEl = document.createElement('div');
        msgEl.className = `message-bubble ${type}`;
        
        const content = document.createElement('p');
        content.textContent = text;
        
        const time = document.createElement('span');
        time.className = 'message-time';
        
        // Format time nicely for local view
        const dateObj = new Date(timeString);
        time.textContent = isNaN(dateObj.getTime()) 
            ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        msgEl.appendChild(content);
        msgEl.appendChild(time);
        
        scrollArea.appendChild(msgEl);
        
        // Auto-scroll to the bottom of the conversation history
        scrollArea.scrollTop = scrollArea.scrollHeight;
    }

    // Event Listeners for Interaction Controls
    if (sendBtn) {
        sendBtn.addEventListener('click', handleSendMessage);
    }

    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
            }
        });
    }
});
