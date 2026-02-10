# AutoFolio

**AutoFolio** is an AI-native portfolio platform that "interviews" for you. It combines a sleek, modern chat interface with RAG (Retrieval Augmented Generation) to answer questions about your experience, projects, and skills accurately.

> **Status:** Active Development
> **Stack:** Next.js, Supabase, Vercel AI SDK, Shadcn UI

## Features (Planned)
- **Visitor Chat:** A conversational interface for recruiters and clients.
- **Generative UI:** The AI renders rich components (Project Cards, Contact Forms) in the chat.
- **Admin Dashboard:** Manage your profile and documents.
- **Profile Enrichment:** Chat with the AI to generate RAG-optimized summaries of your experience.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/AutoFolio.git
    cd AutoFolio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Setup Environment:**
    Copy `.env.local.example` (or create one) with:
    ```bash
    NEXT_PUBLIC_SUPABASE_URL=...
    NEXT_PUBLIC_SUPABASE_ANON_KEY=...
    OPENROUTER_API_KEY=...
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

## Project Structure
- `app/(visitor)`: Public facing chat interface.
- `app/(admin)`: Protected admin dashboard.
- `lib/ai`: Vercel AI SDK configurations.
- `lib/db`: Supabase client and schema definitions.
