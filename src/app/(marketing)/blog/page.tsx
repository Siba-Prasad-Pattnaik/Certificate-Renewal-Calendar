import type { Metadata } from 'next';
import { Suspense } from 'react';
import BlogListPage from '@/components/marketing/blog-list-page';
import { buildMetadata } from '@/lib/utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Blog - Articles & Tutorials',
    description: 'Read articles, tutorials, and insights about web development, design, and career growth.',
    path: '/blog',
    type: 'website',
  });
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Blog
          </h1>
          <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
            Articles, tutorials, and insights about web development
          </p>
        </div>

        <Suspense fallback={<BlogLoadingSkeleton />}>
          <BlogListPage />
        </Suspense>
      </div>
    </div>
  );
}

function BlogLoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4 rounded-lg border bg-card p-6">
            <div className="h-48 w-full animate-pulse rounded-md bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}