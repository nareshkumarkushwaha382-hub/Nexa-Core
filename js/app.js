/**
 * @file app.js
 * @description Centralized application router and state management.
 */

import { supabase } from '../supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const screens = {
        splash: document.getElementById('splash-screen'),
        welcome: document.getElementById('welcome-screen'),
        auth: document.getElementById('auth-screen'),
        username: document.getElementById('username-screen'),
        profile: document.getElementById('profile-screen'),
        home: document.getElementById('home-screen')
    };

    function showScreen(screenName) {
        Object.entries(screens).forEach(([name, el]) => {
            if (!el) return;
            if (name === screenName) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        });
    }

    window.nexaRouter = { showScreen };

    async function initApp() {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            setTimeout(async () => {
                if (!session) {
                    showScreen('welcome');
                } else {
                    const user = session.user;
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .maybeSingle();

                    if (profile && profile.username) {
                        window.sessionStorage.setItem('nexa_chosen_username', profile.username);
                        window.dispatchEvent(new CustomEvent('nexa:userLoaded', { detail: profile }));
                        showScreen('home');
                    } else {
                        window.sessionStorage.setItem('nexa_temp_uid', user.id);
                        window.sessionStorage.setItem('nexa_temp_email', user.email || '');
                        window.sessionStorage.setItem('nexa_temp_photo', user.user_metadata?.avatar_url || '');
                        window.sessionStorage.setItem('nexa_temp_name', user.user_metadata?.full_name || 'Pioneer');
                        showScreen('username');
                    }
                }
            }, 800);
        } catch (err) {
            console.error('[App Init Error]', err);
            showScreen('welcome');
        }
    }

    const getStartedBtn = document.getElementById('get-started-btn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            showScreen('auth');
        });
    }

    initApp();
});

                                                      
