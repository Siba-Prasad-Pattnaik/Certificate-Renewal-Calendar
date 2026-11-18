# Content Management Guide

This document provides guidelines for managing content (blog posts, projects, portfolio entries) in the portfolio website using MDX/Contentlayer.

## MDX Authoring Guide

### Frontmatter Fields

#### Blog Posts (`content/blog/`)
```yaml
---
title: "Post Title"                    # Required: Post title
slug: "post-title"                     # Required: URL-friendly slug (lowercase, hyphens)
date: "2024-01-15T10:00:00.000Z"      # Required: Publication date
author: "Your Name"                    # Required: Author name
excerpt: "Brief description..."       # Required: Short excerpt for preview
tags: ["tag1", "tag2"]                # Optional: Array of tags
draft: false                          # Optional: Draft status (true = not published)
featured: false                       # Optional: Featured post
coverImage: "/images/blog/cover.jpg"  # Optional: Cover image path
---
```

#### Projects (`content/projects/`)
```yaml
---
title: "Project Name"                 # Required: Project title
slug: "project-name"                  # Required: URL-friendly slug
date: "2024-01-15"                   # Required: Project date
client: "Client Name"                 # Optional: Client/organization
category: "Web Development"           # Optional: Project category
tags: ["react", "nextjs", "typescript"] # Optional: Technologies used
featured: true                        # Optional: Featured project
url: "https://project-demo.com"       # Optional: Live demo URL
github: "https://github.com/..."      # Optional: GitHub repository
coverImage: "/images/projects/cover.jpg" # Optional: Project cover image
status: "completed"                   # Optional: completed, ongoing, archived
---
```

### Content Validation

All MDX files are validated during build:

1. **Required Fields**: Missing required fields will fail CI
2. **Date Format**: Must be valid ISO 8601 format
3. **Slug Format**: Lowercase, letters, numbers, hyphens only
4. **URL Paths**: Must point to existing files in `public/` directory

### Validation Errors

Common validation errors and solutions:

```bash
# Missing required field
❌ Error: Frontmatter validation failed for 'content/blog/my-post.mdx'
Error: Required field 'title' is missing

# Invalid date format  
❌ Error: Invalid date format in 'content/blog/my-post.mdx'
Expected: 2024-01-15T10:00:00.000Z
Got: 2024-01-15

# Duplicate slug
❌ Error: Duplicate slug 'my-post' found in:
- content/blog/post1.mdx
- content/blog/post2.mdx
```

## Image Management

### Supported Formats
- **WebP** (recommended)
- **JPEG** (for photographs)
- **PNG** (for graphics with transparency)
- **SVG** (for icons and logos)

### Image Optimization

1. **Place images in `public/images/` directory**
2. **Use descriptive filenames**: `project-screenshot-desktop.webp`
3. **Optimize before uploading**:
   - Compress JPEG/PNG files (TinyPNG, ImageOptim)
   - Convert to WebP for better compression
   - Resize to appropriate dimensions

### Reference in MDX
```markdown
![Project Screenshot](/images/projects/project-screenshot.webp)
*Caption: Project dashboard interface*
```

## Drafts and Publishing

### Draft Mode
```yaml
draft: true   # Post won't appear in production
```

Draft posts:
- Won't appear in blog listings
- Won't be included in RSS/Atom feeds
- Won't appear in sitemap.xml
- Can be previewed with direct URL

### Publishing Checklist
Before publishing any content:

```markdown
## Pre-Publication Checklist
- [ ] Frontmatter complete and validated
- [ ] Content proofread for typos
- [ ] Images optimized and correctly referenced
- [ ] Links tested (internal and external)
- [ ] SEO meta description written
- [ ] Tags consistent with existing taxonomy
- [ ] Scheduled publication date set
- [ ] Social sharing images ready (Open Graph)
```

## Admin CMS vs Git-based Workflow

### Git-based Workflow (Recommended)
1. **Create MDX file** in appropriate `content/` directory
2. **Add frontmatter** with required fields
3. **Write content** in Markdown/MDX format
4. **Commit changes** to Git repository
5. **Deploy** via CI/CD pipeline
6. **Preview** on Vercel preview deployment

### Local Validation Commands
```bash
# Validate content structure
npm run content:validate

# Build with MDX validation
npm run build

# Start dev server with content watching
npm run dev
```

### Admin CMS (Optional Setup)
The application includes an admin interface at `/admin`:

**Features**:
- Visual editor for blog posts and projects
- Image upload and management
- Draft/publish workflows
- Real-time preview

**Setup Requirements**:
```bash
# Environment variables required:
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH= # bcrypt hash
JWT_SECRET=your-secret-key
```

## Content Organization

### Directory Structure
```
content/
├── blog/                    # Blog posts
│   ├── 2024/
│   │   ├── 01-january/
│   │   └── 02-february/
│   └── drafts/              # Draft posts
├── projects/                # Portfolio projects
│   ├── featured/           # Featured projects
│   └── archived/           # Archived projects
├── pages/                  # Static pages (About, etc.)
└── shared/                # Reusable components
    └── components/        # MDX components
```

### Naming Conventions
- **Files**: `yyyy-mm-dd-slug.mdx` (e.g., `2024-01-15-my-post.mdx`)
- **Images**: `category-description-resolution.ext` (e.g., `blog-hero-desktop.webp`)
- **Slugs**: Lowercase, hyphen-separated, meaningful (e.g., `getting-started-with-nextjs`)

