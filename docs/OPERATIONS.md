# Operations Guide

This document covers operational procedures including rollback, monitoring, and incident response for the portfolio application.

## Rollback Checklist

### Vercel Instant Rollback

If a production deployment causes issues:

1. **Access Vercel Dashboard**:
   - Navigate to your project in Vercel
   - Go to the "Deployments" tab

2. **Identify Previous Deployment**:
   - Find the last known good deployment
   - Note its deployment ID and timestamp

3. **Promote Previous Deployment**:
   - Click on the three dots (⋯) next to the deployment
   - Select "Promote to Production"
   - Confirm the rollback

4. **Verify Rollback**:
   - Visit the production URL
   - Run smoke tests: `npm run smoke-test -- --url=https://your-domain.com`
   - Check key functionality

### Environment Variable Rollback

If issues are caused by environment variable changes:

1. **Access Environment Variables**:
   - Vercel: Settings → Environment Variables
   - GitHub Actions: Settings → Secrets

2. **Revert Changes**:
   - Restore previous values
   - Deploy with corrected variables

3. **Database/Blob Considerations**:
   - If database schema changed, may need to rollback migrations
   - Blob storage: ensure new data format is compatible

### Full Incident Rollback Procedure

1. **Assess Impact**:
   - Determine severity (high/medium/low)
   - Identify affected users
   - Check monitoring dashboards

2. **Communicate**:
   - Update status page if available
   - Notify team via Slack/email

3. **Execute Rollback**:
   ```bash
   # Check current deployment
   vercel ls your-project
   
   # Promote previous deployment
   vercel promote --prod <deployment-id>
   ```

4. **Post-Rollback Verification**:
   - Run comprehensive smoke tests
   - Check all API endpoints
   - Verify email functionality
   - Monitor error rates

## Monitoring Checklist

### Performance Monitoring

1. **Vercel Analytics**:
   - Monitor Web Vitals (LCP, FID, CLS)
   - Track serverless function executions
   - Check edge network performance

2. **Lighthouse CI**:
   - Performance ≥ 0.9
   - Accessibility ≥ 0.95  
   - Best Practices ≥ 0.9
   - SEO ≥ 0.95

3. **Custom Metrics**:
   - API response times (< 200ms)
   - Page load times (< 2.5s)
   - Error rates (< 1%)

### Uptime Monitoring

1. **Health Checks**:
   - `/api/health` returns 200
   - `/api/profile` returns valid data
   - Database connections active

2. **External Monitoring**:
   - Set up uptime robot or similar
   - Monitor critical pages
   - Alert on SSL certificate expiration

### Security Monitoring

1. **Authentication**:
   - Failed login attempts
   - Admin access patterns
   - JWT token validation errors

2. **Form Protection**:
   - Cloudflare Turnstile challenge rate
   - Contact form submission patterns
   - Rate limiting violations

3. **Content Security**:
   - CSP violation reports
   - XSS attempts
   - SQL injection patterns

### Email Deliverability

1. **SPF/DKIM/DMARC**:
   - Verify DNS records are correct
   - Monitor email authentication logs

2. **Bounce/Complaint Rates**:
   - Resend dashboard metrics
   - Gmail/Outlook deliverability
   - Spam folder placement

3. **Form Submissions**:
   - Contact form success rate
   - Email confirmation delivery
   - Error logging

## Incident Response Steps

### Severity Levels

**SEV-1 (Critical)**: Application unavailable, data loss, security breach
- Response time: 15 minutes
- Resolution time: 1 hour

**SEV-2 (High)**: Major feature broken, performance degradation
- Response time: 30 minutes  
- Resolution time: 4 hours

**SEV-3 (Medium)**: Minor feature issues, cosmetic problems
- Response time: 4 hours
- Resolution time: 24 hours

### Incident Response Process

1. **Detection**:
   - Monitoring alerts
   - Error logs
   - User reports

2. **Triage**:
   - Assign severity level
   - Gather initial information
   - Create incident channel

3. **Investigation**:
   - Check recent deployments
   - Review logs
   - Test reproduction

4. **Mitigation**:
   - Implement workaround
   - Execute rollback if needed
   - Communicate status

5. **Resolution**:
   - Fix root cause
   - Deploy fix
   - Verify resolution

6. **Post-Mortem**:
   - Document incident
   - Identify improvements
   - Update procedures

## Go-Live Checklist

### Pre-Deployment

- [ ] All required environment variables set
- [ ] DNS records configured
- [ ] SSL certificates provisioned
- [ ] Custom domain verified
- [ ] Analytics configured
- [ ] Email deliverability tested

### Deployment Verification

- [ ] Production build successful
- [ ] Smoke tests pass
- [ ] Lighthouse scores meet budgets
- [ ] All pages load correctly
- [ ] API endpoints functional
- [ ] Contact form works
- [ ] Resume downloads

### Post-Deployment

- [ ] Monitor error rates for 24 hours
- [ ] Verify email notifications
- [ ] Check search engine indexing
- [ ] Social media previews
- [ ] Performance under load

## Maintenance Schedule

- **Daily**: Check monitoring dashboards
- **Weekly**: Review error logs, security alerts
- **Monthly**: Update dependencies, rotate secrets
- **Quarterly**: Full security audit, performance review
