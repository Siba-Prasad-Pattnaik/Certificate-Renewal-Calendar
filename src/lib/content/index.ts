import { seedProfile, seedSocialLinks, seedProjects, seedExperience, seedSkills, seedEducation, seedCertifications, seedBlogPosts } from '@/content/seed';
import type { Profile, SocialLink, Project, Experience, Skill, Education, Certification, BlogPost } from '@/types/content';

// Profile content accessors
export async function getProfile(): Promise<Profile> {
  // In a real scenario, this would fetch from an API or database
  return seedProfile;
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  return seedSocialLinks;
}

// Project content accessors
export async function getProjects(): Promise<Project[]> {
  return seedProjects;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return seedProjects.filter(project => project.isFeatured).slice(0, 3);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return seedProjects.find(project => project.slug === slug) || null;
}

export async function getProjectTags(): Promise<string[]> {
  const tags = new Set<string>();
  seedProjects.forEach(project => {
    project.tags?.forEach(tag => tags.add(tag));
  });
  return Array.from(tags);
}

// Experience content accessors
export async function getExperience(): Promise<Experience[]> {
  return seedExperience;
}

export async function getLatestExperience(limit: number = 3): Promise<Experience[]> {
  return seedExperience.slice(0, limit);
}

// Skills content accessors
export async function getSkills(): Promise<Skill[]> {
  return seedSkills;
}

export async function getSkillsByCategory(): Promise<Record<string, Skill[]>> {
  const skillsByCategory: Record<string, Skill[]> = {};
  
  seedSkills.forEach(skill => {
    if (!skillsByCategory[skill.category]) {
      skillsByCategory[skill.category] = [];
    }
    skillsByCategory[skill.category].push(skill);
  });
  
  return skillsByCategory;
}

// Education content accessors
export async function getEducation(): Promise<Education[]> {
  return seedEducation;
}

// Certification content accessors
export async function getCertifications(): Promise<Certification[]> {
  return seedCertifications;
}

// Blog content accessors
export async function getBlogPosts(): Promise<BlogPost[]> {
  return seedBlogPosts;
}

export async function getLatestBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  return seedBlogPosts.slice(0, limit);
}

// Resume content accessors
export async function getResumeData() {
  const profile = await getProfile();
  const experience = await getExperience();
  const education = await getEducation();
  const skills = await getSkills();
  const certifications = await getCertifications();
  
  return {
    profile,
    experience,
    education,
    skills,
    certifications,
    lastUpdated: new Date().toISOString()
  };
}