import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Subscription } from '@/components/subscribe-button'
import { redirect } from 'next/navigation'
import { BackButton } from '@/components/ui/back-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { SquareArrowOutUpRight } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table'

export default async function TripsPage({ params }: { params: { id: number } }) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: trips, error } = await supabase.from('trips').select('*').eq('id', params.id)

  if (error) {
    console.error(error)
    return <h1>Es gab einen Fehler.</h1>
  }

  const trip = trips.length > 0 ? trips[0] : null

  if (!trip) {
    return (
      <>
        <h1>Keine Reise gefunden.</h1>
        <Link href={'/protected/trips'}>Zurück</Link>
      </>
    )
  }

  const { data: subscription, error: subscriptionError } = await supabase
    .from('trip_members')
    .select('id, down_payment, full_payment, final_payment, created_at')
    .eq('user_id', user.id)
    .eq('trip_id', trip.id)
    .single()

  if (subscriptionError && subscriptionError.code !== 'PGRST116') {
    console.error(subscriptionError)
    return <h1>Es gab einen Fehler beim Überprüfen der Anmeldung.</h1>
  }

  const subscribed = !!subscription
  const timeOfSubscription = subscription?.created_at
  const hasPaid =
    subscription?.down_payment || subscription?.full_payment || subscription?.final_payment
  const allowSubscription = !hasPaid && trip.date_from > new Date().toISOString()
  const tripDone = trip.date_to < new Date().toISOString()

  return (
    <Card className="flex flex-col md:flex-row w-full max-w-6xl">
      <CardHeader className="flex-1">
        <BackButton href="/protected/trips/" className="static w-fit mb-2" />
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
            Euer nächstes Abenteuer erwartet euch in <span className="font-bold">{trip.land}</span>!
            Diese Reise führt euch nach{' '}
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
        </Table>
        {timeOfSubscription && (
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
        {!tripDone && (
          <Subscription
            tripId={trip.id}
            subscribed={subscribed}
            allowSubscription={allowSubscription}
          />
        )}
      </CardContent>
    </Card>
  )
}
