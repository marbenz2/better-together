'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableRow } from '../ui/table'
import Image from 'next/image'
import { Trips } from '@/types/supabase'

const TripCard = ({
  trip,
  subscribed_at,
  children,
}: {
  trip: Trips
  subscribed_at?: string | null
  children?: React.ReactNode
}) => {
  return (
    <Link href={`/protected/trips/${trip.id}`} key={trip.id} className="w-full xs:w-fit">
      <Card className="relative text-sm hover:ring ring-ring">
        {children}
        <CardHeader>
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
          <div className="flex w-full h-full overflow-clip">
            <Image
              loading="lazy"
              src={trip.image}
              alt={trip.name}
              width={600}
              height={400}
              className="h-32 min-w-64 w-full object-cover hover:scale-110 transition-transform"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableHead>Land:</TableHead>
                <TableCell>{trip.land}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Ort:</TableHead>
                <TableCell>{trip.ort}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Plätze</TableHead>
                <TableCell>
                  {trip.available_spots} / {trip.max_spots}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        {subscribed_at && (
          <CardFooter className="text-muted-foreground">
            Angemeldet am: <br />
            {new Date(subscribed_at).toLocaleDateString('de-DE', {
              weekday: 'short',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </CardFooter>
        )}
      </Card>
    </Link>
  )
}

export default TripCard
