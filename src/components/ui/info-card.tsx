import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { cn } from '@/lib/utils'

export default function InfoCard({
  title,
  description,
  className,
  variant,
}: {
  title?: string
  description: string
  className?: string
  variant?: 'info' | 'warning' | 'success'
}) {
  const variantClass =
    variant === 'info'
      ? 'border-info'
      : variant === 'warning'
        ? 'border-destructive'
        : variant === 'success'
          ? 'border-success'
          : 'border-primary-foreground'

  return (
    <Card className="w-full max-w-2xl">
      <div className={cn(`rounded-md p-3 border-l-8 ${variantClass}`, className)}>
        <CardHeader className="p-0">
          {title && <CardTitle>{title}</CardTitle>}
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardHeader>
      </div>
    </Card>
  )
}
