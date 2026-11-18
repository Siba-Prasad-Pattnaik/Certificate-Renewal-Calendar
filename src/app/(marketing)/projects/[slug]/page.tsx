import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Reveal } from '@/components/motion/reveal';
import { ProjectGallery } from '@/components/marketing/project-gallery';
import { getProjectBySlug, getProjects } from '@/lib/content';
import { buildMetadata } from '@/lib/utils/seo';
import { formatDate } from '@/lib/utils/date';
import { 
  ArrowLeft, 
  Calendar, 
  ExternalLink, 
  Github, 
  PlayCircle 
} from 'lucide-react';

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  
  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return buildMetadata({
    title: project.title,
    description: project.description,
    path: `/projects/${project.slug}`,
    image: project.coverImage,
  });
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  
  if (!project) {
    notFound();
  }

  const allProjects = await getProjects();
  const currentIndex = allProjects.findIndex(p => p.slug === params.slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <nav className="container py-6">
        <div className="flex items-center space-x-2 text-sm">
          <Link 
            href="/" 
            className="text-foreground-secondary hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <span className="text-foreground-secondary">/</span>
          <Link 
            href="/projects" 
            className="text-foreground-secondary hover:text-foreground transition-colors"
          >
            Projects
          </Link>
          <span className="text-foreground-secondary">/</span>
          <span className="text-foreground font-medium">{project.title}</span>
        </div>
      </nav>

      <div className="container py-8">
        <Reveal>
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              {project.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center text-foreground-secondary">
                <Calendar className="mr-2 h-4 w-4" />
                <span>
                  {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : 'Present'}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Project Links */}
        {(project.githubUrl || project.liveUrl || project.demoUrl) && (
          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-4 mb-12">
              {project.githubUrl && (
                <Button asChild variant="outline">
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    View on GitHub
                  </a>
                </Button>
              )}
              
              {project.liveUrl && (
                <Button asChild>
                  <a 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Demo
                  </a>
                </Button>
              )}
              
              {project.demoUrl && (
                <Button asChild variant="secondary">
                  <a 
                    href={project.demoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <PlayCircle className="mr-2 h-4 w-4" />
                    View Demo
                  </a>
                </Button>
              )}
            </div>
          </Reveal>
        )}

        {/* Cover Image */}
        {project.coverImage && (
          <Reveal delay={0.2}>
            <div className="relative h-64 md:h-80 lg:h-96 w-full mb-12 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
              <Image
                src={project.coverImage}
                alt={`Cover image for ${project.title}`}
                fill
                className="object-cover"
                priority
              />
            </div>
          </Reveal>
        )}

        {/* Project Content */}
        <Reveal delay={0.3}>
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <div className="text-lg leading-relaxed mb-8">
              {project.description}
            </div>
            
            {project.content && (
              <div className="mt-8">
                {project.content}
              </div>
            )}
          </div>
        </Reveal>

        {/* Project Gallery */}
        {project.galleryImages && project.galleryImages.length > 0 && (
          <Reveal delay={0.4}>
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Project Gallery</h2>
              <ProjectGallery images={project.galleryImages} />
            </div>
          </Reveal>
        )}

        {/* Navigation */}
        <Reveal delay={0.5}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t">
            <div className="flex-1">
              {prevProject && (
                <Link
                  href={`/projects/${prevProject.slug}`}
                  className="group flex items-center text-foreground-secondary hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  <div>
                    <div className="text-sm">Previous Project</div>
                    <div className="font-medium">{prevProject.title}</div>
                  </div>
                </Link>
              )}
            </div>

            <Button asChild variant="outline">
              <Link href="/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Link>
            </Button>

            <div className="flex-1 text-right">
              {nextProject && (
                <Link
                  href={`/projects/${nextProject.slug}`}
                  className="group flex items-center justify-end text-foreground-secondary hover:text-foreground transition-colors"
                >
                  <div>
                    <div className="text-sm">Next Project</div>
                    <div className="font-medium">{nextProject.title}</div>
                  </div>
                  <ArrowLeft className="ml-2 h-4 w-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}