/**
 * @file chat.js
 * @description Module 7 controller managing active messaging sessions, E2EE message threads, and real-time interaction.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const emptyChatState = document.getElementById('empty-chat-state');
    const activeChatContainer = document.getElementById('active-chat-container');
    const activePeerAvatar = document.getElementById('active-peer-avatar');
    const activePeerName = document.getElementById('active-peer-name');
    const activePeerStatus = document.getElementById('active-peer-status');
    const messageScrollArea = document.getElementById('message-scroll-area');
    const messageTextInput = document.getElementById('message-text-input');
    const sendMessageBtn = document.getElementById('send-message-btn');
    const voiceCallBtn = document.getElementById('voice-call-btn');
    const videoCallBtn = document.getElementById('video-call-btn');

    let currentActiveChatId = null;
    let currentUserSession = null;

    // Mock thread store per conversation
    const chatThreads = {
        'chat_1': [
            { sender: 'incoming', text: 'Hey there! Just checking in on the Nexa alpha release.', time: '10:38 AM' },
            { sender: 'outgoing', text: 'Everything is running smoothly. Testing the security modules now.', time: '10:40 AM' },
            { sender: 'incoming', text: 'The encryption handshake verified successfully! 🔒', time: '10:42 AM' }
        ],
        'chat_2': [
            { sender: 'incoming', text: 'Let’s review the architecture specs for Module 7.', time: 'Yesterday' }
        ],
        'chat_3': [
            { sender: 'incoming', text: 'System update v0.1 Alpha deployed seamlessly.', time: 'Aug 3' }
        ],
        'chat_4': [
            { sender: 'incoming', text: 'Voice call quality is exceptionally crisp.', time: 'Aug 1' }
        ]
    };

    // Listen for session data from Module 5/6
    window.addEventListener('nexa:module5Complete', (event) => {
        currentUserSession = event.detail;
    });

    // Intercept chat card clicks from home.js to load active conversation
    document.addEventListener('click', (e) => {
        const chatCard = e.target.closest('.chat-card');
        if (!chatCard) return;

        // Retrieve chat info from DOM element
        const name = chatCard.querySelector('.chat-name').textContent;
        const avatar = chatCard.querySelector('.chat-avatar-wrapper img').src;
        const online = chatCard.querySelector('.online-indicator') !== null;

        // Derive active chat ID from position or name match
        currentActiveChatId = name.toLowerCase().replace(/\s+/g, '_');

        // Ensure thread exists
        if (!chatThreads[currentActiveChatId]) {
            chatThreads[currentActiveChatId] = [
                { sender: 'incoming', text: `Hello! Connected securely with ${name}.`, time: 'Just now' }
            ];
        }

        // Activate workspace UI
        emptyChatState.classList.add('hidden');
        activeChatContainer.classList.remove('hidden');

        activePeerName.textContent = name;
        activePeerAvatar.src = avatar;
        activePeerStatus.textContent = online ? 'online' : 'offline';
        activePeerStatus.style.color = online ? '#00C853' : 'rgba(255,255,255,0.4)';

        renderMessages(currentActiveChatId);
        console.info('[Module 7] Loaded active conversation thread for:', name);
    });

    // Render message history for active chat
    function renderMessages(chatId) {
        messageScrollArea.innerHTML = '';
        const thread = chatThreads[chatId] || [];

        thread.forEach(msg => {
            const row = document.createElement('div');
            row.className = `message-bubble-row ${msg.sender}`;
            row.innerHTML = `
                <div class="message-bubble">
                    <span class="message-text">${msg.text}</span>
                    <div class="message-meta">
                        <span>${msg.time}</span>
                        ${msg.sender === 'outgoing' ? `
                            <svg class="message-status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        ` : ''}
                    </div>
                </div>
            `;
            messageScrollArea.appendChild(row);
        });

        // Scroll to bottom
        messageScrollArea.scrollTop = messageScrollArea.scrollHeight;
    }

    // Handle sending a new message
    function handleSendMessage() {
        const text = messageTextInput.value.trim();
        if (!text || !currentActiveChatId) return;

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Push to thread
        if (!chatThreads[currentActiveChatId]) {
            chatThreads[currentActiveChatId] = [];
        }

        chatThreads[currentActiveChatId].push({
            sender: 'outgoing',
            text: text,
            time: timeStr
        });

        messageTextInput.value = '';
        renderMessages(currentActiveChatId);

        console.info('[Module 7] Sent E2EE message:', text);

        // Simulate incoming peer acknowledgment response after 1.5s
        setTimeout(() => {
            if (!currentActiveChatId) return;
            const ackTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            chatThreads[currentActiveChatId].push({
                sender: 'incoming',
                text: 'Message received and verified securely! ⚡',
                time: ackTime
            });
            renderMessages(currentActiveChatId);
        }, 1500);
    }

    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', handleSendMessage);
    }

    if (messageTextInput) {
        messageTextInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
            }
        });
    }

    // Call action triggers
    if (voiceCallBtn) {
        voiceCallBtn.addEventListener('click', () => {
            alert(`Initializing secure end-to-end encrypted voice call with ${activePeerName.textContent}...`);
            console.info('[Module 7] Voice call initiated.');
        });
    }

    if (videoCallBtn) {
        videoCallBtn.addEventListener('click', () => {
            alert(`Initializing secure HD video call with ${activePeerName.textContent}...`);
            console.info('[Module 7] Video call initiated.');
        });
    }
});
