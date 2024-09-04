import { createClient } from '@/utils/supabase/server'
import {
  getGroupTrips,
  getPaymentDetails,
  getSubscribedTrips,
  getUser,
  getUserGroups,
} from '@/utils/supabase/queries'
import Trips from '@/components/Trips'
import Payments from '@/components/payments/Payments'
import { Tables } from 'database.types'

type Trips = Tables<'trips'>
type Groups = Tables<'groups'>
type GroupMembers = Tables<'group_members'>
type PaymentDetails = {
  trip_id: string
  down_payment: number | null
  full_payment: number | null
  final_payment: number | null
  down_payment_paypal_id: string | null
  full_payment_paypal_id: string | null
  final_payment_paypal_id: string | null
}
type SubscribedTrips = {
  created_at: string
  trips: Trips
}
type UserGroups = {
  group_id: GroupMembers['group_id']
  favourite: GroupMembers['favourite'] // Änderung hier
  role: 'admin' | 'member'
  groups: Groups
}[]

export default async function PaymentPage() {
  const supabase = createClient()
  const [user] = await Promise.all([getUser(supabase)])
  const [userGroups, subscribedTrips, paymentDetails] = await Promise.all([
    user
      ? getUserGroups(supabase, user.id).then((groups) => groups as unknown as UserGroups[])
      : [],
    user
      ? getSubscribedTrips(supabase, user.id).then((trips) => trips as unknown as SubscribedTrips[])
      : [],
    user ? getPaymentDetails(supabase, user.id).then((details) => details as PaymentDetails[]) : [],
  ])
  const [groupTrips] = await Promise.all([
    userGroups.length > 0 ? getGroupTrips(supabase, userGroups as UserGroups) : [],
  ])

  return <Payments user={user} paymentDetails={paymentDetails} subscribedTrips={subscribedTrips} />
}
