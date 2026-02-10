# 001-Setup-and-Scaffolding

## 1. Context
- **Goal:** Initialize the repository with the chosen tech stack and structure.
- **Why:** To provide a solid foundation for development.
- **Scope:**
    -   Next.js 16+ (App Router) execution.
    -   Shadcn UI installation.
    -   Supabase Client setup (lib/db).
    -   Vercel AI SDK installation.
    -   Folder structure creation as per specs.

## 2. Strategy
- **Framework:** Next.js (latest).
- **Styling:** Tailwind CSS (via `create-next-app`).
- **Components:** Shadcn (`npx shadcn-ui@latest init`).
- **State/Auth:** Supabase SSR helper.

## 3. Implementation Plan
- [x] **Step 1:** Initialize Next.js project.
    - Command: `npx create-next-app@latest . --typescript --tailwind --eslint`
- [x] **Step 2:** Initialize Shadcn UI.
    - Command: `npx shadcn-ui@latest init`
    - Components: `button`, `input`, `card`, `scroll-area`, `avatar`.
- [x] **Step 3:** Install Dependencies.
    - `npm install ai @ai-sdk/openai @ai-sdk/react` (Vercel AI SDK).
    - `npm install @supabase/ssr @supabase/supabase-js`.
    - `npm install lucid-react` (Icons).
- [x] **Step 4:** Setup Environment Variables.
    - Created `.env.example` template with Supabase and OpenRouter keys.
- [x] **Step 5:** Create Folder Structure.
    - `app/(visitor)/page.tsx`
    - `app/(admin)/dashboard/page.tsx`
    - `lib/ai/`
    - `lib/db/`

## 4. Verification Plan
- **Automated Tests:**
    - [x] Run `npm run dev` and verify no crash.
    - [x] Run `npm run build` to ensure type safety.
- **Manual Verification:**
    - [x] Visit `localhost:3000` -> Should see Visitor Home.
    - [x] Visit `localhost:3000/dashboard` -> Should see Admin Placeholder.
