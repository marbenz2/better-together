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
    const now = new Date()
    return (
      subscribedTrips
        ?.filter(
          (subscribedTrip) =>
            subscribedTrip.trips.group_id === groupId &&
            new Date(subscribedTrip.trips.date_to) >= now,
        )
        .sort(
          (a, b) => new Date(a.trips.date_from).getTime() - new Date(b.trips.date_from).getTime(),
        ) ?? []
    )
  }, [subscribedTrips, groupId])

  return (
    <div className="flex flex-col sm:flex-row gap-4">
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
          Du bist noch nicht Teil einer Reise deiner Gruppe. Schau dir doch mal die{' '}
          <Link href={'/protected/trips'} className="underline decoration-dashed">
            anstehenden Reisen
          </Link>{' '}
          an oder erstelle eine neue Reise.
        </CardDescription>
      )}
    </div>
  )
}
