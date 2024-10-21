'use client'

import { useEffect } from 'react'
import { useTripStore } from '@/stores/tripStores'
import { useToast } from '@/components/ui/use-toast'
import { useToastStore } from '@/stores/toastStore'
import EditTrip from '@/components/trips/EditTrip'

export default function EditTripPage({ params }: { params: { id: string } }) {
  const { getTrip } = useTripStore()
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
      getTrip(params.id)
    }
  }, [params.id, getTrip])

  return <EditTrip />
}
