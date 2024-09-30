'use client'

import { useState, useTransition } from 'react'
import { Button } from './ui/button'
import { useTripStore } from '@/stores/tripStores'
import { useUserStore } from '@/stores/userStore'
import { usePaymentStore } from '@/stores/paymentStore'
import { addSubscription, removeSubscription } from '@/utils/supabase/queries'
import { showNotification } from '@/lib/utils'
import Spinner from './ui/Spinner'
import { ResponsiveDialog } from './ResponsiveDialog'
import { createClient } from '@/utils/supabase/client'

export function TripSubscription() {
  const { user } = useUserStore()
  const { trip, getTripMembers } = useTripStore()
  const { isSubscribed, setIsSubscribed, setSubscribedTrips } = useUserStore()
  const { paymentStatus } = usePaymentStore()

  if (!trip) return null

  const hasPaid =
    paymentStatus?.down_payment || paymentStatus?.full_payment || paymentStatus?.final_payment
  const currentDate = new Date().toISOString()
  const allowSubscription = trip?.date_from > currentDate

  const handleSubscribe = async () => {
    try {
      const { error } = await addSubscription(trip.id, user.id)
      if (error) {
        console.error('Fehler beim Anmelden:', error)
        return
      }
      setIsSubscribed(true)
      setSubscribedTrips((prevTrips) => [
        ...(prevTrips || []),
        { trips: trip, subscribed_at: new Date().toISOString() },
      ])
      getTripMembers(trip.id)
      showNotification(
        'Anmeldung erfolgt',
        `Du hast dich erfolgreich für die Reise angemeldet.`,
        'success',
      )
    } catch (error) {
      console.error('Fehler beim Anmelden:', error)
    }
  }

  const handleUnsubscribe = async () => {
    try {
      const { error } = await removeSubscription(trip.id, user.id)
      if (error) {
        console.error('Fehler beim Abmelden:', error)
        return
      }
      setIsSubscribed(false)
      setSubscribedTrips((prevTrips) =>
        prevTrips ? prevTrips.filter((t) => t.trips.id !== trip.id) : [],
      )
      getTripMembers(trip.id)
      showNotification(
        'Abmeldung erfolgt',
        'Du hast dich erfolgreich von der Reise abgemeldet',
        'success',
      )
    } catch (error) {
      console.error('Fehler beim Abmelden:', error)
    }
  }

  return (
    <>
      {allowSubscription ? (
        <SubscriptionButton
          isSubscribed={isSubscribed}
          onSubscribe={handleSubscribe}
          onUnsubscribe={handleUnsubscribe}
          disabled={hasPaid ?? false}
        >
          {hasPaid ? 'Bereits bezahlt' : isSubscribed ? 'Abmelden' : 'Anmelden'}
        </SubscriptionButton>
      ) : (
        <p className="font-bold text-center">
          Die Anmeldung für diese Reise ist bereits geschlossen.
        </p>
      )}
    </>
  )
}

type SubscriptionButtonProps = {
  isSubscribed: boolean
  onSubscribe: () => Promise<void>
  onUnsubscribe: () => Promise<void>
  disabled?: boolean
  children: React.ReactNode
}

function SubscriptionButton({
  isSubscribed,
  onSubscribe,
  onUnsubscribe,
  disabled,
  children,
}: SubscriptionButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    startTransition(async () => {
      try {
        if (isSubscribed) {
          await onUnsubscribe()
        } else {
          await onSubscribe()
        }
      } catch (err) {
        setError((err as Error).message)
      }
    })
  }

  return (
    <>
      <ResponsiveDialog
        title={`${isSubscribed ? 'Abmelden' : 'Anmelden'}`}
        message={`Möchtest du dich wirklich für die Reise ${isSubscribed ? 'abmelden' : 'anmelden'}?`}
        confirmText={isSubscribed ? 'Abmelden' : 'Anmelden'}
        onConfirm={handleClick}
        disabled={disabled || isPending}
      >
        <Button disabled={disabled || isPending}>{isPending ? <Spinner /> : children}</Button>
      </ResponsiveDialog>
      {error && <p className="text-red-500">{error}</p>}
    </>
  )
}
