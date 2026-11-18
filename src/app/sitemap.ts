import { MetadataRoute } from 'next';
import { getAllPublishedSlugs } from '@/lib/content/blog';
import { getProjects } from '@/lib/content/index';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const now = new Date();

  // Static routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  // Published blog posts
  const blogSlugs = await getAllPublishedSlugs();
  const blogPosts = blogSlugs.map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: now, // In production, this would come from blog post metadata
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Published projects
  const projects = await getProjects();
  const publishedProjects = projects
    .filter(project => project.isPublished)
    .map(project => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: project.updatedAt ? new Date(project.updatedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  // Tag filter pages (only include if they're indexable per ADR)
  // For now, we'll include main tags if they exist
  const tagRoutes = [
    {
      url: `${baseUrl}/blog/tags`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
  ];

  return [
    ...staticRoutes,
    ...blogPosts,
    ...publishedProjects,
    ...tagRoutes,
  ];
}