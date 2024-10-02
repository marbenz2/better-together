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
import { Separator } from './ui/separator'
import { FacebookIcon, InstagramIcon, TwitterIcon } from 'lucide-react'

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
        <MobileButton className="block lg:hidden" />
      </SheetTrigger>
      <SheetContent side={'left'} className="flex flex-col h-full p-0">
        <SheetHeader>
          <SheetTitle></SheetTitle>
        </SheetHeader>
        <div className="flex flex-col justify-between w-full h-full py-10">
          <div className="flex flex-col w-full items-start">
            {navLinks.map(({ href, label }, index) => (
              <div key={label} className="flex flex-col w-full">
                <Link
                  href={href}
                  className="flex w-full px-6 py-6 items-center hover:bg-primary transition-colors duration-300"
                  onClick={handleLinkClick}
                >
                  <span className="uppercase">{label}</span>
                </Link>
                {index < navLinks.length - 1 && <Separator className="bg-white/10" />}
              </div>
            ))}
          </div>
          {/* social media icons/link on the bottom of the menu centered */}
          <div className="flex justify-center w-full gap-4 self-end">
            <Link href={'https://www.instagram.com/'} target="_blank" rel="noopener noreferrer">
              <InstagramIcon className="w-6 h-6 hover:text-primary transition-colors duration-300" />
            </Link>
            <Link href={'https://www.x.com/'} target="_blank" rel="noopener noreferrer">
              <TwitterIcon className="w-6 h-6 hover:text-primary transition-colors duration-300" />
            </Link>
            <Link href={'https://www.facebook.com/'} target="_blank" rel="noopener noreferrer">
              <FacebookIcon className="w-6 h-6 hover:text-primary transition-colors duration-300" />
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
