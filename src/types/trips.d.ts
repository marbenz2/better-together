import { Tables } from 'database.types'

type Trips = Tables<'trips'>

export type GroupTripsType = Trips[]
export type GroupTripType = Trips

export type ExtendedTrip = Trips & {
  subscribed_at: TripMembers['subscribed_at']
}
