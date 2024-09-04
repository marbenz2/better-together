'use client'

import {
  Card,
  CardBackPlate,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import Paypal from './Paypal'
import { CheckCircleIcon } from 'lucide-react'
import { Separator } from '../ui/separator'
import Link from 'next/link'
import { Tables } from 'database.types'

type Trips = Tables<'trips'>
type PaymentDetails = {
  trip_id: string
  down_payment: number | null
  full_payment: number | null
  final_payment: number | null
  down_payment_paypal_id: string | null
  full_payment_paypal_id: string | null
  final_payment_paypal_id: string | null
}
type SubscribedTrips = {
  created_at: string
  trips: Trips
}

interface PaymentsProps {
  user: any | null
  paymentDetails: PaymentDetails[]
  subscribedTrips: SubscribedTrips[]
}

export default function Payments({ user, paymentDetails, subscribedTrips }: PaymentsProps) {
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
    trip: Trips
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
          <AccordionItem value="Payments">
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
        {subscribedTrips.map((trip) => {
          const paymentStatus = paymentDetails.find((sub) => sub.trip_id === trip.trips.id)
          const transactionsId = paymentDetails.reduce(
            (acc, sub) => {
              if (sub.trip_id === trip.trips.id) {
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
              <CardBackPlate key={trip.trips.id}>
                <PaymentCard
                  trip={trip.trips}
                  paymentStatus={{
                    down_payment: !!paymentStatus.down_payment,
                    full_payment: !!paymentStatus.full_payment,
                    final_payment: !!paymentStatus.final_payment,
                  }}
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
