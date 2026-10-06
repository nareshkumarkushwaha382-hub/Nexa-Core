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
        console.log('1. initApp started...');
        showView('splash');

        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('2. Session result:', { session, error });
        
        if (error) throw error;

        if (!session) {
            console.log('3. No session found. Switching to welcome.');
            showView('welcome');
            return;
        }

        const userId = session.user.id;
        console.log('4. User ID found:', userId);

        let { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();

        console.log('5. Profile fetch result:', { profile, profileError });

        if (!profile) {
            console.log('6. Profile missing. Auto-creating profile row...');
            const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert({ id: userId })
                .select()
                .single();

            console.log('7. Create profile result:', { newProfile, createError });
            profile = newProfile;
        }

        if (!profile || !profile.username) {
            console.log('8. Directing to username view');
            showView('username');
        } else if (!profile.display_name) {
            console.log('9. Directing to profile view');
            showView('profile');
        } else {
            console.log('10. Directing to home view with userId:', userId);
            showView('home', userId);
        }

    } catch (err) {
        console.error('CRITICAL initApp Exception:', err);
        showView('welcome');
    }
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
