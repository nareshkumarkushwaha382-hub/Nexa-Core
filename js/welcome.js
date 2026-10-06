import { supabase } from '../supabase-config.js';

export function initWelcome() {
    const googleLoginBtn = document.getElementById('google-login-btn');
    
    if (googleLoginBtn) {
        // Remove existing listeners to avoid duplicates if re-initialized
        googleLoginBtn.replaceWith(googleLoginBtn.cloneNode(true));
        const freshBtn = document.getElementById('google-login-btn');

        freshBtn.addEventListener('click', async () => {
            try {
                const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: window.location.origin
                    }
                });
                if (error) throw error;
            } catch (err) {
                console.error('Google Auth Error:', err);
                alert('Authentication failed: ' + err.message);
            }
        });
    }
}
