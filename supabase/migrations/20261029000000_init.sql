-- Esquema inicial del sitio (Next.js estático + Supabase).
-- Restricciones espejo de las validaciones del cliente en src/components/ContactForm.tsx

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Solicitudes de contacto
-- ---------------------------------------------------------------------------
create table if not exists public.contact_requests (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text not null
               check (char_length(trim(name)) between 2 and 100),
  email        text not null
               check (char_length(email) between 5 and 255)
               check (email ~* '^[^[:space:]]+@[^[:space:]]+\.[^[:space:]]{2,}$'),
  phone        text check (phone is null or char_length(phone) between 1 and 30),
  project_type text check (project_type is null or char_length(project_type) <= 40),
  message      text not null
               check (char_length(trim(message)) between 10 and 2000),
  source       text not null default 'web-contacto'
               check (char_length(source) <= 40)
);

create index if not exists contact_requests_created_at_idx
  on public.contact_requests (created_at desc);

alter table public.contact_requests enable row level security;

-- El cliente público solo puede crear solicitudes: sin select, update ni delete.
drop policy if exists "insert contact_requests" on public.contact_requests;
create policy "insert contact_requests"
  on public.contact_requests
  for insert
  to anon, authenticated
  with check (true);

-- ---------------------------------------------------------------------------
-- Proyectos / galería (datos dinámicos)
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id         text primary key,
  title      text not null check (char_length(title) between 1 and 120),
  category   text not null default 'otros' check (char_length(category) <= 40),
  image      text not null check (char_length(image) <= 200),
  summary    text check (summary is null or char_length(summary) <= 300),
  sort_order integer not null default 0,
  published  boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;

-- Lectura pública solo de lo publicado; escritura exclusiva del service role.
drop policy if exists "read published projects" on public.projects;
create policy "read published projects"
  on public.projects
  for select
  to anon, authenticated
  using (published = true);
