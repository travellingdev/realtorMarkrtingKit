create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'FREE',
  quota_used int not null default 0,
  quota_extra int not null default 0,
  created_at timestamp with time zone default now()
);
alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select using ( auth.uid() = id );
create policy "profiles_update_own" on public.profiles for update using ( auth.uid() = id );

create type kit_status as enum ('PROCESSING','READY','FAILED');
create table if not exists public.kits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  status kit_status not null default 'PROCESSING',
  payload jsonb not null,
  outputs jsonb,
  created_at timestamp with time zone default now()
);
alter table public.kits enable row level security;
create policy "kits_select_own" on public.kits for select using ( auth.uid() = user_id );
create policy "kits_insert_own" on public.kits for insert with check ( auth.uid() = user_id );

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  type text not null,
  meta jsonb,
  created_at timestamp with time zone default now()
);
alter table public.events enable row level security;
create policy "events_rw_own" on public.events using ( auth.uid() = user_id ) with check ( auth.uid() = user_id );

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();