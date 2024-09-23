'use client'

import { useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useToastStore } from '@/stores/toastStore'
import Profile from '@/components/profile/Profile'

export default function ProfilePage() {
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

  return <Profile />
}
