# VolleyScore - Professional Volleyball Live Score App

A modern, real-time volleyball score tracking application built with Next.js 15, Supabase, and TypeScript. Features live match updates, tournament management, team tracking, and user authentication.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.1-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square&logo=supabase)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

### Core Functionality
- 🔴 **Live Match Updates** - Real-time score updates using Supabase subscriptions
- 📅 **Match Schedules** - Browse upcoming matches by league/tournament
- 🏆 **Tournament Management** - Multi-tournament support with league standings
- 👥 **Team & Player Profiles** - Detailed team information and player statistics
- 📊 **Set-by-Set Breakdown** - Complete match details with set scores
- ⭐ **Favorites System** - Save favorite teams and matches (requires login)

### User Experience
- 🌓 **Dark/Light Theme** - System-aware theme switching
- 📱 **PWA Support** - Install as mobile app with offline capabilities
- 🔐 **User Authentication** - Secure login via Supabase Auth
- ⚡ **Real-time Updates** - WebSocket-powered live data (no manual refresh)
- 📱 **Fully Responsive** - Mobile-first design, works on all devices

### Admin Features
- 🛡️ **Admin Dashboard** - Secure admin panel for content management
- ✏️ **Match Management** - Create, update, and manage matches
- 📝 **Live Score Updates** - Real-time score editing during live matches
- 🏅 **Team & Tournament CRUD** - Full content management system

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: TailwindCSS 4.x
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: Zustand
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **PWA**: next-pwa
- **Deployment**: Vercel (recommended)

## 📦 Installation

### Prerequisites
- Node.js 20.x or higher
- npm or yarn
- Supabase account (free tier works)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd volleyball-app/volleyball-score-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to initialize

#### Run the Database Schema
1. Open the SQL Editor in your Supabase dashboard
2. Copy the contents of `supabase-schema.sql`
3. Paste and execute the SQL script
4. This will create all tables, policies, triggers, and functions

### 4. Configure Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Find these values in: Supabase Dashboard → Settings → API

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

The application uses the following main tables:
- **teams** - Team information
- **tournaments** - League/tournament data
- **matches** - Match schedules and results
- **sets** - Set-by-set scores
- **players** - Player profiles
- **player_stats** - Player statistics per tournament
- **match_events** - Live commentary events
- **profiles** - User profiles (linked to auth.users)
- **user_favorite_teams** - User's favorite teams
- **user_favorite_matches** - User's favorite matches

See `supabase-schema.sql` for the complete schema with RLS policies.

## 🔐 Authentication

The app uses Supabase Auth with email/password:
- Users can sign up and create profiles
- Profiles are automatically created via database trigger
- Admin users have `is_admin = true` in profiles table
- Row Level Security (RLS) protects admin routes

### Create an Admin User
After signing up, update your profile in Supabase:
```sql
UPDATE profiles 
SET is_admin = true 
WHERE id = 'your-user-id';
```

## 📱 PWA Configuration

The app is configured as a Progressive Web App:
- Manifest file: `public/manifest.json`
- Works offline (with service worker caching)
- Can be installed on mobile devices
- Add icons: `public/icon-192.png` and `public/icon-512.png`

## 🎨 Customization

### Theme Colors
Edit colors in `src/app/globals.css` and Tailwind config.

### Logo
Replace the logo in `src/components/layout/Header.tsx`.

### Branding
Update `manifest.json` and metadata in `src/app/layout.tsx`.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

```bash
# Or use Vercel CLI
npm install -g vercel
vercel
```

### Environment Variables on Vercel
Add all variables from `.env.local` to Vercel project settings.

## 📊 Real-time Features

The app uses Supabase Real-time for live updates:
- Match scores update automatically
- Set scores refresh in real-time
- No page refresh needed
- WebSocket-based subscriptions

## 🛠️ Development

### Project Structure
```
volleyball-score-app/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   │   ├── layout/      # Header, Footer
│   │   ├── matches/     # Match-related components
│   │   ├── providers/   # Context providers
│   │   └── ui/          # UI components
│   ├── lib/             # Utilities and configs
│   │   └── supabase/    # Supabase client setup
│   ├── store/           # Zustand state management
│   └── types/           # TypeScript types
├── public/              # Static assets
└── supabase-schema.sql  # Database schema
```

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🐛 Troubleshooting

### Supabase Connection Issues
- Verify `.env.local` has correct credentials
- Check Supabase project is active
- Ensure RLS policies are created

### Real-time Not Working
- Check Supabase Real-time is enabled in dashboard
- Verify RLS policies allow SELECT access
- Check browser console for connection errors

### Admin Access Denied
- Ensure user has `is_admin = true` in profiles table
- Clear browser cache and re-login

## 🎯 Future Enhancements

- [ ] Full admin CRUD interface
- [ ] Push notifications for match updates
- [ ] Live commentary system
- [ ] Video highlights integration
- [ ] Advanced statistics and analytics
- [ ] Multi-language support
- [ ] Social sharing features
- [ ] Team comparison tools

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

---

Built with ❤️ using Next.js and Supabase
