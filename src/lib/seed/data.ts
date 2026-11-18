import { 
  Profile, 
  Project, 
  ProjectImage, 
  Experience, 
  Education, 
  Certification, 
  Skill, 
  SocialLink, 
  Tag, 
  BlogPost, 
  Resume, 
  ContactInfo,
  SiteSettings 
} from '../zod/types';

// Generate a consistent UUID for all seed data
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Generate a consistent ISO date string
function generateDate(offsetDays: number = 0): string {
  const date = new Date();
  date.setDate(date.getDate() - offsetDays);
  return date.toISOString();
}

// Seed Profile
export const seedProfile: Profile = {
  id: generateId('profile'),
  name: 'Alex Johnson',
  title: 'Senior Full Stack Developer',
  bio: 'Passionate full-stack developer with 8+ years of experience building scalable web applications. Specializing in React, TypeScript, Node.js, and cloud infrastructure. Always eager to learn new technologies and solve complex problems.',
  location: 'San Francisco, CA',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  email: 'alex.johnson@example.com',
  phone: '+1 (555) 123-4567',
  website: 'https://alexjohnson.dev',
  linkedin: 'https://linkedin.com/in/alexjohnson',
  github: 'https://github.com/alexjohnson',
  twitter: 'https://twitter.com/alexjohnson',
  createdAt: generateDate(365),
  updatedAt: generateDate(7),
};

// Seed Projects
export const seedProjects: Project[] = [
  {
    id: generateId('project'),
    slug: 'e-commerce-platform',
    title: 'E-Commerce Platform',
    description: 'A full-featured e-commerce platform with real-time inventory management and payment processing.',
    longDescription: 'Built with React, Node.js, and PostgreSQL. Features include user authentication, product catalog, shopping cart, payment integration (Stripe), order management, and admin dashboard.',
    category: 'Web Application',
    tags: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Stripe'],
    featured: true,
    status: 'completed',
    startDate: generateDate(180),
    endDate: generateDate(30),
    url: 'https://ecom-demo.alexjohnson.dev',
    repository: 'https://github.com/alexjohnson/ecommerce-platform',
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
    isCurrent: false,
    sortOrder: 1,
    createdAt: generateDate(180),
    updatedAt: generateDate(30),
  },
  {
    id: generateId('project'),
    slug: 'ai-content-generator',
    title: 'AI Content Generator',
    description: 'A SaaS platform for generating marketing content using OpenAI GPT-4.',
    longDescription: 'Developed a subscription-based SaaS platform that allows marketers to generate blog posts, social media content, and ad copies using AI. Features include team collaboration, content templates, and analytics dashboard.',
    category: 'SaaS',
    tags: ['AI', 'Next.js', 'OpenAI', 'SaaS'],
    featured: true,
    status: 'in-progress',
    startDate: generateDate(90),
    endDate: null,
    url: 'https://content-ai.alexjohnson.dev',
    repository: 'https://github.com/alexjohnson/ai-content-generator',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'OpenAI API', 'Prisma', 'PostgreSQL', 'Stripe'],
    isCurrent: true,
    sortOrder: 2,
    createdAt: generateDate(90),
    updatedAt: generateDate(7),
  },
  {
    id: generateId('project'),
    slug: 'health-fitness-tracker',
    title: 'Health & Fitness Tracker',
    description: 'Mobile app for tracking workouts, nutrition, and health metrics.',
    longDescription: 'Cross-platform mobile application built with React Native that syncs with popular fitness devices and provides personalized workout recommendations and nutrition tracking.',
    category: 'Mobile App',
    tags: ['React Native', 'Health', 'Fitness', 'Mobile'],
    featured: false,
    status: 'completed',
    startDate: generateDate(240),
    endDate: generateDate(120),
    url: 'https://apps.apple.com/app/health-tracker',
    repository: 'https://github.com/alexjohnson/health-fitness-tracker',
    technologies: ['React Native', 'TypeScript', 'Redux', 'Firebase', 'HealthKit', 'Google Fit API'],
    isCurrent: false,
    sortOrder: 3,
    createdAt: generateDate(240),
    updatedAt: generateDate(120),
  },
  {
    id: generateId('project'),
    slug: 'portfolio-website',
    title: 'Portfolio Website',
    description: 'Modern, responsive portfolio website built with Next.js and TypeScript.',
    longDescription: 'This very portfolio website! Built with Next.js 14, TypeScript, and Tailwind CSS. Features include dark mode, responsive design, blog functionality with MDX, and contact form with spam protection.',
    category: 'Website',
    tags: ['Next.js', 'TypeScript', 'Tailwind', 'Portfolio'],
    featured: true,
    status: 'completed',
    startDate: generateDate(60),
    endDate: generateDate(14),
    url: 'https://alexjohnson.dev',
    repository: 'https://github.com/alexjohnson/portfolio',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'MDX', 'Zod', 'Resend', 'Vercel'],
    isCurrent: false,
    sortOrder: 4,
    createdAt: generateDate(60),
    updatedAt: generateDate(14),
  },
];

