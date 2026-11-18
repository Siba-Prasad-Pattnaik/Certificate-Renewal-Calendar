import type { MetadataRoute } from 'next';
import envClient from '@/lib/env/client';

/**
 * Generates robots.txt content
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = envClient.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  const isPreview = process.env.VERCEL_ENV === 'preview';

  // In preview environments, disallow all indexing
  if (isPreview) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
      host: undefined,
      sitemap: undefined,
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/admin/*',
        '/login',
        '/api/admin',
        '/api/admin/*',
      ],
    },
    host: baseUrl,
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}