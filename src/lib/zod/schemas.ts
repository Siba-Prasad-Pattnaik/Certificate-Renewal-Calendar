import { z } from 'zod';

// Profile schema
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const UrlSchema = z.string().url().max(2048);
const EmailSchema = z.string().email().max(255);
const PhoneSchema = z.string().max(20).regex(/^[\d\s\+\-\(\)]+$/);

// Common reusable schemas
export const IdSchema = z.string().uuid();
export const SlugSchema = z.string().regex(slugPattern).max(100);
export const NonEmptyStringSchema = z.string().min(1).max(500);
export const OptionalStringSchema = z.string().max(1000).optional();
export const DateSchema = z.string().datetime();
export const OptionalDateSchema = DateSchema.optional();
export const BooleanSchema = z.boolean();

export const ProfileSchema = z.object({
  id: IdSchema,
  name: NonEmptyStringSchema,
  title: NonEmptyStringSchema,
  bio: z.string().max(2000),
  location: OptionalStringSchema,
  avatarUrl: UrlSchema.optional(),
  email: EmailSchema,
  phone: PhoneSchema.optional(),
  website: UrlSchema.optional(),
  linkedin: UrlSchema.optional(),
  github: UrlSchema.optional(),
  twitter: UrlSchema.optional(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export const ProjectImageSchema = z.object({
  id: IdSchema,
  projectId: IdSchema,
  url: UrlSchema,
  alt: NonEmptyStringSchema,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  order: z.number().int().nonnegative(),
  createdAt: DateSchema,
});

export const ProjectSchema = z.object({
  id: IdSchema,
  slug: SlugSchema,
  title: NonEmptyStringSchema,
  description: z.string().max(1000),
  longDescription: z.string().max(10000).optional(),
  category: NonEmptyStringSchema,
  tags: z.array(NonEmptyStringSchema).max(10),
  featured: BooleanSchema,
  status: z.enum(['completed', 'in-progress', 'planned']),
  startDate: DateSchema,
  endDate: OptionalDateSchema,
  url: UrlSchema.optional(),
  repository: UrlSchema.optional(),
  technologies: z.array(NonEmptyStringSchema).max(20),
  isCurrent: BooleanSchema,
  sortOrder: z.number().int().nonnegative(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export const ExperienceSchema = z.object({
  id: IdSchema,
  company: NonEmptyStringSchema,
  title: NonEmptyStringSchema,
  location: OptionalStringSchema,
  startDate: DateSchema,
  endDate: OptionalDateSchema,
  isCurrent: BooleanSchema,
  description: z.string().max(2000),
  achievements: z.array(NonEmptyStringSchema).max(20),
  technologies: z.array(NonEmptyStringSchema).max(20),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'freelance', 'internship']),
  url: UrlSchema.optional(),
  sortOrder: z.number().int().nonnegative(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export const EducationSchema = z.object({
  id: IdSchema,
  institution: NonEmptyStringSchema,
  degree: NonEmptyStringSchema,
  field: OptionalStringSchema,
  location: OptionalStringSchema,
  startDate: DateSchema,
  endDate: OptionalDateSchema,
  isCurrent: BooleanSchema,
  description: z.string().max(1000),
  grade: OptionalStringSchema,
  url: UrlSchema.optional(),
  sortOrder: z.number().int().nonnegative(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export const CertificationSchema = z.object({
  id: IdSchema,
  name: NonEmptyStringSchema,
  issuer: NonEmptyStringSchema,
  issueDate: DateSchema,
  expiryDate: OptionalDateSchema,
  neverExpires: BooleanSchema.default(false),
  credentialId: OptionalStringSchema,
  url: UrlSchema.optional(),
  description: z.string().max(500).optional(),
  sortOrder: z.number().int().nonnegative(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export const SkillSchema = z.object({
  id: IdSchema,
  name: NonEmptyStringSchema,
  category: NonEmptyStringSchema,
  proficiency: z.number().int().min(1).max(10),
  yearsOfExperience: z.number().positive(),
  featured: BooleanSchema,
  icon: OptionalStringSchema,
  description: z.string().max(500).optional(),
  sortOrder: z.number().int().nonnegative(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export const SocialLinkSchema = z.object({
  id: IdSchema,
  platform: z.enum(['linkedin', 'github', 'twitter', 'instagram', 'youtube', 'medium', 'dev', 'codepen', 'dribbble', 'behance', 'stackoverflow', 'reddit', 'discord', 'twitch', 'facebook']),
  url: UrlSchema,
  username: OptionalStringSchema,
  displayText: OptionalStringSchema,
  sortOrder: z.number().int().nonnegative(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export const TagSchema = z.object({
  id: IdSchema,
  name: NonEmptyStringSchema,
  slug: SlugSchema,
  description: z.string().max(500).optional(),
  postCount: z.number().int().nonnegative(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export const BlogPostSchema = z.object({
  id: IdSchema,
  slug: SlugSchema,
  title: NonEmptyStringSchema,
  excerpt: z.string().max(300),
  content: z.string().max(50000),
  readingTimeMinutes: z.number().int().positive(),
  publishedAt: DateSchema,
  updatedAt: DateSchema,
  featured: BooleanSchema,
  tags: z.array(SlugSchema).max(10),
  authorId: IdSchema,
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  coverImageUrl: UrlSchema.optional(),
  coverImageAlt: NonEmptyStringSchema.optional(),
  status: z.enum(['draft', 'published', 'archived']),
  createdAt: DateSchema,
});

export const ResumeSchema = z.object({
  id: IdSchema,
  title: NonEmptyStringSchema,
  summary: z.string().max(2000),
  fileName: NonEmptyStringSchema,
  fileUrl: UrlSchema,
  fileSize: z.number().int().positive(),
  fileType: z.string().max(50),
  language: NonEmptyStringSchema,
  isPrimary: BooleanSchema,
  downloadCount: z.number().int().nonnegative(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export const ContactInfoSchema = z.object({
  id: IdSchema,
  name: NonEmptyStringSchema,
  email: EmailSchema,
  subject: NonEmptyStringSchema,
  message: z.string().max(2000),
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().max(500).optional(),
  status: z.enum(['pending', 'read', 'replied', 'spam']),
  repliedAt: OptionalDateSchema,
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export const SiteSettingsSchema = z.object({
  id: IdSchema,
  key: NonEmptyStringSchema,
  value: z.any(),
  createdAt: DateSchema,
  updatedAt: DateSchema,
});

export const AuthLoginSchema = z.object({
  email: EmailSchema,
  password: NonEmptyStringSchema,
});

export const PasswordChangeSchema = z.object({
  currentPassword: NonEmptyStringSchema,
  newPassword: NonEmptyStringSchema.min(8).max(100),
  confirmPassword: NonEmptyStringSchema,
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const SessionPayloadSchema = z.object({
  userId: IdSchema,
  email: EmailSchema,
  role: z.enum(['admin', 'editor', 'viewer']),
  expiresAt: DateSchema,
});

// Export all schemas
export const Schemas = {
  Profile: ProfileSchema,
  Project: ProjectSchema,
  ProjectImage: ProjectImageSchema,
  Experience: ExperienceSchema,
  Education: EducationSchema,
  Certification: CertificationSchema,
  Skill: SkillSchema,
  SocialLink: SocialLinkSchema,
  Tag: TagSchema,
  BlogPost: BlogPostSchema,
  Resume: ResumeSchema,
  ContactInfo: ContactInfoSchema,
  SiteSettings: SiteSettingsSchema,
  AuthLogin: AuthLoginSchema,
  PasswordChange: PasswordChangeSchema,
  SessionPayload: SessionPayloadSchema,
};

export type Profile = z.infer<typeof ProfileSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type ProjectImage = z.infer<typeof ProjectImageSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type SocialLink = z.infer<typeof SocialLinkSchema>;
export type Tag = z.infer<typeof TagSchema>;
export type BlogPost = z.infer<typeof BlogPostSchema>;
export type Resume = z.infer<typeof ResumeSchema>;
export type ContactInfo = z.infer<typeof ContactInfoSchema>;
export type SiteSettings = z.infer<typeof SiteSettingsSchema>;
export type AuthLogin = z.infer<typeof AuthLoginSchema>;
export type PasswordChange = z.infer<typeof PasswordChangeSchema>;
export type SessionPayload = z.infer<typeof SessionPayloadSchema>;
