import { Trips, TripMembers, GroupMembers, Groups, Profiles } from '@/types/supabase'

export type GroupMembersType = {
  user_id: GroupMembers['user_id']
  role: GroupMembers['role']
}[]

export type UserGroupsType = {
  group_id: GroupMembers['group_id']
  favourite: GroupMembers['favourite']
  role: GroupMembers['role']
  groups: Groups
}[]

export type SubscribedTripsType = {
  trips: Trips
  subscribed_at: TripMembers['subscribed_at']
}[]

export type PublicProfilesType = Profiles
