import { supabase } from '../supabase-config.js';
import { showView } from './app.js';

const usernameForm = document.getElementById('username-form');
const usernameInput = document.getElementById('username-input');

usernameForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim().toLowerCase();

    // Client-side validation: 3–24 chars, lowercase letters, numbers, underscores
    const regex = /^[a-z0-9_]{3,24}$/;
    if (!regex.test(username)) {
        alert('Username must be 3–24 characters long and contain only lowercase letters, numbers, and underscores.');
        return;
    }

    try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
            throw new Error('No active session found. Please sign in again.');
        }

        // Check if username is already taken
        const { data: existingUser, error: checkError } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', username)
            .maybeSingle();

        if (checkError) throw checkError;

        if (existingUser && existingUser.id !== session.user.id) {
            alert('This username is already taken. Please choose another one.');
            return;
        }

        // Upsert profile with the new username
        const { error: upsertError } = await supabase
            .from('profiles')
            .upsert({
                id: session.user.id,
                username: username,
                updated_at: new Date().toISOString()
            });

        if (upsertError) throw upsertError;

        // Proceed to profile setup view
        showView('profile');

    } catch (err) {
        console.error('Error saving username:', err);
        alert('Failed to save username: ' + err.message);
    }
});
