-- Run this once in Supabase: SQL Editor -> New query -> Run

create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique,
  display_name text,
  bio text,
  updated_at timestamptz default now()
);

create table if not exists messages (
  id bigint generated always as identity primary key,
  sender_id uuid not null references profiles(id) on delete cascade,
  receiver_id uuid not null references profiles(id) on delete cascade,
  content text not null check (length(content) between 1 and 2000),
  created_at timestamptz default now()
);

create index if not exists messages_pair_idx on messages (sender_id, receiver_id, created_at);
create index if not exists messages_receiver_idx on messages (receiver_id, created_at);

alter table profiles enable row level security;
alter table messages enable row level security;

create policy "profiles readable by signed-in users" on profiles
  for select to authenticated using (true);
create policy "insert own profile" on profiles
  for insert to authenticated with check (auth.uid() = id);
create policy "update own profile" on profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy "read own messages" on messages
  for select to authenticated using (auth.uid() in (sender_id, receiver_id));
create policy "send as myself" on messages
  for insert to authenticated with check (auth.uid() = sender_id);

-- Enable realtime for messages
alter publication supabase_realtime add table messages;
