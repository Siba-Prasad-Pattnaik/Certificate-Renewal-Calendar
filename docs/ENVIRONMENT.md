# Environment Variables

This document outlines all environment variables required by the portfolio application, their purpose, and how to configure them for different environments.

## Required Variables

### Local Development

| Variable | Description | Default/Example | Required |
|----------|-------------|----------------|----------|
| `JWT_SECRET` | Secret key for signing JWT tokens | `your-super-secret-jwt-key-here` | Yes |
| `ADMIN_PASSWORD_HASH` | bcrypt hash for admin access | Generated via setup script | No (setup script) |
| `TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key | `1x00000000000000000000AA` | Yes (for contact form) |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key | `1x0000000000000000000000000000000AA` | Yes (for contact form) |
| `RESEND_API_KEY` | API key for Resend email service | `re_123456789` | Yes (for contact form) |
| `NEXT_PUBLIC_FORM_FALLBACK_URL` | Fallback URL for contact form (GitHub Pages) | `https://formspree.io/f/{your-form-id}` | No |
| `DEPLOY_TARGET` | Deployment target environment | `local`, `vercel`, `github-pages` | Yes |

### Preview/Production

| Variable | Description | Required |
|----------|-------------|----------|
| `VERCEL_ORG_ID` | Vercel organization ID | For Vercel deployments |
| `VERCEL_PROJECT_ID` | Vercel project ID | For Vercel deployments |
| `VERCEL_TOKEN` | Vercel access token | For Vercel deployments |
| `NEXT_PUBLIC_VERCEL_ENV` | Vercel environment | Auto-set by Vercel |
| `NEXT_PUBLIC_VERCEL_URL` | Vercel deployment URL | Auto-set by Vercel |

### Analytics

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Domain for Plausible Analytics | No |
| `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL` | URL for Plausible script | No |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | Google Analytics tracking ID | No |

### Storage

| Variable | Description | Required |
|----------|-------------|----------|
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token | For file uploads |
| `DATABASE_URL` | PostgreSQL connection string | For database persistence |

## Environment Setup

### Local Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Generate a secure JWT secret:
   ```bash
   openssl rand -base64 32
   ```
   Add the output to `JWT_SECRET` in `.env.local`.

3. Generate admin password hash:
   ```bash
   npm run generate:admin-password
   ```
   This creates an admin password hash and adds it to your `.env.local`.

4. Set up Cloudflare Turnstile:
   - Create an account at [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/)
   - Add your domain and get site/secret keys
   - Add them to `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`

5. Set up Resend:
   - Create account at [Resend](https://resend.com)
   - Create API key and domain
   - Add API key to `RESEND_API_KEY`

### GitHub Actions Secrets

For CI/CD to work, configure these secrets in your GitHub repository:

1. Go to Settings → Secrets and variables → Actions
2. Add:
   - `VERCEL_TOKEN`: Vercel access token
   - `VERCEL_ORG_ID`: Vercel organization ID  
   - `VERCEL_PROJECT_ID`: Vercel project ID
   - `TURNSTILE_SECRET_KEY`: Cloudflare Turnstile secret key
   - `RESEND_API_KEY`: Resend API key
   - `JWT_SECRET`: JWT signing secret
   - `BLOB_READ_WRITE_TOKEN`: Vercel Blob token (optional)

### Production Environment

For Vercel deployments, add all environment variables through the Vercel dashboard:

1. Go to your project in Vercel
2. Navigate to Settings → Environment Variables
3. Add all required variables

## Security Notes

- Never commit `.env.local` or any file containing secrets to version control
- Rotate secrets quarterly or after any security incident
- Use different secrets for different environments (development, staging, production)
- Review access logs regularly for unusual activity

## Validation

The application validates environment variables on startup. Missing required variables will cause the application to fail with clear error messages.

## Troubleshooting

If you encounter issues:

1. Check that all required variables are set
2. Verify variable names match exactly
3. Ensure no trailing spaces in variable values
4. Restart the application after changing environment variables
