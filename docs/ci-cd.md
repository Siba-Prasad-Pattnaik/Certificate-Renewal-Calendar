# CI/CD Pipeline Documentation

## Required Status Checks for Branch Protection

To enforce quality gates and prevent merging broken code into the `main` branch, configure the following required status checks in your GitHub repository settings:

### Mandatory Checks
1. **`lint-and-test`** - Linting, type checking, unit/integration tests, and build validation
2. **`e2e-tests`** - End-to-end Playwright tests
3. **`lighthouse`** - Lighthouse CI performance, accessibility, and best practices validation
4. **`vercel-deploy`** - Vercel preview deployment verification

### Branch Protection Rules
Navigate to `Settings > Branches > Branch protection rules` and add a rule for the `main` branch with:

**Required Status Checks (select all):**
- ✅ `ci / lint-and-test`
- ✅ `ci / e2e-tests` 
- ✅ `lighthouse / lighthouse`
- ✅ `deploy / vercel-deploy`

**Additional Settings:**
- ✅ Require a pull request before merging
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging

## Pipeline Overview

### 1. Continuous Integration (CI) Pipeline
- **Trigger**: `push` to any branch or `pull_request` to `main`
- **Jobs**: 
  - `lint-and-test`: Lint, type check, unit/integration tests, security audit, build validation
  - `e2e-tests`: Playwright E2E and accessibility tests (depends on lint-and-test)

### 2. Lighthouse CI Pipeline
- **Trigger**: `pull_request` to `main`
- **Tests**: Home (`/`), Projects (`/projects/[slug]`), Blog (`/blog/[slug]`), Resume (`/resume`), Contact (`/contact`)
- **Budgets**: See [Performance Budgets](../../docs/PERFORMANCE.md)

### 3. Deploy Pipeline
- **Preview**: Deploys every PR branch to Vercel preview, comments URL
- **Production**: Deploys `main` branch to production after all checks pass
- **Fallback**: Manual GitHub Pages static deployment option

## Environment Requirements

### GitHub Secrets Required
```bash
VERCEL_TOKEN           # Vercel authentication token
VERCEL_ORG_ID          # Vercel organization ID  
VERCEL_PROJECT_ID      # Vercel project ID
LIGHTHOUSE_CI_TOKEN    # Optional, for storing Lighthouse reports
```

### Local Development Requirements
- Node.js 18+ (specified in `.nvmrc`)
- npm 8+
- Playwright browsers for E2E testing

## Quality Gates

### Code Quality
- ESLint with Next.js configuration
- TypeScript strict mode
- Prettier formatting
- No TypeScript errors in CI

### Test Coverage
- Unit tests for all utilities and components
- Integration tests for API routes
- E2E tests for critical user journeys
- Accessibility tests (axe-core via Playwright)

### Performance Budgets
All pages must meet:
- Performance: ≥ 0.9
- Accessibility: ≥ 0.95  
- Best Practices: ≥ 0.9
- SEO: ≥ 0.95
- LCP: ≤ 2500ms
- CLS: ≤ 0.1
- TBT: ≤ 200ms

### Security
- Dependencies audited weekly
- No high/critical vulnerabilities in production dependencies
- Security headers configured (CSP, HSTS, etc.)

## Troubleshooting

### Common CI Failures

**Build Fails with MDX Validation Errors**
- Check Contentlayer configuration
- Verify MDX frontmatter syntax
- Run `npm run content:validate` locally

**E2E Tests Fail Intermittently**
- Increase timeouts in Playwright config
- Use `--retries` flag in CI
- Check for flaky network requests

**Lighthouse Budget Regressions**
- Review bundle size changes
- Check image optimization
- Verify lazy loading implementation

**Missing GitHub Secrets**
- Pipeline will skip deployment steps with clear warning
- No red build failures for missing optional secrets

## Maintenance Checklist

### Weekly
- [ ] Review dependency security alerts
- [ ] Check Lighthouse reports for regressions
- [ ] Review CI/CD performance metrics
- [ ] Verify all required checks are still relevant

### Monthly  
- [ ] Update Node.js version if needed
- [ ] Review and update Playwright browsers
- [ ] Audit GitHub secrets rotation
- [ ] Review pipeline timeout values

### Quarterly
- [ ] Review and update performance budgets
- [ ] Evaluate new CI/CD features
- [ ] Benchmark against industry standards
- [ ] Update documentation