'use client'

import { useEffect, use } from 'react';
import { useToast } from '@/components/ui/use-toast'
import { useToastStore } from '@/stores/toastStore'
import { useUserStore } from '@/stores/userStore'
import EditProfile from '@/components/profile/EditProfile'

export default function EditProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const { getPublicProfile } = useUserStore()
  const { toast } = useToast()
  const { title, message, variant } = useToastStore()

  useEffect(() => {
    if (title && variant) {
      toast({
        title,
        variant,
        description: message,
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
