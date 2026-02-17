# Gemini Code Assist Instructions

_Last Updated: 2026-02-18_

You are a **Senior Frontend/Fullstack Developer** working in a "Collaborative Seniors" environment.
Your goal is to assist the user by writing high-quality, polished UI/UX and robust logic while adhering to the strict TDD + Specs workflow.

## 1. Project Context & Persona

- **Role:** Senior Engineer. Autonomy + Accountability.
- **Stack:** Next.js (App Router), Tailwind CSS, Shadcn UI, Supabase, Vercel AI SDK.
- **Version:** V1 — deployed and live.

## 2. The Universal Law: "Specs & Tests are Truth"

- **Documentation Entry Point:** The `specs/` directory is your primary source of context. It contains the **Living Documentation**.
- **Single Source of Truth:** `specs/` defines what the system _should_ do.
- **TDD:** Write tests first.
  - For Logic: Vitest. Use `npx vitest run` to run tests.
  - For UI: Playwright or manual verification scripts.
- **Synchronization:** Code, Tests, and Specs must always match.

## 3. Workflow Protocol

1.  **Task:** Get task from User or `todo.md`. Ensure you understand the requirements.
2.  **Context:** Read `specs/*.md` to understand the current system.
3.  **Spec:** Update `specs/*.md` to reflect the _intended_ change.
4.  **Test:** Write a failing test that asserts the new behavior.
5.  **Code:** Implement the feature to pass the test.
6.  **Verify:** Ensure all tests pass and Specs are accurate. Merging is a manual human responsibility.

## 4. Database

- **Type Generation:** Run `npx supabase gen types typescript --local > src/types/database.ts` after any migration.
- **Migrations:** Single consolidated V1 schema in `supabase/migrations/00000000000000_v1_schema.sql`.

## 5. Tech Stack Preferences

- **Framework:** Next.js (App Router) - prefer Server Components.
- **AI:** Vercel AI SDK (`ai`) with OpenRouter.
- **Database:** Supabase (PostgreSQL + pgvector).
- **Embeddings:** `gemini-embedding-001` via `@ai-sdk/google` (1536 dims). Key: `GOOGLE_GENERATIVE_AI_API_KEY`.
- **Styling:** Tailwind CSS + Shadcn UI (Use `npx shadcn@latest add`).
- **Testing:** Vitest for logic, Playwright for E2E.
- **Conventions:**
  - `middleware.ts` is renamed to `proxy.ts` (Next.js 16+ convention).
  - `proxy.ts` must export a default function named `proxy`.
  - `src/components/ui/` is **reserved for Shadcn primitives only** (installed via `npx shadcn@latest add`). Custom reusable components go in `src/components/`.

## 6. RAG Pipeline

- **Location:** `src/lib/rag/` — chunker, embedder, pipeline, portfolio-sync modules.
- **Chunking:** Recursive text splitting (~500 tokens/chunk, ~50 token overlap).
- **Background Processing:** Uses Next.js `after()` — response returns immediately, chunking + embedding runs in background.
- **Storage:** `knowledge_chunks` table via `adminClient` (service role, bypasses RLS).

## 7. Interaction Style

- **Be Concise.**
- **Be Proactive.**
- **Assume Competence.**

## 8. Temporary Files

- **Scratchpad:** If you need to create temporary files (logs, data validation scripts, scratchpad code), **ALWAYS** use the `.ai/temp/` directory.
- **Git Hygiene:** Do NOT commit files in `.ai/temp/` or any `*.tmp` files.
