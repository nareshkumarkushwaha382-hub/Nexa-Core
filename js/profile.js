/**
 * @file profile.js
 * @description Module 5 controller managing profile personalization and final registration commit.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const profileScreen = document.getElementById('profile-screen');
    const avatarImg = document.getElementById('profile-avatar-img');
    const displayNameInput = document.getElementById('display-name-input');
    const bioInput = document.getElementById('bio-input');
    const bioCounter = document.getElementById('bio-counter');
    const profileSubmitBtn = document.getElementById('profile-submit-btn');

    let userSession = null;

    // Listen for Module 4 completion event dispatched by username.js
    window.addEventListener('nexa:module4Complete', (event) => {
        if (!profileScreen) return;

        userSession = event.detail;
        console.info('[Module 5] Initializing profile setup for user:', userSession.username);

        // Pre-populate fields from session state
        if (userSession.displayName) {
            displayNameInput.value = userSession.displayName;
        }
        if (userSession.photoURL) {
            avatarImg.src = userSession.photoURL;
        } else {
            avatarImg.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
        }

        profileScreen.classList.remove('hidden');
        void profileScreen.offsetWidth; // Force reflow
        profileScreen.classList.add('active');
        profileScreen.setAttribute('aria-hidden', 'false');
    });

    // Bio character counting listener
    if (bioInput) {
        bioInput.addEventListener('input', (e) => {
            const length = e.target.value.length;
            bioCounter.textContent = `${length} / 120`;
        });
    }

    // Handle profile completion submit
    if (profileSubmitBtn) {
        profileSubmitBtn.addEventListener('click', () => {
            const finalDisplayName = displayNameInput.value.trim() || userSession.displayName || 'Nexa Pioneer';
            const finalBio = bioInput.value.trim() || 'Connect without limits.';

            // Complete user profile record
            userSession.displayName = finalDisplayName;
            userSession.bio = finalBio;
            userSession.status = 'Online';
            userSession.createdAt = new Date().toISOString();

            // Store finalized complete profile session state
            sessionStorage.setItem('nexa_auth_session', JSON.stringify(userSession));
            console.info('[Module 5] Profile fully created and stored securely.', userSession);

            // Fade out profile screen
            profileScreen.classList.remove('active');
            profileScreen.setAttribute('aria-hidden', 'true');

            setTimeout(() => {
                profileScreen.remove();

                // Dispatch custom event indicating Module 5 is finished, ready for Module 6 (Home Screen)
                window.dispatchEvent(new CustomEvent('nexa:module5Complete', { detail: userSession }));
            }, 600);
        });
    }
});
