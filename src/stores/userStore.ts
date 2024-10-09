import { create } from 'zustand'
import {
  getPublicProfile,
  getSubscribedTrips,
  getUser,
  updatePublicProfile,
} from '@/utils/supabase/queries'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { PublicProfileType, SubscribedTripsType } from '@/types/user'
import { showNotification } from '@/lib/utils'

interface UserState {
  user: User
  setUser: (user: User) => void
  getUser: () => Promise<void>
  publicProfile: PublicProfileType | null
  setPublicProfile: (profile: PublicProfileType) => void
  getPublicProfile: (userId?: string) => Promise<void>
  updatePublicProfile: (profile: PublicProfileType) => Promise<void>
  subscribedTrips: SubscribedTripsType | null
  setSubscribedTrips: (
    subscribedTrips:
      | SubscribedTripsType
      | ((prev: SubscribedTripsType | null) => SubscribedTripsType),
  ) => void
  getSubscribedTrips: (userId?: string) => Promise<void>
  isSubscribed: boolean
  setIsSubscribed: (isSubscribed: boolean) => void
}

const handleError = (error: unknown, defaultTitle: string, defaultMessage: string) => {
  console.error(error)

  const errorMessage = error instanceof Error ? error.message : defaultMessage

  showNotification(defaultTitle, errorMessage, 'destructive')
}

export const useUserStore = create<UserState>((set) => {
  const supabase = createClient()

  return {
    user: {} as User,
    setUser: (user: User) => set({ user }),
    getUser: async () => {
      try {
        const { data, error } = await getUser(supabase)
        if (error) {
          throw error
        }
        set({ user: data ?? ({} as User) })
      } catch (error) {
        console.error('Fehler beim Abrufen des Benutzers:', error)
        handleError(
          error,
          'Fehler beim Abrufen des Benutzers',
          'Die Benutzerdaten konnten nicht abgerufen werden.',
        )
        set({ user: {} as User })
      }
    },

    publicProfile: null,
    setPublicProfile: (publicProfile: PublicProfileType) => set({ publicProfile }),
    getPublicProfile: async (userId?: string) => {
      try {
        const user = userId || useUserStore.getState().user.id
        const { data, error } = await getPublicProfile(supabase, user)
        if (error) {
          throw error
        }
        if (data) {
          set({ publicProfile: data })
        }
      } catch (error) {
        console.error('Fehler beim Abrufen des öffentlichen Profils:', error)
        handleError(
          error,
          'Fehler beim Abrufen des öffentlichen Profils',
          'Das öffentliche Profil konnte nicht abgerufen werden.',
        )
      }
    },

    updatePublicProfile: async (profile: PublicProfileType) => {
      try {
        const { data: user } = await getUser(supabase)
        if (!user) {
          console.error('Kein Benutzer gefunden')
          return
        }
        const { data, error } = await updatePublicProfile(supabase, profile)
        if (error) throw error
        if (data) {
          set({ publicProfile: data as PublicProfileType })
          showNotification(
            'Profil aktualisiert',
            `Dein Profil wurde erfolgreich aktualisiert.`,
            'success',
          )
        }
      } catch (error) {
        handleError(
          error,
          'Fehler beim Aktualisieren des Profils',
          'Es ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
        )
      }
    },

    subscribedTrips: null,
    setSubscribedTrips: (subscribedTrips) =>
      set((state) => ({
        subscribedTrips:
          typeof subscribedTrips === 'function'
            ? subscribedTrips(state.subscribedTrips)
            : subscribedTrips,
      })),

    getSubscribedTrips: async (userId?: string) => {
      const user = userId || useUserStore.getState().user.id
      const { data, error } = await getSubscribedTrips(supabase, user)
      if (error) {
        console.error('Error fetching subscribed trips:', error)
        return
      }
      if (data) {
        set({ subscribedTrips: data })
      }
    },

    isSubscribed: false,
    setIsSubscribed: (isSubscribed) => set({ isSubscribed }),
  }
})
