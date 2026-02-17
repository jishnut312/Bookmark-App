-- Create bookmarks table if it doesn't exist
create table if not exists bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  tags text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add tags column if it doesn't exist (safety measure)
alter table bookmarks add column if not exists tags text[] default '{}';

-- Enable Row Level Security
alter table bookmarks enable row level security;

-- Drop existing policies to recreate them safely
drop policy if exists "Users can view their own bookmarks" on bookmarks;
drop policy if exists "Users can insert their own bookmarks" on bookmarks;
drop policy if exists "Users can delete their own bookmarks" on bookmarks;

-- Create policies
create policy "Users can view their own bookmarks"
  on bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own bookmarks"
  on bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own bookmarks"
  on bookmarks for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists bookmarks_user_id_idx on bookmarks(user_id);

-- Enable Realtime for the bookmarks table
-- This check block ensures we don't error if the table is already in the publication
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' 
    and schemaname = 'public' 
    and tablename = 'bookmarks'
  ) then
    alter publication supabase_realtime add table bookmarks;
  end if;
end $$;
