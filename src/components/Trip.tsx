'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { SquareArrowOutUpRight } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table'
import { TripSubscription } from '@/components/subscribe-button'
import Link from 'next/link'
import { BackButtonClient } from './ui/back-button-client'
import { useUserStore } from '@/stores/userStore'
import { useTripStore } from '@/stores/tripStores'
import { useEffect } from 'react'
import Spinner from './ui/Spinner'

export default function Trip() {
  const { subscribedTrips, isSubscribed, setIsSubscribed } = useUserStore()
  const { trip } = useTripStore()

  useEffect(() => {
    if (trip && subscribedTrips) {
      setIsSubscribed(
        !!subscribedTrips.find((subscribedTrip) => subscribedTrip.trips.id === trip.id),
      )
    }
  }, [trip, subscribedTrips, setIsSubscribed])

  if (!trip) return <Spinner />

  const subscription = subscribedTrips?.find(
    (subscribedTrip) => subscribedTrip.trips.id === trip.id,
  )
  const timeOfSubscription = subscription?.subscribed_at
  const tripDone = trip.date_to < new Date().toISOString()

  return (
    <>
      <Card className="flex flex-col md:flex-row max-w-7xl w-full">
        <CardHeader className="flex-1">
          <BackButtonClient className="static w-fit mb-2" />
          <Image
            src={trip.image}
            alt={trip.name}
            width={600}
            height={400}
            className="w-fit object-contain"
            priority={true}
          />
        </CardHeader>
        <CardContent className="flex flex-col md:pt-6 md:pl-0 gap-12 justify-between flex-1">
          <div className="flex flex-col gap-4">
            <CardHeader className="p-0">
              <CardTitle>{trip.name}</CardTitle>
              <CardDescription>
                {new Date(trip.date_from).toLocaleDateString('de-DE', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                -
                <br />
                {new Date(trip.date_to).toLocaleDateString('de-DE', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              Euer nächstes Abenteuer erwartet euch in{' '}
              <span className="font-bold">{trip.land}</span>! Diese Reise führt euch nach{' '}
              <span className="font-bold">
                {trip.plz} {trip.ort}
              </span>
              {trip.ort !== trip.area && (
                <>
                  , einem charmanten Ort in der malerischen Region{' '}
                  <span className="font-bold">{trip.area}</span>
                </>
              )}
              . Eure Unterkunft findet ihr in der{' '}
              <span className="font-bold">
                {trip.street} {trip.street_number}
              </span>
              . Bereitet euch auf eine unvergessliche Zeit vor, voller spannender Erlebnisse und
              entspannender Momente! Um eure Anreise so einfach wie möglich zu gestalten, könnt ihr
              euch hier direkt die Route anzeigen lassen: <br />
              <br />
              <Link
                href={trip.anreise_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 items-center w-fit"
              >
                Google Maps <SquareArrowOutUpRight size={14} />
              </Link>
            </CardContent>
          </div>
          <Table>
            <TableBody>
              <TableRow>
                <TableHead>Land:</TableHead>
                <TableCell>{trip.land}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Gebiet:</TableHead>
                <TableCell>{trip.area}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Ort:</TableHead>
                <TableCell>
                  {trip.plz} {trip.ort}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Anschrift:</TableHead>
                <TableCell>
                  {trip.street} {trip.street_number}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Plätze</TableHead>
                <TableCell>{trip.beds}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Zimmer</TableHead>
                <TableCell>{trip.rooms}</TableCell>
              </TableRow>
            </TableBody>
          </Table>{' '}
          {isSubscribed && timeOfSubscription && (
            <CardDescription className="text-muted-foreground">
              Angemeldet am:{' '}
              {new Date(timeOfSubscription).toLocaleDateString('de-DE', {
                weekday: 'short',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </CardDescription>
          )}
          {!tripDone && <TripSubscription />}
          {tripDone && (
            <CardDescription className="text-muted-foreground">
              Diese Reise ist bereits vorbei. Wir hoffen, ihr hattet eine tolle Zeit!
            </CardDescription>
          )}
        </CardContent>
      </Card>
    </>
  )
}
