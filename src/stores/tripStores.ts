import { createClient } from '@/utils/supabase/client'
import { create } from 'zustand'
import { useUserStore } from './userStore'
import {
  createTrip,
  deleteTrip,
  getGroupTrips,
  getTrip,
  getUser,
  updateTrip,
} from '@/utils/supabase/queries'
import { GroupTripsType, GroupTripType } from '@/types/trips'
import { showNotification } from '@/lib/utils'
import { NotificationMessage } from '@/types/notification.'

interface TripState {
  trip: GroupTripType | null
  setTrip: (trip: GroupTripType) => void
  getTrip: (tripId: string) => Promise<void>
  groupTrips: GroupTripsType | null
  setGroupTrips: (groupTrips: GroupTripsType) => void
  getGroupTrips: (groupId: string) => Promise<void>
  createTrip: (trip: GroupTripType) => Promise<void>
  updateTrip: (trip: GroupTripType) => Promise<void>
  deleteTrip: (tripId: string) => Promise<void>
}

const handleError = (error: any, defaultTitle: string, defaultMessage: string) => {
  const errorMessages: { [key: string]: NotificationMessage } = {}

  const errorMessage = errorMessages[error.code] || {
    title: defaultTitle,
    message: defaultMessage,
    variant: 'destructive',
  }
  showNotification(errorMessage.title, errorMessage.message, errorMessage.variant)
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
  createTrip: async (trip: Omit<GroupTripType, 'id'>) => {
    try {
      const supabase = createClient()
      const { data: user } = await getUser(supabase)
      if (!user) {
        console.error('Kein Benutzer gefunden')
        return
      }
      const { data, error } = await createTrip(supabase, trip as GroupTripType)
      if (error) throw error

      if (data && !error) {
        set({ trip: data as GroupTripType })
        showNotification(
          'Reise erstellt',
          `Die Reise "${trip.name}" wurde erfolgreich erstellt.`,
          'success',
        )
      }
    } catch (error) {
      handleError(
        error,
        'Fehler beim Erstellen der Reise',
        'Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
      )
    }
  },
  updateTrip: async (trip: GroupTripType) => {
    try {
      const supabase = createClient()
      const { data: user } = await getUser(supabase)
      if (!user) {
        console.error('Kein Benutzer gefunden')
        return
      }
      const { data, error } = await updateTrip(supabase, trip)
      if (error) throw error
      if (data && !error) {
        set({ trip: data as GroupTripType })
        showNotification(
          'Reise aktualisiert',
          `Die Reise "${trip.name}" wurde erfolgreich aktualisiert.`,
          'success',
        )
      }
    } catch (error) {
      handleError(
        error,
        'Fehler beim Aktualisieren der Reise',
        'Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
      )
    }
  },
  deleteTrip: async (tripId: string) => {
    try {
      const supabase = createClient()
      const { data: user } = await getUser(supabase)
      if (!user) {
        console.error('Kein Benutzer gefunden')
        return
      }
      const { data, error } = await deleteTrip(supabase, tripId)
      if (error) throw error
      if (data && !error) {
        set({ trip: null })
        showNotification('Reise gelöscht', 'Die Reise wurde erfolgreich gelöscht.', 'success')
      }
    } catch (error) {
      handleError(
        error,
        'Fehler beim Löschen der Reise',
        'Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
      )
    }
  },
}))
