import { supabase } from '../supabase-config.js';
import { showView } from './ui.js';

const usernameForm = document.getElementById('username-form');
const usernameInput = document.getElementById('username-input');

usernameForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim().toLowerCase();

    if (!/^[a-z0-9_]{3,24}$/.test(username)) {
        alert('Username must be 3–24 characters: letters, numbers, underscores only.');
        return;
    }

    try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) throw new Error('No active session found. Please sign in again.');

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

        const { error: upsertError } = await supabase
            .from('profiles')
            .upsert({
                id: session.user.id,
                username,
                updated_at: new Date().toISOString()
            });

        if (upsertError) {
            // 23505 = unique violation (someone grabbed it a moment ago)
            if (upsertError.code === '23505') {
                alert('This username is already taken. Please choose another one.');
                return;
            }
            throw upsertError;
        }

        showView('profile');
    } catch (err) {
        console.error('Error saving username:', err);
        alert('Failed to save username: ' + err.message);
    }
});
