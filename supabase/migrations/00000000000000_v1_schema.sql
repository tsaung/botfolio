-- =============================================================================
-- BotFolio V1 Schema
-- Consolidated migration for clean production deployment
-- =============================================================================

-- =============================================================================
-- Extensions
-- =============================================================================
create extension if not exists vector with schema extensions;

-- =============================================================================
-- 1. profiles: User identity and context
-- =============================================================================
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text not null,
  avatar_url text,
  profession text not null,
  experience int not null default 0,
  field text not null,
  welcome_message text not null,
  professional_summary text not null,
  chat_welcome_message text,
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select using (true);

create policy "Users can insert their own profile."
  on profiles for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile."
  on profiles for update using ((select auth.uid()) = id);

-- =============================================================================
-- 2. bot_configs: AI assistant configuration
-- =============================================================================
create table bot_configs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null check (type in ('public_agent', 'admin_agent')),
  provider text not null default 'openrouter',
  model text not null default 'google/gemini-2.0-flash-001',
  system_prompt text,
  predefined_prompts jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, type)
);

alter table bot_configs enable row level security;

create policy "Users can view own bot config."
  on bot_configs for select using (auth.uid() = user_id);

create policy "Users can update own bot config."
  on bot_configs for update using (auth.uid() = user_id);

create policy "Users can insert own bot config."
  on bot_configs for insert with check (auth.uid() = user_id);

create policy "Public can view public_agent config."
  on bot_configs for select using (type = 'public_agent');

-- =============================================================================
-- 3. knowledge_documents: RAG content store
-- =============================================================================
create table knowledge_documents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  content text not null,
  type text not null check (type in ('manual', 'ai_generated', 'auto_generated')),
  metadata jsonb,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_knowledge_documents_user_id on knowledge_documents(user_id);

alter table knowledge_documents enable row level security;

create policy "Users can view own documents."
  on knowledge_documents for select using (auth.uid() = user_id);

create policy "Users can insert own documents."
  on knowledge_documents for insert with check (auth.uid() = user_id);

create policy "Users can update own documents."
  on knowledge_documents for update using (auth.uid() = user_id);

create policy "Users can delete own documents."
  on knowledge_documents for delete using (auth.uid() = user_id);

create policy "Public can view active documents."
  on knowledge_documents for select using (status = 'active');

-- =============================================================================
-- 4. knowledge_chunks: Vector embeddings for RAG similarity search
--    Embedding model: gemini-embedding-001 @ 1536 dimensions
-- =============================================================================
create table knowledge_chunks (
  id uuid default gen_random_uuid() primary key,
  document_id uuid references knowledge_documents(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  embedding vector(1536),
  chunk_index integer not null,
  token_count integer,
  metadata jsonb,
  created_at timestamptz default now()
);

create index idx_knowledge_chunks_user_id on knowledge_chunks(user_id);
create index idx_knowledge_chunks_embedding on knowledge_chunks
  using hnsw (embedding vector_cosine_ops);

alter table knowledge_chunks enable row level security;

create policy "Users can view own chunks."
  on knowledge_chunks for select using (auth.uid() = user_id);

create policy "Users can insert own chunks."
  on knowledge_chunks for insert with check (auth.uid() = user_id);

create policy "Users can update own chunks."
  on knowledge_chunks for update using (auth.uid() = user_id);

create policy "Users can delete own chunks."
  on knowledge_chunks for delete using (auth.uid() = user_id);

create policy "Public can view chunks."
  on knowledge_chunks for select using (true);

-- =============================================================================
-- 5. match_knowledge_chunks: Vector similarity search RPC
-- =============================================================================
create or replace function match_knowledge_chunks(
  query_embedding vector(1536),
  match_count int default 5,
  match_threshold float default 0.3
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  chunk_index int,
  similarity float
)
language plpgsql
security definer
as $$
begin
  return query
    select
      kc.id,
      kc.document_id,
      kc.content,
      kc.chunk_index,
      1 - (kc.embedding <=> query_embedding) as similarity
    from knowledge_chunks kc
    inner join knowledge_documents kd on kd.id = kc.document_id
    where
      kd.status = 'active'
      and 1 - (kc.embedding <=> query_embedding) > match_threshold
    order by kc.embedding <=> query_embedding
    limit match_count;
end;
$$;

-- =============================================================================
-- 6. Portfolio tables: projects, experiences, skills, social_links
-- =============================================================================

-- projects
create table projects (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  image_url text,
  live_url text,
  repo_url text,
  tags text[],
  sort_order integer default 0,
  status text default 'published' check (status in ('published', 'draft', 'archived')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- experiences
create table experiences (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  company text not null,
  location text,
  start_date date not null,
  end_date date,
  description text,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- skills
create table skills (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text not null,
  proficiency integer check (proficiency >= 1 and proficiency <= 5),
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- social_links
create table social_links (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  platform text not null,
  url text not null,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on all portfolio tables
alter table projects enable row level security;
alter table experiences enable row level security;
alter table skills enable row level security;
alter table social_links enable row level security;

-- RLS Policies: Public read, owner write
create policy "Public projects are viewable by everyone" on projects for select using (true);
create policy "Users can insert their own projects" on projects for insert with check (auth.uid() = user_id);
create policy "Users can update their own projects" on projects for update using (auth.uid() = user_id);
create policy "Users can delete their own projects" on projects for delete using (auth.uid() = user_id);

create policy "Public experiences are viewable by everyone" on experiences for select using (true);
create policy "Users can insert their own experiences" on experiences for insert with check (auth.uid() = user_id);
create policy "Users can update their own experiences" on experiences for update using (auth.uid() = user_id);
create policy "Users can delete their own experiences" on experiences for delete using (auth.uid() = user_id);

create policy "Public skills are viewable by everyone" on skills for select using (true);
create policy "Users can insert their own skills" on skills for insert with check (auth.uid() = user_id);
create policy "Users can update their own skills" on skills for update using (auth.uid() = user_id);
create policy "Users can delete their own skills" on skills for delete using (auth.uid() = user_id);

create policy "Public social_links are viewable by everyone" on social_links for select using (true);
create policy "Users can insert their own social_links" on social_links for insert with check (auth.uid() = user_id);
create policy "Users can update their own social_links" on social_links for update using (auth.uid() = user_id);
create policy "Users can delete their own social_links" on social_links for delete using (auth.uid() = user_id);

-- Indexes
create index projects_user_id_idx on projects (user_id);
create index experiences_user_id_idx on experiences (user_id);
create index skills_user_id_idx on skills (user_id);
create index social_links_user_id_idx on social_links (user_id);

-- =============================================================================
-- 7. Shared trigger function: auto-update updated_at
-- =============================================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_updated_at_projects
  before update on projects for each row execute function handle_updated_at();

create trigger handle_updated_at_experiences
  before update on experiences for each row execute function handle_updated_at();

create trigger handle_updated_at_skills
  before update on skills for each row execute function handle_updated_at();

create trigger handle_updated_at_social_links
  before update on social_links for each row execute function handle_updated_at();
