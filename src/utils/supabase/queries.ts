import { SupabaseClient } from '@supabase/supabase-js'
import { cache } from 'react'
import { createClient } from './client'
import { GroupMembers, Groups, TripMembers, Trips } from '@/types/supabase'
import { PublicProfilesType } from '@/types/dashboard'
import { PublicProfileType } from '@/types/user'
import { GroupTripType } from '@/types/trips'

export const getUser = cache(async (supabase: SupabaseClient) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  return { data: user, error }
})

export const getUserGroups = cache(async (supabase: SupabaseClient, userId: string) => {
  const { data, error } = await supabase
    .from('group_members')
    .select('group_id, favourite, role, groups(*)')
    .eq('user_id', userId)
    .returns<
      ({ group_id: GroupMembers['group_id'] } & { favourite: GroupMembers['favourite'] } & {
        role: GroupMembers['role']
      } & { groups: Groups })[]
    >()
  return { data, error }
})

export const getGroupMembers = cache(async (supabase: SupabaseClient, groupId: string) => {
  const { data, error } = await supabase
    .from('group_members')
    .select('user_id, role')
    .eq('group_id', groupId)
    .returns<({ user_id: GroupMembers['user_id'] } & { role: GroupMembers['role'] })[]>()
  return { data, error }
})

export const removeUserFromGroup = cache(
  async (supabase: SupabaseClient, userId: string, groupId: string) => {
    const { data, error } = await supabase
      .from('group_members')
      .delete()
      .eq('user_id', userId)
      .eq('group_id', groupId)
      .returns<GroupMembers[]>()
    return { data, error }
  },
)

export const makeUserAdmin = cache(
  async (supabase: SupabaseClient, userId: string, groupId: string) => {
    const { data, error } = await supabase
      .from('group_members')
      .update({ role: 'admin' })
      .eq('user_id', userId)
      .eq('group_id', groupId)
      .returns<GroupMembers[]>()
    return { data, error }
  },
)

export const removeUserAdmin = cache(
  async (supabase: SupabaseClient, userId: string, groupId: string) => {
    const { data, error } = await supabase
      .from('group_members')
      .update({ role: 'member' })
      .eq('user_id', userId)
      .eq('group_id', groupId)
      .returns<GroupMembers[]>()
    return { data, error }
  },
)

export const getPublicProfiles = cache(async (supabase: SupabaseClient, userIds: string[]) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .in('id', userIds)
    .returns<PublicProfilesType[]>()
  return { data, error }
})

export const getPublicProfile = cache(async (supabase: SupabaseClient, userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .returns<PublicProfileType[]>()
    .maybeSingle()
  return { data, error }
})

export const updatePublicProfile = cache(
  async (supabase: SupabaseClient, profile: PublicProfileType) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        profile_picture: profile.profile_picture,
      })
      .eq('id', profile.id)
      .returns<PublicProfileType>()
      .single()
    return { data, error }
  },
)

export const getTrip = cache(async (supabase: SupabaseClient, tripId: string) => {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('id', tripId)
    .returns<Trips[]>()
    .single()
  return { data, error }
})

export const getGroupTrips = cache(async (supabase: SupabaseClient, groupId: string) => {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('group_id', groupId)
    .returns<Trips[]>()
  return { data, error }
})

export const getSubscribedTrips = cache(async (supabase: SupabaseClient, userId: string) => {
  const { data, error } = await supabase
    .from('trip_members')
    .select('trips(*), subscribed_at')
    .eq('user_id', userId)
    .returns<({ trips: Trips } & { subscribed_at: TripMembers['subscribed_at'] })[]>()
  return { data, error }
})

export const getPayments = cache(async (supabase: SupabaseClient, groupId: string) => {
  const { data, error } = await supabase
    .from('trips')
    .select('id, down_payment, full_payment, final_payment')
    .eq('group_id', groupId)
    .returns<Pick<Trips, 'id' | 'down_payment' | 'full_payment' | 'final_payment'>[]>()
  return { data, error }
})

export const getPaymentStatus = cache(
  async (supabase: SupabaseClient, userId: string, tripId: string) => {
    const { data, error } = await supabase
      .from('trip_members')
      .select('id, down_payment, full_payment, final_payment, created_at')
      .eq('user_id', userId)
      .eq('trip_id', tripId)
      .returns<
        ({ id: TripMembers['id'] } & { down_payment: TripMembers['down_payment'] } & {
          full_payment: TripMembers['full_payment']
        } & { final_payment: TripMembers['final_payment'] } & {
          created_at: TripMembers['created_at']
        })[]
      >()
      .maybeSingle()
    return { data, error }
  },
)

export const getPaymentDetails = cache(async (supabase: SupabaseClient, userId: string) => {
  const { data, error } = await supabase
    .from('trip_members')
    .select(
      'trip_id, down_payment, full_payment, final_payment, down_payment_paypal_id, full_payment_paypal_id, final_payment_paypal_id',
    )
    .eq('user_id', userId)
    .returns<
      ({ trip_id: TripMembers['trip_id'] } & { down_payment: TripMembers['down_payment'] } & {
        full_payment: TripMembers['full_payment']
      } & { final_payment: TripMembers['final_payment'] } & {
        down_payment_paypal_id: TripMembers['down_payment_paypal_id']
      } & { full_payment_paypal_id: TripMembers['full_payment_paypal_id'] } & {
        final_payment_paypal_id: TripMembers['final_payment_paypal_id']
      })[]
    >()
  return { data, error }
})

