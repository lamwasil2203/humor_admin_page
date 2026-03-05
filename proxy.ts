import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: getUser() makes a network request to Supabase to validate the
  // JWT. Do NOT use getSession() here — it only reads from the cookie and
  // cannot detect a revoked/expired token server-side.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Unauthenticated users trying to reach any /admin route → send to login
  if (!user && pathname.startsWith('/admin')) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.delete('error')
    return NextResponse.redirect(loginUrl)
  }

  // Already-authenticated users hitting /login → send to admin dashboard.
  // Skip this if there's an error param — that means they were bounced back
  // by the superadmin check and should stay on the login page.
  const error = request.nextUrl.searchParams.get('error')
  if (user && pathname === '/login' && !error) {
    const adminUrl = request.nextUrl.clone()
    adminUrl.pathname = '/admin'
    return NextResponse.redirect(adminUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT static files and Next.js internals.
     * We keep /admin and /login in scope; everything else passes through.
     */
    '/admin/:path*',
    '/login',
  ],
}
