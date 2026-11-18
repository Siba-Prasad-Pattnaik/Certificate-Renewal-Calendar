import type { BlogPost } from '@/types/content';
import { seedBlogPosts, seedTags } from '@/content/seed';

export interface GetPostsOptions {
  page?: number;
  limit?: number;
  tag?: string;
}

export interface PaginatedPosts {
  posts: BlogPost[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    limit: number;
  };
}

export async function getPosts(options: GetPostsOptions = {}): Promise<PaginatedPosts> {
  const { page = 1, limit = 6, tag } = options;
  
  // Filter published posts only
  let filteredPosts = seedBlogPosts.filter(post => post.is_published);
  
  // Filter by tag if provided
  if (tag && tag !== 'all') {
    filteredPosts = filteredPosts.filter(post => 
      post.tags?.some(t => t.slug === tag)
    );
  }
  
  // Calculate pagination
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / limit);
  const validPage = Math.max(1, Math.min(page, totalPages));
  
  // Apply pagination
  const startIndex = (validPage - 1) * limit;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + limit);
  
  // Sort by published date (newest first)
  const sortedPosts = [...paginatedPosts].sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
  
  return {
    posts: sortedPosts,
    pagination: {
      currentPage: validPage,
      totalPages: totalPages || 1,
      totalPosts,
      limit,
    },
  };
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const post = seedBlogPosts.find(post => post.slug === slug && post.is_published);
  return post || null;
}

export async function getTags() {
  return seedTags;
}

export async function getPostsByTag(tagSlug: string): Promise<BlogPost[]> {
  return seedBlogPosts.filter(
    post => post.is_published && post.tags?.some(tag => tag.slug === tagSlug)
  );
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  return seedBlogPosts
    .filter(post => post.is_published)
    .map(post => post.slug);
}

export async function getRelatedPosts(currentSlug: string, limit: number = 3): Promise<BlogPost[]> {
  const currentPost = await getPostBySlug(currentSlug);
  if (!currentPost) return [];
  
  const currentTags = currentPost.tags?.map(t => t.slug) || [];
  
  const relatedPosts = seedBlogPosts
    .filter(post => 
      post.is_published && 
      post.slug !== currentSlug &&
      post.tags?.some(tag => currentTags.includes(tag.slug))
    )
    .sort((a, b) => {
      // Sort by number of matching tags
      const aMatches = a.tags?.filter(t => currentTags.includes(t.slug)).length || 0;
      const bMatches = b.tags?.filter(t => currentTags.includes(t.slug)).length || 0;
      return bMatches - aMatches;
    })
    .slice(0, limit);
    
  return relatedPosts;
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}