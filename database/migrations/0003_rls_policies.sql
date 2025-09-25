alter table public.characters enable row level security;
alter table public.locations enable row level security;
alter table public.objects enable row level security;
alter table public.stories enable row level security;
alter table public.chapters enable row level security;

do $$ begin
  execute 'drop policy if exists "select own characters" on public.characters';
  execute 'drop policy if exists "insert own characters" on public.characters';
  execute 'drop policy if exists "update own characters" on public.characters';
  execute 'drop policy if exists "delete own characters" on public.characters';

  execute 'drop policy if exists "select own locations" on public.locations';
  execute 'drop policy if exists "insert own locations" on public.locations';
  execute 'drop policy if exists "update own locations" on public.locations';
  execute 'drop policy if exists "delete own locations" on public.locations';

  execute 'drop policy if exists "select own objects" on public.objects';
  execute 'drop policy if exists "insert own objects" on public.objects';
  execute 'drop policy if exists "update own objects" on public.objects';
  execute 'drop policy if exists "delete own objects" on public.objects';

  execute 'drop policy if exists "select own stories" on public.stories';
  execute 'drop policy if exists "insert own stories" on public.stories';
  execute 'drop policy if exists "update own stories" on public.stories';
  execute 'drop policy if exists "delete own stories" on public.stories';

  execute 'drop policy if exists "select own chapters" on public.chapters';
  execute 'drop policy if exists "insert own chapters" on public.chapters';
  execute 'drop policy if exists "update own chapters" on public.chapters';
  execute 'drop policy if exists "delete own chapters" on public.chapters';
end $$;


-- characters
create policy "select own characters" on public.characters for select using (user_id = auth.uid());
create policy "insert own characters" on public.characters for insert with check (user_id = auth.uid());
create policy "update own characters" on public.characters for update using (user_id = auth.uid());
create policy "delete own characters" on public.characters for delete using (user_id = auth.uid());

-- locations
create policy "select own locations" on public.locations for select using (user_id = auth.uid());
create policy "insert own locations" on public.locations for insert with check (user_id = auth.uid());
create policy "update own locations" on public.locations for update using (user_id = auth.uid());
create policy "delete own locations" on public.locations for delete using (user_id = auth.uid());

-- objects
create policy "select own objects" on public.objects for select using (user_id = auth.uid());
create policy "insert own objects" on public.objects for insert with check (user_id = auth.uid());
create policy "update own objects" on public.objects for update using (user_id = auth.uid());
create policy "delete own objects" on public.objects for delete using (user_id = auth.uid());

-- stories
create policy "select own stories" on public.stories for select using (user_id = auth.uid());
create policy "insert own stories" on public.stories for insert with check (user_id = auth.uid());
create policy "update own stories" on public.stories for update using (user_id = auth.uid());
create policy "delete own stories" on public.stories for delete using (user_id = auth.uid());

-- chapters
create policy "select own chapters" on public.chapters for select using (user_id = auth.uid());
create policy "insert own chapters" on public.chapters for insert with check (user_id = auth.uid());
create policy "update own chapters" on public.chapters for update using (user_id = auth.uid());
create policy "delete own chapters" on public.chapters for delete using (user_id = auth.uid());

