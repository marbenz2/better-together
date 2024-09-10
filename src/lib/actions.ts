'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

/* export async function addSubscription({ tripId }: { tripId: string }) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { error: setUserError } = await supabase.rpc('set_current_user_id', { user_id: user.id })
  if (setUserError) {
    throw new Error(`Error setting user ID: ${setUserError.message}`)
  }

  const { data: existingSubscription, error: fetchError } = await supabase
    .from('trip_members')
    .select('id')
    .eq('user_id', user.id)
    .eq('trip_id', tripId)
    .single()

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw new Error(`Error checking subscription: ${fetchError.message}`)
  }

  if (existingSubscription) {
    throw new Error('User is already subscribed to this trip')
  }

  // Anmeldung hinzufügen
  const { data, error } = await supabase.from('trip_members').insert({
    user_id: user.id,
    trip_id: tripId,
    role: 'member',
    subscribed_at: new Date().toISOString(),
  })

  if (error) {
    throw new Error(`Fehler beim Hinzufügen der Anmeldung: ${error.message}`)
  }
  revalidatePath('/protected')
  revalidatePath('/protected/trips')
  return data
} */

/* export async function removeSubscription({ tripId }: { tripId: string }) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { error: setUserError } = await supabase.rpc('set_current_user_id', { user_id: user.id })
  if (setUserError) {
    throw new Error(`Error setting user ID: ${setUserError.message}`)
  }

  const { data: subscription, error: fetchError } = await supabase
    .from('trip_members')
    .select('down_payment, full_payment, final_payment')
    .eq('user_id', user.id)
    .eq('trip_id', tripId)
    .single()

  if (fetchError) {
    throw new Error(`Error fetching subscription: ${fetchError.message}`)
  }

  if (subscription.down_payment || subscription.full_payment || subscription.final_payment) {
    throw new Error('Cannot unsubscribe after payment has been made')
  }

  // Abmeldung durchführen
  const { data, error } = await supabase
    .from('trip_members')
    .delete()
    .eq('user_id', user.id)
    .eq('trip_id', tripId)

  if (error) {
    throw new Error(`Error removing trip from user: ${error.message}`)
  }
  revalidatePath('/protected')
  revalidatePath('/protected/trips')
  return data
} */

/* export async function setTripStatus({
  tripId,
  userId,
  status,
}: {
  tripId: string
  userId: string
  status: string
}) {
  const supabase = createClient()

  // Setzen der aktuellen Benutzer-ID für die Sitzung
  const { error: setUserError } = await supabase.rpc('set_current_user_id', { user_id: userId })

  if (setUserError) {
    console.error(setUserError)
    throw new Error(`Error setting user ID: ${setUserError.message}`)
  }
  // Aktualisieren des Trip-Status
  const { error: errorTrips } = await supabase
    .from('trips')
    .update({ status: status as 'upcoming' | 'current' | 'done' })
    .eq('id', tripId)

  if (errorTrips) {
    console.error(errorTrips)
    throw new Error('Fehler beim Aktualisieren des Trip-Status')
  }

  // Pfade revalidieren
  revalidatePath('/protected')
  revalidatePath('/protected/trips')

  return { message: 'Trip status updated successfully' }
} */

/* export async function getTripStatus({ tripId }: { tripId: number }) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { error: setUserError } = await supabase.rpc('set_current_user_id', { user_id: user.id })
  if (setUserError) {
    throw new Error(`Error setting user ID: ${setUserError.message}`)
  }

  const { data: trip, error: tripError } = await supabase
    .from('trips')
    .select('status')
    .eq('id', tripId)
    .single()

  if (tripError) {
    console.error(tripError)
    throw new Error('Failed to fetch trip data')
  }

  return trip.status
} */

export async function updatePaymentStatus(
  user_id: string,
  trip_id: string,
  payment_type: string,
  transaction_id: string,
) {
  const supabase = createClient()

  const { error: setUserError } = await supabase.rpc('set_current_user_id', { user_id: user_id })
  if (setUserError) {
    throw new Error(`Error setting user ID: ${setUserError.message}`)
  }

  const { error: payment_status_error } = await supabase
    .from('trip_members')
    .update({ [payment_type]: true })
    .eq('user_id', user_id)
    .eq('trip_id', trip_id)

  const { error: transaction_id_error } = await supabase
    .from('trip_members')
    .update({ [`${payment_type}_paypal_id`]: transaction_id })
    .eq('user_id', user_id)
    .eq('trip_id', trip_id)

  if (payment_status_error) {
    console.error('Error updating payment status:', payment_status_error)
    return null
  }
  if (transaction_id_error) {
    console.error('Error updating paypal id:', transaction_id_error)
    return null
  }

  revalidatePath('/protected/payments')
  return
}

/* export async function assignTripToUser(userId: string, tripId: string) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { error: setUserError } = await supabase.rpc('set_current_user_id', { user_id: user.id })
  if (setUserError) {
    throw new Error(`Error setting user ID: ${setUserError.message}`)
  }

  const { data, error } = await supabase
    .from('trip_members')
    .insert([{ user_id: userId, trip_id: tripId }])

  if (error) {
    console.error('Error assigning trip to user:', error)
    return null
  }
  return data
} */
