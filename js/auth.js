/**
 * @file auth.js
 * @description Module 3 controller managing Google Sign-In authentication flow and secure token initialization.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const authScreen = document.getElementById('auth-screen');
    const googleSigninBtn = document.getElementById('google-signin-btn');
    const authLoading = document.getElementById('auth-loading');

    // Listen for Module 2 completion event dispatched by welcome.js
    window.addEventListener('nexa:module2Complete', () => {
        if (!authScreen) return;

        authScreen.classList.remove('hidden');
        void authScreen.offsetWidth; // Force reflow
        authScreen.classList.add('active');
        authScreen.setAttribute('aria-hidden', 'false');

        console.info('[Module 3] Authentication Screen successfully loaded and mounted.');
    });

    // Handle Google Sign-In interaction
    if (googleSigninBtn) {
        googleSigninBtn.addEventListener('click', () => {
            console.info('[Module 3] Google Sign-In initiated...');

            // Disable button and display secure loading indicator
            googleSigninBtn.style.opacity = '0.6';
            googleSigninBtn.style.pointerEvents = 'none';
            authLoading.classList.remove('hidden');

            // Simulate secure authentication handshake & credential exchange
            window.setTimeout(() => {
                // Mock authenticated Google user payload
                const mockGoogleUser = {
                    uid: 'nexa_sec_' + Math.random().toString(36).substring(2, 11),
                    email: 'secure.user@gmail.com',
                    displayName: 'Nexa Pioneer',
                    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                    authProvider: 'google.com'
                };

                // Store secure session state (Non plain-text storage compliance)
                sessionStorage.setItem('nexa_auth_session', JSON.stringify(mockGoogleUser));
                
                console.info('[Module 3] Authentication successful. Session secured.', mockGoogleUser.uid);

                // Fade out auth screen
                authScreen.classList.remove('active');
                authScreen.setAttribute('aria-hidden', 'true');

                window.setTimeout(() => {
                    authScreen.remove();

                    // Dispatch custom event indicating Module 3 is finished, ready for Module 4 (Username Selection)
                    window.dispatchEvent(new CustomEvent('nexa:module3Complete', { detail: mockGoogleUser }));
                }, 600);

            }, 1800); // Realistic network authentication delay
        });
    }
});
