# Plan: Admin Dashboard Implementation

> **Status:** Active
> **Last Updated:** 2026-02-10

## Context
We need to build a proper admin dashboard layout with a sidebar for navigation, a header with a logout button, and a consistent look and feel using Shadcn UI components. This will replace the current basic dashboard and settings pages.

## Goal
Implement a responsive admin dashboard layout with:
- Sidebar navigation (Dashboard, AI Settings).
- Header with logout button and breadcrumbs (optional).
- Uniform styling using Shadcn UI components.
- Mobile responsiveness.
- Correct OpenRouter integration using `@openrouter/ai-sdk-provider`.

## Proposed Changes

### 1. Components
- **`src/components/admin/sidebar.tsx`**: Navigation sidebar with links.
- **`src/components/admin/header.tsx`**: Top header with user actions.
- **`src/components/admin/logout-button.tsx`**: Button to handle sign out.
- **`src/components/admin/mobile-nav.tsx`**: Mobile navigation (optional/if needed for responsiveness).

### 2. Layout
- **`src/app/(admin)/layout.tsx`**: Main layout wrapper for admin routes.

### 3. Pages
- **`src/app/(admin)/dashboard/page.tsx`**: Update content to match new design.
- **`src/app/(admin)/settings/ai/page.tsx`**: Ensure consistent styling.

### 4. API
- **`src/app/api/chat/route.ts`**: Update OpenRouter initialization to use `@openrouter/ai-sdk-provider`.

## Step-by-Step Plan

1.  **Create Sidebar Component**
    -   Create `src/components/admin/sidebar.tsx`.
    -   Use `next/link` for navigation.
    -   Style with Tailwind/Shadcn classes.
    -   Include links for "Dashboard" and "AI Settings".

2.  **Create Header & Logout Button**
    -   Create `src/components/admin/logout-button.tsx` calling the `signout` server action.
    -   Create `src/components/admin/header.tsx` including the logout button.

3.  **Implement Admin Layout**
    -   Create `src/app/(admin)/layout.tsx`.
    -   Structure: Sidebar on left (desktop), Header on top, Main content area.
    -   Handle mobile responsiveness (hide sidebar on small screens, show hamburger menu).

4.  **Refine Dashboard Page**
    -   Update `src/app/(admin)/dashboard/page.tsx`.
    -   Use `Card`, `CardHeader`, `CardTitle` from Shadcn UI.

5.  **Refine AI Settings Page**
    -   Review `src/app/(admin)/settings/ai/page.tsx`.
    -   Ensure it fits well in the new layout.

6.  **Refactor OpenRouter Integration**
    -   Install `@openrouter/ai-sdk-provider`.
    -   Update `src/app/api/chat/route.ts` to use `createOpenRouter`.

7.  **Verify & Test**
    -   Check navigation between pages.
    -   Test logout functionality.
    -   Check mobile view.
    -   Test chat functionality to ensure OpenRouter refactor works.
