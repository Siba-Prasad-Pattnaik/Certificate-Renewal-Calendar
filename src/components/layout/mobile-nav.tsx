'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils/cn';
import ThemeToggle from './theme-toggle';

const navItems = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Resume', href: '/resume' },
  { label: 'Contact', href: '/contact' },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      <div className="flex flex-col gap-4">
        {navItems.map((item) => (
          <SheetClose key={item.href} asChild>
            <Link
              href={item.href}
              className={cn(
                'flex h-10 items-center rounded-md px-4 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                pathname === item.href
                  ? 'bg-accent text-accent-foreground'
                  : 'text-foreground/70'
              )}
            >
              {item.label}
            </Link>
          </SheetClose>
        ))}
      </div>
      
      <div className="flex items-center justify-between border-t pt-4">
        <div className="text-sm text-foreground/60">Theme</div>
        <ThemeToggle />
      </div>
      
      <SheetClose asChild>
        <Button className="mt-4 w-full">
          Get in touch
        </Button>
      </SheetClose>
    </div>
  );
}
