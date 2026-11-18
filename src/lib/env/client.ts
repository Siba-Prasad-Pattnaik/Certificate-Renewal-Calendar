import { z } from 'zod';

// Environment variable validation schema
const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Next.js configuration
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_SITE_NAME: z.string().min(1).default('Personal Portfolio'),
  NEXT_PUBLIC_SITE_DESCRIPTION: z.string().min(1).default('A modern personal portfolio website'),
  
  // API and backend configuration
  PORT: z.string().regex(/^\d+$/).transform(Number).default('3000'),
  API_BASE_URL: z.string().url().default('http://localhost:3000/api'),
  
  // Email configuration
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().default('portfolio@resend.dev'),
  EMAIL_ADMIN: z.string().email().default('admin@example.com'),
  
  // Analytics and monitoring
  GOOGLE_ANALYTICS_ID: z.string().optional(),
  PLAUSIBLE_DOMAIN: z.string().optional(),
  
  // Security
  TURNSTILE_SECRET_KEY: z.string().optional(),
  JWT_SECRET: z.string().min(32).default('development-jwt-secret-min-32-chars-long'),
  SESSION_SECRET: z.string().min(32).default('development-session-secret-min-32-chars'),
  
  // Content and storage
  CONTENT_DIR: z.string().default('./src/content'),
  UPLOAD_DIR: z.string().default('./public/uploads'),
  MAX_UPLOAD_SIZE: z.string().regex(/^\d+$/).transform(Number).default('5242880'), // 5MB
  
  // Feature flags
  ENABLE_CONTACT_FORM: z.string().transform((val) => val === 'true').default('true'),
  ENABLE_BLOG_COMMENTS: z.string().transform((val) => val === 'true').default('false'),
  ENABLE_ADMIN_DASHBOARD: z.string().transform((val) => val === 'true').default('true'),
  
  // Performance and caching
  ENABLE_CACHE: z.string().transform((val) => val === 'true').default('true'),
  CACHE_TTL: z.string().regex(/^\d+$/).transform(Number).default('3600'), // 1 hour
  
  // Development features
  ENABLE_SWAGGER: z.string().transform((val) => val === 'true').default('true'),
  ENABLE_DEBUG_LOGGING: z.string().transform((val) => val === 'true').default('false'),
});

// Infer the type from the schema
export type EnvSchema = z.infer<typeof envSchema>;

// Environment variable client with validation
class EnvClient {
  private validatedEnv: EnvSchema;
  
