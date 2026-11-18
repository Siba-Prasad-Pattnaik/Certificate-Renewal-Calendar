#!/usr/bin/env tsx
/**
 * Emits the API contract to .agent/contracts/api_contract.json
 * This script generates the complete REST API contract based on the LLD specification.
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

// Define the API contract based on LLD.md specification
const apiContract = {
  version: '1.0.0',
  generatedAt: new Date().toISOString(),
  basePath: '/api',
  endpoints: [
    // Public endpoints
    {
      path: '/health',
      method: 'GET',
      auth: 'public',
      description: 'Health check endpoint',
      request: {
        params: {},
        query: {},
        body: null
      },
      response: {
        200: {
          description: 'Health status',
          schema: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok', 'degraded'] },
              time: { type: 'string', format: 'date-time' },
              version: { type: 'string' },
              adapters: {
                type: 'object',
                properties: {
                  email: { type: 'string', enum: ['ok', 'degraded', 'disabled'] },
                  storage: { type: 'string', enum: ['ok', 'degraded', 'disabled'] }
                }
              }
            },
            required: ['status', 'time', 'version', 'adapters']
          }
        },
        500: {
          description: 'Internal server error'
        }
      }
    },
    {
      path: '/profile',
      method: 'GET',
      auth: 'public',
      description: 'Get public profile information',
      request: {
        params: {},
        query: {},
        body: null
      },
      response: {
        200: {
          description: 'Profile data',
          schema: { $ref: '#/components/schemas/Profile' }
        }
      }
    },
    {
      path: '/projects',
      method: 'GET',
      auth: 'public',
      description: 'Get list of published projects',
      request: {
        params: {},
        query: {
          featured: { type: 'boolean', optional: true },
          limit: { type: 'number', optional: true },
          offset: { type: 'number', optional: true }
        },
        body: null
      },
      response: {
        200: {
          description: 'List of projects',
          schema: {
            type: 'array',
            items: { $ref: '#/components/schemas/Project' }
          }
        }
      }
    },
    {
      path: '/projects/[slug]',
      method: 'GET',
      auth: 'public',
      description: 'Get project by slug',
      request: {
        params: {
          slug: { type: 'string', description: 'Project slug' }
        },
        query: {},
        body: null
      },
      response: {
        200: {
          description: 'Project details',
          schema: { $ref: '#/components/schemas/Project' }
        },
        404: {
          description: 'Project not found'
        }
      }
    },
    // Admin endpoints
    {
      path: '/admin/profile',
      method: 'GET',
      auth: 'admin',
      description: 'Get admin profile (full details)',
      request: {
        params: {},
        query: {},
        body: null
      },
      response: {
        200: {
          description: 'Admin profile data',
          schema: { $ref: '#/components/schemas/Profile' }
        },
        401: {
          description: 'Unauthorized'
        }
      }
    },
    {
      path: '/admin/profile',
      method: 'PUT',
      auth: 'admin',
      description: 'Update profile',
      request: {
        params: {},
        query: {},
        body: { $ref: '#/components/schemas/ProfileUpdate' }
      },
      response: {
        200: {
          description: 'Profile updated',
          schema: { $ref: '#/components/schemas/Profile' }
        },
        400: {
          description: 'Validation error'
        },
        401: {
          description: 'Unauthorized'
        }
      }
    },
    // Contact endpoint
    {
      path: '/contact',
      method: 'POST',
      auth: 'public',
      description: 'Submit contact form',
      request: {
        params: {},
        query: {},
        body: { $ref: '#/components/schemas/ContactMessage' }
      },
      response: {
        201: {
          description: 'Message submitted successfully'
        },
        400: {
          description: 'Validation error'
        },
        422: {
          description: 'Turnstile verification failed'
        }
      }
    },
    // Add more endpoints as needed...
  ],
  components: {
    schemas: {
      // Schemas will be populated from Zod schemas once they exist
      Profile: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          slug: { type: 'string', maxLength: 50, pattern: '^[a-z0-9-]+$' },
          full_name: { type: 'string', minLength: 1, maxLength: 100 },
          headline: { type: 'string', maxLength: 150 },
          bio: { type: 'string' },
          avatar_url: { type: 'string', format: 'uri' },
          location: { type: 'string', maxLength: 100 },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string', maxLength: 20 },
          website_url: { type: 'string', format: 'uri' },
          seo_title: { type: 'string', maxLength: 60 },
          seo_description: { type: 'string', maxLength: 160 },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        },
        required: ['slug', 'full_name']
      },
      Project: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          profile_id: { type: 'string', format: 'uuid' },
          slug: { type: 'string', maxLength: 200 },
          title: { type: 'string', minLength: 2, maxLength: 200 },
          description: { type: 'string' },
          content: { type: 'string' },
          cover_image_url: { type: 'string', format: 'uri' },
          featured: { type: 'boolean' },
          status: { type: 'string', enum: ['draft', 'published', 'archived'] },
          start_date: { type: 'string', format: 'date' },
          end_date: { type: 'string', format: 'date' },
          is_current: { type: 'boolean' },
          client_name: { type: 'string', maxLength: 100 },
          project_url: { type: 'string', format: 'uri' },
          repository_url: { type: 'string', format: 'uri' },
          technologies: { type: 'array', items: { type: 'string' } },
          seo_title: { type: 'string', maxLength: 60 },
          seo_description: { type: 'string', maxLength: 160 },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        },
        required: ['slug', 'title']
      },
      ContactMessage: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 100 },
          email: { type: 'string', format: 'email' },
          subject: { type: 'string', maxLength: 200 },
          message: { type: 'string', minLength: 10, maxLength: 5000 },
          turnstileToken: { type: 'string' }
        },
        required: ['name', 'email', 'subject', 'message', 'turnstileToken']
      },
      ProfileUpdate: {
        type: 'object',
        properties: {
          full_name: { type: 'string', minLength: 1, maxLength: 100 },
          headline: { type: 'string', maxLength: 150 },
          bio: { type: 'string' },
          location: { type: 'string', maxLength: 100 },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string', maxLength: 20 },
          website_url: { type: 'string', format: 'uri' },
          seo_title: { type: 'string', maxLength: 60 },
          seo_description: { type: 'string', maxLength: 160 }
        },
        required: []
      }
    }
  }
};

// Write the contract to file
const contractsDir = join(process.cwd(), '.agent/contracts');
const outputPath = join(contractsDir, 'api_contract.json');

try {
  // Ensure contracts directory exists
  const fs = require('fs');
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }
  
  // Write the contract
  writeFileSync(outputPath, JSON.stringify(apiContract, null, 2));
  console.log(`✅ API contract written to ${outputPath}`);
} catch (error) {
  console.error('❌ Failed to write API contract:', error);
  process.exit(1);
}