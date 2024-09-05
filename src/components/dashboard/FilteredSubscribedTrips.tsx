import React from 'react'
import Link from 'next/link'
import { CardDescription } from '@/components/ui/card'
import type { SubscribedTripsType } from '@/types/dashboard'
import TripCard from '@/components/TripCard'

interface FilteredSubscribedTripsProps {
  filteredSubscribedTrips: SubscribedTripsType
}

export default function FilteredSubscribedTrips({
  filteredSubscribedTrips,
}: FilteredSubscribedTripsProps) {
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
