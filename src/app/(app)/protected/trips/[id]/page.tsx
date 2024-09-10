'use client'

import { useEffect } from 'react'
import Trip from '@/components/Trip'
import { useTripStore } from '@/stores/tripStores'
import { usePaymentStore } from '@/stores/paymentStore'
import { useToast } from '@/components/ui/use-toast'
import { useToastStore } from '@/stores/toastStore'

export default function TripPage({ params }: { params: { id: string } }) {
  const { getTrip } = useTripStore()
  const { getPaymentStatus } = usePaymentStore()
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
      getTrip(params.id)
      getPaymentStatus(params.id)
    }
  }, [params.id, getTrip, getPaymentStatus])

  return <Trip />
}
