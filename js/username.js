/**
 * @file username.js
 * @description Module 4 controller managing unique username validation and registration flow.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const usernameScreen = document.getElementById('username-screen');
    const usernameInput = document.getElementById('username-input');
    const usernameFeedback = document.getElementById('username-feedback');
    const statusIcon = document.getElementById('username-status-icon');
    const usernameSubmitBtn = document.getElementById('username-submit-btn');

    let authenticatedUser = null;
    let isUsernameValid = false;
    let validationTimeout = null;

    // Listen for Module 3 completion event dispatched by auth.js
    window.addEventListener('nexa:module3Complete', (event) => {
        if (!usernameScreen) return;

        authenticatedUser = event.detail;
        console.info('[Module 4] Received authenticated session for user:', authenticatedUser.uid);

        usernameScreen.classList.remove('hidden');
        void usernameScreen.offsetWidth; // Force reflow
        usernameScreen.classList.add('active');
        usernameScreen.setAttribute('aria-hidden', 'false');

        // Pre-fill a suggested username based on display name if available
        if (authenticatedUser.displayName) {
            const suggested = authenticatedUser.displayName.toLowerCase().replace(/[^a-z0-9_]/g, '').substring(0, 15);
            if (suggested.length >= 3) {
                usernameInput.value = suggested;
                validateUsername(suggested);
            }
        }
    });

    // Real-time input listener with debounced availability check
    if (usernameInput) {
        usernameInput.addEventListener('input', (e) => {
            const rawValue = e.target.value.trim().toLowerCase();
            
            // Filter invalid characters immediately
            const sanitized = rawValue.replace(/[^a-z0-9_]/g, '');
            if (sanitized !== rawValue) {
                usernameInput.value = sanitized;
            }

            clearTimeout(validationTimeout);

            if (sanitized.length === 0) {
                resetValidationState('Use 3-24 characters (letters, numbers, underscores).', '');
                return;
            }

            if (sanitized.length < 3) {
                resetValidationState('Username must be at least 3 characters long.', 'error');
                return;
            }

            // Show checking state
            usernameFeedback.textContent = 'Checking availability...';
            usernameFeedback.className = 'input-feedback';
            statusIcon.innerHTML = '<div class="spinner" style="width: 14px; height: 14px;"></div>';
            statusIcon.classList.remove('hidden');
            usernameInput.className = '';

            // Debounce simulated server availability query
            validationTimeout = setTimeout(() => {
                simulateAvailabilityCheck(sanitized);
            }, 500);
        });
    }

    const resetValidationState = (message, state) => {
        isUsernameValid = false;
        usernameFeedback.textContent = message;
        usernameFeedback.className = `input-feedback ${state}`;
        statusIcon.classList.add('hidden');
        usernameInput.className = state === 'error' ? 'error' : '';
        usernameSubmitBtn.disabled = true;
    };

    const simulateAvailabilityCheck = (username) => {
        // Reserved handles check simulation
        const reservedHandles = ['admin', 'nexa', 'support', 'root', 'system', 'api'];

        if (reservedHandles.includes(username)) {
            isUsernameValid = false;
            usernameFeedback.textContent = 'This username is reserved or already taken.';
            usernameFeedback.className = 'input-feedback error';
            usernameInput.className = 'error';
            statusIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF2A2A" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
            statusIcon.classList.remove('hidden');
            usernameSubmitBtn.disabled = true;
        } else {
            isUsernameValid = true;
            usernameFeedback.textContent = 'Username is available!';
            usernameFeedback.className = 'input-feedback success';
            usernameInput.className = 'success';
            statusIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00C853" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            statusIcon.classList.remove('hidden');
            usernameSubmitBtn.disabled = false;
        }
    };

    // Handle submit action
    if (usernameSubmitBtn) {
        usernameSubmitBtn.addEventListener('click', () => {
            if (!isUsernameValid) return;

            const finalUsername = usernameInput.value.trim();
            console.info('[Module 4] Username confirmed:', finalUsername);

            // Update user profile record in session storage
            if (authenticatedUser) {
                authenticatedUser.username = finalUsername;
                sessionStorage.setItem('nexa_auth_session', JSON.stringify(authenticatedUser));
            }

            // Fade out username screen
            usernameScreen.classList.remove('active');
            usernameScreen.setAttribute('aria-hidden', 'true');

            setTimeout(() => {
                usernameScreen.remove();

                // Dispatch custom event indicating Module 4 is finished, ready for Module 5 (Profile Creation)
                window.dispatchEvent(new CustomEvent('nexa:module4Complete', { detail: authenticatedUser }));
            }, 600);
        });
    }

    // Helper trigger for programmatic validation on auto-fill
    function validateUsername(val) {
        usernameInput.value = val;
        simulateAvailabilityCheck(val);
    }
});
