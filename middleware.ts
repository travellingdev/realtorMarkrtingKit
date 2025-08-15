import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Routes that require authentication
const protectedRoutes = ['/account', '/billing', '/usage'];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Get user session
  const { data: { session }, error } = await supabase.auth.getSession();
  
  // Store auth state in headers for instant access in components
  if (session?.user) {
    // Get user profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    const userData = {
      user: {
        id: session.user.id,
        email: session.user.email,
        avatar_url: profile?.avatar_url || null,
      },
      plan: profile?.plan || 'FREE',
      quota: {
        used: profile?.quota_used || 0,
        limit: 2 + (profile?.quota_extra || 0),
        extraUnlocked: (profile?.quota_extra || 0) > 0,
      },
    };
    
    // Pass user data through headers (encoded to handle special characters)
    response.headers.set('x-user-data', Buffer.from(JSON.stringify(userData)).toString('base64'));
    response.headers.set('x-authenticated', 'true');
  } else {
    response.headers.set('x-authenticated', 'false');
  }

  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAuthRoute = authRoutes.some(route => path.startsWith(route));

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect to home if accessing auth routes while authenticated
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
};