// Seed Project Images
export const seedProjectImages: ProjectImage[] = [
  {
    id: generateId('image'),
    projectId: seedProjects[0].id,
    url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    alt: 'E-commerce platform dashboard',
    width: 800,
    height: 600,
    order: 1,
    createdAt: generateDate(175),
  },
  {
    id: generateId('image'),
    projectId: seedProjects[1].id,
    url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    alt: 'AI content generator interface',
    width: 800,
    height: 600,
    order: 1,
    createdAt: generateDate(85),
  },
];

// Seed Experience
export const seedExperience: Experience[] = [
  {
    id: generateId('experience'),
    company: 'TechCorp Solutions',
    title: 'Senior Full Stack Developer',
    location: 'San Francisco, CA',
    startDate: generateDate(1080),
    endDate: null,
    isCurrent: true,
    description: 'Led development of multiple enterprise applications and mentored junior developers.',
    achievements: [
      'Improved application performance by 40% through code optimization',
      'Reduced deployment time by 60% with CI/CD pipeline improvements',
      'Mentored 5 junior developers who got promoted within a year',
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'AWS', 'Kubernetes', 'GraphQL'],
    employmentType: 'full-time',
    url: 'https://techcorp.com',
    sortOrder: 1,
    createdAt: generateDate(1080),
    updatedAt: generateDate(30),
  },
  {
    id: generateId('experience'),
    company: 'StartUpBoost',
    title: 'Full Stack Developer',
    location: 'Remote',
    startDate: generateDate(1460),
    endDate: generateDate(1090),
    isCurrent: false,
    description: 'Built and maintained multiple SaaS products for early-stage startups.',
    achievements: [
      'Built 3 SaaS products from scratch that achieved PMF',
      'Implemented automated testing reducing bugs by 70%',
      'Designed scalable architecture supporting 100k+ users',
    ],
    technologies: ['Vue.js', 'Python', 'Django', 'PostgreSQL', 'Docker'],
    employmentType: 'full-time',
    url: 'https://startupboost.com',
    sortOrder: 2,
    createdAt: generateDate(1460),
    updatedAt: generateDate(1090),
  },
  {
    id: generateId('experience'),
    company: 'Digital Innovations',
    title: 'Frontend Developer',
    location: 'New York, NY',
    startDate: generateDate(1825),
    endDate: generateDate(1470),
    isCurrent: false,
    description: 'Developed responsive web applications for various clients across different industries.',
    achievements: [
      'Built 15+ client websites with custom CMS solutions',
      'Implemented mobile-first responsive designs',
      'Achieved 95+ Lighthouse scores for all projects',
    ],
    technologies: ['JavaScript', 'React', 'Sass', 'WordPress', 'PHP'],
    employmentType: 'full-time',
    url: 'https://digitalinnovations.com',
    sortOrder: 3,
    createdAt: generateDate(1825),
    updatedAt: generateDate(1470),
  },
];

// Seed Education
export const seedEducation: Education[] = [
  {
    id: generateId('education'),
    institution: 'Stanford University',
    degree: 'Master of Science in Computer Science',
    field: 'Software Engineering',
    location: 'Stanford, CA',
    startDate: generateDate(2190),
    endDate: generateDate(1825),
    isCurrent: false,
    description: 'Specialized in software engineering, distributed systems, and machine learning.',
    grade: '3.9/4.0',
    url: 'https://stanford.edu',
    sortOrder: 1,
    createdAt: generateDate(2190),
    updatedAt: generateDate(1825),
  },
  {
    id: generateId('education'),
    institution: 'MIT',
    degree: 'Bachelor of Science in Computer Science',
    field: 'Computer Science',
    location: 'Cambridge, MA',
    startDate: generateDate(2920),
    endDate: generateDate(2190),
    isCurrent: false,
    description: 'Focus on algorithms, data structures, and computer systems.',
    grade: 'Summa Cum Laude',
    url: 'https://mit.edu',
    sortOrder: 2,
    createdAt: generateDate(2920),
    updatedAt: generateDate(2190),
  },
];

