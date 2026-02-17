# Smart Bookmark App

A real-time bookmark manager built with Next.js and Supabase, featuring Google OAuth authentication and cross-device synchronization.

## 🚀 Live Demo

**Deployed URL:** https://bookmark-app-three-flame.vercel.app/
## ✨ Features

- **Google OAuth Authentication** - Secure sign-in without passwords
- **Private Bookmarks** - Each user's bookmarks are completely private (Row Level Security)
- **Real-time Sync** - Changes appear instantly across all devices
- **Tag Support** - Organize bookmarks with custom tags
- **Mobile Responsive** - Works seamlessly on desktop and mobile
- **Search Functionality** - Quickly find bookmarks by title, URL, or tags
- **Modern UI** - Premium dark theme with smooth animations

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript
- **Backend:** Supabase (PostgreSQL, Auth, Realtime)
- **Styling:** Tailwind CSS v4, Framer Motion
- **Deployment:** Vercel
- **Authentication:** Supabase Auth with Google OAuth

## 📋 Requirements Met

✅ Google OAuth sign-in only (no email/password)  
✅ Add bookmarks with URL and title  
✅ Private bookmarks per user (RLS policies)  
✅ Real-time updates across devices  
✅ Delete functionality  
✅ Deployed on Vercel  

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Supabase account
- Google Cloud Console project (for OAuth)

### 1. Clone the repository
```bash
git clone [your-repo-url]
cd bookmark-app
npm install
```

### 2. Set up Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase-schema.sql` in the SQL Editor
3. Enable Google OAuth in Authentication → Providers

### 3. Configure environment variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🐛 Problems Encountered & Solutions

### Problem 1: WebSocket Connection Blocked
**Issue:** Realtime updates failed with `WebSocket is closed before the connection is established` error on certain networks.

**Solution:** Implemented a smart fallback system that automatically switches to polling (every 3 seconds) when WebSocket connections are blocked. This ensures real-time-like updates work in all network environments, including corporate firewalls and restrictive ISPs.

```typescript
// Hybrid approach: WebSocket with polling fallback
if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
  pollingInterval = setInterval(() => {
    fetchBookmarks();
  }, 3000);
}
```

### Problem 2: Delete Button Not Visible on Mobile
**Issue:** The delete button used `opacity-0 group-hover:opacity-100`, which doesn't work on touch devices.

**Solution:** Made the button always visible on mobile using responsive Tailwind classes:
```tsx
className="opacity-100 md:opacity-0 md:group-hover:opacity-100"
```

### Problem 3: Missing Tags Column in Database
**Issue:** Initial schema didn't include the `tags` column, causing 404 errors when adding bookmarks.

**Solution:** Updated the schema to include tags as a PostgreSQL array:
```sql
alter table bookmarks add column if not exists tags text[] default '{}';
```

### Problem 4: OAuth Redirect URL Configuration
**Issue:** Google OAuth login failed with 404 errors on the deployed version.

**Solution:** Configured Supabase URL settings to include both localhost and production URLs:
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: `https://your-app.vercel.app/**` and `http://localhost:3000/**`

## 📁 Project Structure

```
bookmark-app/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main app page
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── AuthScreen.tsx    # Login screen
│   │   ├── BookmarkCard.tsx  # Bookmark display
│   │   ├── AddBookmarkModal.tsx
│   │   ├── ConfirmModal.tsx
│   │   └── Sidebar.tsx
│   └── lib/
│       ├── supabase.ts       # Supabase client
│       └── utils.ts          # Utility functions
├── public/                   # Static assets
├── supabase-schema.sql       # Database schema
└── package.json
```

## 🔐 Security Features

- **Row Level Security (RLS)** - Users can only access their own bookmarks
- **Secure Authentication** - Google OAuth via Supabase Auth
- **Environment Variables** - Sensitive keys stored securely
- **HTTPS Only** - All connections encrypted

## 🎨 UI/UX Highlights

- **Premium Dark Theme** - Modern, eye-friendly design
- **Smooth Animations** - Framer Motion for polished interactions
- **Responsive Layout** - Mobile-first design approach
- **Instant Feedback** - Loading states and error handling

## 📝 License

MIT

## 👤 Author

Jishnu T

---

Built with  using Next.js and Supabase
