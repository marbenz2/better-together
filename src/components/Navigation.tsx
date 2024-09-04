import Link from 'next/link'
import AuthButton from './AuthButton'
import { MobileButton } from './ui/mobile-button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'

const navLinks = [
  { href: '/protected', label: 'Dashboard' },
  { href: '/protected/trips', label: 'Reisen' },
  { href: '/protected/payments', label: 'Zahlungen' },
  { href: '/protected/groups', label: 'Gruppen' },
  {
    href: `mailto:${`mailto:benzinger.maxi@gmail.com?subject=Allgemeine%20Anfrage`}`,
    label: 'Kontakt',
  },
]

export default function Navigation() {
  return (
    <nav className="w-full flex justify-center border-b p-4">
      <div className="w-full max-w-7xl flex justify-between items-center text-sm">
        <Link href={'/protected'} className="uppercase font-bold">
          Better.
          <br />
          together.
        </Link>
        <div className="hidden md:flex gap-4">
          {navLinks.map(({ href, label }) => (
            <Link key={label} href={href} className="uppercase">
              {label}
            </Link>
          ))}
        </div>
        <Sheet>
          <SheetDescription hidden>Mobile Navigation</SheetDescription>
          <SheetTrigger asChild>
            <MobileButton className="block md:hidden" />
          </SheetTrigger>
          <SheetContent side={'top'} className="flex w-full justify-center">
            <SheetHeader>
              <SheetTitle></SheetTitle>
            </SheetHeader>
            <SheetTrigger className="flex flex-col items-center gap-12 py-12">
              {navLinks.map(({ href, label }) => (
                <a key={label} href={href} className="uppercase">
                  {label}
                </a>
              ))}
            </SheetTrigger>
          </SheetContent>
        </Sheet>

        <AuthButton />
      </div>
    </nav>
  )
}
