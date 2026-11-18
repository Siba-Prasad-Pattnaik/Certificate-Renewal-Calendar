'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils/cn';

export function SkipLink() {
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // Focus the skip link on first render for screen readers
    if (linkRef.current) {
      linkRef.current.focus();
    }
  }, []);

  return (
    <a
      ref={linkRef}
      href="#main-content"
      className={cn(
        'sr-only',
        'focus:not-sr-only',
        'focus:absolute',
        'focus:top-4',
        'focus:left-4',
        'focus:z-[100]',
        'focus:px-4',
        'focus:py-2',
        'focus:bg-primary',
        'focus:text-primary-foreground',
        'focus:rounded-md',
        'focus:shadow-lg',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-ring',
        'focus:ring-offset-2'
      )}
      onClick={(e) => {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.tabIndex = -1;
          mainContent.focus();
          mainContent.scrollIntoView();
        }
      }}
    >
      Skip to main content
    </a>
  );
}

export default SkipLink;