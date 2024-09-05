import { Tables } from 'database.types'

type Trips = Tables<'trips'>
type TripMembers = Tables<'trip_members'>
type Groups = Tables<'groups'>
type GroupMembers = Tables<'group_members'>
type Profiles = Tables<'profiles'>

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

export type PublicProfilesType = Profiles[]
