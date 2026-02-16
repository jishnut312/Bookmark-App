# 🚀 Quick Setup Guide

Follow these steps to get your Smart Bookmark App running in under 10 minutes!

## Step 1: Install Dependencies (1 min)

```bash
npm install
```

## Step 2: Create Supabase Project (2 min)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (takes ~2 minutes)

## Step 3: Set Up Database (2 min)

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL
4. Go to **Database → Replication** and enable it for the `bookmarks` table

## Step 4: Configure Google OAuth (3 min)

### In Google Cloud Console:

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project or select existing
3. Go to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Choose **Web application**
6. Add these redirect URIs:
   - `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback`
7. Copy your **Client ID** and **Client Secret**

### In Supabase:

1. Go to **Authentication → Providers**
2. Find **Google** and enable it
3. Paste your Client ID and Client Secret
4. Save

## Step 5: Environment Variables (1 min)

1. Copy `.env.local` template
2. Get your Supabase URL and Anon Key from **Settings → API**
3. Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 6: Run the App (1 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## ✅ You're Done!

Try signing in with Google and adding your first bookmark!

## 🌐 Deploy to Vercel (Optional - 5 min)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

Don't forget to add your Vercel URL to Google OAuth redirect URIs:
- `https://your-app.vercel.app/auth/callback`

## 🆘 Need Help?

Check the main README.md for detailed troubleshooting steps.