// Seed Certifications
export const seedCertifications: Certification[] = [
  {
    id: generateId('certification'),
    name: 'AWS Solutions Architect Professional',
    issuer: 'Amazon Web Services',
    issueDate: generateDate(180),
    expiryDate: generateDate(180 + 730), // 2 years
    neverExpires: false,
    credentialId: 'AWS-SAP-12345',
    url: 'https://aws.amazon.com/certification/',
    description: 'Design and deploy dynamically scalable, highly available, fault-tolerant, and reliable applications on AWS.',
    sortOrder: 1,
    createdAt: generateDate(180),
    updatedAt: generateDate(180),
  },
  {
    id: generateId('certification'),
    name: 'Google Cloud Professional DevOps Engineer',
    issuer: 'Google Cloud',
    issueDate: generateDate(120),
    expiryDate: generateDate(120 + 1095), // 3 years
    neverExpires: false,
    credentialId: 'GCP-DEVOPS-67890',
    url: 'https://cloud.google.com/certification/',
    description: 'Ability to build and deploy applications on Google Cloud using DevOps best practices.',
    sortOrder: 2,
    createdAt: generateDate(120),
    updatedAt: generateDate(120),
  },
  {
    id: generateId('certification'),
    name: 'React Advanced Certification',
    issuer: 'Meta',
    issueDate: generateDate(90),
    expiryDate: null,
    neverExpires: true,
    credentialId: 'REACT-ADV-45678',
    url: 'https://react.dev/',
    description: 'Advanced React patterns, performance optimization, and state management.',
    sortOrder: 3,
    createdAt: generateDate(90),
    updatedAt: generateDate(90),
  },
];

// Seed Skills
export const seedSkills: Skill[] = [
  {
    id: generateId('skill'),
    name: 'TypeScript',
    category: 'Languages',
    proficiency: 9,
    yearsOfExperience: 5,
    featured: true,
    icon: 'typescript',
    description: 'Strongly typed superset of JavaScript',
    sortOrder: 1,
    createdAt: generateDate(365),
    updatedAt: generateDate(30),
  },
  {
    id: generateId('skill'),
    name: 'React',
    category: 'Frontend',
    proficiency: 10,
    yearsOfExperience: 7,
    featured: true,
    icon: 'react',
    description: 'Frontend library for building user interfaces',
    sortOrder: 2,
    createdAt: generateDate(365),
    updatedAt: generateDate(30),
  },
  {
    id: generateId('skill'),
    name: 'Node.js',
    category: 'Backend',
    proficiency: 9,
    yearsOfExperience: 6,
    featured: true,
    icon: 'nodejs',
    description: 'JavaScript runtime for server-side development',
    sortOrder: 3,
    createdAt: generateDate(365),
    updatedAt: generateDate(30),
  },
  {
    id: generateId('skill'),
    name: 'Next.js',
    category: 'Frontend',
    proficiency: 8,
    yearsOfExperience: 4,
    featured: true,
    icon: 'nextjs',
    description: 'React framework for production',
    sortOrder: 4,
    createdAt: generateDate(365),
    updatedAt: generateDate(30),
  },
  {
    id: generateId('skill'),
    name: 'AWS',
    category: 'Cloud',
    proficiency: 8,
    yearsOfExperience: 4,
    featured: false,
    icon: 'aws',
    description: 'Cloud computing services',
    sortOrder: 5,
    createdAt: generateDate(365),
    updatedAt: generateDate(30),
  },
  {
    id: generateId('skill'),
    name: 'Docker',
    category: 'DevOps',
    proficiency: 7,
    yearsOfExperience: 3,
    featured: false,
    icon: 'docker',
    description: 'Containerization platform',
    sortOrder: 6,
    createdAt: generateDate(365),
    updatedAt: generateDate(30),
  },
  {
    id: generateId('skill'),
    name: 'GraphQL',
    category: 'Backend',
    proficiency: 7,
    yearsOfExperience: 3,
    featured: false,
    icon: 'graphql',
    description: 'Query language for APIs',
    sortOrder: 7,
    createdAt: generateDate(365),
    updatedAt: generateDate(30),
  },
  {
    id: generateId('skill'),
    name: 'PostgreSQL',
    category: 'Database',
    proficiency: 8,
    yearsOfExperience: 5,
    featured: false,
    icon: 'postgresql',
    description: 'Relational database management system',
    sortOrder: 8,
    createdAt: generateDate(365),
    updatedAt: generateDate(30),
  },
];

