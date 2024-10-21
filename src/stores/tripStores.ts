import { createClient } from '@/utils/supabase/client'
import { create } from 'zustand'
import {
  createTrip,
  deleteTrip,
  getAdditionalMembers,
  getAvailableSpots,
  getGroupTrips,
  getTrip,
  getTripMembers,
  updateTrip,
} from '@/utils/supabase/queries'
import {
  AdditionalMembersType,
  AvailableSpotsType,
  GroupTripsType,
  GroupTripType,
  TripMembersType,
} from '@/types/trips'
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
  additionalMembers: AdditionalMembersType
  setAdditionalMembers: (additionalMembers: AdditionalMembersType) => void
  getAdditionalMembers: (tripId: string, userId: string) => Promise<void>
  availableSpots: number
  setAvailableSpots: (availableSpots: number) => void
  getAvailableSpots: (tripId: string) => Promise<void>
}

const handleError = (error: unknown, defaultTitle: string, defaultMessage?: string) => {
  console.error(error)

  const errorMessage = error instanceof Error ? error.message : defaultMessage

  showNotification(defaultTitle, 'destructive', errorMessage)
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
        handleError(error, 'Fehler beim Abrufen der Reise')
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
        handleError(error, 'Fehler beim Abrufen der Gruppenreisen')
        set({ groupTrips: [] })
      }
    },

    createTrip: async (trip: Omit<GroupTripType, 'id'>) => {
      try {
        const { data, error } = await createTrip(supabase, trip as GroupTripType)
        if (error) throw error
        set({ trip: data ?? null })
        if (data) {
          showNotification('Reise erstellt', 'success')
        }
      } catch (error) {
        handleError(error, 'Fehler beim Erstellen der Reise')
      }
    },

    updateTrip: async (trip: GroupTripType) => {
      try {
        const { data, error } = await updateTrip(supabase, trip)
        if (error) throw error
        set({ trip: data ?? null })
        if (data) {
          showNotification('Reise aktualisiert', 'success')
        }
      } catch (error) {
        handleError(error, 'Fehler beim Aktualisieren der Reise')
      }
    },

    deleteTrip: async (tripId: string) => {
      try {
        const { error } = await deleteTrip(supabase, tripId)
        if (error) throw error
        set({ trip: null })
        showNotification('Reise gelöscht', 'success')
      } catch (error) {
        handleError(error, 'Fehler beim Löschen der Reise')
      }
    },

    tripMembers: [],
    getTripMembers: async (tripId: string) => {
      try {
        const { data, error } = await getTripMembers(supabase, tripId)
        if (error) throw error
        set({ tripMembers: data ?? [] })
      } catch (error) {
        handleError(error, 'Fehler beim Abrufen der Reise-Mitglieder')
        set({ tripMembers: [] })
      }
    },

    additionalMembers: [],
    setAdditionalMembers: (additionalMembers: AdditionalMembersType) => set({ additionalMembers }),
    getAdditionalMembers: async (tripId: string, userId: string) => {
      try {
        const { data, error } = await getAdditionalMembers(supabase, tripId, userId)
        if (error) throw error
        set({ additionalMembers: data ?? [] })
      } catch (error) {
        handleError(error, 'Fehler beim Abrufen der zusätzlichen Mitglieder')
        set({ additionalMembers: [] })
      }
    },

    availableSpots: 0,
    setAvailableSpots: (availableSpots: AvailableSpotsType) => set({ availableSpots }),
    getAvailableSpots: async (tripId: string) => {
      try {
        const { data, error } = await getAvailableSpots(supabase, tripId)
        if (error) throw error
        set({ availableSpots: data ?? 0 })
      } catch (error) {
        handleError(error, 'Fehler beim Abrufen der verfügbaren Plätze')
        set({ availableSpots: 0 })
      }
    },
  }
})
