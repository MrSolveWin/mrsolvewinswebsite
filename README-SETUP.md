# MrSolveWin Creator Website

A static, mobile-friendly creator website with a public video gallery and a private owner dashboard.

## What's included
- `index.html`: public homepage and YouTube subscribe links
- `admin.html`: owner sign-in and video management
- `assets/`: styling and browser code
- `supabase-setup.sql`: database table and owner-only Row Level Security policies

## Before publishing
This project is intentionally not connected to any account yet. A parent/guardian should manage the hosting and Supabase accounts.

### 1. Create the Supabase project
1. Create a Supabase project from the official Supabase website.
2. In Authentication settings, disable public sign-ups.
3. In Authentication > Users, create the single owner account. Use an email/password controlled by the owner with guardian help.
4. Copy the owner's UUID from the Users list.
5. Open SQL Editor, paste `supabase-setup.sql`, replace every `OWNER_USER_UUID` with that UUID, and run it.
6. In Project Settings > API, copy the Project URL and public anon/publishable key.

### 2. Configure this website
Open `assets/config.js` and replace:
- `PASTE_SUPABASE_PROJECT_URL_HERE`
- `PASTE_SUPABASE_ANON_OR_PUBLISHABLE_KEY_HERE`

Use only the public anon/publishable key. NEVER use the `service_role` key or any secret key in website code.

### 3. Publish with GitHub Pages
1. Create a new GitHub repository named `mrsolvewin-website` (guardian can help manage publishing).
2. Upload all files and folders from this project into the repository root.
3. In repository Settings > Pages, choose Deploy from a branch, select `main` and `/ (root)`, then Save.
4. GitHub Pages will show the public website URL after deployment.
5. Public homepage: `https://YOUR-USERNAME.github.io/mrsolvewin-website/`
6. Admin dashboard: `https://YOUR-USERNAME.github.io/mrsolvewin-website/admin.html`

## Adding a video
1. Sign in at `/admin.html`.
2. Paste a YouTube video URL, enter a title and optional description.
3. Choose whether it should be public, then Add video.
4. The public homepage displays published videos.

## Security notes
- The Supabase public anon key is meant to be present in browser code; Row Level Security is what protects the database.
- Never publish a Supabase service-role/secret key, account password, recovery code, or private token.
- Keep Supabase public sign-ups disabled. Only the guardian-managed owner account should exist.
- The owner UUID restriction in SQL is essential. Replace the placeholder before running the SQL.
- The admin page URL is not a security boundary. Database policies enforce who can change videos.
