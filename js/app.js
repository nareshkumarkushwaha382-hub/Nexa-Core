import { supabase } from '../supabase-config.js';
import { initWelcome } from './welcome.js';
import { initHome } from './home.js';
import { initSettings } from './settings.js';

// Central View Manager Registry
const Views = {
    splash: document.getElementById('splash-view'),
    welcome: document.getElementById('welcome-view'),
    username: document.getElementById('username-view'),
    profile: document.getElementById('profile-view'),
    home: document.getElementById('home-view'),
    settings: document.getElementById('settings-view')
};

/**
 * Switch active view container visibility safely
 * @param {string} viewName 
 * @param {any} viewData 
 */
export function showView(viewName, viewData = null) {
    Object.keys(Views).forEach(name => {
        const viewEl = Views[name];
        if (viewEl) {
            if (name === viewName) {
                viewEl.classList.remove('hidden');
                viewEl.classList.add('active');

                // Trigger view-specific initializers when rendered
                if (name === 'welcome') {
                    initWelcome();
                } else if (name === 'home' && viewData) {
                    initHome(viewData);
                } else if (name === 'settings' && viewData) {
                    initSettings(viewData);
                }
            } else {
                viewEl.classList.remove('active');
                viewEl.classList.add('hidden');
            }
        }
    });
}

/**
 * Main application initialization & sequential session/profile guard
 */
async function initApp() {
    try {
        showView('splash');

        // Fetch current session with safety timeout fallback (8 seconds)
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Session fetch timeout')), 8000)
        );

        const { data: { session }, error } = await Promise.race([sessionPromise, timeoutPromise]);
        
        if (error) throw error;

        // If no active session, show welcome/login screen
        if (!session) {
            showView('welcome');
            return;
        }

        const userId = session.user.id;

        // Check if user has completed profile & username setup in Supabase
        let { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

        if (profileError) {
            console.warn('Profile fetch warning:', profileError);
        }

        // If profile row doesn't exist yet (first-time Google login), auto-create it
        if (!profile) {
            const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert({ id: userId })
                .select()
                .single();

            if (createError) {
                console.error('Error auto-creating profile row:', createError);
            }
            profile = newProfile;
        }

        // Sequential onboarding check
        if (!profile || !profile.username) {
            showView('username');
        } else if (!profile.display_name) {
            showView('profile');
        } else {
            showView('home', userId);
        }

    } catch (err) {
        console.error('Initialization error caught:', err);
        // Fallback gracefully to welcome screen instead of freezing indefinitely on splash
        showView('welcome');
    }
}

// Listen to Supabase Auth state changes (e.g. successful Google OAuth callback)
supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session) {
        await initApp();
    } else if (event === 'SIGNED_OUT') {
        showView('welcome');
    }
});

// Run initialization on DOM load
window.addEventListener('DOMContentLoaded', initApp);
