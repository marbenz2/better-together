'use client'

import { useEffect } from 'react'
import Groups from '@/components/groups/Groups'
import { useToast } from '@/components/ui/use-toast'
import { useToastStore } from '@/stores/toastStore'

export default function GroupsPage() {
  const { toast } = useToast()
  const { title, message, variant } = useToastStore()

  useEffect(() => {
    if (title && message && variant) {
      toast({
        title,
        description: message,
        variant,
      })
    }
  }, [title, message, variant, toast])

  return <Groups />
}
