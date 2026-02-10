-- Seed default admin user
-- NOTE: Password is 'admin'
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'authenticated',
    'authenticated',
    'admin@gmail.com',
    '$2a$10$3y.g8g5y3.y3.y3.y3.y3.y3.y3.y3.y3.y3.y3.y3.y3.y3.y3', -- Placeholder hash, in real world use Supabase Studio or API
    now(),
    NULL,
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    now(),
    now(),
    '',
    '',
    '',
    ''
) ON CONFLICT (id) DO NOTHING;

-- Seed default profile
INSERT INTO public.profiles (id, updated_at)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', now())
ON CONFLICT (id) DO NOTHING;

-- Seed default AI settings
INSERT INTO public.system_settings (key, value)
VALUES (
    'ai_model_config',
    '{"provider": "openrouter", "modelId": "openai/gpt-4o-mini"}'::jsonb
)
ON CONFLICT (key) DO NOTHING;
