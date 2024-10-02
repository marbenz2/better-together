'use client'

import Link from 'next/link'
import AuthButton from './AuthButton'
import MobileNavigation from '@/components/MobileMenu'
import { HeartHandshakeIcon } from 'lucide-react'

const navLinks = [
  { href: '/protected', label: 'Übersicht' },
  { href: '/protected/groups', label: 'Gruppen' },
  { href: '/protected/trips', label: 'Reisen' },
  { href: '/protected/payments', label: 'Zahlungen' },
  { href: '/protected/profile', label: 'Profil' },
  {
    href: 'mailto:benzinger.maxi@gmail.com?subject=Allgemeine%20Anfrage',
    label: 'Kontakt',
  },
]

export default function Navigation() {
  return (
    <nav className="w-full flex justify-center border-b p-4">
      <div className="w-full max-w-7xl flex justify-between items-center text-sm">
        <Link
          title="Better. Together."
          href={'/protected'}
          className="uppercase font-bold flex items-center gap-2"
        >
          <HeartHandshakeIcon className="w-10 h-10 text-[#c940ce]" strokeWidth={1.5} />
          <h2 className="hidden sm:flex">
            Better.
            <br />
            together.
          </h2>
        </Link>
        <div className="hidden lg:flex gap-4">
          {navLinks.map(({ href, label }) => (
            <Link key={label} href={href} className="uppercase">
              {label}
            </Link>
          ))}
        </div>
        <MobileNavigation />
        <AuthButton />
      </div>
    </nav>
  )
}
