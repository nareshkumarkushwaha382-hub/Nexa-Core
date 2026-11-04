import { supabase } from '../supabase-config.js';

// Works on localhost and on GitHub Pages project URLs (keeps /repo-name/ path)
const REDIRECT_URL = window.location.origin + window.location.pathname;

export async function signInWithGoogle() {
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: REDIRECT_URL }
        });
        if (error) throw error;
    } catch (err) {
        console.error('Google Sign-In Error:', err);
        alert('Authentication failed: ' + err.message);
    }
}

export async function signOutUser() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    } catch (err) {
        console.error('Sign-Out Error:', err);
        alert('Failed to sign out cleanly: ' + err.message);
    }
}

export async function getCurrentSession() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return session;
    } catch (err) {
        console.error('Error fetching session:', err);
        return null;
    }
}
