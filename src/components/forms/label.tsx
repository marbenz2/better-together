import { cn } from '@/lib/utils'
import React from 'react'

export function Label({
  children,
  className,
  ...props
}: { children: React.ReactNode } & React.JSX.IntrinsicElements['label']) {
  return (
    <label className={cn('text-sm font-medium', className)} {...props}>
      {children}
    </label>
  )
}
