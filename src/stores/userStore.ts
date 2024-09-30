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
import { NotificationMessage } from '@/types/notification'
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

const handleError = (error: any, defaultTitle: string, defaultMessage: string) => {
  const errorMessages: { [key: string]: NotificationMessage } = {}

  const errorMessage = errorMessages[error.code] || {
    title: defaultTitle,
    message: defaultMessage,
    variant: 'destructive',
  }
  showNotification(errorMessage.title, errorMessage.message, errorMessage.variant)
}

export const useUserStore = create<UserState>((set) => {
  const supabase = createClient()

  return {
    user: {} as User,
    setUser: (user) => set({ user }),

    getUser: async () => {
      const { data: user, error } = await getUser(supabase)
      if (error) {
        console.error('Error fetching user:', error)
        return
      }
      if (user) {
        set({ user })
      }
    },

    publicProfile: null,
    setPublicProfile: (publicProfile) => set({ publicProfile }),

    getPublicProfile: async (userId?: string) => {
      const user = userId || useUserStore.getState().user.id
      const { data, error } = await getPublicProfile(supabase, user)
      if (error) {
        console.error('Error fetching public profile:', error)
        return
      }
      if (data) {
        set({ publicProfile: data })
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
        if (data && !error) {
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
