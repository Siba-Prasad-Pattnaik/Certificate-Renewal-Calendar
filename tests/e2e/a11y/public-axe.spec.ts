import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

test.describe('Public Pages Accessibility (axe-core)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await injectAxe(page);
  });

  test('Home page should have no critical accessibility violations', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Portfolio/);
    
    const results = await checkA11y(page, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
        },
      },
    });
    
    expect(results.violations.length).toBe(0);
  });

  test('Projects page should have no critical accessibility violations', async ({ page }) => {
    await page.goto('/projects');
    await expect(page).toHaveTitle(/Projects/);
    
    const results = await checkA11y(page, undefined, {
      verbose: true,
      include: ['critical', 'serious'],
    });
    
    expect(results.violations.length).toBe(0);
  });

  test('Blog page should have no critical accessibility violations', async ({ page }) => {
    await page.goto('/blog');
    await expect(page).toHaveTitle(/Blog/);
    
    const results = await checkA11y(page);
    
    expect(results.violations.length).toBe(0);
  });

  test('About page should have no critical accessibility violations', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveTitle(/About/);
    
    const results = await checkA11y(page);
    
    expect(results.violations.length).toBe(0);
  });

  test('Resume page should have no critical accessibility violations', async ({ page }) => {
    await page.goto('/resume');
    await expect(page).toHaveTitle(/Resume/);
    
    const results = await checkA11y(page);
    
    expect(results.violations.length).toBe(0);
  });

  test('Contact page should have no critical accessibility violations', async ({ page }) => {
    await page.goto('/contact');
    await expect(page).toHaveTitle(/Contact/);
    
    const results = await checkA11y(page);
    
    expect(results.violations.length).toBe(0);
  });
});
