import { Profiles, Trips, TripMembers } from '@/types/supabase'

export type PublicProfileType = Profiles | null

export type SubscribedTripsType = {
  trips: Trips
  subscribed_at: TripMembers['subscribed_at']
}[]

export type SubscribedTripType = {
  subscribed: boolean
}
