import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Save, Eye, Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Edit Blog Post | Admin Dashboard',
  description: 'Edit an existing blog post',
}

// Mock blog post data - in a real app, this would come from your API
const mockPost = {
  id: '1',
  title: 'Building Scalable React Applications',
  slug: 'building-scalable-react-applications',
  excerpt: 'Learn how to architect large-scale React applications with proper state management and performance optimization.',
  content: '## Introduction\n\nBuilding scalable React applications requires careful planning and architecture...',
  status: 'ACTIVE',
  tags: ['React', 'Architecture', 'Performance'],
  publishedAt: '2024-03-15',
  author: 'Alex Johnson',
  featured: true,
  // Gallery images with meaningful alt text
  galleryImages: [
    {
      id: '1',
      url: '/placeholder.svg',
      alt: 'React application architecture diagram showing component hierarchy',
      caption: 'Component hierarchy for scalable React apps',
      order: 1,
    },
    {
      id: '2',
      url: '/placeholder.svg',
      alt: 'Performance optimization graph comparing bundle sizes',
      caption: 'Bundle size comparison before and after optimization',
      order: 2,
    },
    {
      id: '3',
      url: '/placeholder.svg',
      alt: 'State management flow chart showing data flow between components',
      caption: 'State management flow in large applications',
      order: 3,
    },
  ],
}

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = mockPost // In real app, fetch by params.id

  if (!post) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to blog posts</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Blog Post</h1>
            <p className="text-muted-foreground">
              ID: {params.id} | Slug: {post.slug}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>
                Edit the blog post title, excerpt, and main content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="title"
                  defaultValue={post.title}
                  placeholder="Enter blog post title"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="excerpt" className="text-sm font-medium">
                  Excerpt
                </label>
                <Textarea
                  id="excerpt"
                  defaultValue={post.excerpt}
                  placeholder="Brief description that appears in listings"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">
                  Content (Markdown)
                </label>
                <Textarea
                  id="content"
                  defaultValue={post.content}
                  placeholder="Write your blog post here in Markdown format"
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Configure post status and metadata
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <Select defaultValue={post.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PROCESSING">Processing</SelectItem>
                    <SelectItem value="ACTIVE">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="featured" className="text-sm font-medium">
                  Featured
                </label>
                <Select defaultValue={post.featured ? 'true' : 'false'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="tags" className="text-sm font-medium">
                  Tags
                </label>
                <Input
                  id="tags"
                  defaultValue={post.tags.join(', ')}
                  placeholder="React, TypeScript, Performance"
                />
                <p className="text-xs text-muted-foreground">
                  Separate tags with commas
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="publishedAt" className="text-sm font-medium">
                  Published Date
                </label>
                <Input
                  id="publishedAt"
                  type="date"
                  defaultValue={post.publishedAt}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gallery Images</CardTitle>
              <CardDescription>
                Manage images for the blog post gallery
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {post.galleryImages.map((image) => (
                  <div
                    key={image.id}
                    className="flex items-center gap-4 p-3 border rounded-lg bg-muted/50"
                  >
                    <div className="relative h-16 w-16 rounded-md overflow-hidden">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Alt Text:</span>
                        <span className="text-sm">{image.alt}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Caption:</span>
                        <span className="text-sm">{image.caption}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove image</span>
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Add New Image</label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    PNG, JPG, WebP up to 5MB
                  </p>
                  <Button variant="outline">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="alt-text" className="text-sm font-medium">
                  Alt Text for New Image
                </label>
                <Input
                  id="alt-text"
                  placeholder="Describe the image for screen readers"
                  aria-describedby="alt-text-help"
                />
                <p id="alt-text-help" className="text-xs text-muted-foreground">
                  Provide meaningful description that conveys the content and purpose of the image
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="image-caption" className="text-sm font-medium">
                  Caption
                </label>
                <Input
                  id="image-caption"
                  placeholder="Optional caption displayed below the image"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="content" className="mt-6">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Optimize for search engines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="meta-title" className="text-sm font-medium">
                  Meta Title
                </label>
                <Input
                  id="meta-title"
                  defaultValue={post.title}
                  placeholder="Optional custom meta title"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="meta-description" className="text-sm font-medium">
                  Meta Description
                </label>
                <Textarea
                  id="meta-description"
                  defaultValue={post.excerpt}
                  placeholder="Optional custom meta description"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="canonical-url" className="text-sm font-medium">
                  Canonical URL
                </label>
                <Input
                  id="canonical-url"
                  placeholder="https://example.com/blog/post-slug"
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank to use default
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Advanced post configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="custom-slug" className="text-sm font-medium">
                  Custom Slug
                </label>
                <Input
                  id="custom-slug"
                  defaultValue={post.slug}
                  placeholder="custom-url-slug"
                />
                <p className="text-xs text-muted-foreground">
                  Change the URL slug for the post
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <p>Last saved: {post.publishedAt || 'Never'}</p>
          <p>Author: {post.author}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete Post</Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Update Post
          </Button>
        </div>
      </div>
    </div>
  )
}