# Database Schema

## Tables

### `profiles`

- **Purpose:** Stores user profile information and bot personality context.
- **RLS:** Public read, Owner write.
- **Columns:**
  - `id` (UUID, PK, FK auth.users)
  - `name` (Text, NOT NULL)
  - `avatar_url` (Text)
  - `profession` (Text, NOT NULL)
  - `experience` (Integer, Default 0, NOT NULL)
  - `field` (Text, NOT NULL)
  - `welcome_message` (Text, NOT NULL)
  - `professional_summary` (Text, NOT NULL)
  - `updated_at` (Timestamp)

### Automation

- **Removed**: Automatic profile creation trigger `on_auth_user_created` has been removed to enforce manual onboarding and data quality.

### `system_settings`

- **Purpose:** Global configuration (Key-Value store).
- **RLS:** Private (Owner read/write).
- **Columns:** `key` (PK), `value` (JSONB).

## Future Schema (Planned)

- **`documents`**: Stores raw and enriched content (`content`, `type`, `created_at`).
- **`embeddings`**: Stores vector embeddings for RAG (`vector`, `content_chunk`).
- **`messages`**: Stores chat history (optional/transient?).

## Access Patterns

- **Client Component:** Use `createClient` (Browser).
- **Server Component:** Use `createServerClient` (Cookies).
- **Admin/Background:** Use `adminClient` (Service Role) to bypass RLS.
