import { test, expect } from '@playwright/test';

const viewports = [
  { width: 375, height: 667 },  // Mobile
  { width: 768, height: 1024 }, // Tablet
  { width: 1440, height: 900 }, // Desktop
];

const pages = ['/', '/about', '/projects', '/blog', '/contact', '/resume'];

test.describe('Color Contrast Accessibility Across Themes and Viewports', () => {
  for (const viewport of viewports) {
    test.describe(`Viewport: ${viewport.width}x${viewport.height}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize(viewport);
      });

      test(`Light theme should have sufficient contrast`, async ({ page }) => {
        // Switch to light theme
        await page.goto('/');
        
        // Ensure light theme
        await page.evaluate(() => {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        });
        
        // Test each page
        for (const pageUrl of pages) {
          await page.goto(pageUrl);
          
          // Wait for page to load
          await page.waitForLoadState('networkidle');
          
          // Check contrast for all text elements
          await page.evaluate(() => {
            const elements = document.querySelectorAll('*');
            let lowContrastElements = [];
            
            elements.forEach(element => {
              const style = window.getComputedStyle(element);
              const textColor = style.color;
              const bgColor = style.backgroundColor;
              const fontSize = parseFloat(style.fontSize);
              const fontWeight = style.fontWeight;
              
              // Skip elements with transparent or no text color
              if (textColor === 'rgba(0, 0, 0, 0)' || textColor === 'transparent') {
                return;
              }
              
              // Simple contrast check (this is a simplified version)
              // In a real test, you would use a proper contrast calculation library
              const textLuminance = getLuminance(textColor);
              const bgLuminance = getLuminance(bgColor);
              const contrastRatio = (Math.max(textLuminance, bgLuminance) + 0.05) / 
                                   (Math.min(textLuminance, bgLuminance) + 0.05);
              
              // WCAG 2.1 AA requires 4.5:1 for normal text, 3:1 for large text
              const isLargeText = fontSize >= 18 || (fontSize >= 14 && parseInt(fontWeight) >= 700);
              const requiredRatio = isLargeText ? 3 : 4.5;
              
              if (contrastRatio < requiredRatio) {
                lowContrastElements.push({
                  element: element.tagName,
                  text: element.textContent?.slice(0, 50),
                  contrastRatio: contrastRatio.toFixed(2),
                  requiredRatio,
                });
              }
            });
            
            // Helper function to approximate luminance
            function getLuminance(color) {
              // Simplified - real implementation would parse rgb/rgba/hex colors
              if (color.includes('rgb')) {
                const matches = color.match(/\d+/g);
                if (matches) {
                  const [r, g, b] = matches.map(Number);
                  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                }
              }
              return 0.5; // Default mid-value
            }
            
            return lowContrastElements;
          }).then(lowContrastElements => {
            // Log any contrast issues found
            if (lowContrastElements.length > 0) {
              console.log(`Contrast issues on ${pageUrl}:`, lowContrastElements);
            }
            
            // We expect very few or no contrast issues
            expect(lowContrastElements.length).toBeLessThanOrEqual(5);
          });
        }
      });

      test(`Dark theme should have sufficient contrast`, async ({ page }) => {
        // Switch to dark theme
        await page.goto('/');
        
        // Ensure dark theme
        await page.evaluate(() => {
          document.documentElement.classList.remove('light');
          document.documentElement.classList.add('dark');
        });
        
        // Test each page
        for (const pageUrl of pages) {
          await page.goto(pageUrl);
          
          // Wait for page to load
          await page.waitForLoadState('networkidle');
          
          // Same contrast check as above
          await page.evaluate(() => {
            const elements = document.querySelectorAll('*');
            let lowContrastElements = [];
            
            elements.forEach(element => {
              const style = window.getComputedStyle(element);
              const textColor = style.color;
              const bgColor = style.backgroundColor;
              const fontSize = parseFloat(style.fontSize);
              const fontWeight = style.fontWeight;
              
              if (textColor === 'rgba(0, 0, 0, 0)' || textColor === 'transparent') {
                return;
              }
              
              const textLuminance = getLuminance(textColor);
              const bgLuminance = getLuminance(bgColor);
              const contrastRatio = (Math.max(textLuminance, bgLuminance) + 0.05) / 
                                   (Math.min(textLuminance, bgLuminance) + 0.05);
              
              const isLargeText = fontSize >= 18 || (fontSize >= 14 && parseInt(fontWeight) >= 700);
              const requiredRatio = isLargeText ? 3 : 4.5;
              
              if (contrastRatio < requiredRatio) {
                lowContrastElements.push({
                  element: element.tagName,
                  text: element.textContent?.slice(0, 50),
                  contrastRatio: contrastRatio.toFixed(2),
                  requiredRatio,
                });
              }
            });
            
            function getLuminance(color) {
              if (color.includes('rgb')) {
                const matches = color.match(/\d+/g);
                if (matches) {
                  const [r, g, b] = matches.map(Number);
                  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                }
              }
              return 0.5;
            }
            
            return lowContrastElements;
          }).then(lowContrastElements => {
            // Log any contrast issues found
            if (lowContrastElements.length > 0) {
              console.log(`Contrast issues on ${pageUrl} (dark theme):`, lowContrastElements);
            }
            
            // We expect very few or no contrast issues
            expect(lowContrastElements.length).toBeLessThanOrEqual(5);
          });
        }
      });
    });
  }
});
