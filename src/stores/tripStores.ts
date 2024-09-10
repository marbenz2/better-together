import { createClient } from '@/utils/supabase/client'
import { create } from 'zustand'
import { useUserStore } from './userStore'
import { getGroupTrips, getTrip } from '@/utils/supabase/queries'
import { GroupTripsType, GroupTripType } from '@/types/trips'

interface TripState {
  trip: GroupTripType | null
  setTrip: (trip: GroupTripType) => void
  getTrip: (tripId: string) => Promise<void>
  groupTrips: GroupTripsType | null
  setGroupTrips: (groupTrips: GroupTripsType) => void
  getGroupTrips: (groupId: string) => Promise<void>
}

export const useTripStore = create<TripState>((set) => ({
  trip: null,
  setTrip: (trip: GroupTripType) => set({ trip }),
  getTrip: async (tripId: string) => {
    const supabase = createClient()
    const { data: user } = await supabase.auth.getUser()
    if (!user) {
      console.error('Kein Benutzer gefunden')
      return
    }
    const { data, error } = await getTrip(supabase, tripId)
    if (error) {
      console.error('Error fetching trip:', error)
    }
    if (data) {
      set({ trip: data as GroupTripType })
    }
  },

  groupTrips: [],
  setGroupTrips: (groupTrips: GroupTripsType) => set({ groupTrips }),

  getGroupTrips: async (groupId: string) => {
    const supabase = createClient()
    const user = useUserStore.getState().user
    if (!user) {
      console.error('Kein Benutzer gefunden')
      return
    }
    const { data, error } = await getGroupTrips(supabase, groupId)
    if (error) {
      console.error('Error fetching group trips:', error)
    }
    if (data) {
      set({ groupTrips: data as GroupTripsType })
    }
  },
}))
