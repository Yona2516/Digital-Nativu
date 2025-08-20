-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (metadata is primarily in auth.users)
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  email text unique,
  name text,
  role text check (role in ('admin','user')) default 'user',
  created_at timestamp with time zone default now()
);

-- Comments table
create table if not exists public.comments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete set null,
  name text,
  email text,
  comment_text text not null,
  status text check (status in ('pending','approved','rejected')) default 'pending',
  created_at timestamp with time zone default now()
);

-- Files table
create table if not exists public.files (
  id uuid primary key default uuid_generate_v4(),
  admin_id uuid references public.users(id) on delete set null,
  file_url text not null,
  file_type text,
  category text,
  uploaded_at timestamp with time zone default now()
);

-- Contents table
create table if not exists public.contents (
  id uuid primary key default uuid_generate_v4(),
  section text not null,
  title text,
  body text,
  media_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS
alter table public.comments enable row level security;
alter table public.files enable row level security;
alter table public.contents enable row level security;
alter table public.users enable row level security;

-- Policies
-- Users: admins full, others read own row
create policy if not exists users_admin_all on public.users for all using (
  exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
) with check (
  exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
);

create policy if not exists users_read_self on public.users for select using (
  id = auth.uid()
);

-- Comments policies
create policy if not exists comments_insert_any on public.comments for insert with check (true);
create policy if not exists comments_select_approved on public.comments for select using (status = 'approved');
create policy if not exists comments_admin_all on public.comments for all using (
  exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
) with check (
  exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
);

-- Files policies (admin only)
create policy if not exists files_admin_all on public.files for all using (
  exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
) with check (
  exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
);

-- Contents policies (admin only)
create policy if not exists contents_admin_all on public.contents for all using (
  exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
) with check (
  exists(select 1 from public.users u where u.id = auth.uid() and u.role = 'admin')
);

-- Storage bucket note: create from dashboard named 'digitalnatives_files'.


