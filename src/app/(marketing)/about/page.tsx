import { getProfile, getSocialLinks, getExperience, getSkillsByCategory, getEducation, getCertifications } from '@/lib/content';
import { JsonLd } from '@/components/seo/json-ld';
import { buildMetadata, personJsonLd } from '@/lib/utils/seo';
import Image from 'next/image';
import { ExperienceTimeline } from '@/components/sections/experience-timeline';
import { SkillsChart } from '@/components/sections/skills-chart';
import { EducationCertifications } from '@/components/sections/education-certifications';
import { SocialLinks } from '@/components/marketing/social-links';
import { Reveal } from '@/components/motion/reveal';

interface SkillsByCategory {
  [category: string]: Array<{
    id: string;
    name: string;
    category: string;
    proficiency: number;
    yearsExperience: number;
  }>;
}

export const generateMetadata = () => {
  return buildMetadata({
    title: 'About',
    description: 'Learn more about my background, experience, skills, and education',
    path: '/about',
  });
};

export default async function AboutPage() {
  const [profile, socialLinks, experience, skills, education, certifications] = await Promise.all([
    getProfile(),
    getSocialLinks(),
    getExperience(),
    getSkillsByCategory(),
    getEducation(),
    getCertifications(),
  ]);

  const jsonLdData = personJsonLd(profile, socialLinks);

  return (
    <>
      <JsonLd data={jsonLdData} />
      <div className="space-y-32 pb-32">
        {/* Bio Header */}
        <section className="scroll-mt-28">
          <div className="container">
            <Reveal y={20}>
              <div className="grid gap-12 lg:grid-cols-2">
                <div className="flex flex-col justify-center space-y-6">
                  <div>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                      About Me
                    </h1>
                    <p className="mt-4 text-xl text-foreground-secondary">
                      {profile.headline}
                    </p>
                  </div>
                  
                  <div className="prose prose-lg dark:prose-invert">
                    <p>{profile.bio}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="relative h-64 w-64 overflow-hidden rounded-full md:h-80 md:w-80 lg:h-96 lg:w-96">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5"></div>
                    <div className="relative flex h-full w-full items-center justify-center">
                      <div className="h-48 w-48 rounded-full bg-gradient-to-br from-primary to-primary/30 md:h-60 md:w-60 lg:h-72 lg:w-72"></div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Experience Timeline */}
        <section id="experience" className="scroll-mt-28">
          <div className="container">
            <Reveal y={20}>
              <h2 className="mb-12 text-3xl font-bold tracking-tight sm:text-4xl">Experience</h2>
              <ExperienceTimeline experience={experience} showViewAll={false} />
            </Reveal>
          </div>
        </section>

        {/* Skills Chart */}
        <section id="skills" className="scroll-mt-28">
          <div className="container">
            <Reveal y={20}>
              <h2 className="mb-12 text-3xl font-bold tracking-tight sm:text-4xl">Skills</h2>
              <SkillsChart skills={skills as SkillsByCategory} />
            </Reveal>
          </div>
        </section>

        {/* Education & Certifications */}
        <section id="education" className="scroll-mt-28">
          <div className="container">
            <Reveal y={20}>
              <h2 className="mb-12 text-3xl font-bold tracking-tight sm:text-4xl">Education & Certifications</h2>
              <EducationCertifications education={education} certifications={certifications} />
            </Reveal>
          </div>
        </section>

        {/* Social Links */}
        <section>
          <div className="container">
            <Reveal y={20}>
              <div className="flex flex-col items-center justify-center space-y-6">
                <h3 className="text-2xl font-semibold">Connect with me</h3>
                <SocialLinks />
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </>
  );
}
