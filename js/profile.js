import { supabase } from '../supabase-config.js';
import { showView } from './app.js';

const profileForm = document.getElementById('profile-form');
const displayNameInput = document.getElementById('display-name-input');
const bioInput = document.getElementById('bio-input');

profileForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const displayName = displayNameInput.value.trim();
    const bio = bioInput.value.trim();

    if (!displayName) {
        alert('Display name is required.');
        return;
    }

    try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
            throw new Error('No active session found. Please sign in again.');
        }

        // Update profile with display name and bio
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                display_name: displayName,
                bio: bio,
                updated_at: new Date().toISOString()
            })
            .eq('id', session.user.id);

        if (updateError) throw updateError;

        // Profile complete, enter home dashboard
        showView('home');
        // TODO: Trigger home/chat module initialization

    } catch (err) {
        console.error('Error updating profile:', err);
        alert('Failed to update profile: ' + err.message);
    }
});
