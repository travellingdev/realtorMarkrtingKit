import { NextRequest, NextResponse } from 'next/server';

/**
 * Image proxy endpoint to bypass CORS restrictions
 * Fetches images from Supabase and returns them with proper CORS headers
 */
export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url');
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }
    
    console.log('[image-proxy] Fetching image:', url.substring(0, 100));
    
    // Fetch the image from the original source
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('[image-proxy] Failed to fetch image:', response.status);
      return NextResponse.json(
        { error: 'Failed to fetch image' },
        { status: response.status }
      );
    }
    
    // Get the image data
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();
    
    console.log('[image-proxy] Image fetched, size:', buffer.byteLength);
    
    // Return the image with CORS headers that allow Canvas access
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Content-Length': buffer.byteLength.toString(),
      },
    });
    
  } catch (error) {
    console.error('[image-proxy] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Also handle OPTIONS for preflight requests
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}