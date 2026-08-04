-- FA FITNESS: personal, user-owned data model. Run with Supabase CLI or SQL editor.
create extension if not exists "pgcrypto";

create type public.program_status as enum ('draft', 'active', 'completed', 'archived');
create type public.set_status as enum ('completed', 'skipped', 'pending');
create type public.note_category as enum ('training', 'nutrition', 'measurement', 'injury', 'general');
create type public.progress_photo_type as enum ('front', 'side', 'back', 'custom');

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = timezone('utc', now()); return new; end; $$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null check (char_length(first_name) between 2 and 80),
  birth_date date, gender text check (gender in ('male', 'female', 'undisclosed')) default 'undisclosed',
  height_cm numeric(5,2) check (height_cm between 100 and 250), current_weight_kg numeric(6,2) check (current_weight_kg between 30 and 350),
  target_weight_kg numeric(6,2) check (target_weight_kg between 30 and 350), experience_level text, primary_goal text, activity_level text,
  training_days_per_week smallint check (training_days_per_week between 1 and 7), training_location text, equipment_notes text, injury_notes text,
  avatar_path text, onboarding_completed_at timestamptz, created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now())
);
create table public.user_preferences (
  id uuid primary key default gen_random_uuid(), user_id uuid not null unique references public.profiles(id) on delete cascade,
  unit_system text not null default 'metric' check (unit_system in ('metric', 'imperial')), theme text not null default 'system' check (theme in ('light','dark','system')),
  locale text not null default 'ar-SA', notifications_enabled boolean not null default true, rest_sound_enabled boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now())
);
create table public.user_goals (
  id uuid primary key default gen_random_uuid(), user_id uuid not null unique references public.profiles(id) on delete cascade,
  calories_target integer check (calories_target between 500 and 10000), protein_target_g numeric(6,1) check (protein_target_g between 0 and 1000),
  carbs_target_g numeric(6,1) check (carbs_target_g between 0 and 2000), fat_target_g numeric(6,1) check (fat_target_g between 0 and 1000),
  water_target_ml integer not null default 3000 check (water_target_ml between 250 and 15000), created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now())
);
create table public.muscle_groups (id uuid primary key default gen_random_uuid(), name_ar text not null unique, name_en text not null unique, created_at timestamptz not null default timezone('utc', now()));
create table public.equipment (id uuid primary key default gen_random_uuid(), name_ar text not null unique, name_en text not null unique, created_at timestamptz not null default timezone('utc', now()));
create table public.exercises (
  id uuid primary key default gen_random_uuid(), user_id uuid references public.profiles(id) on delete cascade,
  name_ar text not null, name_en text not null, primary_muscle_id uuid references public.muscle_groups(id), difficulty text check (difficulty in ('beginner','intermediate','advanced')), movement_type text,
  instructions text, common_mistakes text, safety_notes text, video_url text, image_path text, personal_notes text, is_archived boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now()), deleted_at timestamptz,
  unique (user_id, name_ar)
);
create table public.exercise_muscles (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, exercise_id uuid not null references public.exercises(id) on delete cascade, muscle_group_id uuid not null references public.muscle_groups(id), is_primary boolean not null default false, unique(exercise_id, muscle_group_id));
create table public.exercise_equipment (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, exercise_id uuid not null references public.exercises(id) on delete cascade, equipment_id uuid not null references public.equipment(id), unique(exercise_id, equipment_id));
create table public.workout_programs (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, name text not null, program_type text not null default 'custom', goal text,
  status public.program_status not null default 'draft', start_date date, end_date date, notes text, is_active boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now()), deleted_at timestamptz,
  unique(user_id, name)
);
create unique index one_active_program_per_user on public.workout_programs(user_id) where is_active and deleted_at is null;
create table public.workout_days (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, program_id uuid not null references public.workout_programs(id) on delete cascade, name text not null, day_order smallint not null check (day_order > 0), weekday smallint check (weekday between 0 and 6), notes text, created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now()), unique(program_id, day_order));
create table public.workout_day_exercises (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, workout_day_id uuid not null references public.workout_days(id) on delete cascade, exercise_id uuid not null references public.exercises(id), exercise_order smallint not null check(exercise_order > 0), target_sets smallint not null check(target_sets between 1 and 20), target_reps_min smallint check(target_reps_min >= 0), target_reps_max smallint check(target_reps_max >= target_reps_min), target_weight_kg numeric(7,2), rest_seconds integer not null default 90 check(rest_seconds between 0 and 3600), notes text, created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now()), unique(workout_day_id, exercise_order));
create table public.workout_sessions (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, program_id uuid references public.workout_programs(id) on delete set null, workout_day_id uuid references public.workout_days(id) on delete set null, started_at timestamptz not null default timezone('utc', now()), completed_at timestamptz, duration_seconds integer check(duration_seconds >= 0), overall_rpe numeric(3,1) check(overall_rpe between 1 and 10), notes text, estimated_calories integer check(estimated_calories >= 0), is_complete boolean not null default false, created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now()));
create table public.workout_session_exercises (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, session_id uuid not null references public.workout_sessions(id) on delete cascade, exercise_id uuid references public.exercises(id) on delete set null, name_snapshot text not null, exercise_order smallint not null check(exercise_order > 0), was_skipped boolean not null default false, notes text, created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now()), unique(session_id, exercise_order));
create table public.workout_sets (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, session_exercise_id uuid not null references public.workout_session_exercises(id) on delete cascade, set_number smallint not null check(set_number > 0), weight_kg numeric(7,2) check(weight_kg >= 0), reps smallint check(reps >= 0), rpe numeric(3,1) check(rpe between 1 and 10), status public.set_status not null default 'pending', notes text, completed_at timestamptz, created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now()), unique(session_exercise_id, set_number));
create table public.personal_records (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, exercise_id uuid references public.exercises(id) on delete cascade, record_type text not null check(record_type in ('max_weight','max_reps','max_volume','best_set','best_session','longest_session','weekly_exercises')), value numeric(12,2) not null check(value >= 0), unit text not null, achieved_at timestamptz not null default timezone('utc', now()), source_session_id uuid references public.workout_sessions(id) on delete set null, created_at timestamptz not null default timezone('utc', now()));
create table public.body_measurements (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, measured_on date not null default current_date, weight_kg numeric(6,2) check(weight_kg between 30 and 350), body_fat_percent numeric(5,2) check(body_fat_percent between 0 and 100), muscle_mass_kg numeric(6,2) check(muscle_mass_kg >= 0), waist_cm numeric(6,2) check(waist_cm >= 0), chest_cm numeric(6,2) check(chest_cm >= 0), right_arm_cm numeric(6,2) check(right_arm_cm >= 0), left_arm_cm numeric(6,2) check(left_arm_cm >= 0), thigh_cm numeric(6,2) check(thigh_cm >= 0), neck_cm numeric(6,2) check(neck_cm >= 0), hip_cm numeric(6,2) check(hip_cm >= 0), notes text, created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now()), unique(user_id, measured_on));
create table public.progress_photos (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, measured_on date not null default current_date, photo_type public.progress_photo_type not null, storage_path text not null unique, weight_kg numeric(6,2), notes text, file_size_bytes integer check(file_size_bytes > 0 and file_size_bytes <= 10485760), created_at timestamptz not null default timezone('utc', now()));
create table public.nutrition_goals (id uuid primary key default gen_random_uuid(), user_id uuid not null unique references public.profiles(id) on delete cascade, calories integer not null check(calories between 500 and 10000), protein_g numeric(6,1) not null check(protein_g >= 0), carbs_g numeric(6,1) not null check(carbs_g >= 0), fat_g numeric(6,1) not null check(fat_g >= 0), updated_at timestamptz not null default timezone('utc', now()));
create table public.nutrition_entries (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, eaten_at timestamptz not null default timezone('utc', now()), meal_type text not null, food_name text not null, amount text, calories integer not null check(calories >= 0), protein_g numeric(6,1) not null default 0 check(protein_g >= 0), carbs_g numeric(6,1) not null default 0 check(carbs_g >= 0), fat_g numeric(6,1) not null default 0 check(fat_g >= 0), notes text, created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now()));
create table public.saved_meals (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, name text not null, meal_type text, items jsonb not null default '[]'::jsonb, calories integer not null default 0 check(calories >= 0), protein_g numeric(6,1) not null default 0 check(protein_g >= 0), carbs_g numeric(6,1) not null default 0 check(carbs_g >= 0), fat_g numeric(6,1) not null default 0 check(fat_g >= 0), created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now()));
create table public.water_entries (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, consumed_at timestamptz not null default timezone('utc', now()), amount_ml integer not null check(amount_ml between 1 and 5000), created_at timestamptz not null default timezone('utc', now()));
create table public.achievements (id uuid primary key default gen_random_uuid(), code text not null unique, title_ar text not null, description_ar text not null, category text not null, points integer not null default 0 check(points >= 0), badge_icon text, rule_key text not null, created_at timestamptz not null default timezone('utc', now()));
create table public.user_achievements (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, achievement_id uuid not null references public.achievements(id) on delete cascade, awarded_at timestamptz not null default timezone('utc', now()), unique(user_id, achievement_id));
create table public.challenges (id uuid primary key default gen_random_uuid(), title_ar text not null, description_ar text not null, cadence text not null check(cadence in ('daily','weekly')), target_value integer not null check(target_value > 0), rule_key text not null, is_active boolean not null default true, created_at timestamptz not null default timezone('utc', now()));
create table public.user_challenges (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, challenge_id uuid not null references public.challenges(id) on delete cascade, progress_value integer not null default 0 check(progress_value >= 0), completed_at timestamptz, starts_on date not null default current_date, unique(user_id, challenge_id, starts_on));
create table public.calendar_events (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, event_date date not null, event_type text not null, title text not null, details jsonb not null default '{}'::jsonb, created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now()));
create table public.notes (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, category public.note_category not null default 'general', title text not null, content text not null, noted_at timestamptz not null default timezone('utc', now()), session_id uuid references public.workout_sessions(id) on delete set null, exercise_id uuid references public.exercises(id) on delete set null, measurement_id uuid references public.body_measurements(id) on delete set null, created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now()));
create table public.notifications (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, notification_type text not null, title text not null, body text not null, read_at timestamptz, scheduled_for timestamptz, created_at timestamptz not null default timezone('utc', now()));
create table public.motivational_messages (id uuid primary key default gen_random_uuid(), body_ar text not null, context text not null default 'general', is_active boolean not null default true, created_at timestamptz not null default timezone('utc', now()));
create table public.backup_logs (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, backup_type text not null check(backup_type in ('json','csv','import')), status text not null check(status in ('started','completed','failed')), storage_path text, created_at timestamptz not null default timezone('utc', now()));
create table public.activity_logs (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade, action text not null, entity_type text not null, entity_id uuid, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default timezone('utc', now()));
create table public.app_settings (id uuid primary key default gen_random_uuid(), user_id uuid not null unique references public.profiles(id) on delete cascade, last_sync_at timestamptz, last_backup_at timestamptz, storage_used_bytes bigint not null default 0 check(storage_used_bytes >= 0), updated_at timestamptz not null default timezone('utc', now()));

