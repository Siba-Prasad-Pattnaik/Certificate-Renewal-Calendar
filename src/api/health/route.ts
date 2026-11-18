import { NextResponse } from 'next/server';
import envClient from '@/lib/env/client';
import { storage } from '@/lib/adapters/storage';
import { email } from '@/lib/adapters/email';
import ApiResponse from '@/lib/api/api-response';

// Minimal health check route stub for compilation
export async function GET() {
  try {
    // Environment health check
    const envHealth = envClient.health();
    
    // Storage health check
    const storageHealth = await storage.health();
    
    // Email health check
    const emailHealth = await email.health();
    
    // Combine all health checks
    const health = {
      status: envHealth.status,
      timestamp: new Date().toISOString(),
      services: {
        environment: envHealth,
        storage: storageHealth,
        email: emailHealth,
      },
      system: {
        nodeEnv: envClient.env.NODE_ENV,
        appUrl: envClient.env.NEXT_PUBLIC_APP_URL,
      },
    };
    
    return NextResponse.json(
      ApiResponse.success(health),
      { status: 200 }
    );
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      ApiResponse.error('INTERNAL_ERROR', 'Health check failed'),
      { status: 500 }
    );
  }
}