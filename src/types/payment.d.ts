import { Tables } from 'database.types'

type TripMembers = Tables<'trip_members'>
type Trips = Tables<'trips'>

export type UserPaymentsType = {
  trip_id: TripMembers['trip_id']
  down_payment_amount: TripMembers['down_payment_amount']
  full_payment_amount: TripMembers['full_payment_amount']
  final_payment_amount: TripMembers['final_payment_amount']
  down_payment: TripMembers['down_payment']
  full_payment: TripMembers['full_payment']
  final_payment: TripMembers['final_payment']
}
