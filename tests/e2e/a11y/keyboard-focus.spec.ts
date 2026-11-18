import { test, expect } from '@playwright/test';

test.describe('Keyboard Navigation and Focus Management', () => {
  test('Skip link should be first focusable element and navigate to main content', async ({ page }) => {
    await page.goto('/');
    
    // Press Tab and check skip link is focused
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeFocused();
    
    // Skip link should be visible when focused
    await expect(skipLink).toBeVisible();
    
    // Activate skip link
    await page.keyboard.press('Enter');
    
    // Should navigate to main content
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeFocused();
  });

  test('Header navigation should be keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    // Skip skip link
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should focus on logo/home link
    const logoLink = page.locator('a[href="/"]');
    await expect(logoLink).toBeFocused();
    
    // Continue tabbing through navigation
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
    }
    
    // Should focus on theme toggle
    const themeToggle = page.locator('button[aria-label*="theme"]');
    await expect(themeToggle).toBeFocused();
  });

  test('Mobile navigation should trap focus and close with Escape', async ({ page }) => {
    await page.goto('/');
    
    // Open mobile menu
    const mobileMenuButton = page.locator('button[aria-label="Toggle menu"]');
    await mobileMenuButton.click();
    
    // Focus should be trapped in mobile menu
    await page.keyboard.press('Tab');
    
    // Should focus on first menu item
    const firstNavItem = page.locator('nav a').first();
    await expect(firstNavItem).toBeFocused();
    
    // Press Escape to close
    await page.keyboard.press('Escape');
    
    // Focus should return to menu button
    await expect(mobileMenuButton).toBeFocused();
  });

  test('Blog tag filters should be toggle buttons with aria-pressed', async ({ page }) => {
    await page.goto('/blog');
    
    // Find tag filters
    const tagButtons = page.locator('button[role="button"][aria-pressed]');
    await expect(tagButtons).toHaveCountGreaterThan(0);
    
    // First tag should not be pressed initially
    const firstTag = tagButtons.first();
    await expect(firstTag).toHaveAttribute('aria-pressed', 'false');
    
    // Toggle with Space
    await firstTag.focus();
    await page.keyboard.press('Space');
    
    // Should now be pressed
    await expect(firstTag).toHaveAttribute('aria-pressed', 'true');
    
    // Toggle with Enter
    await page.keyboard.press('Enter');
    
    // Should toggle back to false
    await expect(firstTag).toHaveAttribute('aria-pressed', 'false');
  });

  test('Form fields should have proper labels and error announcements', async ({ page }) => {
    await page.goto('/contact');
    
    // Check all form fields have visible labels
    const fields = page.locator('input, textarea, select');
    const count = await fields.count();
    
    for (let i = 0; i < count; i++) {
      const field = fields.nth(i);
      const id = await field.getAttribute('id');
      
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
      }
    }
    
    // Check for live region for error announcements
    const liveRegion = page.locator('[aria-live]');
    await expect(liveRegion).toHaveCountGreaterThan(0);
  });
});
