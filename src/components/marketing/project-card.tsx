'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/types/content';
import { ExternalLink, Github } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      <div className="relative aspect-video overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5"></div>
        <div className="flex h-full items-center justify-center">
          <div className="h-32 w-32 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex items-center gap-4 rounded-full bg-background/80 px-4 py-2 backdrop-blur-sm">
            {project.liveUrl && (
              <Link
                href={project.liveUrl}
                className="flex items-center gap-1 text-sm hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                Live
              </Link>
            )}
            {project.repoUrl && (
              <Link
                href={project.repoUrl}
                className="flex items-center gap-1 text-sm hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
                Code
              </Link>
            )}
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-xl font-semibold">{project.title}</h3>
          <Link 
            href={`/projects/${project.slug}`}
            className="text-primary hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
        
        <p className="mb-4 text-foreground-secondary">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
          {project.tags.length > 3 && (
            <Badge variant="outline">
              +{project.tags.length - 3}
            </Badge>
          )}
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-foreground-secondary">
          <span>
            {new Date(project.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
          </span>
          <span className="font-medium">Featured</span>
        </div>
      </CardContent>
    </Card>
  );
}
