'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import { CardDescription } from '@/components/ui/card'
import TripCard from '@/components/trip/TripCard'
import { useGroupStore } from '@/stores/groupStores'
import { useUserStore } from '@/stores/userStore'

export default function FilteredSubscribedTrips() {
  const { groupId } = useGroupStore()
  const { subscribedTrips } = useUserStore()

  const filteredSubscribedTrips = useMemo(() => {
    return (
      subscribedTrips?.filter((subscribedTrip) => subscribedTrip.trips.group_id === groupId) ?? []
    )
  }, [subscribedTrips, groupId])

  return (
    <div className="block xs:flex gap-4">
      {filteredSubscribedTrips && filteredSubscribedTrips.length > 0 ? (
        filteredSubscribedTrips.map((filteredSubscribedTrip) =>
          filteredSubscribedTrip ? (
            <TripCard
              key={filteredSubscribedTrip.trips.id}
              trip={filteredSubscribedTrip.trips}
              subscribed_at={filteredSubscribedTrip.subscribed_at}
            />
          ) : null,
        )
      ) : (
        <CardDescription>
          Du hast noch keine Reisen gebucht. Schau dir{' '}
          <Link href={'/protected/trips'} className="underline decoration-dashed">
            hier
          </Link>{' '}
          alle Reisen an!
        </CardDescription>
      )}
    </div>
  )
}
