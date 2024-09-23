'use client'

import { useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useToastStore } from '@/stores/toastStore'
import { useUserStore } from '@/stores/userStore'
import EditProfile from '@/components/profile/EditProfile'

export default function EditProfilePage({ params }: { params: { id: string } }) {
  const { getPublicProfile } = useUserStore()
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

  useEffect(() => {
    if (params.id) {
      getPublicProfile(params.id)
    }
  }, [params.id, getPublicProfile])

  return <EditProfile />
}
