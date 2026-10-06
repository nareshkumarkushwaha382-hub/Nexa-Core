import { supabase } from '../supabase-config.js';

// DOM Views Registry
const views = {
    splash: document.getElementById('splash-view'),
    welcome: document.getElementById('welcome-view'),
    username: document.getElementById('username-view'),
    profile: document.getElementById('profile-view'),
    home: document.getElementById('home-view'),
    settings: document.getElementById('settings-view')
};

// Switch view helper
function showView(name) {
    Object.keys(views).forEach(key => {
        const el = views[key];
        if (el) {
            if (key === name) {
                el.classList.remove('hidden');
                el.classList.add('active');
            } else {
                el.classList.remove('active');
                el.classList.add('hidden');
            }
        }
    });
}

// Google Login Trigger
document.getElementById('google-login-btn')?.addEventListener('click', async () => {
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin }
        });
        if (error) throw error;
    } catch (err) {
        console.error('Login error:', err);
        alert('Login failed: ' + err.message);
    }
});

// Direct App Starter
async function startApp() {
    try {
        showView('splash');

        // Get session
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (!session) {
            showView('welcome');
            return;
        }

        const userId = session.user.id;

        // Check profile
        let { data: profile, error: profileErr } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

        if (!profile) {
            // Auto-create profile if missing
            const { data: newProf } = await supabase
                .from('profiles')
                .insert({ id: userId })
                .select()
                .single();
            profile = newProf;
        }

        if (!profile || !profile.username) {
            showView('username');
        } else if (!profile.display_name) {
            showView('profile');
        } else {
            showView('home');
            // Load home conversations if function exists
            if (window.initHome) window.initHome(userId);
        }

    } catch (err) {
        console.error('App start error:', err);
        showView('welcome');
    }
}

// Run on load
window.addEventListener('DOMContentLoaded', startApp);

// Listen to auth changes
supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
        startApp();
    } else if (event === 'SIGNED_OUT') {
        showView('welcome');
    }
});
