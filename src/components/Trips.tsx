import TripCard from '@/components/TripCard'
import { setTripStatus } from '@/lib/actions'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  CardBackPlate,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tables } from 'database.types'
import CheckSubscribeIcon from './CheckSubscribeIcon'

type Trips = Tables<'trips'>
type TripMembers = Tables<'trip_members'>
type Groups = Tables<'groups'>
type GroupMembers = Tables<'group_members'>
type SubscribedTrips = {
  trips: Trips
  subscribed_at: TripMembers['subscribed_at']
}[]
type UserGroups = {
  group_id: GroupMembers['group_id']
  groups: Groups
}[]
type ExtenededTrips = Trips & { subscribed_at: TripMembers['subscribed_at'] | undefined }

interface TripsProps {
  user: any | null
  userGroups: UserGroups | null
  groupTrips: Trips[] | null
  subscribedTrips: SubscribedTrips | null
}

export default function Trips({ user, userGroups, groupTrips, subscribedTrips }: TripsProps) {
  const extendedGroupTrips = groupTrips?.map((groupTrip) => {
    const subscribedTrip = subscribedTrips?.find(
      (subscribedTrip) => subscribedTrip.trips.id === groupTrip.id,
    )
    return {
      ...groupTrip,
      subscribed_at: subscribedTrip?.subscribed_at,
    }
  })

  const sortedTrips = extendedGroupTrips?.sort(
    (a, b) => new Date(a.date_from).getTime() - new Date(b.date_from).getTime(),
  )

  const today = new Date()

  const checkAndSetStatus = async (trip: Trips, status: string, userId: string) => {
    if (trip.status !== status) {
      try {
        await setTripStatus({ tripId: trip.id, status, userId })
      } catch (err) {
        console.error((err as any).message)
      }
    }
  }

  const upcomingTrips = sortedTrips?.filter((trip) => {
    const isUpcoming = new Date(trip.date_from) > today
    if (isUpcoming) {
      checkAndSetStatus(trip, 'upcoming', user.id)
    }
    return isUpcoming
  })

  const currentTrips = sortedTrips?.filter((trip) => {
    const isCurrent = new Date(trip.date_from) <= today && new Date(trip.date_to) >= today
    if (isCurrent) {
      checkAndSetStatus(trip, 'current', user.id)
    }
    return isCurrent
  })

  const pastTrips = sortedTrips?.filter((trip) => {
    const isPast = new Date(trip.date_to) < today
    if (isPast) {
      checkAndSetStatus(trip, 'done', user.id)
    }
    return isPast
  })

  const renderTrips = (trips: ExtenededTrips[]) =>
    trips.map((trip) => {
      return (
        <TripCard trip={trip} key={trip.id} subscribed_at={trip.subscribed_at}>
          {/* <CheckSubscribeIcon subscribed={subscribedTripIds.includes(trip.id)} /> */}
        </TripCard>
      )
    })

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col md:flex-row gap-12">
        <CardBackPlate>
          <CardHeader>
            <CardTitle>Aktuell</CardTitle>
            <CardDescription>Aktuelle Ausfahrt</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row flex-wrap gap-12 sm:gap-4 pt-1">
            {currentTrips && currentTrips.length === 0 && (
              <CardDescription>Keine aktuellen Ausfahrten.</CardDescription>
            )}
            {currentTrips && renderTrips(currentTrips)}
          </CardContent>
        </CardBackPlate>
        <CardBackPlate className="flex-1">
          <CardHeader>
            <CardTitle>Anstehend</CardTitle>
            <CardDescription>Geplante Ausfahrten</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row flex-wrap gap-12 sm:gap-4 pt-1">
            {upcomingTrips && upcomingTrips.length === 0 && (
              <CardDescription>Keine aktuellen Ausfahrten.</CardDescription>
            )}
            {upcomingTrips && renderTrips(upcomingTrips)}
          </CardContent>
        </CardBackPlate>
      </div>
      <CardBackPlate>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <CardHeader>
              <AccordionTrigger className="py-0">
                <CardTitle>Beendet</CardTitle>
              </AccordionTrigger>
              <CardDescription>Beendete Ausfahrten</CardDescription>
            </CardHeader>
            <AccordionContent>
              <CardContent className="flex flex-col sm:flex-row flex-wrap gap-12 sm:gap-4 pt-1">
                {pastTrips && pastTrips.length === 0 && (
                  <CardDescription>Keine aktuellen Ausfahrten.</CardDescription>
                )}
                {pastTrips && renderTrips(pastTrips)}
              </CardContent>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardBackPlate>
    </div>
  )
}
