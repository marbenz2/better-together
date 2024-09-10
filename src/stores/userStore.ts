import { create } from 'zustand'
import { getPublicProfile, getSubscribedTrips, getUser } from '@/utils/supabase/queries'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { PublicProfileType, SubscribedTripsType } from '@/types/user'

interface UserState {
  user: User
  setUser: (user: User) => void
  getUser: () => Promise<void>
  publicProfile: PublicProfileType | null
  setPublicProfile: (profile: PublicProfileType) => void
  getPublicProfile: (userId?: string) => Promise<void>
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

export const useUserStore = create<UserState>((set) => ({
  user: {} as User,
  setUser: (user) => set({ user }),

  getUser: async () => {
    const supabase = createClient()
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
    const supabase = createClient()
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

  subscribedTrips: null,
  setSubscribedTrips: (subscribedTrips) =>
    set((state) => ({
      subscribedTrips:
        typeof subscribedTrips === 'function'
          ? subscribedTrips(state.subscribedTrips)
          : subscribedTrips,
    })),

  getSubscribedTrips: async (userId?: string) => {
    const supabase = createClient()
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
}))
