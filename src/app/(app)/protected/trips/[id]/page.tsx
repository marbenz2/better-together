'use client'

import { useEffect, useState } from 'react'
import Trip from '@/components/trip/Trip'
import { useTripStore } from '@/stores/tripStores'
import { usePaymentStore } from '@/stores/paymentStore'
import { useToast } from '@/components/ui/use-toast'
import { useToastStore } from '@/stores/toastStore'
import { useUserStore } from '@/stores/userStore'
import { useGroupStore } from '@/stores/groupStores'
import Spinner from '@/components/ui/Spinner'

export default function TripPage({ params }: { params: { id: string } }) {
  const { user } = useUserStore()
  const { getAllUserGroups } = useGroupStore()
  const { getTrip } = useTripStore()
  const { getPaymentStatus } = usePaymentStore()
  const { toast } = useToast()
  const { title, message, variant } = useToastStore()
  const [isLoading, setIsLoading] = useState(true)

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
    async function loadData() {
      if (params.id) {
        setIsLoading(true)
        await Promise.all([
          getTrip(params.id),
          getPaymentStatus(user.id, params.id),
          getAllUserGroups(user.id),
        ])
        setIsLoading(false)
      }
    }
    loadData()
  }, [params.id, getTrip, getPaymentStatus, getAllUserGroups, user.id])

  if (isLoading) return <Spinner />

  return <Trip />
}
