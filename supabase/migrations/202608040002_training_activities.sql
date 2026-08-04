-- FA FITNESS V2: unified history for resistance, cardio, and fitness sessions.
-- This migration is additive and can be run after 202607310001_initial_schema.sql.

create type public.training_session_kind as enum ('resistance', 'cardio', 'fitness');
create type public.activity_category as enum ('cardio', 'fitness');

create table public.training_activities (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[a-z0-9-]+$'),
  category public.activity_category not null,
  name_ar text not null unique,
  name_en text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.user_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  file_name text not null check (char_length(file_name) between 1 and 255),
  storage_path text not null unique,
  mime_type text not null,
  file_size_bytes integer not null check (file_size_bytes > 0 and file_size_bytes <= 10485760),
  linked_entity_type text,
  linked_entity_id uuid,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.workout_sessions
  add column session_kind public.training_session_kind not null default 'resistance',
  add column activity_id uuid references public.training_activities(id) on delete set null,
  add column activity_name_snapshot text,
  add column distance_km numeric(8,2) check (distance_km >= 0),
  add column intensity numeric(3,1) check (intensity between 1 and 10);

alter table public.workout_sessions
  add constraint cardio_or_fitness_has_activity check (
    session_kind = 'resistance' or activity_name_snapshot is not null
  );

create index workout_sessions_user_completed_at_idx
  on public.workout_sessions (user_id, completed_at desc)
  where is_complete = true;
create index workout_sessions_user_kind_completed_at_idx
  on public.workout_sessions (user_id, session_kind, completed_at desc)
  where is_complete = true;
create index training_activities_category_active_idx
  on public.training_activities (category, is_active);
create index user_files_user_created_at_idx on public.user_files (user_id, created_at desc);

alter table public.training_activities enable row level security;
create policy "read active training activities" on public.training_activities
  for select to authenticated using (is_active);
alter table public.user_files enable row level security;
create policy "own files only" on public.user_files for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- The app subscribes to a user's own session rows after saving a workout.
alter publication supabase_realtime add table public.workout_sessions;

insert into storage.buckets (id, name, public, file_size_limit)
values ('user-files', 'user-files', false, 10485760)
on conflict (id) do update set public = false, file_size_limit = 10485760;
create policy "read own user files" on storage.objects for select to authenticated
  using (bucket_id = 'user-files' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "upload own user files" on storage.objects for insert to authenticated
  with check (bucket_id = 'user-files' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "update own user files" on storage.objects for update to authenticated
  using (bucket_id = 'user-files' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'user-files' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "delete own user files" on storage.objects for delete to authenticated
  using (bucket_id = 'user-files' and (storage.foldername(name))[1] = auth.uid()::text);
