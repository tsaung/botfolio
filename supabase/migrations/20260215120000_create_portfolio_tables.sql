-- Create projects table
create table if not exists public.projects (
    id uuid not null default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    title text not null,
    description text,
    image_url text,
    live_url text,
    repo_url text,
    tags text[],
    sort_order integer default 0,
    status text default 'published' check (status in ('published', 'draft', 'archived')),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    constraint projects_pkey primary key (id)
);

-- Create experiences table
create table if not exists public.experiences (
    id uuid not null default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    title text not null,
    company text not null,
    location text,
    start_date date not null,
    end_date date, -- null means "current"
    description text,
    sort_order integer default 0,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    constraint experiences_pkey primary key (id)
);

-- Create skills table
create table if not exists public.skills (
    id uuid not null default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    name text not null,
    category text not null,
    proficiency integer check (proficiency >= 1 and proficiency <= 5),
    sort_order integer default 0,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    constraint skills_pkey primary key (id)
);

-- Create social_links table
create table if not exists public.social_links (
    id uuid not null default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    platform text not null,
    url text not null,
    sort_order integer default 0,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    constraint social_links_pkey primary key (id)
);

-- Enable RLS
alter table public.projects enable row level security;
alter table public.experiences enable row level security;
alter table public.skills enable row level security;
alter table public.social_links enable row level security;

-- RLS Policies for projects
create policy "Public projects are viewable by everyone"
    on public.projects for select
    using (true);

create policy "Users can insert their own projects"
    on public.projects for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own projects"
    on public.projects for update
    using (auth.uid() = user_id);

create policy "Users can delete their own projects"
    on public.projects for delete
    using (auth.uid() = user_id);

-- RLS Policies for experiences
create policy "Public experiences are viewable by everyone"
    on public.experiences for select
    using (true);

create policy "Users can insert their own experiences"
    on public.experiences for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own experiences"
    on public.experiences for update
    using (auth.uid() = user_id);

create policy "Users can delete their own experiences"
    on public.experiences for delete
    using (auth.uid() = user_id);

-- RLS Policies for skills
create policy "Public skills are viewable by everyone"
    on public.skills for select
    using (true);

create policy "Users can insert their own skills"
    on public.skills for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own skills"
    on public.skills for update
    using (auth.uid() = user_id);

create policy "Users can delete their own skills"
    on public.skills for delete
    using (auth.uid() = user_id);

-- RLS Policies for social_links
create policy "Public social_links are viewable by everyone"
    on public.social_links for select
    using (true);

create policy "Users can insert their own social_links"
    on public.social_links for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own social_links"
    on public.social_links for update
    using (auth.uid() = user_id);

create policy "Users can delete their own social_links"
    on public.social_links for delete
    using (auth.uid() = user_id);

-- Indexes
create index if not exists projects_user_id_idx on public.projects (user_id);
create index if not exists experiences_user_id_idx on public.experiences (user_id);
create index if not exists skills_user_id_idx on public.skills (user_id);
create index if not exists social_links_user_id_idx on public.social_links (user_id);

-- Triggers for updated_at
-- Assuming handle_updated_at function exists from previous migrations (it usually does in Supabase templates or verify if we need to create it)
-- To be safe, I will check if it exists or create it, but usually standard is to just use it. 
-- Actually, let's just create the triggers.
-- The function usually is `moddatetime` extension or a custom function. 
-- Looking at previous migrations/files might be good, but standard custom trigger is safest.

-- Create a generic updated_at trigger function if it doesn't exist (or just reuse if we know its name).
-- I'll use a standard block.

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_updated_at_projects
    before update on public.projects
    for each row
    execute function public.handle_updated_at();

create trigger handle_updated_at_experiences
    before update on public.experiences
    for each row
    execute function public.handle_updated_at();

create trigger handle_updated_at_skills
    before update on public.skills
    for each row
    execute function public.handle_updated_at();

create trigger handle_updated_at_social_links
    before update on public.social_links
    for each row
    execute function public.handle_updated_at();
