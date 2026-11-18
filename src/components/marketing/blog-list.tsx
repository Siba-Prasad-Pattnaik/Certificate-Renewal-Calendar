'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BlogCard from './blog-card';
import TagFilter from './tag-filter';
import BlogPagination from './blog-pagination';
import { getPosts, getTags } from '@/lib/content/blog';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/motion/reveal';
import { cn } from '@/lib/utils/cn';

interface BlogListProps {
  tag: string;
  page: number;
}

export default function BlogList({ tag, page }: BlogListProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    limit: 6,
  });
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [postsData, tagsData] = await Promise.all([
          getPosts({ tag, page }),
          getTags(),
        ]);
        
        setPosts(postsData.posts);
        setPagination(postsData.pagination);
        setTags(tagsData);
      } catch (error) {
        console.error('Error loading blog data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [tag, page]);
  
  const handleTagChange = (selectedTag: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (selectedTag === 'all' || selectedTag === tag) {
      params.delete('tag');
    } else {
      params.set('tag', selectedTag);
    }
    
    params.delete('page');
    router.push(`/blog?${params.toString()}`);
  };
  
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/blog?${params.toString()}`);
  };
  
  const handleClearFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('tag');
    params.delete('page');
    router.push(`/blog?${params.toString()}`);
  };
  
  if (loading) {
    return (
      <div className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div 
              key={i}
              className="bg-gray-100 dark:bg-gray-800 rounded-lg h-96 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }
  
  const hasPosts = posts.length > 0;
  const hasTagFilter = tag && tag !== 'all';
  
  return (
    <>
      <div className="mb-8">
        <TagFilter 
          tags={tags}
          selectedTag={tag}
          onTagChange={handleTagChange}
        />
      </div>
      
      {!hasPosts ? (
        <Reveal>
          <div className="text-center py-16 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
            <h3 className="text-2xl font-semibold mb-4">No posts found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {hasTagFilter 
                ? `No posts found for this tag filter.`
                : `No blog posts have been published yet.`
              }
            </p>
            {hasTagFilter && (
              <Button onClick={handleClearFilter}>Clear filter</Button>
            )}
          </div>
        </Reveal>
      ) : (
        <>
          <Reveal>
            <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              Showing {posts.length} of {pagination.totalPosts} posts
              {hasTagFilter && (
                <span className="ml-2">
                  (filtered)
                </span>
              )}
            </div>
          </Reveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {posts.map((post, index) => (
              <BlogCard 
                key={post.slug}
                post={post}
                index={index}
              />
            ))}
          </div>
          
          {pagination.totalPages > 1 && (
            <BlogPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </>
  );
}
