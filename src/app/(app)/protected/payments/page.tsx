import React from 'react'
import Paypal from '@/components/payments/Paypal'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import {
  Card,
  CardBackPlate,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Database } from '../../../../../database.types'
import { Separator } from '@/components/ui/separator'
import { CheckCircleIcon } from 'lucide-react'
import Link from 'next/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export default async function PaymentPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: subscriptions, error: subscriptionsError } = await supabase
    .from('trip_members')
    .select(
      'trip_id, down_payment, full_payment, final_payment, down_payment_paypal_id, full_payment_paypal_id, final_payment_paypal_id',
    )
    .eq('user_id', user.id)

  if (subscriptionsError) {
    console.error(subscriptionsError)
    return <h1>Es gab einen Fehler beim Abrufen der Abonnements.</h1>
  }

  const tripIds = subscriptions.map((sub) => sub.trip_id)

  const { data: trips, error: tripsError } = await supabase
    .from('trips')
    .select('*')
    .in('id', tripIds)

  if (tripsError) {
    console.error(tripsError)
    return <h1>Es gab einen Fehler beim Abrufen der Reisen.</h1>
  }

  function renderPaymentSection(
    title: string,
    paymentType: string,
    paymentAmount: number | null,
    paymentStatus: boolean,
    userId: string,
    tripId: string,
    transactionsId: { [key: string]: string },
  ) {
    if (paymentStatus === false && paymentAmount) {
      return (
        <div className="flex flex-col gap-4 items-center w-full md:max-w-md">
          <div className="flex flex-col text-center">
            <CardTitle>{title}:</CardTitle>
            <CardDescription>{paymentAmount}€</CardDescription>
          </div>
          <Paypal
            price={paymentAmount}
            user_id={userId}
            trip_id={tripId}
            payment_type={paymentType}
          />
        </div>
      )
    } else if (paymentStatus === true) {
      return (
        <div className="flex flex-col gap-4 w-full items-center md:max-w-md">
          <div className="flex flex-col text-center">
            <CardTitle>{title}:</CardTitle>
            <CardDescription>{paymentAmount}€</CardDescription>
          </div>
          <div className="relative flex flex-col w-full h-full gap-4 items-center justify-center text-center">
            <CheckCircleIcon size={48} className="text-success" />
            <p>Bereits bezahlt</p>
            <CardDescription>
              Zahlungs ID: {transactionsId[`${paymentType}_paypal_id`]}
            </CardDescription>
          </div>
        </div>
      )
    }
    return null
  }

  function PaymentCard({
    trip,
    paymentStatus,
    userId,
    transactionsId,
  }: {
    trip: Database['public']['Tables']['trips']['Row']
    paymentStatus: {
      down_payment: boolean
      full_payment: boolean
      final_payment: boolean
    }
    userId: string
    transactionsId: { [key: string]: string }
  }) {
    return (
      <Card key={trip.id}>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <CardHeader className="text-center lg:text-start w-full">
              <CardTitle>{trip.name}</CardTitle>
              <CardDescription className="text-balance">
                {new Date(trip.date_from).toLocaleDateString('de-DE', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                -{' '}
                {new Date(trip.date_to).toLocaleDateString('de-DE', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </CardDescription>
              <AccordionTrigger className="items-center justify-center text-sm font-medium">
                Zeige alle Zahlungen
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent>
              <CardContent className="flex flex-col md:flex-row gap-8 md:gap-4 xl:gap-8 w-full">
                {renderPaymentSection(
                  'Anzahlung',
                  'down_payment',
                  trip.down_payment,
                  paymentStatus.down_payment,
                  userId,
                  trip.id,
                  transactionsId,
                )}
                <Separator className="md:hidden block" />
                <Separator orientation="vertical" className="hidden md:block" />
                {renderPaymentSection(
                  'Hauptzahlung',
                  'full_payment',
                  trip.full_payment,
                  paymentStatus.full_payment,
                  userId,
                  trip.id,
                  transactionsId,
                )}
                <Separator className="md:hidden block" />
                <Separator orientation="vertical" className="hidden md:block" />
                {renderPaymentSection(
                  'Schlusszahlung',
                  'final_payment',
                  trip.final_payment,
                  paymentStatus.final_payment,
                  userId,
                  trip.id,
                  transactionsId,
                )}
              </CardContent>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <CardFooter className="justify-center">
          <CardDescription>
            Falls es Fragen zu einer oder mehrer Zahlungen gibt,{' '}
            <Link
              href={`mailto:benzinger.maxi@gmail.com?subject=Zahlungsanfrage%20${
                user?.user_metadata.first_name
              }%20${user?.user_metadata.last_name}?body=Resiedaten:%20${
                trip.name
              }%20von%20${new Date(trip.date_from).toLocaleDateString('de-DE', {
                weekday: 'short',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}%20-%20${new Date(trip.date_to).toLocaleDateString('de-DE', {
                weekday: 'short',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}%0ANutzer:%20${user?.user_metadata.first_name}%20${
                user?.user_metadata.last_name
              }%0AE-Mail:%20${user?.email}%0A%0AFrage:%20`}
              className="underline decoration-dashed"
            >
              kontaktiere
            </Link>{' '}
            uns.
          </CardDescription>
        </CardFooter>
      </Card>
    )
  }

  return (
    <CardBackPlate className="w-full max-w-7xl">
      <CardHeader>
        <CardTitle>Bezahlung</CardTitle>
        <CardDescription>Hier werden alle ausstehenden Zahlungen angezeigt</CardDescription>
      </CardHeader>
      <CardContent>
        {trips.map((trip) => {
          const paymentStatus = subscriptions.find((sub) => sub.trip_id === trip.id)
          const transactionsId = subscriptions.reduce(
            (acc, sub) => {
              if (sub.trip_id === trip.id) {
                acc['down_payment_paypal_id'] = sub.down_payment_paypal_id ?? ''
                acc['full_payment_paypal_id'] = sub.full_payment_paypal_id ?? ''
                acc['final_payment_paypal_id'] = sub.final_payment_paypal_id ?? ''
              }
              return acc
            },
            {} as { [key: string]: string },
          )

          if (paymentStatus) {
            return (
              <CardBackPlate key={trip.id}>
                <PaymentCard
                  trip={trip}
                  paymentStatus={paymentStatus}
                  userId={user.id}
                  transactionsId={transactionsId}
                />
              </CardBackPlate>
            )
          }
          return null
        })}
      </CardContent>
    </CardBackPlate>
  )
}
