'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { seedSocialLinks } from '@/content/seed';
import { Github, Linkedin, Twitter, ExternalLink } from 'lucide-react';

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  codesandbox: ExternalLink,
};

export default function SocialLinks() {
  return (
    <div className="flex items-center gap-2">
      {seedSocialLinks.map((link) => {
        const Icon = iconMap[link.icon as keyof typeof iconMap] || ExternalLink;
        
        return (
          <Button
            key={link.id}
            variant="outline"
            size="icon"
            asChild
            className="h-10 w-10"
          >
            <Link
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${link.platform}`}
            >
              <Icon className="h-5 w-5" />
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
