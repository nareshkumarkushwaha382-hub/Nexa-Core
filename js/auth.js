/**
 * @file auth.js
 * @description Firebase Google Sign-In and profile validation controller.
 */

import { auth, db } from '../firebase-config.js';
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const googleSignInBtn = document.getElementById('google-signin-btn');
    const authLoading = document.getElementById('auth-loading');
    const authScreen = document.getElementById('auth-screen');
    const usernameScreen = document.getElementById('username-screen');
    const homeScreen = document.getElementById('home-screen');

    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', async () => {
            const provider = new GoogleAuthProvider();
            try {
                if (authLoading) authLoading.classList.remove('hidden');
                googleSignInBtn.style.opacity = '0.5';
                googleSignInBtn.style.pointerEvents = 'none';

                const result = await signInWithPopup(auth, provider);
                await checkUserProfileAndRedirect(result.user);
            } catch (error) {
                console.error('[Firebase Auth Error]', error.message);
                alert(`Authentication failed: ${error.message}`);
                if (authLoading) authLoading.classList.add('hidden');
                googleSignInBtn.style.opacity = '1';
                googleSignInBtn.style.pointerEvents = 'auto';
            }
        });
    }

    async function checkUserProfileAndRedirect(user) {
        const snapshot = await get(ref(db, `users/${user.uid}`));
        authScreen.classList.add('hidden');

        if (snapshot.exists() && snapshot.val().username) {
            homeScreen.classList.remove('hidden');
            window.sessionStorage.setItem('nexa_chosen_username', snapshot.val().username);
            window.dispatchEvent(new CustomEvent('nexa:userLoaded', { detail: snapshot.val() }));
        } else {
            usernameScreen.classList.remove('hidden');
            window.sessionStorage.setItem('nexa_temp_uid', user.uid);
            window.sessionStorage.setItem('nexa_temp_email', user.email || '');
            window.sessionStorage.setItem('nexa_temp_photo', user.photoURL || '');
            window.sessionStorage.setItem('nexa_temp_name', user.displayName || 'Pioneer');
        }
    }
});
