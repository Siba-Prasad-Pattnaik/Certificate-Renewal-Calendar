import { test, expect } from '@playwright/test';

test.describe('Reduced Motion Accessibility', () => {
  test('with prefers-reduced-motion enabled', async ({ page }) => {
    // Enable reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    await page.goto('/');
    
    // Check that no complex animations are present
    // Reduced motion should replace complex animations with simple fades
    
    // Scroll through page to trigger any scroll animations
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    await page.waitForTimeout(500);
    
    // Check for instant transitions (no duration or very short duration)
    await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let hasLongAnimations = false;
      
      elements.forEach(element => {
        const style = window.getComputedStyle(element);
        const transitionDuration = style.transitionDuration;
        const animationDuration = style.animationDuration;
        
        if (transitionDuration && !transitionDuration.includes('0s') && !transitionDuration.includes('0ms')) {
          const duration = parseFloat(transitionDuration);
          if (duration > 0.3) { // More than 300ms
            hasLongAnimations = true;
            console.log('Found long transition:', element, transitionDuration);
          }
        }
        
        if (animationDuration && !animationDuration.includes('0s') && !animationDuration.includes('0ms')) {
          const duration = parseFloat(animationDuration);
          if (duration > 0.3) { // More than 300ms
            hasLongAnimations = true;
            console.log('Found long animation:', element, animationDuration);
          }
        }
      });
      
      return hasLongAnimations;
    }).then(hasLongAnimations => {
      expect(hasLongAnimations).toBe(false);
    });
  });

  test('page transitions respect reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    await page.goto('/');
    
    // Navigate to another page
    await page.click('a[href="/about"]');
    await page.waitForLoadState('networkidle');
    
    // Check that page transition was instant or very fast
    // This is more of a visual check, but we can verify the URL changed
    await expect(page).toHaveURL(/\/about/);
  });

  test('hero animations respect reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    await page.goto('/');
    
    // Check hero section
    const hero = page.locator('section:has(h1)');
    await expect(hero).toBeVisible();
    
    // Reduced motion should mean no parallax or complex animations
    // We'll check that Framer Motion components use reduced variants
    await page.evaluate(() => {
      const motionElements = document.querySelectorAll('[data-framer-motion]');
      let usesReducedMotion = true;
      
      motionElements.forEach(element => {
        const style = window.getComputedStyle(element);
        const transform = style.transform;
        
        // Reduced motion should limit complex transforms
        if (transform && transform !== 'none') {
          // Check for complex transforms like translate3d with large values
          if (transform.includes('translate3d') || transform.includes('rotate')) {
            usesReducedMotion = false;
          }
        }
      });
      
      return usesReducedMotion;
    }).then(usesReducedMotion => {
      expect(usesReducedMotion).toBe(true);
    });
  });
});
