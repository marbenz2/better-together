import Dashboard from '@/components/dashboard/Dashboard'
import { SubscribedTripsType, UserGroupsType } from '@/types/dashboard'
import { getSubscribedTrips, getUser, getUserGroups } from '@/utils/supabase/queries'
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = createClient()

  const user = await getUser(supabase)

  // Fetch user groups and subscribed trips if the user is authenticated
  const [userGroups, subscribedTrips] = await Promise.all([
    user
      ? getUserGroups(supabase, user.id).then((groups) => groups as unknown as UserGroupsType)
      : null,
    user
      ? getSubscribedTrips(supabase, user.id).then(
          (trips) => trips as unknown as SubscribedTripsType,
        )
      : null,
  ])

  return <Dashboard user={user} subscribedTrips={subscribedTrips} userGroups={userGroups} />
}
