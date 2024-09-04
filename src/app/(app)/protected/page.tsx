import Dashboard from '@/components/Dashboard'
import { getSubscribedTrips, getUser, getUserGroups } from '@/utils/supabase/queries'
import { createClient } from '@/utils/supabase/server'
import { Tables } from 'database.types'

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
  favourite: GroupMembers['favourite']
  groups: Groups
}[]

export default async function Home() {
  const supabase = createClient()

  const user = await getUser(supabase)

  // Fetch user groups and subscribed trips if the user is authenticated
  const [userGroups, subscribedTrips] = await Promise.all([
    user
      ? getUserGroups(supabase, user.id).then((groups) => groups as unknown as UserGroups)
      : null,
    user
      ? getSubscribedTrips(supabase, user.id).then((trips) => trips as unknown as SubscribedTrips)
      : null,
  ])

  return <Dashboard user={user} subscribedTrips={subscribedTrips} userGroups={userGroups} />
}
