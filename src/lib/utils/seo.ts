import { Metadata } from 'next';
import envClient from '@/lib/env/client';
import type { Profile, BlogPost } from '@/types/content';
import type { SocialLink } from '@/types/content';

/**
 * Truncates text to specified length without breaking words
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  
  // Try to break at word boundary
  const truncated = text.substr(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.7) {
    return truncated.substr(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

/**
 * Generates absolute URL from path
 */
export function absoluteUrl(path: string): string {
  const baseUrl = envClient.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

interface BuildMetadataOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  noIndex?: boolean;
}

/**
 * Builds Next.js Metadata object with Open Graph, Twitter Cards, and canonical URLs
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  tags,
  noIndex = false,
}: BuildMetadataOptions): Metadata {
  const truncatedTitle = truncate(title, 60);
  const truncatedDescription = truncate(description, 160);
  const url = absoluteUrl(path);
  
  const images = image
    ? [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: truncatedTitle,
        },
      ]
    : [
        {
          url: absoluteUrl('/og-default.png'),
          width: 1200,
          height: 630,
          alt: truncatedTitle,
        },
      ];

  return {
    title: truncatedTitle,
    description: truncatedDescription,
    metadataBase: new URL(envClient.env.NEXT_PUBLIC_APP_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: truncatedTitle,
      description: truncatedDescription,
      url,
      siteName: envClient.env.NEXT_PUBLIC_SITE_NAME,
      images,
      locale: 'en_US',
      type,
      publishedTime,
      modifiedTime,
      tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: truncatedTitle,
      description: truncatedDescription,
      images: images.map(img => img.url),
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': !noIndex ? -1 : undefined,
        'max-image-preview': !noIndex ? 'large' : undefined,
        'max-snippet': !noIndex ? -1 : undefined,
      },
    },
  };
}

interface PersonJsonLdOptions {
  profile: Profile;
  socialLinks: SocialLink[];
}

/**
 * Generates schema.org Person JSON-LD
 */
export function personJsonLd({ profile, socialLinks }: PersonJsonLdOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.headline,
    url: absoluteUrl('/'),
    image: profile.avatarUrl,
    sameAs: socialLinks.map(link => link.url),
    address: profile.location ? {
      '@type': 'PostalAddress',
      addressLocality: profile.location,
    } : undefined,
    description: profile.bio,
  };
}

interface BlogPostingJsonLdOptions {
  post: BlogPost;
  profile: Profile;
}

/**
 * Generates schema.org BlogPosting JSON-LD
 */
export function blogPostingJsonLd({ post, profile }: BlogPostingJsonLdOptions) {
  const author = personJsonLd({ profile, socialLinks: [] });
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: profile.name,
      jobTitle: profile.headline,
      url: absoluteUrl('/'),
      image: profile.avatarUrl,
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    keywords: post.tags,
    wordCount: post.wordCount || 0,
    articleBody: post.content,
  };
}