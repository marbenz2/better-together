import * as React from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { PencilIcon } from 'lucide-react'

interface BackButtonProps extends React.HTMLAttributes<HTMLAnchorElement> {
  tripId: string
}

const EditButton = React.forwardRef<HTMLAnchorElement, BackButtonProps>(
  ({ className, tripId, ...props }, ref) => {
    const router = useRouter()

    const handleEdit = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault()
      router.push(`/protected/edit-trip/${tripId}`)
    }

    return (
      <a
        ref={ref}
        className={cn('text-foreground flex h-full w-full items-center', className)}
        href="#"
        onClick={handleEdit}
        {...props}
      >
        <PencilIcon size={24} />
      </a>
    )
  },
)

EditButton.displayName = 'EditButton'
export { EditButton }
