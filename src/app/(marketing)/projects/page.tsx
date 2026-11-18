'use client';

import { useState, useMemo } from 'react';
import { getProjects, getProjectTags } from '@/lib/content';
import { buildMetadata } from '@/lib/utils/seo';
import { Reveal } from '@/components/motion/reveal';
import { TagFilter } from '@/components/marketing/tag-filter';
import { ProjectsGrid } from '@/components/sections/projects-grid';
import { Project } from '@/types/content';

export const generateMetadata = () => {
  return buildMetadata({
    title: 'Projects',
    description: 'Browse my portfolio of projects with detailed case studies',
    path: '/projects',
  });
};

export default function ProjectsPage() {
  const projects = getProjects();
  const allTags = getProjectTags();
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const filteredProjects = useMemo(() => {
    if (selectedTag === 'All') return projects;
    return projects.filter(project => 
      project.tags?.some(tag => tag.name === selectedTag)
    );
  }, [projects, selectedTag]);

  return (
    <div className="space-y-32 pb-32">
      {/* Page Header */}
      <section className="scroll-mt-28">
        <div className="container">
          <Reveal y={20}>
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Projects
              </h1>
              <p className="mt-4 text-xl text-foreground-secondary">
                A collection of my work, from concept to delivery
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Tag Filter */}
      <section>
        <div className="container">
          <Reveal y={20}>
            <div className="mb-12">
              <TagFilter 
                tags={allTags} 
                selectedTag={selectedTag} 
                onTagSelect={setSelectedTag} 
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Projects Grid */}
      <section>
        <div className="container">
          <Reveal y={20}>
            {filteredProjects.length > 0 ? (
              <ProjectsGrid projects={filteredProjects} showViewAll={false} />
            ) : (
              <div className="mx-auto max-w-2xl text-center py-16">
                <h3 className="text-2xl font-semibold mb-4">No projects found</h3>
                <p className="text-foreground-secondary">
                  No projects match the selected tag. Try selecting a different tag or view all projects.
                </p>
                <button 
                  onClick={() => setSelectedTag('All')}
                  className="mt-6 text-primary hover:underline"
                >
                  View all projects
                </button>
              </div>
            )}
          </Reveal>
        </div>
      </section>
    </div>
  );
}
