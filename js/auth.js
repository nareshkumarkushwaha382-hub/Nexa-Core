import { supabase } from '../supabase-config.js';

/**
 * Triggers Google OAuth sign in flow
 */
export async function signInWithGoogle() {
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) throw error;
    } catch (err) {
        console.error('Google Sign-In Error:', err);
        alert('Authentication failed: ' + err.message);
    }
}

/**
 * Signs out the current user and clears session state
 */
export async function signOutUser() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    } catch (err) {
        console.error('Sign-Out Error:', err);
        alert('Failed to sign out cleanly: ' + err.message);
    }
}

/**
 * Retrieves the currently active Supabase session
 * @returns {Promise<import('@supabase/supabase-js').Session | null>}
 */
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
