# Rollback Procedures

This document provides detailed procedures for rolling back deployments in case of production issues.

## Quick Reference

| Severity | Action                        | Time to Resolution |
|----------|-------------------------------|-------------------|
| Critical | Instant Vercel rollback       | < 5 minutes       |
| High     | Promote previous deployment   | < 15 minutes      |
| Medium   | Hotfix deployment             | < 1 hour          |
| Low      | Scheduled patch release       | < 4 hours         |

## Vercel Rollback Procedures

### Instant Production Rollback

If a deployment causes critical issues affecting all users:

1. **Access Vercel Dashboard**:
   - Navigate to [vercel.com](https://vercel.com) and select your project
   - Go to "Deployments" tab

2. **Identify Faulty Deployment**:
   - Look for the most recent production deployment
   - Check deployment status and logs for errors

3. **Execute Rollback**:
   - Click the three dots (⋯) next to the problematic deployment
   - Select "Promote to Production"
   - Confirm the action

4. **Alternative: CLI Rollback**:
   ```bash
   # Install Vercel CLI if not already installed
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # List deployments
   vercel ls your-project-name
   
   # Rollback to specific deployment
   vercel rollback <deployment-id>
   
   # Or promote previous deployment
   vercel promote <deployment-id> --prod
   ```

### Progressive Rollback

For less severe issues affecting only some features:

1. **Create Feature Flag**:
   - Deploy with feature flag disabled for broken feature
   - Keep other new functionality active

2. **Partial Rollback**:
   - Revert only specific routes/components
   - Deploy as hotfix without full rollback

3. **A/B Rollback**:
   - Route percentage of traffic to previous version
   - Use Vercel's built-in A/B testing

## Database & Data Rollback Considerations

### Schema Changes

If deployment includes database schema changes:

1. **Backward Compatibility**:
   - New code should work with old schema
   - Old code should work with new schema (during transition)

2. **Migration Rollback Scripts**:
   ```sql
   -- Example: Rollback user table addition
   DROP TABLE IF EXISTS users_new;
   
   -- Example: Rollback column addition
   ALTER TABLE posts DROP COLUMN IF EXISTS new_feature_flag;
   ```

3. **Data Preservation**:
   - Backup before migration: `npm run db:backup`
   - Restore if needed: `npm run db:restore -- --file=backup-YYYY-MM-DD.sql`

### Blob Storage

For image/file uploads in Vercel Blob:

1. **File Versioning**:
   - New uploads use new path pattern
   - Old files remain accessible during rollback

2. **Cache Invalidation**:
   - Rollback may require cache invalidation
   ```bash
   # Clear Vercel cache
   curl -X POST "https://api.vercel.com/v1/integrations/deployments/$DEPLOYMENT_ID/cache" \
     -H "Authorization: Bearer $VERCEL_TOKEN"
   ```

## Environment Variable Rollback

### Vercel Dashboard

1. **Current Environment Variables**:
   - Settings → Environment Variables
   - List all variables with current values

2. **Rollback Procedure**:
   - Export current configuration
   - Restore previous values
   - Redeploy with corrected variables

3. **Emergency Override**:
   ```
   NEXT_PUBLIC_MAINTENANCE_MODE=true
   NEXT_PUBLIC_ROLLBACK_VERSION=v1.2.3
   ```

### Local Testing

Before applying rollback to production:

```bash
# Test with previous environment
cp .env.example .env.local
# Edit .env.local with rollback values
npm run dev
```

## Branch Protection & Deployment Gates

### Pre-Rollback Checks

1. **Verify Rollback Target**:
   ```bash
   # Check what's deployed
   vercel ls --prod
   
   # Inspect deployment
   vercel inspect <deployment-id>
   ```

2. **Health Check**:
   ```bash
   # Test target deployment
   curl -f https://rollback-target.vercel.app/api/health
   
   # Run smoke tests
   npm run smoke-test -- --url=https://rollback-target.vercel.app
   ```

3. **User Impact Assessment**:
   - Check error rates in monitoring
   - Review user-reported issues
   - Assess data loss risk

### Post-Rollback Verification

1. **Immediate Verification**:
   - [ ] Production site loads (HTTP 200)
   - [ ] Core functionality works
   - [ ] API endpoints respond correctly
   - [ ] No console errors in browser

2. **Extended Verification**:
   - [ ] Run full test suite against rolled-back version
   - [ ] Check database connections
   - [ ] Verify third-party integrations
   - [ ] Test on multiple devices/browsers

3. **Monitoring Setup**:
   - [ ] Alerts configured for rollback state
   - [ ] Performance baselines established
   - [ ] Error tracking enabled

## Communication Plan

### Internal Communication

1. **Immediate Notification**:
   ```markdown
   **Subject**: [SEV-1] Production Rollback Initiated
   
   **Issue**: Brief description of problem
   **Action**: Rollback to deployment v1.2.3
   **ETA**: 5-10 minutes
   **Impact**: All users temporarily affected
   ```

2. **Status Updates**:
   - Every 5 minutes during active rollback
   - Upon completion or failure

3. **Post-Mortem Preparation**:
   - Document timeline
   - Capture logs
   - Prepare for RCA (Root Cause Analysis)

### External Communication

For user-facing issues:

1. **Status Page Updates**:
   ```
   🟡 Investigating - We're experiencing issues with the latest update
   🔴 Major Outage - Rolling back to previous version
   🟢 Resolved - Service restored after rollback
   ```

2. **Social Media**:
   - Brief, factual updates
   - Avoid technical jargon
   - Provide timeline for resolution

3. **Email Notification** (if extended outage):
   - Apologize for inconvenience
   - Explain actions taken
   - Provide contact for follow-up questions

## Rollback Decision Framework

### When to Rollback

**Immediate Rollback (0-15 minutes)**:
- Security vulnerability introduced
- Complete service outage
- Data corruption/loss
- Critical functional regression

**Scheduled Rollback (1-4 hours)**:
- Performance degradation > 50%
- Major feature broken for > 25% users
- Compliance violation

**Hotfix Instead of Rollback**:
- Minor UI issues
- Non-critical functionality broken
- Can be fixed with small patch

### Decision Checklist

Answer these questions before rolling back:

1. ✅ Can the issue be fixed with a hotfix?
2. ✅ Is data at risk of corruption/loss?
3. ✅ What percentage of users are affected?
4. ✅ Have we identified the root cause?
5. ✅ Do we have a verified working version to roll back to?
6. ✅ Are dependencies compatible with rollback version?
7. ✅ Is the rollback path tested in staging?

## Testing Rollback Procedures

### Regular Testing Schedule

1. **Monthly Test**:
   - Practice rollback in staging environment
   - Time the process
   - Document improvements

2. **Quarterly Drill**:
   - Simulate production rollback scenario
   - Involve entire on-call team
   - Test communication channels

3. **Post-Release Verification**:
   - After every production deployment
   - Verify rollback capabilities remain intact
   - Update rollback documentation

### Rollback Testing Script

```typescript
// scripts/test-rollback.ts
import { execSync } from 'child_process';

async function testRollback() {
  console.log('🧪 Testing rollback procedures...');
  
  // 1. Deploy test version
  execSync('vercel deploy --prod --yes', { stdio: 'inherit' });
  
  // 2. Capture deployment ID
  const deploymentId = execSync('vercel ls --prod --quiet | head -1').toString().trim();
  
  // 3. Simulate issue
  console.log('🔧 Simulating production issue...');
  
  // 4. Execute rollback
  execSync(`vercel rollback ${deploymentId} --prod --yes`, { stdio: 'inherit' });
  
  // 5. Verify recovery
  console.log('✅ Rollback test completed');
}
```

## Rollback Metrics & Improvement

### Key Metrics to Track

1. **Rollback Frequency**:
   - Number of rollbacks per month/quarter
   - Trend over time (should decrease)

2. **Rollback Duration**:
   - Time from issue detection to rollback decision
   - Time from decision to completed rollback
   - Total downtime caused

3. **Rollback Success Rate**:
   - Percentage of successful rollbacks
   - Causes of rollback failures
   - Mean time between rollbacks

4. **Impact Metrics**:
   - User sessions affected
   - Revenue impact (if applicable)
   - Support tickets generated

### Continuous Improvement

1. **Post-Mortem Actions**:
   ```markdown
   ## Rollback Improvement Log
    
   ### Date: 2024-01-15
   **Issue**: Database migration failure
   **Improvement**: Added pre-migration validation
   **Action**: Created `scripts/validate-migration.ts`
    
   ### Date: 2024-02-20
   **Issue**: Slow rollback due to cache
   **Improvement**: Automated cache invalidation
   **Action**: Added to deploy.yml
   ```

2. **Tooling Improvements**:
   - Automated rollback scripts
   - One-click rollback dashboard
   - Rollback health checks
   - Rollback impact analytics

3. **Process Improvements**:
   - Clearer decision criteria
   - Better communication templates
   - Regular training sessions
   - Updated documentation

## Appendix

### Command Reference

```bash
# Vercel CLI Rollback Commands
vercel rollback <deployment-id>          # Rollback to specific deployment
vercel promote <deployment-id> --prod    # Promote to production
vercel ls --prod                         # List production deployments
vercel inspect <deployment-id>           # Inspect deployment details

# Database Rollback
npm run db:backup                        # Backup database
npm run db:restore -- --file=backup.sql  # Restore from backup
npm run migration:rollback               # Rollback last migration

# Cache Management
npm run cache:clear                      # Clear application cache
npm run isr:revalidate                   # Revalidate ISR pages
```

### Rollback Runbook Template

```markdown
# Rollback Runbook: [Scenario Name]

## Scenario Description
Brief description of the issue requiring rollback.

## Pre-Conditions
- [ ] Issue detected in monitoring
- [ ] Severity assessed as [Critical/High]
- [ ] Team notified via [Slack/Email]
- [ ] Backup procedures initiated if needed

## Rollback Steps
1. **Step 1**: Verify rollback target
2. **Step 2**: Execute rollback command
3. **Step 3**: Verify rollback success
4. **Step 4**: Communicate completion

## Post-Rollback Verification
- [ ] Smoke tests pass
- [ ] Monitoring shows normal patterns
- [ ] Error rates returned to baseline
- [ ] Customer reports resolved

## Communication Template
```
Subject: Rollback Completed - [Date/Time]

The production rollback has been completed successfully.

**Issue**: [Brief description]
**Resolution**: Rolled back to deployment [version]
**Status**: Service restored
**Next Steps**: [Post-mortem scheduled for DateTime]
```
```

### Emergency Contacts

| Role                    | Contact Method | Availability |
|-------------------------|----------------|--------------|
| DevOps Lead             | Slack @devops  | 24/7         |
| Engineering Manager     | Phone          | Business hrs |
| Customer Support Lead   | Slack @support | Business hrs |
| Executive Sponsor       | Email          | As needed    |

---

**Last Updated**: $(date +%Y-%m-%d)
**Next Review**: $(date -d "+90 days" +%Y-%m-%d)
**Owner**: DevOps Team
**Approvers**: Engineering Manager, Product Owner
