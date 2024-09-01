import { create } from 'zustand'
import { Tables } from '../../database.types'

type Group = Tables<'groups'>
type User = Tables<'users'>
type User2 = {
  id: string
  email: string
  raw_user_meta_data: {}
  created_at: Timestamp
}
type Trip = Tables<'trips'>

type GroupStore = {
  groups: Group[]
  setGroups: (groupsData: Group[]) => void
  clearGroups: () => void
}

type UserStore = {
  user: User | null
  setUser: (userData: User) => void
  clearUser: () => void
}

type TripStore = {
  trips: Trip[]
  setTrips: (tripsData: Trip[]) => void
  clearTrips: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (userData: User) => set({ user: userData }),
  clearUser: () => set({ user: null }),
}))

export const useGroupStore = create<GroupStore>((set) => ({
  groups: [],
  setGroups: (groupsData: Group[]) => set({ groups: groupsData }),
  clearGroups: () => set({ groups: [] }),
}))

export const useTripStore = create<TripStore>((set) => ({
  trips: [],
  setTrips: (tripsData: Trip[]) => set({ trips: tripsData }),
  clearTrips: () => set({ trips: [] }),
}))
