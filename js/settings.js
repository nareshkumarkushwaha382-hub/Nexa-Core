import { supabase } from '../supabase-config.js';
import { showView, escapeHTML } from './ui.js';
import { signOutUser } from './auth.js';

export async function initSettings(userId) {
    const infoContainer = document.getElementById('settings-profile-info');
    if (!infoContainer) return;

    infoContainer.innerHTML = '<p>Loading profile info...</p>';

    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (error) throw error;

        infoContainer.innerHTML = `
            <div class="settings-profile-card">
                <h3>${escapeHTML(profile.display_name || 'User')}</h3>
                <p><strong>Username:</strong> @${escapeHTML(profile.username)}</p>
                <p><strong>Bio:</strong> ${escapeHTML(profile.bio || 'No bio provided.')}</p>
            </div>
        `;
    } catch (err) {
        console.error('Error loading settings profile:', err);
        infoContainer.innerHTML = '<p class="error-text">Failed to load profile details.</p>';
    }
}

document.getElementById('logout-btn')?.addEventListener('click', signOutUser);

document.getElementById('back-to-home-btn')?.addEventListener('click', () => showView('home'));

document.getElementById('settings-btn')?.addEventListener('click', async () => {
    showView('settings');
    const { data: { session } } = await supabase.auth.getSession();
    if (session) initSettings(session.user.id);
});
