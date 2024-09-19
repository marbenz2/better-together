'use client'

import { useEffect } from 'react'
import Trips from '@/components/trips/Trips'
import { useGroupStore } from '@/stores/groupStores'
import { useTripStore } from '@/stores/tripStores'
import { useUserStore } from '@/stores/userStore'
import { useInitializationStore } from '@/stores/initializationStore'
import { Card, CardDescription, CardHeader } from '@/components/ui/card'
import InfoCard from '@/components/ui/info-card'

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

  if (!groupId) {
    return (
      <InfoCard
        description="Du musst eine Gruppe erstellen oder einer Gruppe beitreten, um Reisen zu sehen"
        variant="info"
      />
    )
  }

  return <Trips />
}
