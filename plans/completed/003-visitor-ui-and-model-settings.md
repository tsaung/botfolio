# [003-Visitor-UI-and-Model-Settings]

## 1. Context
- **Goal:** Develop the public-facing "Full Screen Chat" interface and the Admin controls to select the AI model powering it.
- **Why:** The core value proposition is a "Personal RAG" portfolio. Visitors need a chat interface to interact with the portfolio. The owner needs control over which LLM is used (cost vs. intelligence).
- **Scope:**
    - Database schema for `system_settings` (Key-Value store).
    - Admin UI for Model Selection (OpenRouter models).
    - Public UI for Chat (Visitor view).
    - API Route for Chat (`/api/chat`) connecting the two.
    - **Excluded:** RAG/Embeddings logic (this will be a separate "Brain" task). This task uses a simple system prompt.

## 2. Strategy
- **Architecture:**
    - **Database:** New `system_settings` table (Key-Value store) to persist the selected model.
    - **Admin:** A Server Component page `app/(admin)/settings/ai/page.tsx` with a Client Component form to update settings.
    - **Public:** `app/(visitor)/page.tsx` as a Client Component using `useChat` hook.
    - **AI Provider:** Vercel AI SDK (`ai`) with OpenRouter as the provider.
- **Data Model:**
    - `system_settings`: `{ key: text (PK), value: jsonb, updated_at: timestamp }`.
    - Key: `ai_model_config`. Value: `{ provider: "openrouter", modelId: "anthropic/claude-3.5-sonnet" }`.
- **Security (RLS):**
    - `system_settings` table:
        - `read`: Private to owner.
        - `write`: Private to owner.
        - API Route uses `adminClient` (Service Role) to bypass RLS for reading config.

## 3. Implementation Plan
- [x] **Step 1: Database Schema**
    - Created `supabase/migrations/20260210_create_system_settings.sql`.
    - Defined `system_settings` table with RLS policies.
- [x] **Step 2: Server Actions & Data Access**
    - Created `lib/actions/settings.ts` (Admin UI actions).
    - Created `lib/db/admin.ts` (Service Role client).
- [x] **Step 3: Admin Model Selector**
    - Created `components/admin/model-selector.tsx` using `shadcn/ui` Select.
    - Created `app/(admin)/settings/ai/page.tsx`.
- [x] **Step 4: Chat API (`/api/chat`)**
    - Created `app/api/chat/route.ts`.
    - Implemented OpenRouter configuration and dynamic model selection.
- [x] **Step 5: Public Chat UI**
    - Created `components/chat/chat-interface.tsx`.
    - Implemented manual input state and `sendMessage` fallback for robustness.
    - Updated `app/(visitor)/page.tsx`.
- [x] **Step 6: Pre-commit Instructions**
    - Verified frontend with Playwright script (`verification/chat_initial.png`).
    - Reviewed code and fixed lint errors.

## 4. Verification Plan
- **Manual Verification:**
    - [x] Admin page loads and allows saving.
    - [x] Public page loads and displays welcome message.
    - [x] API route is reachable (mocked verification).
