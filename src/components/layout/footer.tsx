import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail } from 'lucide-react';
import SocialLinks from '@/components/marketing/social-links';

const footerLinks = {
  Site: [
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Blog', href: '/blog' },
    { label: 'Resume', href: '/resume' },
    { label: 'Contact', href: '/contact' },
  ],
  Resources: [
    { label: 'GitHub', href: 'https://github.com', external: true },
    { label: 'LinkedIn', href: 'https://linkedin.com', external: true },
    { label: 'CodeSandbox', href: 'https://codesandbox.io', external: true },
    { label: 'Dev.to', href: 'https://dev.to', external: true },
    { label: 'Medium', href: 'https://medium.com', external: true },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background-secondary">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <span className="font-bold">P</span>
              </div>
              <span className="font-semibold">Portfolio</span>
            </div>
            <p className="text-sm text-foreground-secondary">
              A showcase of my work, thoughts, and professional journey. Building digital experiences with care.
            </p>
            <SocialLinks />
          </div>

          {/* Footer links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-sm font-semibold">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground-secondary hover:text-primary transition-colors"
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t pt-8 text-center text-sm text-foreground-secondary">
          <p>
            © {currentYear} Portfolio. All rights reserved.
            <br className="sm:hidden" />
            {' '}
            Built with Next.js, Tailwind CSS, and ❤️.
          </p>
        </div>
      </div>
    </footer>
  );
}
