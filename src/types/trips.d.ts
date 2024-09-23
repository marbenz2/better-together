import { Profiles, Trips, TripMembers } from '@/types/supabase'

export type GroupTripsType = Trips[]
export type GroupTripType = Trips
export type PublicProfilesType = Profiles[]
export type TripMembersType = TripMembers[]

export type ExtendedTrip = Trips & {
  subscribed_at: TripMembers['subscribed_at']
}
