import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full pt-8 pb-4 flex flex-col justify-center text-center gap-2 text-xs">
      &copy; {new Date().getFullYear()} - MarBenz
      <div>
        <Link
          href={'/data-protection'}
          className="hover:text-primary transition-colors duration-300"
        >
          Datenschutz
        </Link>
        <span className="mx-2">|</span>
        <Link href={'/imprint'} className="hover:text-primary transition-colors duration-300">
          Impressum
        </Link>
        <span className="mx-2">|</span>
        <Link href={'/terms-of-use'} className="hover:text-primary transition-colors duration-300">
          Nutzungsbedingungen
        </Link>
      </div>
    </footer>
  )
}