// Seed Social Links
export const seedSocialLinks: SocialLink[] = [
  {
    id: generateId('social'),
    platform: 'github',
    url: 'https://github.com/alexjohnson',
    username: 'alexjohnson',
    displayText: 'GitHub',
    sortOrder: 1,
    createdAt: generateDate(365),
    updatedAt: generateDate(30),
  },
  {
    id: generateId('social'),
    platform: 'linkedin',
    url: 'https://linkedin.com/in/alexjohnson',
    username: 'alexjohnson',
    displayText: 'LinkedIn',
    sortOrder: 2,
    createdAt: generateDate(365),
    updatedAt: generateDate(30),
  },
  {
    id: generateId('social'),
    platform: 'twitter',
    url: 'https://twitter.com/alexjohnson',
    username: '@alexjohnson',
    displayText: 'Twitter',
    sortOrder: 3,
    createdAt: generateDate(365),
    updatedAt: generateDate(30),
  },
  {
    id: generateId('social'),
    platform: 'medium',
    url: 'https://medium.com/@alexjohnson',
    username: '@alexjohnson',
    displayText: 'Medium',
    sortOrder: 4,
    createdAt: generateDate(365),
    updatedAt: generateDate(30),
  },
];

// Seed Tags
export const seedTags: Tag[] = [
  {
    id: generateId('tag'),
    name: 'React',
    slug: 'react',
    description: 'Posts about React framework',
    postCount: 5,
    createdAt: generateDate(180),
    updatedAt: generateDate(30),
  },
  {
    id: generateId('tag'),
    name: 'TypeScript',
    slug: 'typescript',
    description: 'Posts about TypeScript programming',
    postCount: 4,
    createdAt: generateDate(150),
    updatedAt: generateDate(30),
  },
  {
    id: generateId('tag'),
    name: 'Next.js',
    slug: 'nextjs',
    description: 'Posts about Next.js framework',
    postCount: 3,
    createdAt: generateDate(120),
    updatedAt: generateDate(30),
  },
  {
    id: generateId('tag'),
    name: 'Performance',
    slug: 'performance',
    description: 'Posts about web performance optimization',
    postCount: 3,
    createdAt: generateDate(90),
    updatedAt: generateDate(30),
  },
];

