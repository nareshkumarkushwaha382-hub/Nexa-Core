import { supabase } from '../supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('NEXA APP.JS LOADED');

    const splash = document.getElementById('splash-screen');
    const welcome = document.getElementById('welcome-screen');
    const auth = document.getElementById('auth-screen');
    const username = document.getElementById('username-screen');
    const profile = document.getElementById('profile-screen');
    const home = document.getElementById('home-screen');

    function show(screen) {
        [splash, welcome, auth, username, profile, home].forEach(el => {
            if (el) el.classList.add('hidden');
        });

        if (screen) {
            screen.classList.remove('hidden');
            screen.classList.add('active');
        }
    }

    window.nexaRouter = {
        showScreen: name => {
            const screens = {
                splash,
                welcome,
                auth,
                username,
                profile,
                home
            };

            show(screens[name]);
        }
    };

    // Show something immediately.
    show(welcome);

    // Get Started
    const getStarted = document.getElementById('get-started-btn');

    if (getStarted) {
        getStarted.addEventListener('click', () => {
            show(auth);
        });
    }

    console.log('NEXA ROUTER READY');
});
