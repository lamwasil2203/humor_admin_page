'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? 'bg-indigo-600 text-white'
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      {children}
    </Link>
  )
}