export const addNewGroup = cache(
  async (supabase: SupabaseClient, userId: string, groupName: string) => {
    const { data, error } = await supabase
      .from('groups')
      .insert([{ name: groupName, created_by: userId }])
      .select()
      .returns<Groups[]>()
      .single()

    if (data) {
      await supabase
        .from('group_members')
        .insert([{ user_id: userId, group_id: data.id, favourite: true, role: 'admin' }])
    }
    return { data, error }
  },
)

export const deleteExistingGroup = cache(
  async (supabase: SupabaseClient, userId: string, groupId: string) => {
    const { data, error } = await supabase
      .from('groups')
      .delete()
      .eq('id', groupId)
      .eq('created_by', userId)
      .returns<Groups[]>()
    return { data, error }
  },
)

export const leaveExistingGroup = cache(
  async (supabase: SupabaseClient, userId: string, groupId: string) => {
    const { data, error } = await supabase
      .from('group_members')
      .delete()
      .eq('user_id', userId)
      .eq('group_id', groupId)
      .returns<GroupMembers[]>()
    return { data, error }
  },
)

export const renameExistingGroup = cache(
  async (supabase: SupabaseClient, userId: string, groupId: string, newName: string) => {
    const { data, error } = await supabase
      .from('groups')
      .update({ name: newName })
      .eq('id', groupId)
      .eq('created_by', userId)
      .select()
      .returns<Groups[]>()
    return { data, error }
  },
)

export const joinExistingGroup = cache(
  async (supabase: SupabaseClient, userId: string, groupId: string) => {
    const { error: insertError } = await supabase
      .from('group_members')
      .insert([{ user_id: userId, group_id: groupId, favourite: false, role: 'member' }])
    if (insertError) return { data: null, error: insertError }

    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('id', groupId)
      .returns<Groups[]>()
      .maybeSingle()

    return { data, error }
  },
)

export const setFavouriteGroup = cache(
  async (supabase: SupabaseClient, userId: string, groupId: string, newFavourite: boolean) => {
    const { data, error } = await supabase
      .from('group_members')
      .update({ favourite: newFavourite })
      .eq('user_id', userId)
      .eq('group_id', groupId)
      .select()
      .returns<GroupMembers[]>()
    return { data, error }
  },
)

export const addSubscription = cache(async (tripId: string, userId: string) => {
  const supabase = createClient()
  const { data: existingSubscription, error: fetchError } = await supabase
    .from('trip_members')
    .select('id')
    .eq('user_id', userId)
    .eq('trip_id', tripId)
    .maybeSingle()

  if (fetchError) return { data: null, error: fetchError }
  if (existingSubscription)
    return { data: null, error: new Error('User is already subscribed to this trip') }

  const { data, error } = await supabase
    .from('trip_members')
    .insert({
      user_id: userId,
      trip_id: tripId,
      role: 'member',
      subscribed_at: new Date().toISOString(),
    })
    .select()
    .single()

  return { data, error }
})

export const removeSubscription = cache(async (tripId: string, userId: string) => {
  const supabase = createClient()
  const { data: subscription, error: fetchError } = await supabase
    .from('trip_members')
    .select('down_payment, full_payment, final_payment')
    .eq('user_id', userId)
    .eq('trip_id', tripId)
    .returns<TripMembers[]>()
    .single()

  if (fetchError) return { data: null, error: fetchError }
  if (subscription.down_payment || subscription.full_payment || subscription.final_payment) {
    return { data: null, error: new Error('Cannot unsubscribe after payment has been made') }
  }

  const { data, error } = await supabase
    .from('trip_members')
    .delete()
    .eq('user_id', userId)
    .eq('trip_id', tripId)
    .select()
    .returns<TripMembers[]>()

  return { data, error }
})

export const setTripStatus = cache(
  async (tripId: string, userId: string, status: 'upcoming' | 'current' | 'done') => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('trips')
      .update({ status })
      .eq('id', tripId)
      .eq('created_by', userId)
      .select()
      .returns<Trips[]>()
      .single()
    return { data, error }
  },
)

export const updatePaymentStatus = cache(
  async (
    userId: string,
    tripId: string,
    paymentType: 'down_payment' | 'full_payment' | 'final_payment',
    transactionId: string,
  ) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('trip_members')
      .update({
        [paymentType]: true,
        [`${paymentType}_paypal_id`]: transactionId,
      })
      .eq('user_id', userId)
      .eq('trip_id', tripId)
      .select()
      .single()

    return { data, error }
  },
)

export const createTrip = cache(async (supabase: SupabaseClient, trip: GroupTripType) => {
  const { data, error } = await supabase
    .from('trips')
    .insert(trip)
    .select()
    .returns<Trips>()
    .single()
  return { data, error }
})

export const updateTrip = cache(async (supabase: SupabaseClient, trip: GroupTripType) => {
  const { data, error } = await supabase
    .from('trips')
    .update(trip)
    .eq('id', trip.id)
    .select()
    .returns<Trips>()
    .single()
  return { data, error }
})

export const deleteTrip = cache(async (supabase: SupabaseClient, tripId: string) => {
  const { data, error } = await supabase
    .from('trips')
    .delete()
    .eq('id', tripId)
    .select()
    .returns<Trips>()
    .single()
  return { data, error }
})

export const getTripMembers = cache(async (supabase: SupabaseClient, tripId: string) => {
  const { data, error } = await supabase
    .from('trip_members')
    .select('user_id')
    .eq('trip_id', tripId)
    .returns<TripMembers[]>()
  return { data, error }
})
