'use client'

import { useEffect } from 'react'
import { useUserStore, useGroupStore, useTripStore } from '../../../stores/store'
import { createClient } from '@/utils/supabase/client'
import { redirect } from 'next/navigation'

const fetchInitialData = async () => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      console.error('User Error:', userError)
      throw new Error('Error loading user data')
    }

    ;(useUserStore.getState() as { setUser: (user: any) => void }).setUser(user)

    const { data: groups, error: groupsError } = await supabase
      .from('group_members')
      .select('group_id, groups(name, description, created_at)')
      .eq('user_id', user?.id ?? '')

    if (groupsError) {
      console.error('Groups Error:', groupsError)
      throw new Error('Error loading group data')
    }

    if (!groups) {
      throw new Error('No groups found')
    }

    ;(useGroupStore.getState() as { setGroups: (groups: any) => void }).setGroups(
      groups.map((gm) => gm.groups),
    )

    const { data: trips, error: tripsError } = await supabase
      .from('trips')
      .select('*')
      .in(
        'group',
        groups.map((g) => g.group_id),
      )

    if (tripsError) {
      console.error('Trips Error:', tripsError)
      throw new Error('Error loading trip data')
    }

    if (!trips) {
      throw new Error('No trips found')
    }

    ;(useTripStore.getState() as { setTrips: (trips: any) => void }).setTrips(trips)

    // Weitere Daten laden und in entsprechende Stores setzen, falls nötig
  } catch (error) {
    console.error('Error loading data:', error)
  }
}

export default function Home() {
  const user = useUserStore((state) => state.user)
  const groups = useGroupStore((state) => state.groups)
  const trips = useTripStore((state) => state.trips)

  useEffect(() => {
    fetchInitialData()
  }, [])

  return (
    <div>
      <h1>Willkommen zu deiner Reiseplanungs-App!</h1>
      {/* Weitere UI-Komponenten */}
      <div>
        <h1>Dashboard für {user?.email}</h1>
        <h2>Gruppen</h2>
        <ul>
          {groups.map((group, id) => (
            <li key={id}>{group.name}</li>
          ))}
        </ul>
        <h2>Trips</h2>
        <ul>
          {trips.map((trip) => (
            <li key={trip.id}>{trip.name}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
