# Plan: Admin Dashboard Implementation

> **Status:** Active
> **Last Updated:** 2026-02-10

## Context
We need to build a proper admin dashboard layout with a sidebar for navigation, a header with a logout button, and a consistent look and feel using Shadcn UI components. This will replace the current basic dashboard and settings pages. We also need to fix database seeding and route protection issues.

## Goal
Implement a responsive admin dashboard layout with:
- Sidebar navigation (Dashboard, AI Settings).
- Header with logout button and breadcrumbs (optional).
- Uniform styling using Shadcn UI components.
- Mobile responsiveness.
- Correct OpenRouter integration using `@openrouter/ai-sdk-provider`.
- **Database Seeding**: Default admin user and initial system settings.
- **Route Protection**: Ensure all `/settings/*` and `/dashboard/*` routes are protected.

## Proposed Changes

### 1. Components
- **`src/components/admin/sidebar.tsx`**: Navigation sidebar with links.
- **`src/components/admin/header.tsx`**: Top header with user actions.
- **`src/components/admin/logout-button.tsx`**: Button to handle sign out.
- **`src/components/admin/mobile-nav.tsx`**: Mobile navigation.

### 2. Layout & Security
- **`src/app/(admin)/layout.tsx`**: Main layout wrapper for admin routes.
- **`src/middleware.ts`**: Update to strictly protect `/(admin)/*` routes (not just `/dashboard`).

### 3. Pages & Logic
- **`src/lib/actions/settings.ts`**: Update `getSystemSetting` to gracefully handle missing rows (return null instead of error).
- **`src/app/(admin)/dashboard/page.tsx`**: Update content to match new design.
- **`src/app/(admin)/settings/ai/page.tsx`**: Ensure consistent styling.
- **`src/app/api/chat/route.ts`**: Update OpenRouter initialization.

### 4. Database
- **`supabase/seed.sql`**: Add SQL for default admin user and initial `ai_model_config`.

## Step-by-Step Plan

1.  **Create Sidebar & Header Components**
    -   (Already Implemented) Verify `src/components/admin/sidebar.tsx`, `header.tsx`, `logout-button.tsx`, `mobile-nav.tsx`.

2.  **Implement Admin Layout**
    -   (Already Implemented) Verify `src/app/(admin)/layout.tsx`.

3.  **Enhance Middleware Protection**
    -   Update `src/middleware.ts` or `src/lib/db/middleware.ts` to check if `request.nextUrl.pathname` starts with `/settings` or `/dashboard` and redirect to login if no user.

4.  **Fix Settings Logic**
    -   Modify `src/lib/actions/settings.ts` -> `getSystemSetting`. If `single()` fails with `PGRST116` (0 rows), catch it and return `null` instead of throwing.

5.  **Refactor OpenRouter Integration**
    -   (Already Implemented) Verify `src/app/api/chat/route.ts`.

6.  **Seed Database**
    -   Create `supabase/seed.sql`.
    -   Insert into `auth.users`: email `admin@gmail.com`, password `admin` (hashed).
    -   Insert into `public.profiles`: corresponding profile.
    -   Insert into `public.system_settings`: key `ai_model_config`, value default JSON.

7.  **Verify & Test**
    -   Reset DB locally if possible (or just run seed manually via SQL editor if local instance is running).
    -   Visit `/settings/ai` without login -> Should redirect.
    -   Login with `admin@gmail.com` / `admin`.
    -   Visit `/settings/ai` -> Should show default config, no "0 rows" error.
