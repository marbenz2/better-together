import { Tables } from 'database.types'

type TripMembers = Tables<'trip_members'>
type Trips = Tables<'trips'>

export type PaymentsType = {
  id: Trips['id']
  down_payment: Trips['down_payment']
  full_payment: Trips['full_payment']
  final_payment: Trips['final_payment']
}

export type PaymentStatusType = {
  id: TripMembers['id']
  down_payment: TripMembers['down_payment']
  full_payment: TripMembers['full_payment']
  final_payment: TripMembers['final_payment']
  created_at: TripMembers['created_at']
}

export type PaymentDetailsType = {
  trip_id: TripMembers['id']
  down_payment: TripMembers['down_payment']
  full_payment: TripMembers['full_payment']
  final_payment: TripMembers['final_payment']
  down_payment_paypal_id: TripMembers['down_payment_paypal_id']
  full_payment_paypal_id: TripMembers['full_payment_paypal_id']
  final_payment_paypal_id: TripMembers['final_payment_paypal_id']
}

export type TransactionIdType = {
  down_payment_paypal_id: TripMembers['down_payment_paypal_id']
  full_payment_paypal_id: TripMembers['full_payment_paypal_id']
  final_payment_paypal_id: TripMembers['final_payment_paypal_id']
}