// Seed Blog Posts
export const seedBlogPosts: BlogPost[] = [
  {
    id: generateId('blog'),
    slug: 'modern-react-patterns-2024',
    title: 'Modern React Patterns You Should Know in 2024',
    excerpt: 'Explore the latest React patterns and best practices for building scalable applications.',
    content: `# Modern React Patterns You Should Know in 2024

React has evolved significantly over the years, and staying up-to-date with modern patterns is crucial for building maintainable and scalable applications. In this post, we'll explore several patterns that have become essential in 2024.

## 1. Component Composition with Slots

Instead of complex prop drilling, use composition patterns:

\`\`\`jsx
<Card>
  <Card.Header>
    <Card.Title>Modern Patterns</Card.Title>
  </Card.Header>
  <Card.Content>
    <p>Content goes here</p>
  </Card.Content>
</Card>
\`\`\`

## 2. Custom Hooks for Business Logic

Extract reusable logic into custom hooks:

\`\`\`javascript
function useUserData(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUserData(userId).then(setUser);
  }, [userId]);
  
  return { user, loading };
}
\`\`\`

## 3. Server Components

With React Server Components, we can now render components on the server:

\`\`\`jsx
// app/blog/page.jsx
async function BlogPage() {
  const posts = await fetchBlogPosts();
  
  return (
    <div>
      {posts.map(post => (
        <BlogPost key={post.id} post={post} />
      ))}
    </div>
  );
}
\`\`\`

## 4. State Management with Context Selectors

Optimize context performance with selector patterns:

\`\`\`javascript
const UserContext = createContext();

function useUserSelector(selector) {
  const context = useContext(UserContext);
  return selector(context);
}

// Usage
const userName = useUserSelector(state => state.user.name);
\`\`\`

## Conclusion

These patterns help create more maintainable, performant, and scalable React applications. As the ecosystem continues to evolve, staying current with these practices will ensure your applications remain modern and efficient.`,
    readingTimeMinutes: 8,
    publishedAt: generateDate(7),
    updatedAt: generateDate(7),
    featured: true,
    tags: ['react', 'typescript'],
    authorId: seedProfile.id,
    seoTitle: 'Modern React Patterns 2024 | Best Practices & Examples',
    seoDescription: 'Learn essential React patterns for 2024 including component composition, custom hooks, server components, and state management optimizations.',
    coverImageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop',
    coverImageAlt: 'React code on screen',
    status: 'published',
    createdAt: generateDate(14),
  },
  {
    id: generateId('blog'),
    slug: 'typescript-advanced-types',
    title: 'Advanced TypeScript Types for Robust Applications',
    excerpt: 'Master advanced TypeScript types to create type-safe and maintainable codebases.',
    content: `# Advanced TypeScript Types for Robust Applications

TypeScript's type system is one of its most powerful features. Beyond basic types, advanced type features can dramatically improve code safety and developer experience.

## Conditional Types

Conditional types allow types to be selected based on conditions:

\`\`\`typescript
type ExtractReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getString(): string { return 'hello'; }
function getNumber(): number { return 42; }

type StringReturn = ExtractReturnType<typeof getString>; // string
type NumberReturn = ExtractReturnType<typeof getNumber>; // number
\`\`\`

## Mapped Types

Transform existing types into new types:

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
\`\`\`

## Template Literal Types

Create string literal types from templates:

\`\`\`typescript
type EventName = 'click' | 'hover' | 'focus';
type HandlerName = \`on\${Capitalize<EventName>}\`;

// Result: 'onClick' | 'onHover' | 'onFocus'
\`\`\`

## Utility Types in Practice

Combine utility types for powerful patterns:

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  createdAt: Date;
}

// Create a type for user updates (all fields optional except id)
type UserUpdate = Partial<Omit<User, 'id' | 'createdAt'>> & { id: string };

// Create a read-only user view
type ReadonlyUserView = Readonly<Pick<User, 'id' | 'name' | 'email'>>;
\`\`\`

## Conclusion

Mastering advanced TypeScript types enables you to create self-documenting, type-safe code that catches errors at compile time rather than runtime.`,
    readingTimeMinutes: 10,
    publishedAt: generateDate(14),
    updatedAt: generateDate(7),
    featured: true,
    tags: ['typescript', 'programming'],
    authorId: seedProfile.id,
    seoTitle: 'Advanced TypeScript Types Guide | Conditional, Mapped & Template Types',
    seoDescription: 'Learn advanced TypeScript types including conditional types, mapped types, template literal types, and utility types for robust applications.',
    coverImageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&h=630&fit=crop',
    coverImageAlt: 'TypeScript code on screen',
    status: 'published',
    createdAt: generateDate(21),
  },
];

// Seed Resume
export const seedResume: Resume = {
  id: generateId('resume'),
  title: 'Alex Johnson - Senior Full Stack Developer',
  summary: '8+ years of experience building scalable web applications with React, TypeScript, Node.js, and cloud technologies. Proven track record of leading development teams and delivering high-quality software solutions.',
  fileName: 'alex-johnson-resume-2024.pdf',
  fileUrl: '/assets/resumes/alex-johnson-resume-2024.pdf',
  fileSize: 1024000, // 1MB
  fileType: 'application/pdf',
  language: 'English',
  isPrimary: true,
  downloadCount: 42,
  createdAt: generateDate(30),
  updatedAt: generateDate(7),
};

// Seed Contact Info
export const seedContactInfo: ContactInfo = {
  id: generateId('contact'),
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  subject: 'General Inquiry',
  message: 'I would like to learn more about your services and discuss potential collaboration opportunities.',
  ipAddress: '192.168.1.100',
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  status: 'read',
  repliedAt: generateDate(1),
  createdAt: generateDate(2),
  updatedAt: generateDate(1),
};

// Seed Site Settings
export const seedSiteSettings: SiteSettings = {
  id: generateId('settings'),
  key: 'theme',
  value: { mode: 'system', color: 'blue' },
  createdAt: generateDate(365),
  updatedAt: generateDate(30),
};

// Export all seed data
export const seedData = {
  profile: seedProfile,
  projects: seedProjects,
  projectImages: seedProjectImages,
  experience: seedExperience,
  education: seedEducation,
  certifications: seedCertifications,
  skills: seedSkills,
  socialLinks: seedSocialLinks,
  tags: seedTags,
  blogPosts: seedBlogPosts,
  resume: seedResume,
  contactInfo: seedContactInfo,
  siteSettings: seedSiteSettings,
};

export default seedData;