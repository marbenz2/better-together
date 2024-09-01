import { createClient } from '@/utils/supabase/server'
import { CardBackPlate, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import CheckSubscribeIcon from '../CheckSubscribeIcon'
import { setTripStatus } from '@/lib/actions'
import TripCard from '../TripCard'
import { Database } from '../../../database.types'

type Trip = Database['public']['Tables']['trips']['Row']
type Trips = Database['public']['Tables']['trips']['Row'][]

export default async function Trips() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { data: trips, error: tripsError } = await supabase.from('trips').select('*')

  if (tripsError) {
    console.error(tripsError)
    return <h1>Es gab einen Fehler.</h1>
  }

  const { data: subscriptions, error: subscriptionsError } = await supabase
    .from('trip_members')
    .select('trip_id, created_at')
    .eq('user_id', user.id)

  if (subscriptionsError) {
    console.error(subscriptionsError)
    return <h1>Es gab einen Fehler beim Abrufen der Abonnements.</h1>
  }

  const subscribedTripIds = subscriptions ? subscriptions.map((sub) => sub.trip_id) : []

  const sortedTrips = trips.sort(
    (a, b) => new Date(a.date_from).getTime() - new Date(b.date_from).getTime(),
  )

  const today = new Date()

  const checkAndSetStatus = async (trip: Trip, status: string, userId: string) => {
    if (trip.status !== status) {
      try {
        await setTripStatus({ tripId: trip.id, status, userId })
      } catch (err) {
        console.error((err as any).message)
      }
    }
  }

  const upcomingTrips = sortedTrips.filter((trip) => {
    const isUpcoming = new Date(trip.date_from) > today
    if (isUpcoming) {
      checkAndSetStatus(trip, 'upcoming', user.id)
    }
    return isUpcoming
  })

  const currentTrips = sortedTrips.filter((trip) => {
    const isCurrent = new Date(trip.date_from) <= today && new Date(trip.date_to) >= today
    if (isCurrent) {
      checkAndSetStatus(trip, 'current', user.id)
    }
    return isCurrent
  })

  const pastTrips = sortedTrips.filter((trip) => {
    const isPast = new Date(trip.date_to) < today
    if (isPast) {
      checkAndSetStatus(trip, 'done', user.id)
    }
    return isPast
  })

  const renderTrips = (trips: Trips) =>
    trips.map((trip) => {
      const subscription = subscriptions.find((sub) => sub.trip_id === trip.id)
      return (
        <TripCard trip={trip} key={trip.id} created_at={subscription && subscription.created_at}>
          <CheckSubscribeIcon subscribed={subscribedTripIds.includes(trip.id)} />
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
            {currentTrips.length === 0 ? (
              <CardDescription>Keine aktuellen Ausfahrten.</CardDescription>
            ) : (
              renderTrips(currentTrips)
            )}
          </CardContent>
        </CardBackPlate>
        <CardBackPlate className="flex-1">
          <CardHeader>
            <CardTitle>Anstehend</CardTitle>
            <CardDescription>Geplante Ausfahrten</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row flex-wrap gap-12 sm:gap-4 pt-1">
            {upcomingTrips.length === 0 ? (
              <CardDescription>Keine anstehenden Ausfahrten.</CardDescription>
            ) : (
              renderTrips(upcomingTrips)
            )}
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
                {pastTrips.length === 0 ? (
                  <CardDescription>Keine beendeten Ausfahrten.</CardDescription>
                ) : (
                  renderTrips(pastTrips)
                )}
              </CardContent>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardBackPlate>
    </div>
  )
}
