import { createClient } from '@/utils/supabase/server'
import { getGroupTrips, getSubscribedTrips, getUser, getUserGroups } from '@/utils/supabase/queries'
import Trips from '@/components/Trips'
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

export default async function TripsPage() {
  const supabase = createClient()
  const [user] = await Promise.all([getUser(supabase)])
  const [userGroups, subscribedTrips] = await Promise.all([
    user
      ? getUserGroups(supabase, user.id).then((groups) => groups as unknown as UserGroups)
      : null,
    user
      ? getSubscribedTrips(supabase, user.id).then((trips) => trips as unknown as SubscribedTrips)
      : null,
  ])
  const [groupTrips] = await Promise.all([userGroups && getGroupTrips(supabase, userGroups)])

  return (
    <Trips
      user={user}
      userGroups={userGroups}
      groupTrips={groupTrips}
      subscribedTrips={subscribedTrips}
    />
  )
}
