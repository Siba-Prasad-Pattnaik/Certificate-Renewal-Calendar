'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SocialLinks from '@/components/marketing/social-links';
import { seedProfile } from '@/content/seed';
import { ArrowRight, Download } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-12 md:py-24">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
          {/* Left column: Text content */}
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                {seedProfile.name}
              </h1>
              <p className="mt-4 text-xl text-foreground-secondary">
                {seedProfile.headline}
              </p>
              <p className="mt-2 text-foreground-secondary">
                📍 {seedProfile.location}
              </p>
            </div>
            
            <p className="text-lg text-foreground-secondary">
              {seedProfile.bio}
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/projects">
                  View projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/resume">
                  <Download className="mr-2 h-4 w-4" />
                  Download resume
                </Link>
              </Button>
            </div>
            
            <div className="pt-4">
              <SocialLinks />
            </div>
          </div>
          
          {/* Right column: Avatar */}
          <div className="relative flex items-center justify-center">
            <div className="relative h-64 w-64 overflow-hidden rounded-full md:h-80 md:w-80 lg:h-96 lg:w-96">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5"></div>
              <div className="relative flex h-full w-full items-center justify-center">
                <div className="h-48 w-48 rounded-full bg-gradient-to-br from-primary to-primary/30 md:h-60 md:w-60 lg:h-72 lg:w-72"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
