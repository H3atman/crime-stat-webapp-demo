import { NextRequest, NextResponse } from 'next/server';
import { ENV } from '@/lib/constants';

/**
 * Handle OPTIONS request for CORS preflight
 */
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin') || '';
  
  // Return response with CORS headers
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

/**
 * Proxy API route to handle file download requests
 */
export async function GET(request: NextRequest) {
  // Get API base URL from ENV constant instead of directly from process.env
  const API_BASE_URL = ENV.API_BASE_URL;
  const origin = request.headers.get('origin') || '';
  
  try {
    console.log('API_BASE_URL:', API_BASE_URL); // Debug log
    
    // Validate API base URL
    if (!API_BASE_URL) {
      console.error('API_BASE_URL is undefined or empty');
      return NextResponse.json(
        { detail: 'Server configuration error. API base URL is not defined.' },
        { 
          status: 500,
          headers: getCorsHeaders(origin),
        }
      );
    }
    
    // Get the file path from query parameters
    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get('path');
    console.log('Download path parameter:', path); // Debug log
    
    if (!path) {
      return NextResponse.json(
        { detail: 'No file path provided' },
        { 
          status: 400,
          headers: getCorsHeaders(origin),
        }
      );
    }
    
    // Determine the full URL
    // If path already starts with http(s), use it directly
    // Otherwise, join it with the base URL
    let fullPath;
    try {
      if (path.startsWith('http')) {
        fullPath = path;
      } else {
        fullPath = new URL(path, API_BASE_URL).toString();
      }
      console.log('Making download request to:', fullPath); // Debug log
    } catch (error) {
      console.error('Invalid URL construction:', error);
      return NextResponse.json(
        { detail: 'Server configuration error. Invalid download URL.' },
        { 
          status: 500,
          headers: getCorsHeaders(origin),
        }
      );
    }
    
    // Forward the request to the actual API
    const response = await fetch(fullPath);
    console.log('Download response status:', response.status); // Debug log
    
    if (!response.ok) {
      return NextResponse.json(
        { detail: 'Failed to download file' },
        { 
          status: response.status,
          headers: getCorsHeaders(origin),
        }
      );
    }
    
    // Get content type and other headers
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const contentDisposition = response.headers.get('content-disposition');
    
    // Get the file data as array buffer
    const fileData = await response.arrayBuffer();
    
    // Create a new response with the file data
    const corsHeaders = getCorsHeaders(origin);
    corsHeaders.set('Content-Type', contentType);
    corsHeaders.set('Content-Disposition', contentDisposition || 'attachment; filename="processed_crime_stats.xlsx"');
    
    const newResponse = new NextResponse(fileData, {
      status: 200,
      headers: corsHeaders,
    });
    
    return newResponse;
  } catch (error) {
    console.error('Error downloading file (detailed):', error); // Enhanced error logging
    return NextResponse.json(
      { detail: 'Failed to download file. Please try again.' },
      { 
        status: 500,
        headers: getCorsHeaders(origin),
      }
    );
  }
}

/**
 * Generate CORS headers based on the origin
 */
function getCorsHeaders(origin: string) {
  const headers = new Headers();
  
  // Check if the origin matches our allowed origins
  const allowedOrigins = [ENV.FRONTEND_URL];
  if (process.env.NODE_ENV === 'development') {
    allowedOrigins.push('http://localhost:3000');
  }
  
  const isAllowedOrigin = allowedOrigins.includes(origin);
  
  // Set CORS headers only if the origin is allowed
  if (isAllowedOrigin) {
    headers.set('Access-Control-Allow-Origin', origin);
  } else {
    // Default to the frontend URL if origin is not in allowed list
    headers.set('Access-Control-Allow-Origin', ENV.FRONTEND_URL);
  }
  
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  headers.set('Access-Control-Max-Age', '86400'); // 24 hours
  
  return headers;
} 