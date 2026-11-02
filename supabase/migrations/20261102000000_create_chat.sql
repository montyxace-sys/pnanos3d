-- Chat threads and encrypted messages (E2EE: server only stores ciphertext)
create table if not exists public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  sender_id uuid not null references auth.users(id),
  ciphertext text not null,
  iv text not null,
  created_at timestamptz not null default now()
);

alter table public.chat_threads enable row level security;
alter table public.chat_admins enable row level security;
alter table public.chat_messages enable row level security;

-- Threads: user owns; admin can read all
create policy "threads_select_own_or_admin"
  on public.chat_threads for select to authenticated
  using (user_id = auth.uid() or exists (select 1 from public.chat_admins a where a.user_id = auth.uid()));

create policy "threads_insert_own"
  on public.chat_threads for insert to authenticated
  with check (user_id = auth.uid());

create policy "threads_update_own"
  on public.chat_threads for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Admins
create policy "admins_select_self"
  on public.chat_admins for select to authenticated
  using (user_id = auth.uid());

-- Messages: read if thread owner or admin
create policy "messages_select_thread"
  on public.chat_messages for select to authenticated
  using (
    exists (select 1 from public.chat_threads t where t.id = thread_id and (t.user_id = auth.uid() or exists (select 1 from public.chat_admins a where a.user_id = auth.uid())))
  );

-- Insert: sender must be auth user and thread accessible
create policy "messages_insert_thread"
  on public.chat_messages for insert to authenticated
  with check (
    sender_id = auth.uid() and
    exists (select 1 from public.chat_threads t where t.id = thread_id and (t.user_id = auth.uid() or exists (select 1 from public.chat_admins a where a.user_id = auth.uid())))
  );

create or replace function public.set_chat_updated_at()
returns trigger language plpgsql as $$
begin
  update public.chat_threads set updated_at = now() where id = new.thread_id;
  return new;
end;
$$;

drop trigger if exists chat_messages_touch_thread on public.chat_messages;
create trigger chat_messages_touch_thread
  after insert on public.chat_messages
  for each row execute function public.set_chat_updated_at();