create index sessions_user_completed_idx on public.workout_sessions(user_id, completed_at desc);
create index nutrition_entries_user_eaten_idx on public.nutrition_entries(user_id, eaten_at desc);
create index water_entries_user_consumed_idx on public.water_entries(user_id, consumed_at desc);
create index measurements_user_date_idx on public.body_measurements(user_id, measured_on desc);
create index notes_user_date_idx on public.notes(user_id, noted_at desc);
create index calendar_events_user_date_idx on public.calendar_events(user_id, event_date);

create or replace function public.seed_default_program(target_user_id uuid) returns void language plpgsql security definer set search_path = public as $$
declare default_program_id uuid; day_a_id uuid; day_b_id uuid; day_c_id uuid;
begin
  if exists(select 1 from public.workout_programs where user_id = target_user_id) then return; end if;
  insert into public.workout_programs (user_id,name,program_type,goal,status,is_active) values (target_user_id,'Full Body A / B / C','full_body','بناء العضلات','active',true) returning id into default_program_id;
  insert into public.workout_days (user_id,program_id,name,day_order,weekday) values (target_user_id,default_program_id,'Full Body A',1,0) returning id into day_a_id;
  insert into public.workout_days (user_id,program_id,name,day_order,weekday) values (target_user_id,default_program_id,'Full Body B',2,2) returning id into day_b_id;
  insert into public.workout_days (user_id,program_id,name,day_order,weekday) values (target_user_id,default_program_id,'Full Body C',3,4) returning id into day_c_id;
  insert into public.workout_day_exercises (user_id,workout_day_id,exercise_id,exercise_order,target_sets,target_reps_min,target_reps_max,rest_seconds)
  select target_user_id, day_a_id, e.id, x.exercise_order, x.target_sets, x.reps_min, x.reps_max, x.rest_seconds from (values
    ('سكوات بالبار',1,4,6,8,120),('ضغط صدر بالبار',2,4,6,8,120),('تجديف بار منحني',3,3,8,10,90)) as x(name_ar,exercise_order,target_sets,reps_min,reps_max,rest_seconds) join public.exercises e on e.name_ar=x.name_ar and e.user_id is null;
  insert into public.workout_day_exercises (user_id,workout_day_id,exercise_id,exercise_order,target_sets,target_reps_min,target_reps_max,rest_seconds)
  select target_user_id, day_b_id, e.id, x.exercise_order, x.target_sets, x.reps_min, x.reps_max, x.rest_seconds from (values
    ('رفعة رومانية',1,3,8,10,120),('ضغط كتف واقف',2,3,8,10,90),('سحب علوي',3,3,10,12,75)) as x(name_ar,exercise_order,target_sets,reps_min,reps_max,rest_seconds) join public.exercises e on e.name_ar=x.name_ar and e.user_id is null;
  insert into public.workout_day_exercises (user_id,workout_day_id,exercise_id,exercise_order,target_sets,target_reps_min,target_reps_max,rest_seconds)
  select target_user_id, day_c_id, e.id, x.exercise_order, x.target_sets, x.reps_min, x.reps_max, x.rest_seconds from (values
    ('ضغط الأرجل',1,3,10,12,90),('ضغط دمبل مائل',2,3,8,12,75),('تجديف كيبل جالس',3,3,10,12,75)) as x(name_ar,exercise_order,target_sets,reps_min,reps_max,rest_seconds) join public.exercises e on e.name_ar=x.name_ar and e.user_id is null;
