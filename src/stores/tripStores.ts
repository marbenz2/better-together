import { createClient } from '@/utils/supabase/client'
import { create } from 'zustand'
import {
  createTrip,
  deleteTrip,
  getGroupTrips,
  getTrip,
  getTripMembers,
  updateTrip,
} from '@/utils/supabase/queries'
import { GroupTripsType, GroupTripType, TripMembersType } from '@/types/trips'
import { showNotification } from '@/lib/utils'

interface TripState {
  trip: GroupTripType | null
  setTrip: (trip: GroupTripType | null) => void
  getTrip: (tripId: string) => Promise<void>
  groupTrips: GroupTripsType
  setGroupTrips: (groupTrips: GroupTripsType) => void
  getGroupTrips: (groupId: string) => Promise<void>
  createTrip: (trip: Omit<GroupTripType, 'id'>) => Promise<void>
  updateTrip: (trip: GroupTripType) => Promise<void>
  deleteTrip: (tripId: string) => Promise<void>
  tripMembers: TripMembersType
  getTripMembers: (tripId: string) => Promise<void>
}

const handleError = (error: unknown, defaultTitle: string, defaultMessage: string) => {
  console.error(error)

  const errorMessage = error instanceof Error ? error.message : defaultMessage

  showNotification(defaultTitle, errorMessage, 'destructive')
}

export const useTripStore = create<TripState>((set) => {
  const supabase = createClient()

  return {
    trip: null,
    setTrip: (trip: GroupTripType | null) => set({ trip }),
    getTrip: async (tripId: string) => {
      try {
        const { data, error } = await getTrip(supabase, tripId)
        if (error) throw error
        set({ trip: data ?? null })
      } catch (error) {
        console.error('Fehler beim Abrufen der Reise:', error)
        handleError(
          error,
          'Fehler beim Abrufen der Reise',
          'Die Reise konnte nicht abgerufen werden.',
        )
        set({ trip: null })
      }
    },

    groupTrips: [],
    setGroupTrips: (groupTrips: GroupTripsType) => set({ groupTrips }),
    getGroupTrips: async (groupId: string) => {
      try {
        const { data, error } = await getGroupTrips(supabase, groupId)
        if (error) throw error
        set({ groupTrips: data ?? [] })
      } catch (error) {
        console.error('Fehler beim Abrufen der Gruppenreisen:', error)
        handleError(
          error,
          'Fehler beim Abrufen der Gruppenreisen',
          'Die Gruppenreisen konnten nicht abgerufen werden.',
        )
        set({ groupTrips: [] })
      }
    },

    createTrip: async (trip: Omit<GroupTripType, 'id'>) => {
      try {
        const { data, error } = await createTrip(supabase, trip as GroupTripType)
        if (error) throw error
        set({ trip: data ?? null })
        if (data) {
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
        const { data, error } = await updateTrip(supabase, trip)
        if (error) throw error
        set({ trip: data ?? null })
        if (data) {
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
        const { error } = await deleteTrip(supabase, tripId)
        if (error) throw error
        set({ trip: null })
        showNotification('Reise gelöscht', 'Die Reise wurde erfolgreich gelöscht.', 'success')
      } catch (error) {
        handleError(
          error,
          'Fehler beim Löschen der Reise',
          'Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
        )
      }
    },

    tripMembers: [],
    getTripMembers: async (tripId: string) => {
      try {
        const { data, error } = await getTripMembers(supabase, tripId)
        if (error) throw error
        set({ tripMembers: data ?? [] })
      } catch (error) {
        handleError(
          error,
          'Fehler beim Abrufen der Reise-Mitglieder',
          'Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
        )
        set({ tripMembers: [] })
      }
    },
  }
})
