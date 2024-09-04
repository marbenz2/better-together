import { Tables } from './database.types'

type Identity = {
  identity_id: string
  id: string
  user_id: string
  identity_data: Record<string, any>
  provider: string
  created_at: string
  last_sign_in_at: string
  updated_at: string
}

type UserMetadata = {
  email: string
  email_verified: boolean
  first_name: string
  group_link: string
  last_name: string
  phone_verified: boolean
  sub: string
}

type AppMetadata = {
  provider: string
  providers: string[]
}

export type User = {
  app_metadata: AppMetadata
  aud: string
  confirmation_sent_at: string
  confirmed_at: string
  created_at: string
  email: string
  email_confirmed_at: string
  id: string
  identities: Identity[]
  is_anonymous: boolean
  last_sign_in_at: string
  phone: string
  role: string
  updated_at: string
  user_metadata: UserMetadata
}

type Trip = Tables<'trips'>

export type SubscribedTrip = {
  trips: Trip | null
  created_at: string | null
}
