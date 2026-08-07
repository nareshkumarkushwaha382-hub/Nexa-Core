/**
 * @file auth.js
 * @description Google Authentication controller.
 */

import { auth, db } from '../firebase-config.js';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const googleSignInBtn = document.getElementById('google-signin-btn');
    const authLoading = document.getElementById('auth-loading');
    const splashScreen = document.getElementById('splash-screen');
    const authScreen = document.getElementById('auth-screen');
    const usernameScreen = document.getElementById('username-screen');
    const profileScreen = document.getElementById('profile-screen');
    const homeScreen = document.getElementById('home-screen');

    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', async () => {
            const provider = new GoogleAuthProvider();
            try {
                if (authLoading) authLoading.classList.remove('hidden');
                googleSignInBtn.style.opacity = '0.5';
                googleSignInBtn.style.pointerEvents = 'none';

                await signInWithPopup(auth, provider);
            } catch (error) {
                console.error('[Auth Error]', error.message);
                if (authLoading) authLoading.classList.add('hidden');
                googleSignInBtn.style.opacity = '1';
                googleSignInBtn.style.pointerEvents = 'auto';
            }
        });
    }

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            if (splashScreen) splashScreen.classList.add('hidden');
            if (authScreen) authScreen.classList.add('hidden');

            try {
                const snapshot = await get(ref(db, `users/${user.uid}`));
                if (snapshot.exists() && snapshot.val().username) {
                    const userData = snapshot.val();
                    if (homeScreen) homeScreen.classList.remove('hidden');
                    window.sessionStorage.setItem('nexa_chosen_username', userData.username);
                    window.dispatchEvent(new CustomEvent('nexa:userLoaded', { detail: userData }));
                } else {
                    if (usernameScreen) usernameScreen.classList.remove('hidden');
                    window.sessionStorage.setItem('nexa_temp_uid', user.uid);
                    window.sessionStorage.setItem('nexa_temp_email', user.email || '');
                    window.sessionStorage.setItem('nexa_temp_photo', user.photoURL || '');
                    window.sessionStorage.setItem('nexa_temp_name', user.displayName || 'Pioneer');
                }
            } catch (err) {
                console.error('[Database Read Error]', err);
            }
        }
    });
});
