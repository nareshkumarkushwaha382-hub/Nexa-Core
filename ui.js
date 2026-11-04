// Shared UI helpers (no imports -> no circular dependencies)
const views = {
    splash: document.getElementById('splash-view'),
    welcome: document.getElementById('welcome-view'),
    username: document.getElementById('username-view'),
    profile: document.getElementById('profile-view'),
    home: document.getElementById('home-view'),
    settings: document.getElementById('settings-view')
};

export function showView(name) {
    Object.keys(views).forEach(key => {
        const el = views[key];
        if (!el) return;
        if (key === name) {
            el.classList.remove('hidden');
            el.classList.add('active');
        } else {
            el.classList.remove('active');
            el.classList.add('hidden');
        }
    });
}

export function escapeHTML(str) {
    return String(str ?? '').replace(/[&<>'"]/g,
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}
