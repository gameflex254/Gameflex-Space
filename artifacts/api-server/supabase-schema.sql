-- GameFlex Supabase schema bootstrap
-- Run this in the Supabase SQL editor for the target project.

create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  username text,
  phone text,
  email text,
  avatar_url text,
  game_handle text,
  wallet_balance numeric default 0,
  is_verified boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  referral_code text,
  bio text,
  followers_count integer default 0,
  following_count integer default 0
);

create table if not exists public.achievements (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  icon text,
  points integer default 0,
  category text,
  requirement_type text,
  requirement_value integer default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.tournaments (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  game text,
  format text,
  status text,
  entry_fee numeric default 0,
  prize_pool numeric default 0,
  max_participants integer default 0,
  current_participants integer default 0,
  start_date timestamptz,
  end_date timestamptz,
  registration_deadline timestamptz,
  rules text,
  image_url text,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  group_link text
);

create table if not exists public.marketplace_listings (
  id uuid primary key default uuid_generate_v4(),
  seller_id uuid not null,
  title text not null,
  description text,
  category text,
  price numeric default 0,
  image_url text,
  status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  tournament_id uuid not null,
  amount numeric default 0,
  method text,
  status text,
  transaction_code text,
  screenshot_url text,
  verified_by uuid,
  verified_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.registrations (
  id uuid primary key default uuid_generate_v4(),
  tournament_id uuid not null,
  user_id uuid not null,
  status text,
  payment_id uuid,
  game_handle text,
  seed_number integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lobby_id text
);

create table if not exists public.user_statuses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  content text,
  media_url text,
  media_type text,
  likes_count integer default 0,
  views_count integer default 0,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  comments_count integer default 0,
  post_type text,
  game text,
  tournament_id uuid,
  tags jsonb default '[]'::jsonb
);

create table if not exists public.matches (
  id uuid primary key default uuid_generate_v4(),
  tournament_id uuid not null,
  match_number integer not null,
  round integer default 1,
  player1_id uuid,
  player2_id uuid,
  player1_score integer,
  player2_score integer,
  status text,
  scheduled_at timestamptz,
  completed_at timestamptz,
  winner_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_user_id_idx on public.profiles (user_id);
create index if not exists tournaments_created_by_idx on public.tournaments (created_by);
create index if not exists payments_user_id_idx on public.payments (user_id);
create index if not exists payments_tournament_id_idx on public.payments (tournament_id);
create index if not exists registrations_tournament_id_idx on public.registrations (tournament_id);
create index if not exists registrations_user_id_idx on public.registrations (user_id);
create index if not exists user_statuses_user_id_idx on public.user_statuses (user_id);
create index if not exists matches_tournament_id_idx on public.matches (tournament_id);
