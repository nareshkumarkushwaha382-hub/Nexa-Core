import { supabase } from '../supabase-config.js';

// Central View Manager
const Views = {
    splash: document.getElementById('splash-view'),
    welcome: document.getElementById('welcome-view'),
    username: document.getElementById('username-view'),
    profile: document.getElementById('profile-view'),
    home: document.getElementById('home-view'),
    settings: document.getElementById('settings-view')
};

export function showView(viewName) {
    Object.keys(Views).forEach(name => {
        if (Views[name]) {
            if (name === viewName) {
                Views[name].classList.remove('hidden');
                Views[name].classList.add('active');
            } else {
                Views[name].classList.remove('active');
                Views[name].classList.add('hidden');
            }
        }
    });
}

// Application Initialization & Session Guard
async function initApp() {
    try {
        showView('splash');

        // Check active Supabase session
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (!session) {
            showView('welcome');
            return;
        }

        // Check if user has completed profile & username setup
        const { data: profile, profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error fetching profile:', profileError);
        }

        if (!profile || !profile.username) {
            showView('username');
        } else if (!profile.display_name) {
            showView('profile');
        } else {
            showView('home');
            // TODO: Initialize home/chat modules here
        }
    } catch (err) {
        console.error('Initialization error:', err);
        showView('welcome');
    }
}

// Handle Google Login Trigger
document.getElementById('google-login-btn')?.addEventListener('click', async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin
        }
    });
    if (error) {
        alert('Authentication failed: ' + error.message);
    }
});

// Listen to auth state changes to handle post-OAuth redirection cleanly
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
        initApp();
    } else if (event === 'SIGNED_OUT') {
        showView('welcome');
    }
});

// Run init on load
window.addEventListener('DOMContentLoaded', initApp);
