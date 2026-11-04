import { supabase } from '../supabase-config.js';
import { showView } from './ui.js';
import { signInWithGoogle } from './auth.js';
import { initHome } from './home.js';
import './username.js';
import './profile.js';
import './settings.js';
import './chat.js';

let activeUserId = null;

document.getElementById('google-login-btn')?.addEventListener('click', signInWithGoogle);

async function startApp() {
    try {
        showView('splash');

        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (!session) {
            activeUserId = null;
            showView('welcome');
            return;
        }

        const userId = session.user.id;
        activeUserId = userId;

        let { data: profile, error: profileErr } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();
        if (profileErr) throw profileErr;

        if (!profile) {
            const { data: newProf, error: insErr } = await supabase
                .from('profiles')
                .insert({ id: userId })
                .select()
                .single();
            if (insErr) throw insErr;
            profile = newProf;
        }

        if (!profile.username) {
            showView('username');
        } else if (!profile.display_name) {
            showView('profile');
        } else {
            showView('home');
            await initHome(userId);
        }
    } catch (err) {
        console.error('App start error:', err);
        activeUserId = null;
        showView('welcome');
    }
}

// Module scripts run after the DOM is parsed, so start directly
startApp();

supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
        // SIGNED_IN also fires on tab refocus; ignore if already running for this user
        if (session.user.id !== activeUserId) startApp();
    } else if (event === 'SIGNED_OUT') {
        window.location.reload(); // clean state: channels, DOM, memory
    }
});
