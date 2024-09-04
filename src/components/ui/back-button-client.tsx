import * as React from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface BackButtonProps extends React.HTMLAttributes<HTMLAnchorElement> {}

const BackButtonClient = React.forwardRef<HTMLAnchorElement, BackButtonProps>(
  ({ className, ...props }, ref) => {
    const router = useRouter()

    const handleBack = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault()
      router.back()
    }

    return (
      <a
        ref={ref}
        className={cn(
          'absolute left-8 top-8 py-2 px-4 no-underline text-foreground flex items-center group text-sm',
          className,
        )}
        href="#"
        onClick={handleBack}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{' '}
        Zurück
      </a>
    )
  },
)

BackButtonClient.displayName = 'BackButtonClient'
export { BackButtonClient }
