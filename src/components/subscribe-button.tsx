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
import AddAdditional from './trip/AddAdditional'

export function TripSubscription() {
  const { user } = useUserStore()
  const { trip, getTripMembers, additionalMembers, setAdditionalMembers, getAvailableSpots } =
    useTripStore()
  const { isSubscribed, setIsSubscribed, setSubscribedTrips } = useUserStore()
  const { userPayments } = usePaymentStore()

  if (!trip) return null

  const filteredUserPayments = userPayments?.filter((payment) => payment.trip_id === trip.id)

  const hasPaid = filteredUserPayments?.some(
    (payment) => payment.down_payment || payment.full_payment || payment.final_payment,
  )
  const currentDate = new Date().toISOString()
  const allowSubscription = trip?.date_from > currentDate

  const handleSubscribe = async () => {
    try {
      const { error } = await addSubscription(trip.id, user.id, additionalMembers)
      if (error) {
        console.error('Fehler beim Anmelden:', error)
        throw new Error(error.message)
      }
      setIsSubscribed(true)
      setSubscribedTrips((prevTrips) => [
        ...(prevTrips || []),
        { trips: trip, subscribed_at: new Date().toISOString() },
      ])
      await getTripMembers(trip.id)
      await getAvailableSpots(trip.id)
      setAdditionalMembers([])
      showNotification('Anmeldung erfolgt', 'success')
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('Nicht genügend Plätze')) {
        console.log('HOER')
        showNotification('Keine Plätze mehr verfügbar', 'destructive')
      } else {
        showNotification('Fehler beim Anmelden', 'destructive')
      }
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
      getAvailableSpots(trip.id)
      setAdditionalMembers([])
      showNotification('Abmeldung erfolgt', 'success')
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
  const { setAdditionalMembers } = useTripStore()
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

  const handleCancel = () => {
    setAdditionalMembers([])
  }

  return (
    <>
      <ResponsiveDialog
        title={`${isSubscribed ? 'Abmelden' : 'Anmelden'}`}
        message={`Möchtest du dich wirklich für die Reise ${
          isSubscribed ? 'abmelden' : 'anmelden'
        }?`}
        messageComponent={!isSubscribed && <AddAdditional />}
        confirmText={isSubscribed ? 'Abmelden' : 'Anmelden'}
        onConfirm={handleClick}
        onCancel={handleCancel}
        disabled={disabled || isPending}
      >
        <Button disabled={disabled || isPending}>{isPending ? <Spinner /> : children}</Button>
      </ResponsiveDialog>
      {error && <p className="text-red-500">{error}</p>}
    </>
  )
}
