import { z } from 'zod';
import {
  ProfileSchema,
  ProjectSchema,
  ProjectImageSchema,
  ExperienceSchema,
  EducationSchema,
  CertificationSchema,
  SkillSchema,
  SocialLinkSchema,
  TagSchema,
  BlogPostSchema,
  ResumeSchema,
  ContactInfoSchema,
  SiteSettingsSchema,
  AuthLoginSchema,
  PasswordChangeSchema,
  SessionPayloadSchema,
  IdSchema,
  SlugSchema,
  NonEmptyStringSchema,
  OptionalStringSchema,
  DateSchema,
  OptionalDateSchema,
  BooleanSchema
} from './schemas';

// Export inferred types from Zod schemas
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

// Export common schema types
export type Id = z.infer<typeof IdSchema>;
export type Slug = z.infer<typeof SlugSchema>;
export type NonEmptyString = z.infer<typeof NonEmptyStringSchema>;
export type OptionalString = z.infer<typeof OptionalStringSchema>;
export type DateString = z.infer<typeof DateSchema>;
export type OptionalDateString = z.infer<typeof OptionalDateSchema>;
export type BooleanValue = z.infer<typeof BooleanSchema>;

// Export type guards
export function isProfile(data: unknown): data is Profile {
  return ProfileSchema.safeParse(data).success;
}

export function isProject(data: unknown): data is Project {
  return ProjectSchema.safeParse(data).success;
}

export function isExperience(data: unknown): data is Experience {
  return ExperienceSchema.safeParse(data).success;
}

export function isEducation(data: unknown): data is Education {
  return EducationSchema.safeParse(data).success;
}

export function isSkill(data: unknown): data is Skill {
  return SkillSchema.safeParse(data).success;
}

export function isBlogPost(data: unknown): data is BlogPost {
  return BlogPostSchema.safeParse(data).success;
}

export function isContactInfo(data: unknown): data is ContactInfo {
  return ContactInfoSchema.safeParse(data).success;
}

// Collection types for API responses
export type ProfileResponse = Profile;
export type ProjectResponse = Project;
export type ProjectListResponse = Project[];
export type ExperienceResponse = Experience;
export type ExperienceListResponse = Experience[];
export type EducationResponse = Education;
export type EducationListResponse = Education[];
export type SkillResponse = Skill;
export type SkillListResponse = Skill[];
export type BlogPostResponse = BlogPost;
export type BlogPostListResponse = BlogPost[];
export type SocialLinkListResponse = SocialLink[];
export type ResumeResponse = Resume;

// Pagination types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Common API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

// Filter and search types
export interface ProjectFilters {
  category?: string;
  tag?: string;
  featured?: boolean;
  status?: 'completed' | 'in-progress' | 'planned';
}

export interface BlogFilters {
  tag?: string;
  featured?: boolean;
  status?: 'draft' | 'published' | 'archived';
  search?: string;
}

// Sorting types
export type SortDirection = 'asc' | 'desc';
export interface SortOptions {
  field: string;
  direction: SortDirection;
}