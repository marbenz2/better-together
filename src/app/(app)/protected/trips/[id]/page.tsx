import { createClient } from '@/utils/supabase/server'
import { getPaymentStatus, getSubscribedTrips, getTrip, getUser } from '@/utils/supabase/queries'
import Trip from '@/components/Trip'

export default async function TripPage({ params }: { params: { id: number } }) {
  const supabase = createClient()
  const [user] = await Promise.all([getUser(supabase)])
  const [trip] = await Promise.all([getTrip(supabase, params.id)])
  const [subscribedTrips] = await Promise.all([user && getSubscribedTrips(supabase, user.id)])
  const [paymentStatus] = await Promise.all([user && getPaymentStatus(supabase, user.id, trip.id)])

  return <Trip trip={trip} subscribedTrips={subscribedTrips} paymentStatus={paymentStatus} />
}