  constructor() {
    try {
      // Collect environment variables
      const envVars = {
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
        NEXT_PUBLIC_SITE_DESCRIPTION: process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
        PORT: process.env.PORT,
        API_BASE_URL: process.env.API_BASE_URL,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        EMAIL_FROM: process.env.EMAIL_FROM,
        EMAIL_ADMIN: process.env.EMAIL_ADMIN,
        GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
        PLAUSIBLE_DOMAIN: process.env.PLAUSIBLE_DOMAIN,
        TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
        JWT_SECRET: process.env.JWT_SECRET,
        SESSION_SECRET: process.env.SESSION_SECRET,
        CONTENT_DIR: process.env.CONTENT_DIR,
        UPLOAD_DIR: process.env.UPLOAD_DIR,
        MAX_UPLOAD_SIZE: process.env.MAX_UPLOAD_SIZE,
        ENABLE_CONTACT_FORM: process.env.ENABLE_CONTACT_FORM,
        ENABLE_BLOG_COMMENTS: process.env.ENABLE_BLOG_COMMENTS,
        ENABLE_ADMIN_DASHBOARD: process.env.ENABLE_ADMIN_DASHBOARD,
        ENABLE_CACHE: process.env.ENABLE_CACHE,
        CACHE_TTL: process.env.CACHE_TTL,
        ENABLE_SWAGGER: process.env.ENABLE_SWAGGER,
        ENABLE_DEBUG_LOGGING: process.env.ENABLE_DEBUG_LOGGING,
      };
      
      // Validate against schema
      this.validatedEnv = envSchema.parse(envVars);
      
      console.log('✅ Environment validation successful');
      
      // Log warnings for development
      if (this.validatedEnv.NODE_ENV === 'development') {
        if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
          console.warn('⚠️  Using development JWT secret. Set JWT_SECRET environment variable in production.');
        }
        if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
          console.warn('⚠️  Using development session secret. Set SESSION_SECRET environment variable in production.');
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('❌ Environment validation failed:');
        error.errors.forEach((err) => {
          console.error(`  - ${err.path.join('.')}: ${err.message}`);
        });
        process.exit(1);
      }
      throw error;
    }
  }
  
  // Get validated environment variables
  get env(): EnvSchema {
    return this.validatedEnv;
  }
  
  // Check if we're in development
  get isDevelopment(): boolean {
    return this.validatedEnv.NODE_ENV === 'development';
  }
  
  // Check if we're in production
  get isProduction(): boolean {
    return this.validatedEnv.NODE_ENV === 'production';
  }
  
  // Check if a feature is enabled
  isFeatureEnabled(feature: keyof Pick<EnvSchema, 
    'ENABLE_CONTACT_FORM' | 'ENABLE_BLOG_COMMENTS' | 'ENABLE_ADMIN_DASHBOARD' | 
    'ENABLE_CACHE' | 'ENABLE_SWAGGER' | 'ENABLE_DEBUG_LOGGING'
  >): boolean {
    return this.validatedEnv[feature];
  }
  
  // Get email configuration
  get emailConfig() {
    return {
      hasResend: !!process.env.RESEND_API_KEY,
      fromEmail: this.validatedEnv.EMAIL_FROM,
      adminEmail: this.validatedEnv.EMAIL_ADMIN,
    };
  }
  
  // Get security configuration
  get securityConfig() {
    return {
      hasTurnstile: !!process.env.TURNSTILE_SECRET_KEY,
      hasGoogleAnalytics: !!process.env.GOOGLE_ANALYTICS_ID,
      hasPlausible: !!process.env.PLAUSIBLE_DOMAIN,
      jwtSecret: this.validatedEnv.JWT_SECRET,
      sessionSecret: this.validatedEnv.SESSION_SECRET,
    };
  }
  
  // Get storage configuration
  get storageConfig() {
    return {
      contentDir: this.validatedEnv.CONTENT_DIR,
      uploadDir: this.validatedEnv.UPLOAD_DIR,
      maxUploadSize: this.validatedEnv.MAX_UPLOAD_SIZE,
    };
  }
  
  // Health check
  health(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: Array<{
      name: string;
      status: 'ok' | 'warning' | 'error';
      message: string;
    }>;
  } {
    const checks: Array<{
      name: string;
      status: 'ok' | 'warning' | 'error';
      message: string;
    }> = [];
    
    // Node environment check
    checks.push({
      name: 'node_env',
      status: 'ok',
      message: `Environment: ${this.validatedEnv.NODE_ENV}`,
    });
    
    // Email configuration check
    if (!process.env.RESEND_API_KEY && this.isProduction) {
      checks.push({
        name: 'email',
        status: 'warning',
        message: 'RESEND_API_KEY not set in production. Email will use console adapter.',
      });
    } else if (process.env.RESEND_API_KEY) {
      checks.push({
        name: 'email',
        status: 'ok',
        message: 'Email adapter: Resend',
      });
    } else {
      checks.push({
        name: 'email',
        status: 'ok',
        message: 'Email adapter: Console (development)',
      });
    }
    
    // Security check
    if (this.isProduction) {
      if (this.validatedEnv.JWT_SECRET.length < 32) {
        checks.push({
          name: 'security',
          status: 'warning',
          message: 'JWT_SECRET is too short for production',
        });
      } else {
        checks.push({
          name: 'security',
          status: 'ok',
          message: 'Security configuration OK',
        });
      }
    } else {
      checks.push({
        name: 'security',
        status: 'ok',
        message: 'Security configuration OK for development',
      });
    }
    
    // App URL check
    try {
      new URL(this.validatedEnv.NEXT_PUBLIC_APP_URL);
      checks.push({
        name: 'app_url',
        status: 'ok',
        message: `App URL: ${this.validatedEnv.NEXT_PUBLIC_APP_URL}`,
      });
    } catch {
      checks.push({
        name: 'app_url',
        status: 'error',
        message: `Invalid app URL: ${this.validatedEnv.NEXT_PUBLIC_APP_URL}`,
      });
    }
    
    // Determine overall status
    const hasError = checks.some(check => check.status === 'error');
    const hasWarning = checks.some(check => check.status === 'warning');
    
    return {
      status: hasError ? 'unhealthy' : hasWarning ? 'degraded' : 'healthy',
      checks,
    };
  }
}

// Singleton instance
const envClient = new EnvClient();

// Export the singleton instance and types
export default envClient;
export { envSchema };
export type { EnvSchema };

// Helper function to generate .env.example content
export function generateEnvExample(): string {
  const example = `# Environment Variables Example
# Copy this to .env.local and fill in your values

# Node environment
NODE_ENV=development

# Next.js configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Personal Portfolio
NEXT_PUBLIC_SITE_DESCRIPTION=A modern personal portfolio website

# API and backend configuration
PORT=3000
API_BASE_URL=http://localhost:3000/api

# Email configuration (Resend)
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM=portfolio@resend.dev
EMAIL_ADMIN=admin@example.com

# Analytics and monitoring
GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X
PLAUSIBLE_DOMAIN=yourdomain.com

# Security
TURNSTILE_SECRET_KEY=your_turnstile_secret_key
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
SESSION_SECRET=your-super-secret-session-key-min-32-chars-long

# Content and storage
CONTENT_DIR=./src/content
UPLOAD_DIR=./public/uploads
MAX_UPLOAD_SIZE=5242880  # 5MB in bytes

# Feature flags
ENABLE_CONTACT_FORM=true
ENABLE_BLOG_COMMENTS=false
ENABLE_ADMIN_DASHBOARD=true

# Performance and caching
ENABLE_CACHE=true
CACHE_TTL=3600  # 1 hour in seconds

# Development features
ENABLE_SWAGGER=true
ENABLE_DEBUG_LOGGING=false

# Note: For production, ensure:
# - All secrets are strong and unique
# - JWT_SECRET and SESSION_SECRET are at least 32 characters
# - RESEND_API_KEY is set for email functionality
# - Turnstile secret is configured for contact form spam protection
`;

  return example;
}