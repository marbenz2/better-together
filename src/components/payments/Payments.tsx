'use client'

import { useGroupStore } from '@/stores/groupStores'
import { usePaymentStore } from '@/stores/paymentStore'
import { useUserStore } from '@/stores/userStore'
import {
  Card,
  CardBackPlate,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ArrowLeftRightIcon,
  CheckCircleIcon,
  CoinsIcon,
  CopyIcon,
  HourglassIcon,
  QrCode,
} from 'lucide-react'
import InfoCard from '@/components/ui/info-card'
import { Trips } from '@/types/supabase'
import PaymentQr from './PaymentQr'
import { Separator } from '@/components/ui/separator'
import { ResponsiveDialog } from '@/components/ResponsiveDialog'
import { Button } from '@/components/ui/button'
import { copyToClipboard, showNotification } from '@/lib/utils'

export default function Payments() {
  const { groupId } = useGroupStore()
  const { subscribedTrips } = useUserStore()
  const { userPayments } = usePaymentStore()

  const filteredTrips = subscribedTrips?.filter((trip) => trip.trips.group_id === groupId)

  const sortedFilteredTrips = filteredTrips?.sort(
    (a, b) => new Date(a.trips.date_from).getTime() - new Date(b.trips.date_from).getTime(),
  )

  const filteredPayments = userPayments?.filter((payment) =>
    sortedFilteredTrips?.some((trip) => trip.trips.id === payment.trip_id),
  )

  if (
    !sortedFilteredTrips ||
    sortedFilteredTrips.length === 0 ||
    !filteredPayments ||
    filteredPayments.length === 0
  )
    return (
      <InfoCard
        title="Keine anstehende Reisen gefunden"
        description="Du bist zu keiner Reise angemeldet"
        variant="info"
      />
    )

  return (
    <CardBackPlate className="flex flex-col max-w-7xl w-full">
      <CardHeader>
        <CardTitle>Zahlungen</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-12">
        {filteredPayments &&
          filteredPayments.map((payment) => (
            <div key={payment.trip_id} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <CardTitle>
                  {sortedFilteredTrips.find((trip) => trip.trips.id === payment.trip_id)?.trips
                    .name || 'Unbekannte Reise'}
                </CardTitle>
                <CardDescription>
                  {new Date(
                    sortedFilteredTrips.find((trip) => trip.trips.id === payment.trip_id)?.trips
                      .date_from || 'Unbekanntes Datum',
                  ).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}{' '}
                  -{' '}
                  {new Date(
                    sortedFilteredTrips.find((trip) => trip.trips.id === payment.trip_id)?.trips
                      .date_to || 'Unbekanntes Datum',
                  ).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </CardDescription>
              </div>
              <div className="flex flex-col gap-4">
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Anzahlung:</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!payment.down_payment && payment.down_payment_amount !== null && (
                      <div className="flex flex-col justify-center items-center gap-4">
                        <CoinsIcon className="w-12 h-12 text-yellow-400" />
                        <CardDescription>
                          Ausstehende Zahlung:{' '}
                          {Intl.NumberFormat('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                          }).format(payment.down_payment_amount)}
                        </CardDescription>
                        <PaymentMethods
                          amount={payment.down_payment_amount}
                          trip={
                            sortedFilteredTrips.find((trip) => trip.trips.id === payment.trip_id)
                              ?.trips
                          }
                        />
                      </div>
                    )}
                    {!payment.down_payment && payment.down_payment_amount === null && (
                      <div className="flex flex-col justify-center items-center gap-4">
                        <HourglassIcon className="w-12 h-12 text-sky-400" />
                        <CardDescription>Noch keine Zahlung eingetragen.</CardDescription>
                      </div>
                    )}
                    {payment.down_payment && payment.down_payment_amount !== null && (
                      <div className="flex flex-col justify-center items-center gap-4">
                        <CheckCircleIcon className="w-12 h-12 text-green-400" />
                        <CardDescription>
                          {Intl.NumberFormat('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                          }).format(payment.down_payment_amount)}{' '}
                          bereits bezahlt
                        </CardDescription>
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Hauptzahlung:</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!payment.full_payment && payment.full_payment_amount !== null && (
                      <div className="flex flex-col justify-center items-center gap-4">
                        <CoinsIcon className="w-12 h-12 text-yellow-400" />
                        <CardDescription>
                          Ausstehende Zahlung:{' '}
                          {Intl.NumberFormat('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                          }).format(payment.full_payment_amount)}
                        </CardDescription>
                        <PaymentMethods
                          amount={payment.full_payment_amount}
                          trip={
                            sortedFilteredTrips.find((trip) => trip.trips.id === payment.trip_id)
                              ?.trips
                          }
                        />
                      </div>
                    )}
                    {!payment.full_payment && payment.full_payment_amount === null && (
                      <div className="flex flex-col justify-center items-center gap-4">
                        <HourglassIcon className="w-12 h-12 text-sky-400" />
                        <CardDescription>Noch keine Zahlung eingetragen.</CardDescription>
                      </div>
                    )}
                    {payment.full_payment && payment.full_payment_amount !== null && (
                      <div className="flex flex-col justify-center items-center gap-4">
                        <CheckCircleIcon className="w-12 h-12 text-green-400" />
                        <CardDescription>
                          {Intl.NumberFormat('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                          }).format(payment.full_payment_amount)}{' '}
                          bereits bezahlt
                        </CardDescription>
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Endzahlung:</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!payment.final_payment && payment.final_payment_amount !== null && (
                      <div className="flex flex-col justify-center items-center gap-4">
                        <CoinsIcon className="w-12 h-12 text-yellow-400" />
                        <CardDescription>
                          Ausstehende Zahlung:{' '}
                          {Intl.NumberFormat('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                          }).format(payment.final_payment_amount)}
                        </CardDescription>
                        <PaymentMethods
                          amount={payment.final_payment_amount}
                          trip={
                            sortedFilteredTrips.find((trip) => trip.trips.id === payment.trip_id)
                              ?.trips
                          }
                        />
                      </div>
                    )}
                    {!payment.final_payment && payment.final_payment_amount === null && (
                      <div className="flex flex-col justify-center items-center gap-4">
                        <HourglassIcon className="w-12 h-12 text-sky-400" />
                        <CardDescription>Noch keine Zahlung eingetragen.</CardDescription>
                      </div>
                    )}
                    {payment.final_payment && payment.final_payment_amount !== null && (
                      <div className="flex flex-col justify-center items-center gap-4">
                        <CheckCircleIcon className="w-12 h-12 text-green-400" />
                        <CardDescription>
                          {Intl.NumberFormat('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                          }).format(payment.final_payment_amount)}{' '}
                          bereits bezahlt
                        </CardDescription>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
      </CardContent>
    </CardBackPlate>
  )
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('de-DE', {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function PaymentMethods({ trip, amount }: { trip: Trips | undefined; amount: number }) {
  if (!trip) return null

  const formatIBAN = (iban: string) => {
    return iban.replace(/(.{4})/g, '$1 ').trim()
  }

  const handleCopyClick = (iban: string) => {
    if (!iban || iban === '') {
      showNotification('Fehler beim Kopieren des IBAN', 'destructive')
    }
    copyToClipboard(iban)
    showNotification(`"${iban}" wurde in die Zwischenablage kopiert.`, 'success')
  }

  return (
    <>
      <Separator className="w-full my-4" orientation="horizontal" />
      <div className="flex flex-col lg:flex-row gap-4 mt-4 w-full justify-between">
        {trip.iban && trip.recipient && (
          <div className="flex flex-col gap-2 w-full lg:w-fit items-center lg:items-start">
            <p>Bezahlen per Überweisung:</p>
            <CardDescription>Empfänger: {trip.recipient}</CardDescription>
            <CardDescription className="flex items-center gap-4">
              IBAN: {formatIBAN(trip.iban)}{' '}
              <CopyIcon
                className="w-4 h-4 cursor-pointer"
                onClick={() => handleCopyClick(trip.iban || '')}
              />
            </CardDescription>
            <CardDescription>Zahlungszweck: {trip.name}</CardDescription>
            <CardDescription>
              Betrag:{' '}
              {Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'EUR',
              }).format(amount)}
            </CardDescription>
            {/* <PaymentQr
              type="iban"
              iban={trip.iban}
              recipient={trip.recipient}
              amount={amount}
              purpose={trip.name}
            /> */}
          </div>
        )}
        {trip?.iban && trip?.paypal && (
          <div className="flex flex-col items-center justify-center py-8 lg:py-0">
            <ArrowLeftRightIcon className="w-8 h-8 lg:w-16 lg:h-16 -rotate-90 lg:rotate-0" />
          </div>
        )}
        {trip?.paypal && (
          <div className="flex flex-col gap-2 w-full lg:w-fit items-center lg:items-start">
            <p>Bezahlen per PayPal:</p>
            <CardDescription>Empfänger: {trip.paypal}</CardDescription>
            <CardDescription>Zahlungszweck: {trip.name}</CardDescription>
            <CardDescription>
              Betrag:{' '}
              {Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'EUR',
              }).format(amount)}
            </CardDescription>
            <div className="mt-4">
              <ResponsiveDialog
                title="QR-Code"
                confirmText=""
                onConfirm={() => {}}
                message="Scanen Sie den QR-Code, um die Zahlung zu erstellen."
                messageComponent={
                  <PaymentQr
                    type="paypal"
                    email={trip.paypal}
                    amount={amount}
                    purpose={trip.name}
                  />
                }
              >
                <Button className="w-full flex items-center justify-center gap-4">
                  <QrCode className="w-4 h-4" />
                  <span className="truncate xs:inline">QR-Code</span>
                </Button>
              </ResponsiveDialog>
            </div>
          </div>
        )}
        {!trip?.iban && !trip?.paypal && (
          <div className="flex w-full items-center justify-center">
            <CardDescription>
              Noch keine Zahlungsmethode eingetragen. Bitte wende dich an den Reiseleiter.
            </CardDescription>
          </div>
        )}
      </div>
    </>
  )
}
