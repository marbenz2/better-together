import TripCard from '@/components/TripCard'
import { Button } from '@/components/ui/button'
import {
  CardBackPlate,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: trips, error } = await supabase
    .from('trip_members')
    .select('trips(*), created_at')
    .eq('user_id', user.id)

  if (error) {
    console.error(error)
    return <h1>Es gab einen Fehler beim Laden der Reisen.</h1>
  }

  return (
    <CardBackPlate className="max-w-7xl w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Hallo {user.user_metadata.first_name}!</CardTitle>
        <CardDescription>Hier findest du alle Informationen zu deinen Reisen.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <CardTitle>Deine Reisen:</CardTitle>
        <div className="block xs:flex">
          {trips.length > 0 ? (
            trips.map(({ trips: trip, created_at }) =>
              trip ? <TripCard key={trip.id} trip={trip} created_at={created_at} /> : null,
            )
          ) : (
            <CardDescription>
              Du hast noch keine Reisen gebucht. Schau dir{' '}
              <Link href={'/protected/trips'} className="underline decoration-dashed">
                hier
              </Link>{' '}
              alle Reisen an!
            </CardDescription>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col xs:flex-row gap-4 w-full pt-12">
        <Link href={'protected/trips'} className="w-full xs:w-fit">
          <Button className="w-full">Neue Reisen ansehen</Button>
        </Link>
        <Link href={'/protected/payments'} className="w-full xs:w-fit">
          <Button className="w-full ">Zahlungen ansehen</Button>
        </Link>
      </CardFooter>
    </CardBackPlate>
  )
}
