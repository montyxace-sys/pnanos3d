-- Tabla de planos por usuario (datos personales)
create table if not exists public.user_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Plan sin titulo',
  plan jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_plans enable row level security;

create policy "user_plans_select_own"
  on public.user_plans for select to authenticated using (auth.uid() = user_id);

create policy "user_plans_insert_own"
  on public.user_plans for insert to authenticated with check (auth.uid() = user_id);

create policy "user_plans_update_own"
  on public.user_plans for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "user_plans_delete_own"
  on public.user_plans for delete to authenticated using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_plans_set_updated_at on public.user_plans;
create trigger user_plans_set_updated_at
  before update on public.user_plans
  for each row execute function public.set_updated_at();
