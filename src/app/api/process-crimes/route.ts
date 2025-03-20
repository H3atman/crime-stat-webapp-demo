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
 * Proxy API route to handle file processing requests
 */
export async function POST(request: NextRequest) {
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
    
    // Clone the request body (FormData)
    const formData = await request.formData();
    const files = formData.getAll('files');
    console.log('FormData files count:', files.length); // Debug log
    
    // Create a new FormData object for the fetch request
    const newFormData = new FormData();
    
    // Add all files to the new FormData
    for (const file of files) {
      newFormData.append('files', file);
    }
    
    // Add merge_type parameter
    newFormData.append('merge_type', formData.get('merge_type') as string || 'vertical');
    
    // Validate and construct full URL
    let fullUrl;
    try {
      fullUrl = new URL('/process-crimes/', API_BASE_URL).toString();
      console.log('Making request to:', fullUrl); // Debug log
    } catch (error) {
      console.error('Invalid URL construction:', error);
      return NextResponse.json(
        { detail: 'Server configuration error. Invalid API URL.' },
        { 
          status: 500,
          headers: getCorsHeaders(origin),
        }
      );
    }
    
    // Forward the request to the actual API
    const response = await fetch(fullUrl, {
      method: 'POST',
      body: newFormData,
    });

    console.log('Response status:', response.status); // Debug log
    
    if (!response.ok) {
      const errorData = await response.json();
      console.log('Error data:', errorData); // Debug log
      return NextResponse.json(
        { detail: errorData.detail || 'Failed to process files' },
        { 
          status: response.status,
          headers: getCorsHeaders(origin),
        }
      );
    }

    const data = await response.json();
    console.log('Success data:', data); // Debug log
    
    // Return the response but modify the download URL to use our proxy
    return NextResponse.json({
      download_url: `/api/download-file?path=${encodeURIComponent(data.download_url)}`,
    }, {
      headers: getCorsHeaders(origin),
    });
  } catch (error) {
    console.error('Error processing files (detailed):', error); // Enhanced error logging
    return NextResponse.json(
      { detail: 'Failed to process files. Please try again.' },
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