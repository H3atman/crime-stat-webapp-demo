import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ENV } from '@/lib/constants';

// Middleware function for Next.js
export function middleware(request: NextRequest) {
  // Get the origin from the request headers
  const origin = request.headers.get('origin') || '';
  
  // Create response object
  const response = NextResponse.next();
  
  // Define allowed origins
  const allowedOrigins = [ENV.FRONTEND_URL];
  if (process.env.NODE_ENV === 'development') {
    allowedOrigins.push('http://localhost:3000');
  }
  
  // Check if the origin is in our allowed list
  const isAllowedOrigin = allowedOrigins.includes(origin);
  
  // Set CORS headers for all responses
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  } else {
    // Default to the frontend URL if not matched
    response.headers.set('Access-Control-Allow-Origin', ENV.FRONTEND_URL);
  }
  
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  
  // Handle preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: response.headers,
    });
  }
  
  return response;
}

// Configure which paths should be processed by middleware
export const config = {
  matcher: ['/api/:path*'],
}; 