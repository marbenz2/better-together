import { createClient } from '@/utils/supabase/server'
import { getPaymentStatus, getSubscribedTrips, getTrip, getUser } from '@/utils/supabase/queries'
import Trip from '@/components/Trip'
import { Tables } from 'database.types'

type PaymentStatus = Tables<'trip_members'>
type Trips = Tables<'trips'>
type SubscribedTrips = {
  subscribed_at: string
  trips: Trips
}

export default async function TripPage({ params }: { params: { id: number } }) {
  const supabase = createClient()
  const [user] = await Promise.all([getUser(supabase)])
  const [trip] = await Promise.all([getTrip(supabase, params.id)])
  const [subscribedTrips] = await Promise.all([
    user
      ? getSubscribedTrips(supabase, user.id).then((trips) => trips as unknown as SubscribedTrips[])
      : [],
  ])
  const [paymentStatus] = await Promise.all([
    user
      ? getPaymentStatus(supabase, user.id, trip.id).then((status) => status as PaymentStatus)
      : null,
  ])
  return <Trip trip={trip} subscribedTrips={subscribedTrips} paymentStatus={paymentStatus} />
}
