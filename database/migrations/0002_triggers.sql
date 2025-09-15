-- Función updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers updated_at
drop trigger if exists trg_characters_set_updated_at on public.characters;
create trigger trg_characters_set_updated_at
before update on public.characters
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_locations_set_updated_at on public.locations;
create trigger trg_locations_set_updated_at
before update on public.locations
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_objects_set_updated_at on public.objects;
create trigger trg_objects_set_updated_at
before update on public.objects
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_stories_set_updated_at on public.stories;
create trigger trg_stories_set_updated_at
before update on public.stories
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_chapters_set_updated_at on public.chapters;
create trigger trg_chapters_set_updated_at
before update on public.chapters
for each row execute procedure public.set_updated_at();

