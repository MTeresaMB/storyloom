-- Reemplaza por tu UUID real de Supabase antes de ejecutar
-- select auth.uid(); -- cuando estés autenticado
\set user_uuid 'dac6f4fa-6baf-4966-8d3c-597c1f3afa5e'

insert into public.stories (user_id, title, description, genre, target_words)
values ('dac6f4fa-6baf-4966-8d3c-597c1f3afa5e', 'Sample Story', 'Demo project', 'Fantasy', 80000)
on conflict do nothing;

-- Obtén el ID de la historia recién creada
with s as (
  select id from public.stories where user_id = 'dac6f4fa-6baf-4966-8d3c-597c1f3afa5e' order by created_at desc limit 1
)
insert into public.chapters (user_id, story_id, title, content, word_count)
select 'dac6f4fa-6baf-4966-8d3c-597c1f3afa5e', s.id, 'Chapter 1', 'Once upon a time...', 4 from s
on conflict do nothing;

