'use client'

import { useEffect } from 'react'
import Trips from '@/components/Trips'
import { useGroupStore } from '@/stores/groupStores'
import { useTripStore } from '@/stores/tripStores'
import { useUserStore } from '@/stores/userStore'
import { useInitializationStore } from '@/stores/initializationStore'

export default function TripsPage() {
  const { groupId } = useGroupStore()
  const { getGroupTrips } = useTripStore()
  const { user } = useUserStore()
  const { isInitialized } = useInitializationStore()

  useEffect(() => {
    if (isInitialized && groupId) {
      getGroupTrips(groupId)
    }
  }, [isInitialized, groupId, getGroupTrips, user.id])

  return <Trips />
}
