-- Create system_settings table
create table system_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table system_settings enable row level security;

-- Policy: Authenticated users (admins) can do everything
create policy "Admins can manage system settings." on system_settings
  for all using (auth.role() = 'authenticated');

-- Policy: Service Role (server-side) has full access by default (no policy needed usually, but good to know)

-- Insert default AI model config
insert into system_settings (key, value)
values (
  'ai_model_config',
  '{"provider": "openrouter", "modelId": "openai/gpt-4o-mini"}'::jsonb
)
on conflict (key) do nothing;
