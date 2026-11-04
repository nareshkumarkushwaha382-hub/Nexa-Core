# 💬 Nexa

> **Connect Without Limits.**

Nexa is a modern, secure, and premium messaging platform built with Supabase and modern web technologies. It is designed to provide a fast, elegant, and reliable communication experience while maintaining a clean and professional user interface.

---

# ✨ Features

- 🔐 Google Authentication
- 👤 Username-based accounts
- 💬 Real-time messaging
- 🌙 Premium dark theme
- 📱 Responsive design
- ⚡ Supabase Realtime
- 🎨 Modern UI/UX
- 🔒 Secure user authentication

---

# 🛠 Tech Stack

- HTML5, CSS3, JavaScript (ES modules, no build step)
- Supabase (Auth with Google, Postgres, Realtime)
- GitHub Pages hosting

---

# 📂 Project Structure

```
Nexa-Core/
├── index.html
├── supabase-config.js
├── supabase-schema.sql
├── 404.html
├── css/
├── js/
└── README.md
```

---

# 🚀 Setup

1. Create a project at supabase.com.
2. SQL Editor → paste and run `supabase-schema.sql`.
3. Authentication → Providers → enable **Google** (add your Google OAuth client ID/secret).
4. Authentication → URL Configuration → set Site URL and Redirect URLs to your site
   (e.g. `https://<user>.github.io/Nexa-Core/` and `http://localhost:8000/`).
5. Put your Project URL and anon key in `supabase-config.js`.
6. Serve over HTTP (ES modules don't work from `file://`):

```bash
python3 -m http.server 8000
```

Open http://localhost:8000

---

# 📌 Current Status

Version:

```
v0.1 Alpha
```

Completed:

- Splash Screen
- Landing Page
- Google Login UI
- Username Screen
- Chat UI
- Firebase Project
- Google Authentication
- Realtime Database

Upcoming:

- Real Google Sign In
- User Profiles
- Real-time Chat
- Media Sharing
- Voice Messages
- Notifications
- Voice & Video Calling
- End-to-End Encryption

---

# 📈 Roadmap

- [x] Frontend
- [x] Firebase Setup
- [ ] Authentication Logic
- [ ] User Profiles
- [ ] Messaging
- [ ] Groups
- [ ] Media Sharing
- [ ] Calls
- [ ] Notifications
- [ ] Production Release

---

# 🤝 Contributing

Contributions, suggestions, and feedback are welcome.

Please create an issue before submitting major changes.

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Developer

**Naresh Kumar Kushwaha**

Project:
**Nexa**

Tagline:

> **Connect Without Limits.**
