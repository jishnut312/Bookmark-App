# 🔖 Smart Bookmark App

A modern, elegant bookmark manager built with Next.js and Supabase. Save, organize, and access your favorite links with real-time synchronization and Google OAuth authentication.

![Smart Bookmark App](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

- 🔐 **Google OAuth Authentication** - Secure sign-in with your Google account
- ➕ **Add Bookmarks** - Save URLs with custom titles
- 🔒 **Private Bookmarks** - Each user can only see their own bookmarks
- ⚡ **Real-time Updates** - Bookmarks update instantly without page refresh
- 🗑️ **Delete Bookmarks** - Remove bookmarks you no longer need
- 🎨 **Modern UI** - Beautiful dark theme with glassmorphism effects
- 📱 **Responsive Design** - Works perfectly on all devices
- 🚀 **Fast & Optimized** - Built with Next.js App Router for optimal performance

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Google OAuth)
- **Real-time**: Supabase Realtime
- **Deployment**: Vercel

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account ([sign up here](https://supabase.com))
- A Google Cloud Console project with OAuth 2.0 credentials

## 🚀 Setup Instructions

### 1. Clone and Install

```bash
cd bookmark-app
npm install
```

### 2. Set Up Supabase

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)

2. **Create the bookmarks table** by running this SQL in the Supabase SQL Editor:

```sql
-- Create bookmarks table
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table bookmarks enable row level security;

-- Create policy: Users can only see their own bookmarks
create policy "Users can view their own bookmarks"
  on bookmarks for select
  using (auth.uid() = user_id);

-- Create policy: Users can insert their own bookmarks
create policy "Users can insert their own bookmarks"
  on bookmarks for insert
  with check (auth.uid() = user_id);

-- Create policy: Users can delete their own bookmarks
create policy "Users can delete their own bookmarks"
  on bookmarks for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index bookmarks_user_id_idx on bookmarks(user_id);
```

3. **Enable Realtime** for the bookmarks table:
   - Go to Database → Replication
   - Enable replication for the `bookmarks` table

### 3. Configure Google OAuth

1. **Go to [Google Cloud Console](https://console.cloud.google.com)**

2. **Create OAuth 2.0 credentials**:
   - Navigate to APIs & Services → Credentials
   - Create OAuth 2.0 Client ID
   - Application type: Web application
   - Add authorized redirect URIs:
     - `https://<your-project-ref>.supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (for local development)

3. **Configure in Supabase**:
   - Go to Authentication → Providers → Google
   - Enable Google provider
   - Enter your Client ID and Client Secret
   - Save

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from:
- Supabase Dashboard → Settings → API

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment to Vercel

1. **Push your code to GitHub**

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Add Environment Variables**:
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Update Google OAuth**:
   - Add your Vercel domain to Google Cloud Console authorized redirect URIs:
     - `https://your-app.vercel.app/auth/callback`

5. **Deploy**!

## 📱 Usage

1. **Sign In**: Click "Sign in with Google" to authenticate
2. **Add Bookmark**: Enter a title and URL, then click "Add Bookmark"
3. **View Bookmarks**: All your bookmarks are displayed in real-time
4. **Delete Bookmark**: Hover over a bookmark and click the delete icon
5. **Sign Out**: Click "Sign Out" to end your session

## 🎨 Design Features

- **Glassmorphism**: Modern frosted glass effect on cards
- **Gradient Text**: Eye-catching gradient text for headings
- **Smooth Animations**: Hover effects, transitions, and floating elements
- **Dark Theme**: Easy on the eyes with a purple-blue gradient background
- **Responsive**: Optimized for desktop, tablet, and mobile

## 🔒 Security

- **Row Level Security (RLS)**: Users can only access their own bookmarks
- **Secure Authentication**: Google OAuth 2.0 with Supabase Auth
- **Environment Variables**: Sensitive data stored securely
- **HTTPS**: All production traffic encrypted

## 🐛 Troubleshooting

### Authentication Issues
- Verify Google OAuth credentials in Supabase
- Check redirect URIs match exactly
- Ensure Google provider is enabled in Supabase

### Database Issues
- Confirm RLS policies are created
- Check Supabase connection in browser console
- Verify environment variables are set correctly

### Real-time Not Working
- Enable Realtime replication for bookmarks table
- Check browser console for WebSocket errors

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built with ❤️ using Next.js and Supabase

---

**Live Demo**: [Deploy to see your live URL here]

**Time to Complete**: ~72 hours as per requirements ⏱️
