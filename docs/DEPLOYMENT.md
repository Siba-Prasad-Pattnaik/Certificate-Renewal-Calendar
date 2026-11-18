# Deployment Guide

This guide covers deployment options for the portfolio application, including Vercel and GitHub Pages.

## Deployment Options

### 1. Vercel (Recommended)

Vercel provides serverless deployment with automatic SSL, global CDN, and preview deployments.

#### Setup

1. **Create Vercel Account**:
   - Sign up at [vercel.com](https://vercel.com)
   - Install Vercel CLI: `npm i -g vercel`

2. **Link Repository**:
   ```bash
   vercel login
   vercel
   ```

3. **Configure Environment Variables**:
   - Go to project settings → Environment Variables
   - Add all required variables from `.env.example`

4. **Set Up Custom Domain**:
   - Go to project settings → Domains
   - Add your domain
   - Update DNS as instructed

#### GitHub Integration

The repository includes GitHub Actions workflows for:

- **Preview Deployments**: Automatic deployment on PR creation
- **Production Deployments**: Automatic deployment on push to `main`
- **Required Checks**: Must pass before production deployment

#### Features

- **Automatic HTTPS**: SSL certificates provisioned automatically
- **Global CDN**: Content delivered from edge locations
- **Preview URLs**: Each PR gets unique preview URL
- **Instant Rollbacks**: One-click rollback to previous deployment
- **Analytics**: Built-in performance monitoring

### 2. GitHub Pages (Static Fallback)

GitHub Pages serves static content only. This option has limitations but provides a free hosting option.

#### Limitations

- ❌ No Server Actions
- ❌ No Admin interface  
- ❌ No API routes (`/api/*`)
- ❌ No runtime Turnstile verification
- ❌ No contact form inbox (uses Formspree/Netlify Forms)
- ✅ Static pages only (SSG)
- ✅ Contact form via external service
- ✅ Resume as static PDF

#### Setup

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Select source: GitHub Actions

2. **Configure Fallback Contact Form**:
   - Set `NEXT_PUBLIC_FORM_FALLBACK_URL` to Formspree/Netlify Forms endpoint
   - Update contact page to use external form

3. **Manual Deployment**:
   ```bash
   DEPLOY_TARGET=github-pages npm run build
   ```

#### GitHub Actions Workflow

The `deploy.yml` workflow includes a manual trigger for GitHub Pages:

1. Go to Actions → Deploy workflow
2. Click "Run workflow"
3. Select "github-pages" as deploy_target
4. The workflow builds and deploys to GitHub Pages

#### Static Export Preparation

The `scripts/prepare-static-export.ts` script:

- Removes API routes
- Disables Server Actions
- Configures static export settings
- Updates contact form to use fallback URL

### Deployment Matrix

| Feature | Vercel | GitHub Pages |
|---------|--------|--------------|
| Dynamic API Routes | ✅ | ❌ |
| Server Actions | ✅ | ❌ |
| Admin Interface | ✅ | ❌ |
| Contact Form (email) | ✅ | ❌ (external only) |
| Turnstile Verification | ✅ | ❌ |
| Automatic HTTPS | ✅ | ✅ (via GitHub) |
| Preview Deployments | ✅ | ❌ |
| Instant Rollbacks | ✅ | ❌ |
| Analytics | ✅ | Limited |
| Cost | Free tier | Free |
| CDN | Global | Limited |

## Continuous Integration

### Required Status Checks

Configure branch protection rules in GitHub:

1. Go to repository Settings → Branches → Branch protection rules
2. Add rule for `main` branch
3. Require status checks:
   - **ci / lint-and-test**
   - **ci / e2e-tests**
   - **lighthouse / lighthouse**
4. Require branches to be up to date before merging

### Workflow Overview

#### CI Workflow (`ci.yml`)
- Runs on PR and push to `main`
- Jobs: lint, type-check, unit/integration tests, build, E2E tests
- Uploads Playwright reports on failure

#### Lighthouse Workflow (`lighthouse.yml`)
- Runs on every PR
- Tests key routes with Lighthouse CI
- Enforces performance budgets
- Fails PR on regression

#### Deploy Workflow (`deploy.yml`)
- Preview deployments on PR
- Production deployments on push to `main`
- Manual GitHub Pages deployment

## Security Configuration

### Environment Variables

See [ENVIRONMENT.md](./ENVIRONMENT.md) for complete list.

### Secrets Management

Never commit secrets to the repository. Use:

- **Local**: `.env.local` (gitignored)
- **GitHub Actions**: Repository secrets
- **Vercel**: Project environment variables

### SSL/TLS

- Vercel provides automatic SSL via Let's Encrypt
- GitHub Pages provides SSL via GitHub
- Configure HTTPS redirects in application

## Monitoring & Observability

### Health Checks

- `/api/health`: Basic application health
- `/api/profile`: Data layer health
- Custom monitoring endpoints available

### Logging

- Vercel: Serverless function logs
- GitHub Actions: Workflow run logs
- Application: Structured logging to console

### Performance Monitoring

- Vercel Analytics: Web Vitals
- Lighthouse CI: Performance budgets
- Custom metrics in application

## Troubleshooting

### Common Issues

#### Build Failures

- Check Node.js version matches `.nvmrc`
- Verify all dependencies installed
- Check for TypeScript errors

#### Deployment Failures

- Verify environment variables set
- Check Vercel/GitHub credentials
- Review workflow logs

#### Contact Form Issues

- Verify Turnstile keys configured
- Check Resend API key
- Test email delivery

#### Performance Issues

- Run Lighthouse audit
- Check bundle size
- Optimize images

#### GitHub Pages Limitations

- Remember API routes won't work
- Contact form uses external service
- Admin interface unavailable

## Rollback Procedures

See [OPERATIONS.md](./OPERATIONS.md) for detailed rollback procedures.
