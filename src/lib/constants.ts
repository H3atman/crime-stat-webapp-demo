/**
 * API routes for the application
 */

export const API_ROUTES = {
  PROCESS_FILES: '/api/process-crimes',
  DOWNLOAD_FILE: '/api/download-file',
}

/**
 * Environment variables
 */
export const ENV = {
  FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://crimestatapi.ridmd12.com',
} 