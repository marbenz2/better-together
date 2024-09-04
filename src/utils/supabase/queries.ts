import { SupabaseClient } from '@supabase/supabase-js'
import { cache } from 'react'
import { Tables } from '../../../database.types'

type Groups = Tables<'groups'>
type UserGroups = {
  group_id: string
  favourite: boolean
  groups: Groups
}

export const getUser = cache(async (supabase: SupabaseClient) => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

export const getUserGroups = cache(
  async (supabase: SupabaseClient, user_id: string | undefined) => {
    const { data: userGroups, error } = await supabase
      .from('group_members')
      .select('group_id, favourite, role, groups(*)')
      .eq('user_id', user_id)
    if (error) {
      console.error('error: ', error)
      return
    }
    return userGroups
  },
)

export const getTrip = cache(async (supabase: SupabaseClient, params_id: number) => {
  const { data: trip } = await supabase.from('trips').select('*').eq('id', params_id).single()
  return trip
})

export const getGroupTrips = cache(async (supabase: SupabaseClient, groups: UserGroups[]) => {
  const { data: groupTrips } = await supabase
    .from('trips')
    .select('*')
    .in(
      'group',
      groups.map((g: any) => g.group_id),
    )
  return groupTrips
})

export const getSubscribedTrips = cache(async (supabase: SupabaseClient, user_id: string) => {
  const { data: subscribedTrips } = await supabase
    .from('trip_members')
    .select('trips(*), subscribed_at')
    .eq('user_id', user_id)
  return subscribedTrips
})

export const getPaymentStatus = cache(
  async (supabase: SupabaseClient, user_id: string, trip_id: string) => {
    const { data: subscription } = await supabase
      .from('trip_members')
      .select('id, down_payment, full_payment, final_payment, created_at')
      .eq('user_id', user_id)
      .eq('trip_id', trip_id)
      .single()
    return subscription
  },
)

export const getPaymentDetails = cache(async (supabase: SupabaseClient, user_id: string) => {
  const { data: paymentDetails } = await supabase
    .from('trip_members')
    .select(
      'trip_id, down_payment, full_payment, final_payment, down_payment_paypal_id, full_payment_paypal_id, final_payment_paypal_id',
    )
    .eq('user_id', user_id)
  return paymentDetails
})

export const addNewGroup = async (
  supabase: SupabaseClient,
  user_id: string,
  group_name: string,
) => {
  const { data, error } = await supabase
    .from('groups')
    .insert([{ name: group_name, created_by: user_id }])
    .select()
    .single()
  if (data) {
    await supabase
      .from('group_members')
      .insert([{ user_id, group_id: data.id, favourite: true, role: 'admin' }])
  }
  return { data, error }
}

export const deleteExistingGroup = async (
  supabase: SupabaseClient,
  user_id: string,
  group_id: string,
) => {
  const { error } = await supabase
    .from('groups')
    .delete()
    .eq('id', group_id)
    .eq('created_by', user_id)
  return { error }
}

export const joinExistingGroup = async (
  supabase: SupabaseClient,
  user_id: string,
  group_id: string,
) => {
  const { error } = await supabase
    .from('group_members')
    .insert([{ user_id, group_id, favourite: false, role: 'member' }])

  const { data: groupData } = await supabase.from('groups').select('*').eq('id', group_id).single()
  return { groupData, error }
}

export const setFavouriteGroup = async (
  supabase: SupabaseClient,
  user_id: string,
  group_id: string,
  newFavourite: boolean,
) => {
  const { error } = await supabase
    .from('group_members')
    .update({ favourite: newFavourite })
    .eq('user_id', user_id)
    .eq('group_id', group_id)
  if (error) {
    console.error(error)
  }
  return { error }
}
