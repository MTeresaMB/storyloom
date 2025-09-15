-- Extensión para UUIDs
create extension if not exists pgcrypto;

-- Tabla characters
create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text default '',
  age int,
  appearance text default '',
  personality text default '',
  background text default '',
  goals text default '',
  conflicts text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tabla locations
create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tabla objects
create table if not exists public.objects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text default '',
  location_id uuid references public.locations(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tabla stories (proyectos)
create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text default '',
  genre text default '',
  target_words int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tabla chapters
create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  story_id uuid references public.stories(id) on delete cascade,
  title text not null default 'Untitled',
  content text not null default '',
  word_count int not null default 0,
  last_modified timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

