import * as React from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface BackButtonProps extends React.HTMLAttributes<HTMLAnchorElement> {
  id: string
  type: string
  children: React.ReactNode
}

const EditButton = React.forwardRef<HTMLAnchorElement, BackButtonProps>(
  ({ className, id, type, children, ...props }, ref) => {
    const router = useRouter()

    const handleEdit = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault()
      router.push(`/protected/edit-${type}/${id}`)
    }

    return (
      <a
        ref={ref}
        className={cn('text-foreground flex h-full w-full items-center', className)}
        href="#"
        onClick={handleEdit}
        {...props}
      >
        {children}
      </a>
    )
  },
)

EditButton.displayName = 'EditButton'
export { EditButton }