## Content Migration

### Importing from Other Platforms

#### WordPress Export
```bash
# Convert WordPress XML export to MDX
npm run content:import -- --source=wordpress.xml --output=content/blog/
```

#### Markdown Files
```bash
# Convert markdown with frontmatter
npm run content:convert -- --input=legacy-posts/ --output=content/blog/
```

### Migration Checklist
1. **Backup existing content**
2. **Test conversion locally**
3. **Validate converted files**
4. **Check image references**
5. **Test on preview deployment**
6. **Schedule migration during low traffic**

## Performance Considerations

### Large Content Files
- Split long posts into multiple parts
- Use lazy loading for embedded media
- Consider pagination for content-heavy pages

### Image Optimization
- Use Next.js Image component for automatic optimization
- Specify `width` and `height` attributes
- Use `priority` for above-the-fold images
- Implement lazy loading with `loading="lazy"`

## SEO Best Practices

### Frontmatter SEO Fields
```yaml
seo:
  title: "Custom SEO Title"           # Overrides page title for SEO
  description: "Meta description..."  # Custom meta description
  keywords: ["keyword1", "keyword2"]  # Meta keywords (optional)
  canonical: "https://custom-url.com" # Canonical URL (optional)
  image: "/images/seo/og-image.jpg"   # Open Graph/Twitter image
```

### Content SEO Checklist
- [ ] Target keyword in title (H1)
- [ ] Target keyword in first paragraph
- [ ] Internal links to related content
- [ ] External links to authoritative sources
- [ ] Heading hierarchy (H1 > H2 > H3)
- [ ] Image alt text descriptive
- [ ] URL slug includes primary keyword
- [ ] Meta description under 160 characters

## Troubleshooting Content Issues

### Common Issues and Solutions

**1. MDX Build Failures**
```bash
# Error: MDX compilation failed
Solution: Check for unclosed JSX tags or invalid Markdown syntax
```

**2. Missing Images**
```bash
# Error: Image not found at path
Solution: Ensure images are in public/ directory and paths are correct
```

**3. Draft Posts Showing in Production**
```bash
# Issue: Draft posts visible
Solution: Verify draft: true in frontmatter, rebuild application
```

**4. Content Not Updating**
```bash
# Issue: Changes not reflected
Solution: Clear Contentlayer cache: rm -rf .contentlayer
```

**5. Slow Build Times**
```bash
# Issue: Build times increasing
Solution: Optimize images, consider incremental builds
```

## Version Control Best Practices

### Git Workflow for Content
```bash
# Feature branch for new content
git checkout -b feature/new-blog-post

# Regular commits
git add content/blog/2024-01-15-my-post.mdx
git commit -m "Add: New blog post on Next.js"

# Rebase before merging
git fetch origin main
git rebase origin/main

# Push and create PR
git push origin feature/new-blog-post
```

### Content Review Process
1. **Author creates** content and opens PR
2. **Editor reviews** content quality and SEO
3. **Technical review** for build validation
4. **Preview deployment** for final check
5. **Merge to main** for production deployment

## Automation and Scripts

### Available Scripts
```bash
# Validate all content
npm run content:validate

# Generate table of contents
npm run content:toc

# Optimize all images
npm run content:optimize-images

# Check for broken links
npm run content:check-links

# Generate sitemap
npm run content:generate-sitemap
```

### Custom Content Scripts
Create custom scripts in `scripts/content/` directory:
```typescript
// scripts/content/migrate-posts.ts
import { migrateLegacyPosts } from './lib/migration';

migrateLegacyPosts({
  inputDir: './legacy-content',
  outputDir: './content/blog',
  format: 'markdown'
});
```

## Monitoring and Analytics

### Content Performance
Track content performance using:

1. **Google Analytics 4**:
   - Page views
   - Time on page
   - Bounce rate

2. **Vercel Analytics**:
   - Web Vitals
   - Traffic sources
   - Geographic distribution

3. **Custom Events**:
   ```javascript
   // Track content engagement
   gtag('event', 'content_read', {
     content_type: 'blog_post',
     content_slug: 'my-post',
     read_time: 120 // seconds
   });
   ```

### Content Review Schedule
- **Weekly**: Check top-performing content
- **Monthly**: Update/refresh outdated content
- **Quarterly**: Content audit and inventory
- **Yearly**: Major content strategy review

## Support and Resources

### Getting Help
- **Documentation**: This guide and README.md
- **GitHub Issues**: Report content-related bugs
- **Community**: Discord/Slack channel for content editors

### Training Resources
- **MDX Documentation**: [mdxjs.com](https://mdxjs.com)
- **Markdown Guide**: [markdownguide.org](https://markdownguide.org)
- **Contentlayer Docs**: [contentlayer.dev](https://contentlayer.dev)
- **Next.js Image Docs**: [nextjs.org/docs/app/building-your-application/optimizing/images](https://nextjs.org/docs/app/building-your-application/optimizing/images)

---

**Last Updated**: $(date +%Y-%m-%d)
**Next Review**: $(date -d "+90 days" +%Y-%m-%d)
**Owner**: Content Team
**Approvers**: Editor-in-Chief, Technical Lead