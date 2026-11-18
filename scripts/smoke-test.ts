#!/usr/bin/env node
/**
 * Production Smoke Test Script
 * 
 * Validates core functionality after deployment
 * Usage: npx tsx scripts/smoke-test.ts --url=https://your-domain.com
 */

import { Command } from 'commander';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  message?: string;
  duration?: number;
}

interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  results: TestResult[];
}

class SmokeTester {
  private baseUrl: string;
  private results: TestResult[] = [];
  private startTime: number;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.startTime = Date.now();
  }

  private async makeRequest(
    method: string,
    path: string,
    options?: {
      headers?: Record<string, string>;
      body?: any;
      expectStatus?: number;
      validateJson?: (data: any) => boolean;
    }
  ): Promise<{ status: number; data: any; headers: Record<string, string> }> {
    return new Promise((resolve, reject) => {
      const url = new URL(path, this.baseUrl);
      const isHttps = url.protocol === 'https:';
      const client = isHttps ? https : http;

      const reqOptions: https.RequestOptions = {
        method,
        headers: {
          'User-Agent': 'SmokeTester/1.0',
          ...options?.headers,
        },
      };

      const req = client.request(url, reqOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          let parsedData: any;
          try {
            parsedData = JSON.parse(data);
          } catch {
            parsedData = data;
          }

          resolve({
            status: res.statusCode!,
            data: parsedData,
            headers: res.headers as Record<string, string>,
          });
        });
      });

      req.on('error', reject);
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      if (options?.body) {
        req.write(JSON.stringify(options.body));
      }

      req.end();
    });
  }

  async testPage(path: string, name?: string): Promise<TestResult> {
    const testName = name || `GET ${path}`;
    const start = Date.now();

    try {
      const { status } = await this.makeRequest('GET', path);

      return {
        name: testName,
        status: status === 200 ? 'PASS' : 'FAIL',
        message: `Expected 200, got ${status}`,
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: testName,
        status: 'FAIL',
        message: error instanceof Error ? error.message : 'Request failed',
        duration: Date.now() - start,
      };
    }
  }

  async testApiContract(path: string, validator: (data: any) => boolean): Promise<TestResult> {
    const start = Date.now();

    try {
      const { status, data } = await this.makeRequest('GET', path);

      if (status !== 200) {
        return {
          name: `API Contract: ${path}`,
          status: 'FAIL',
          message: `Expected 200, got ${status}`,
          duration: Date.now() - start,
        };
      }

      const isValid = validator(data);
      return {
        name: `API Contract: ${path}`,
        status: isValid ? 'PASS' : 'FAIL',
        message: isValid ? 'Valid response structure' : 'Invalid response structure',
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: `API Contract: ${path}`,
        status: 'FAIL',
        message: error instanceof Error ? error.message : 'Request failed',
        duration: Date.now() - start,
      };
    }
  }

  async testAuthentication(path: string, expectedStatus: number): Promise<TestResult> {
    const start = Date.now();

    try {
      const { status } = await this.makeRequest('GET', path);

      return {
        name: `Auth Check: ${path}`,
        status: status === expectedStatus ? 'PASS' : 'FAIL',
        message: `Expected ${expectedStatus}, got ${status}`,
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: `Auth Check: ${path}`,
        status: 'FAIL',
        message: error instanceof Error ? error.message : 'Request failed',
        duration: Date.now() - start,
      };
    }
  }

  async testSecurityHeaders(): Promise<TestResult> {
    const start = Date.now();

    try {
      const { headers } = await this.makeRequest('GET', '/');

      const requiredHeaders = [
        'content-security-policy',
        'x-frame-options',
        'x-content-type-options',
        'referrer-policy',
        'permissions-policy',
      ];

      const missingHeaders = requiredHeaders.filter(
        (header) => !headers[header] && !headers[header.toLowerCase()]
      );

      return {
        name: 'Security Headers',
        status: missingHeaders.length === 0 ? 'PASS' : 'FAIL',
        message:
          missingHeaders.length === 0
            ? 'All security headers present'
            : `Missing headers: ${missingHeaders.join(', ')}`,
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: 'Security Headers',
        status: 'FAIL',
        message: error instanceof Error ? error.message : 'Request failed',
        duration: Date.now() - start,
      };
    }
  }

  async testSeoFiles(): Promise<TestResult[]> {
    const seoFiles = ['/sitemap.xml', '/robots.txt', '/manifest.json'];
    const results: TestResult[] = [];

    for (const file of seoFiles) {
      const result = await this.testPage(file, `SEO File: ${file}`);
      results.push(result);
    }

    return results;
  }

  async testResumeDownload(): Promise<TestResult> {
    const start = Date.now();

    try {
      const { status, headers } = await this.makeRequest('GET', '/api/resume/download');

      const isPdf =
        headers['content-type']?.includes('application/pdf') ||
        headers['content-disposition']?.includes('.pdf');

      return {
        name: 'Resume Download',
        status: status === 200 && isPdf ? 'PASS' : 'FAIL',
        message:
          status === 200 && isPdf
            ? 'PDF resume available'
            : `Expected PDF, got status ${status}, content-type: ${headers['content-type']}`,
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: 'Resume Download',
        status: 'FAIL',
        message: error instanceof Error ? error.message : 'Request failed',
        duration: Date.now() - start,
      };
    }
  }

  async testAnalyticsEndpoint(): Promise<TestResult> {
    const start = Date.now();

    try {
      const { status } = await this.makeRequest('POST', '/api/analytics/pageview', {
        body: { path: '/test', timestamp: new Date().toISOString() },
        headers: { 'Content-Type': 'application/json' },
      });

      return {
        name: 'Analytics Endpoint',
        status: status === 204 ? 'PASS' : 'FAIL',
        message: `Expected 204, got ${status}`,
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: 'Analytics Endpoint',
        status: 'FAIL',
        message: error instanceof Error ? error.message : 'Request failed',
        duration: Date.now() - start,
      };
    }
  }

  async testInvalidContactSubmission(): Promise<TestResult> {
    const start = Date.now();

    try {
      const { status } = await this.makeRequest('POST', '/api/contact', {
        body: { email: 'invalid-email', message: '' }, // Invalid submission
        headers: { 'Content-Type': 'application/json' },
      });

      return {
        name: 'Invalid Contact Validation',
        status: status === 400 ? 'PASS' : 'FAIL',
        message: `Expected 400 for invalid submission, got ${status}`,
        duration: Date.now() - start,
      };
    } catch (error) {
      return {
        name: 'Invalid Contact Validation',
        status: 'FAIL',
        message: error instanceof Error ? error.message : 'Request failed',
        duration: Date.now() - start,
      };
    }
  }

  async runAllTests(): Promise<TestSummary> {
    console.log(`🚀 Running smoke tests against: ${this.baseUrl}`);
    console.log('='.repeat(60));

    // Test core pages
    this.results.push(await this.testPage('/', 'Home Page'));
    this.results.push(await this.testPage('/about', 'About Page'));
    this.results.push(await this.testPage('/projects', 'Projects Page'));
    this.results.push(await this.testPage('/blog', 'Blog Page'));
    this.results.push(await this.testPage('/resume', 'Resume Page'));
    this.results.push(await this.testPage('/contact', 'Contact Page'));

    // Test API endpoints with basic contract validation
    this.results.push(
      await this.testApiContract('/api/profile', (data) => {
        return (
          data &&
          typeof data.name === 'string' &&
          typeof data.title === 'string' &&
          Array.isArray(data.skills)
        );
      })
    );

    this.results.push(
      await this.testApiContract('/api/blog', (data) => {
        return Array.isArray(data) && data.every((post: any) => typeof post.slug === 'string');
      })
    );

    // Test authentication
    this.results.push(await this.testAuthentication('/api/admin/profile', 401));

    // Test SEO files
    const seoResults = await this.testSeoFiles();
    this.results.push(...seoResults);

    // Test resume download
    this.results.push(await this.testResumeDownload());

    // Test security headers
    this.results.push(await this.testSecurityHeaders());

    // Test analytics endpoint
    this.results.push(await this.testAnalyticsEndpoint());

    // Test invalid contact submission
    this.results.push(await this.testInvalidContactSubmission());

    // Calculate summary
    const total = this.results.length;
    const passed = this.results.filter((r) => r.status === 'PASS').length;
    const failed = this.results.filter((r) => r.status === 'FAIL').length;
    const skipped = this.results.filter((r) => r.status === 'SKIP').length;

    const totalTime = Date.now() - this.startTime;

    return {
      total,
      passed,
      failed,
      skipped,
      results: this.results,
    };
  }

  printSummary(summary: TestSummary): void {
    console.log('\n📊 Test Results Summary');
    console.log('='.repeat(60));

    // Print detailed results
    for (const result of summary.results) {
      const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
      const time = result.duration ? `(${result.duration}ms)` : '';
      console.log(`${icon} ${result.name.padEnd(40)} ${result.status} ${time}`);
      if (result.message && result.status !== 'PASS') {
        console.log(`   ↳ ${result.message}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`Total: ${summary.total} | ✅ Passed: ${summary.passed} | ❌ Failed: ${summary.failed} | ⚠️ Skipped: ${summary.skipped}`);
    console.log(`Total execution time: ${Date.now() - this.startTime}ms`);

    if (summary.failed > 0) {
      console.error(`\n❌ Smoke tests failed: ${summary.failed} test(s) did not pass`);
      process.exit(1);
    } else {
      console.log(`\n✅ All smoke tests passed!`);
      process.exit(0);
    }
  }
}

// Main program
const program = new Command();

program
  .name('smoke-test')
  .description('Run smoke tests against a deployed portfolio application')
  .version('1.0.0')
  .requiredOption('-u, --url <url>', 'Base URL to test (e.g., https://your-domain.com)');

program.parse(process.argv);

const options = program.opts();

async function main() {
  if (!options.url) {
    console.error('Error: --url option is required');
    program.help();
    process.exit(1);
  }

  const tester = new SmokeTester(options.url);
  const summary = await tester.runAllTests();
  tester.printSummary(summary);
}

main().catch((error) => {
  console.error('🔥 Smoke test execution failed:', error);
  process.exit(1);
});