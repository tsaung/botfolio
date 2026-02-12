# Features

## 1. Authentication
- **Method:** Email/Password via Supabase Auth.
- **Registration:** Invite-only (no public signup).
- **Flows:** Login, Forgot Password, Update Password.
- **Status:** Implemented.

## 2. Admin Dashboard
- **Access:** Restricted to authenticated users (`/(admin)` routes).
- **Layout:**
    - Sidebar navigation (Dashboard, Knowledge Base, Admin Chat, AI Settings).
    - Header with logout button.
    - Mobile-responsive.
- **Features:**
    - **Overview:** Dashboard with key metrics (Knowledge Fragments, Chats).
    - **Knowledge Base:** Manage RAG documents.
        - **User Content:** Manually created documents (high confidence).
        - **AI Generated:** Documents derived from other sources (lower confidence, reviewable).
    - **Admin Chat:** Interface to test the AI agent and preview RAG context.
        - Split-pane layout: Chat interface + Context Preview.
    - **Model Settings:** Select the AI model for the public chat.

## 3. Visitor Chat
- **Interface:** Full-screen chat UI.
- **Functionality:**
    - **Welcome Screen:** Display a welcoming message and suggested prompts (e.g., "Tell me about your experience", "Contact info").
    - **Chat Interaction:**
        - User types a message or clicks a prompt.
        - AI responds with streaming text.
        - Support for Markdown rendering (bold, italics, code blocks).
    - **Loading State:** Input is disabled while AI is "thinking".
    - **History:** Chat history persists within the session (no need for long-term persistence yet).
- **Model:** Configurable via Admin Dashboard (stored in `system_settings`).
    - **Default:** `google/gemini-3-flash-preview` (if no config found).
    - **System Prompt:** "You are Thant Sin's Portfolio Assistant. You are a helpful assistant that answers questions about Thant Sin's work and experience."
- **Backend:**
    - Uses Vercel AI SDK (`streamText`) with OpenRouter.
    - Connects to `google/gemini-3-flash-preview` by default.

## 4. Planned Features (The "Brain")
- **RAG Pipeline:** Vectorize documents (Markdown/Text) for retrieval.
- **Enrichment Agent:** An "Admin Agent" that helps the owner generate high-quality RAG documents.
- **Generative UI:** Dynamic widgets (`streamUI`) for project cards and contact forms.
