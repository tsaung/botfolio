# Admin UI Specifications

## 1. Sidebar

- **Collapsible**: The sidebar should be collapsible to maximize screen real estate.
- **State**: The collapsed state should be persisted (e.g., in localStorage) so the user preference is remembered.
- **Responsiveness**: The sidebar is hidden on mobile and shown on desktop (lg breakpoint). On mobile, it should be accessible via a hamburger menu (already implemented in header?).

## 2. Settings Page

- **Structure**: A single page (`/admin/settings`) containing multiple sections/cards.
- **Sections**:
  - **Profile**: User profile settings (placeholder for now).
  - **AI Configuration**: Existing AI model settings.
- **UI**: Use "Card" components with headers to separate different functional areas. No secondary sidebar.