end; $$;
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, first_name) values (new.id, coalesce(new.raw_user_meta_data->>'first_name', 'رياضي'));
  insert into public.user_preferences (user_id) values (new.id);
  insert into public.user_goals (user_id,calories_target,protein_target_g,carbs_target_g,fat_target_g,water_target_ml) values (new.id,2400,170,260,70,3000);
  insert into public.nutrition_goals (user_id,calories,protein_g,carbs_g,fat_g) values (new.id,2400,170,260,70);
  insert into public.app_settings (user_id) values (new.id);
  perform public.seed_default_program(new.id);
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

-- Every user-owned table only exposes rows whose user_id is the authenticated user.
do $$ declare table_name text; begin
  foreach table_name in array array['user_preferences','user_goals','exercise_muscles','exercise_equipment','workout_programs','workout_days','workout_day_exercises','workout_sessions','workout_session_exercises','workout_sets','personal_records','body_measurements','progress_photos','nutrition_goals','nutrition_entries','saved_meals','water_entries','user_achievements','user_challenges','calendar_events','notes','notifications','backup_logs','activity_logs','app_settings'] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('create policy "own rows only" on public.%I for all using (user_id = auth.uid()) with check (user_id = auth.uid())', table_name);
  end loop;
end $$;
alter table public.profiles enable row level security;
create policy "own profile only" on public.profiles for all using (id = auth.uid()) with check (id = auth.uid());
alter table public.exercises enable row level security;
create policy "read personal or catalog exercises" on public.exercises for select using (user_id = auth.uid() or user_id is null);
create policy "write personal exercises" on public.exercises for insert with check (user_id = auth.uid());
create policy "update personal exercises" on public.exercises for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "delete personal exercises" on public.exercises for delete using (user_id = auth.uid());
alter table public.muscle_groups enable row level security; create policy "read muscles" on public.muscle_groups for select to authenticated using (true);
alter table public.equipment enable row level security; create policy "read equipment" on public.equipment for select to authenticated using (true);
alter table public.achievements enable row level security; create policy "read achievements" on public.achievements for select to authenticated using (true);
alter table public.challenges enable row level security; create policy "read challenges" on public.challenges for select to authenticated using (true);
alter table public.motivational_messages enable row level security; create policy "read motivational messages" on public.motivational_messages for select to authenticated using (is_active);

-- Private storage path format: {auth.uid()}/{filename}. Rejects cross-account reads and writes.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values ('progress-photos', 'progress-photos', false, 10485760, array['image/jpeg','image/png','image/webp']) on conflict (id) do update set public = false;
create policy "read own progress photos" on storage.objects for select to authenticated using (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "upload own progress photos" on storage.objects for insert to authenticated with check (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "update own progress photos" on storage.objects for update to authenticated using (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text) with check (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "delete own progress photos" on storage.objects for delete to authenticated using (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text);

do $$ declare table_name text; begin
  foreach table_name in array array['profiles','user_preferences','user_goals','exercises','workout_programs','workout_days','workout_day_exercises','workout_sessions','workout_session_exercises','workout_sets','body_measurements','nutrition_entries','saved_meals','notes','calendar_events','app_settings'] loop
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute procedure public.set_updated_at()', table_name, table_name);
  end loop;
end $$;
