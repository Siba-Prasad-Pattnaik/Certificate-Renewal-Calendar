import { Hero } from '@/components/sections/hero';
import { ProjectsGrid } from '@/components/sections/projects-grid';
import { SkillsCloud } from '@/components/sections/skills-cloud';
import { ExperienceTimeline } from '@/components/sections/experience-timeline';
import { ContactCTA } from '@/components/sections/contact-cta';
import { BlogPreview } from '@/components/sections/blog-preview';
import { JsonLd } from '@/components/seo/json-ld';
import { buildMetadata, personJsonLd } from '@/lib/utils/seo';
import { getProfile, getSocialLinks, getFeaturedProjects, getSkillsByCategory, getLatestExperience, getLatestBlogPosts } from '@/lib/content';

export const generateMetadata = () => {
  return buildMetadata({
    title: 'Home',
    description: 'Personal portfolio showcasing projects, skills, and experience',
    path: '/',
  });
};

export default async function HomePage() {
  const [profile, socialLinks, featuredProjects, skills, experience, blogPosts] = await Promise.all([
    getProfile(),
    getSocialLinks(),
    getFeaturedProjects(),
    getSkillsByCategory(),
    getLatestExperience(3),
    getLatestBlogPosts(3),
  ]);

  const jsonLdData = personJsonLd(profile, socialLinks);

  return (
    <>
      <JsonLd data={jsonLdData} />
      <div className="space-y-32 pb-32">
        <Hero profile={profile} socialLinks={socialLinks} />
        
        <section id="featured-projects" className="scroll-mt-28">
          <div className="container">
            <h2 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">Featured Projects</h2>
            <ProjectsGrid projects={featuredProjects} showViewAll />
          </div>
        </section>
        
        <section id="skills">
          <div className="container">
            <h2 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">Skills</h2>
            <SkillsCloud skills={skills} />
          </div>
        </section>
        
        <section id="experience">
          <div className="container">
            <h2 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">Recent Experience</h2>
            <ExperienceTimeline experience={experience} showViewAll />
          </div>
        </section>
        
        <section id="latest-posts">
          <div className="container">
            <h2 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">Latest Posts</h2>
            <BlogPreview posts={blogPosts} />
          </div>
        </section>
        
        <section id="contact-cta">
          <div className="container">
            <ContactCTA />
          </div>
        </section>
      </div>
    </>
  );
}