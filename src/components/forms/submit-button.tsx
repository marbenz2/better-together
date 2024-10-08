'use client'

import { useFormStatus } from 'react-dom'
import { type ComponentProps } from 'react'
import { Button } from '../ui/button'
import Spinner from '@/components/ui/Spinner'

type Props = ComponentProps<'button'> & {
  pendingText?: string
}

export function SubmitButton({ children, pendingText = 'Submitting...', ...props }: Props) {
  const { pending, action } = useFormStatus()

  const isPending = pending && action === props.formAction

  return (
    <Button {...props} type="submit" aria-disabled={pending} ref={undefined}>
      {isPending ? <Spinner /> : children}
    </Button>
  )
}
