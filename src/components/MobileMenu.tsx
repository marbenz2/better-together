'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MobileButton } from '@/components/ui/mobile-button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const navLinks = [
  { href: '/protected', label: 'Dashboard' },
  { href: '/protected/trips', label: 'Reisen' },
  { href: '/protected/payments', label: 'Zahlungen' },
  { href: '/protected/groups', label: 'Gruppen' },
  {
    href: `mailto:benzinger.maxi@gmail.com?subject=Allgemeine%20Anfrage`,
    label: 'Kontakt',
  },
]

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
  }

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetDescription hidden>Mobile Navigation</SheetDescription>
      <SheetTrigger asChild>
        <MobileButton className="block md:hidden" />
      </SheetTrigger>
      <SheetContent side={'top'} className="flex w-full justify-center">
        <SheetHeader>
          <SheetTitle></SheetTitle>
        </SheetHeader>
        <div className="flex flex-col items-center gap-12 py-12">
          {navLinks.map(({ href, label }) => (
            <Link key={label} href={href} className="uppercase" onClick={handleLinkClick}>
              {label}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
