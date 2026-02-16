# BotFolio Tasks

> **Status:** Active Development
> **Last Updated:** 2026-02-16

## Completed

- [x] **Authentication** — Email/Password login via Supabase Auth.
- [x] **Admin Dashboard** — Responsive sidebar, header, protected routes.
- [x] **Profile Settings** — Backend + UI for managing identity/context.
- [x] **Bot Settings** — Model, system prompt, and predefined prompts config.
- [x] **Knowledge Base** — CRUD for RAG documents with auto-chunking & embedding.
- [x] **RAG Pipeline** — Embedding via `gemini-embedding-001`, pgvector retrieval.
- [x] **Public Chat** — Visitor chat with streaming AI, markdown, typing indicator.
- [x] **Portfolio CMS** — Projects, Experiences, Skills, Social Links CRUD with reordering.
- [x] **Visitor Portfolio** — Structured portfolio page with Hero, Projects Grid, Experience Timeline, Skills Grid.
- [x] **Floating Chat** — Sheet-based chat FAB on the portfolio page.
- [x] **Portfolio → RAG Sync** — Auto-sync structured data to knowledge base via `after()`.
- [x] **Social Links in Chat** — LLM has access to contact/social links at chat time.
- [x] **Theme Switcher** — Light/Dark/System modes across all views.

## Backlog

### Phase 2: AI Enrichment

- [ ] **Improve with AI (Content Studio)** — Interactive canvas for AI-assisted RAG content generation.
- [ ] **AI-Generated Knowledge** — Lower-confidence docs from AI, reviewable by admin.
- [ ] **Enrichment Agent** — Admin agent for generating high-quality RAG documents.

### Phase 3: Polish & Deployment

- [ ] **Generative UI Widgets** — `streamUI` for Project Cards and Contact Forms.
- [ ] **SEO & Metadata** — OpenGraph tags and metadata.
- [ ] **Deployment to Vercel** — Production deployment.
