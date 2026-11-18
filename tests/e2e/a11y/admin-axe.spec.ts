import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

test.describe('Admin Pages Accessibility (axe-core)', () => {
  test.beforeEach(async ({ page }) => {
    // In a real test, you would log in first
    // For now, we'll assume we're already authenticated
    await page.goto('/admin/login');
    await injectAxe(page);
  });

  test('Admin Dashboard should have no critical accessibility violations', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page).toHaveTitle(/Dashboard/);
    
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

  test('Admin Blog Management should have no critical accessibility violations', async ({ page }) => {
    await page.goto('/admin/blog');
    await expect(page).toHaveTitle(/Blog Management/);
    
    const results = await checkA11y(page, undefined, {
      verbose: true,
      include: ['critical', 'serious'],
    });
    
    expect(results.violations.length).toBe(0);
  });

  test('Admin Projects should have no critical accessibility violations', async ({ page }) => {
    await page.goto('/admin/projects');
    await expect(page).toHaveTitle(/Projects/);
    
    const results = await checkA11y(page);
    
    expect(results.violations.length).toBe(0);
  });

  test('Admin Skills should have no critical accessibility violations', async ({ page }) => {
    await page.goto('/admin/skills');
    await expect(page).toHaveTitle(/Skills/);
    
    const results = await checkA11y(page);
    
    expect(results.violations.length).toBe(0);
  });

  test('Admin Education should have no critical accessibility violations', async ({ page }) => {
    await page.goto('/admin/education');
    await expect(page).toHaveTitle(/Education Management/);
    
    const results = await checkA11y(page);
    
    expect(results.violations.length).toBe(0);
  });

  test('Admin Experience should have no critical accessibility violations', async ({ page }) => {
    await page.goto('/admin/experience');
    await expect(page).toHaveTitle(/Experience/);
    
    const results = await checkA11y(page);
    
    expect(results.violations.length).toBe(0);
  });

  test('Admin Profile should have no critical accessibility violations', async ({ page }) => {
    await page.goto('/admin/profile');
    await expect(page).toHaveTitle(/Profile/);
    
    const results = await checkA11y(page);
    
    expect(results.violations.length).toBe(0);
  });
});
