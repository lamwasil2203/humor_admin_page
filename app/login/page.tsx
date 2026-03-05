'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

function LoginForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get('error')

  const [toast, setToast] = useState<string | null>(null)
  const [toastVisible, setToastVisible] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (!error) return

    const message =
      error === 'unauthorized'
        ? 'Your account does not have admin access.'
        : 'Sign-in failed. Please try again.'

    supabase.auth.signOut().finally(() => {
      router.replace('/login')
      setToast(message)
      setToastVisible(true)
      const hide = setTimeout(() => setToastVisible(false), 3000)
      const clear = setTimeout(() => setToast(null), 3500)
      return () => { clearTimeout(hide); clearTimeout(clear) }
    })
  }, [error]) // eslint-disable-line react-hooks/exhaustive-deps

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">

      {/* Subtle background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Toast */}
      {toast && (
        <div
          style={{ transition: 'opacity 0.4s ease' }}
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-3 text-sm font-medium text-white shadow-lg ${
            toastVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {toast}
        </div>
      )}

      {/* Card */}
      <div className="relative w-full max-w-sm mx-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">

          {/* Logo / wordmark */}
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-white tracking-tight">Humor Project Admin</h1>
            <p className="text-slate-400 text-sm mt-1">Sign in to access the dashboard</p>
          </div>

          {/* Google button */}
          <button
            onClick={signInWithGoogle}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-slate-800 border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <p className="text-slate-600 text-xs text-center mt-6">
            Access restricted to authorized accounts only.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" />
    </svg>
  )
}
