import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
    timeout: 60000, // Increase connection timeout to 60s
    heartbeatIntervalMs: 5000, // Send heartbeats more frequently
  },
});

export type Bookmark = {
  id: string;
  user_id: string;
  title: string;
  url: string;
  created_at: string;
  tags?: string[]; // Optional for now
};
