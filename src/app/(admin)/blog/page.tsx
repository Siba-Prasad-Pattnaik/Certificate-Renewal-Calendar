import type { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MoreHorizontal, Plus, Search, CalendarDays, Eye, EyeOff, Archive, Edit, Trash2, ExternalLink, Filter } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog Management | Admin Dashboard',
  description: 'Manage blog posts, drafts, and publishing workflow',
}

// Mock blog posts data - in a real app, this would come from your API
const blogPosts = [
  {
    id: '1',
    title: 'Building Scalable React Applications',
    slug: 'building-scalable-react-applications',
    excerpt: 'Learn how to architect large-scale React applications with proper state management and performance optimization.',
    status: 'ACTIVE',
    tags: ['React', 'Architecture', 'Performance'],
    publishedAt: '2024-03-15',
    views: 1248,
    comments: 24,
    author: 'Alex Johnson',
    featured: true,
  },
  {
    id: '2',
    title: 'Next.js 14 Server Actions Deep Dive',
    slug: 'nextjs-14-server-actions-deep-dive',
    excerpt: 'A comprehensive guide to using Server Actions in Next.js 14 for better performance and developer experience.',
    status: 'DRAFT',
    tags: ['Next.js', 'Server Actions', 'Performance'],
    publishedAt: null,
    views: 0,
    comments: 0,
    author: 'Alex Johnson',
    featured: false,
  },
  {
    id: '3',
    title: 'TypeScript Best Practices 2024',
    slug: 'typescript-best-practices-2024',
    excerpt: 'Updated guidelines and patterns for writing maintainable TypeScript code in modern web applications.',
    status: 'PROCESSING',
    tags: ['TypeScript', 'Best Practices'],
    publishedAt: '2024-03-10',
    views: 892,
    comments: 18,
    author: 'Alex Johnson',
    featured: true,
  },
  {
    id: '4',
    title: 'The Future of Web Authentication',
    slug: 'future-web-authentication',
    excerpt: 'Exploring emerging authentication technologies and standards for secure web applications.',
    status: 'ARCHIVED',
    tags: ['Security', 'Authentication', 'Web'],
    publishedAt: '2024-02-28',
    views: 1567,
    comments: 32,
    author: 'Alex Johnson',
    featured: false,
  },
  {
    id: '5',
    title: 'Tailwind CSS vs Traditional CSS',
    slug: 'tailwind-css-vs-traditional-css',
    excerpt: 'Comparison of utility-first CSS frameworks and traditional CSS methodologies for modern web development.',
    status: 'ACTIVE',
    tags: ['CSS', 'Tailwind', 'Styling'],
    publishedAt: '2024-03-05',
    views: 756,
    comments: 15,
    author: 'Alex Johnson',
    featured: false,
  },
  {
    id: '6',
    title: 'Microfrontends with Module Federation',
    slug: 'microfrontends-module-federation',
    excerpt: 'Implementing scalable microfrontend architecture using Webpack Module Federation.',
    status: 'DRAFT',
    tags: ['Microfrontends', 'Webpack', 'Architecture'],
    publishedAt: null,
    views: 0,
    comments: 0,
    author: 'Alex Johnson',
    featured: false,
  },
]

const statusColors = {
  DRAFT: 'bg-yellow-500/20 text-yellow-600',
  PROCESSING: 'bg-blue-500/20 text-blue-600',
  ACTIVE: 'bg-green-500/20 text-green-600',
  ARCHIVED: 'bg-gray-500/20 text-gray-600',
}

const statusLabels = {
  DRAFT: 'Draft',
  PROCESSING: 'Processing',
  ACTIVE: 'Published',
  ARCHIVED: 'Archived',
}

export default function BlogPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
          <p className="text-muted-foreground">
            Manage blog posts, drafts, and publishing workflow
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/blog/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{blogPosts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all statuses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {blogPosts.filter(p => p.status === 'ACTIVE').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Live posts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {blogPosts.reduce((sum, post) => sum + post.views, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All-time views
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
          <CardDescription>
            Manage all blog posts with filtering and bulk actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative w-full sm:w-auto sm:flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="active">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px]">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="views">Most Views</SelectItem>
                  <SelectItem value="comments">Most Comments</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="draft">Draft ({blogPosts.filter(p => p.status === 'DRAFT').length})</TabsTrigger>
              <TabsTrigger value="processing">Processing ({blogPosts.filter(p => p.status === 'PROCESSING').length})</TabsTrigger>
              <TabsTrigger value="active">Published ({blogPosts.filter(p => p.status === 'ACTIVE').length})</TabsTrigger>
              <TabsTrigger value="archived">Archived ({blogPosts.filter(p => p.status === 'ARCHIVED').length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Published</TableHead>
                      <TableHead className="text-right">Views</TableHead>
                      <TableHead className="text-right">Comments</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>
                          <div className="font-medium">{post.title}</div>
                          <div className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {post.excerpt}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {post.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {post.featured && (
                              <Badge className="bg-primary/20 text-primary text-xs">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${statusColors[post.status]} capitalize`}>
                            {statusLabels[post.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {post.publishedAt ? (
                            <div className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4 text-muted-foreground" />
                              {post.publishedAt}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Not published</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {post.views.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {post.comments}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                {post.status === 'ACTIVE' ? 'View Live' : 'Preview'}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {post.status === 'ACTIVE' && (
                                <DropdownMenuItem>
                                  <EyeOff className="mr-2 h-4 w-4" />
                                  Unpublish
                                </DropdownMenuItem>
                              )}
                              {post.status === 'DRAFT' && (
                                <DropdownMenuItem>
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  Publish
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common blog management tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Create New Draft
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Archive className="mr-2 h-4 w-4" />
              Archive Old Posts
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Live Blog
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Overview</CardTitle>
            <CardDescription>
              Distribution of posts by status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(statusLabels).map(([status, label]) => {
              const count = blogPosts.filter(p => p.status === status).length
              const percentage = Math.round((count / blogPosts.length) * 100)
              return (
                <div key={status} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{label}</span>
                    <span className="text-muted-foreground">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${statusColors[status].split(' ')[0]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}