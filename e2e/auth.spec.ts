import { test, expect } from '@playwright/test';

test('redirects unauthenticated user from dashboard to login', async ({ page }) => {
  // Navigate to a protected route
  await page.goto('/dashboard');

  // Verify that the user is redirected to the login page
  await expect(page).toHaveURL(/\/login/);

  // Optionally check for login form elements if they exist, but URL check is sufficient for middleware logic verification.
  // For now just checking the URL redirect.
});
