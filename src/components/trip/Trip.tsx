'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { PencilIcon, SquareArrowOutUpRight, Trash2Icon, UsersIcon } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table'
import { TripSubscription } from '@/components/subscribe-button'
import { BackButtonClient } from '@/components/ui/back-button-client'
import { useUserStore } from '@/stores/userStore'
import { useTripStore } from '@/stores/tripStores'
import { useEffect, useState } from 'react'
import Spinner from '@/components/ui/Spinner'
import { ResponsiveDialog } from '@/components/ResponsiveDialog'
import { useRouter } from 'next/navigation'
import { useGroupStore } from '@/stores/groupStores'
import InfoCard from '../ui/info-card'
import { ButtonLink } from '../ui/button-link'
import { Button } from '../ui/button'

export default function Trip() {
  const router = useRouter()
  const { user, subscribedTrips, isSubscribed, setIsSubscribed } = useUserStore()
  const { tripMembers, trip, deleteTrip, getTripMembers } = useTripStore()
  const { tripPublicProfiles, userGroups, getAllTripPublicProfiles } = useGroupStore()

  const [isLoading, setIsLoading] = useState(false)

  const isCreator = trip?.created_by === user?.id
  const isCurrentUserInGroup = userGroups.some((group) => group.groups.id === trip?.group_id)

  useEffect(() => {
    if (trip) {
      setIsLoading(true)
      getTripMembers(trip.id)
      setIsLoading(false)
    }
  }, [trip, getTripMembers])

  useEffect(() => {
    if (tripMembers) {
      setIsLoading(true)
      getAllTripPublicProfiles(tripMembers.map((member) => member.user_id))
      setIsLoading(false)
    }
  }, [tripMembers, getAllTripPublicProfiles])

  useEffect(() => {
    if (trip && subscribedTrips) {
      setIsLoading(true)
      setIsSubscribed(
        !!subscribedTrips.find((subscribedTrip) => subscribedTrip.trips.id === trip.id),
      )
      setIsLoading(false)
    }
  }, [trip, subscribedTrips, setIsSubscribed])

  if (!isCurrentUserInGroup) {
    return (
      <>
        <InfoCard
          description="Du hast keinen Zugriff auf diese Reise, da du nicht in dieser Gruppe bist."
          variant="info"
        />
        <BackButtonClient className="static" />
      </>
    )
  }

  if (!trip)
    return (
      <>
        <InfoCard description="Reise konnte nicht geladen werden." variant="info" />
        <BackButtonClient className="static" />
      </>
    )

  const handleDeleteTrip = async () => {
    try {
      await deleteTrip(trip.id)
      router.push('/protected/trips')
    } catch (error) {
      console.error('Fehler beim Löschen der Reise:', error)
    }
  }
  const handleEditTrip = () => {
    router.push(`/protected/edit-trip/${trip.id}`)
  }

  const subscription = subscribedTrips?.find(
    (subscribedTrip) => subscribedTrip.trips.id === trip.id,
  )
  const timeOfSubscription = subscription?.subscribed_at
  const tripDone = trip.date_to < new Date().toISOString()

  if (isLoading) return <Spinner />

  return (
    <>
      <Card className="flex flex-col md:flex-row max-w-7xl w-full">
        <CardHeader className="flex-1">
          <div className="flex justify-between mb-4">
            <BackButtonClient className="static" />
            {isCreator && (
              <div className="flex gap-4">
                <ButtonLink href={`/protected/trips/${trip.id}/user-list`}>
                  <UsersIcon className="w-4 h-4" />
                </ButtonLink>
                <ResponsiveDialog
                  title="Reise bearbeiten"
                  message="Wollen Sie diese Reise wirklich bearbeiten?"
                  confirmText="Reise bearbeiten"
                  onConfirm={handleEditTrip}
                >
                  <Button>
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                </ResponsiveDialog>
                <ResponsiveDialog
                  title="Reise löschen"
                  message="Wollen Sie diese Reise wirklich löschen?"
                  confirmText="Reise löschen"
                  info="Diese Aktion kann nicht rückgängig gemacht werden."
                  infoType="warning"
                  buttonVariant="destructive"
                  onConfirm={handleDeleteTrip}
                >
                  <Button variant="destructive">
                    <Trash2Icon className="w-4 h-4" />
                  </Button>
                </ResponsiveDialog>
              </div>
            )}
          </div>
          <div className="relative flex w-full h-64 md:h-full">
            <Image
              loading="lazy"
              src={trip.image}
              alt={trip.name}
              fill
              className="object-contain object-top"
            />
          </div>
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
              <span className="font-bold">{trip.ort}</span>
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
              {/*               <Link
                href={trip.anreise_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 items-center w-fit"
              >
                Google Maps <SquareArrowOutUpRight className="w-4 h-4" />
              </Link> */}
              <ButtonLink
                href={trip.anreise_link}
                label="Google Maps"
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit"
              >
                <SquareArrowOutUpRight className="w-4 h-4" />
              </ButtonLink>
            </CardContent>
          </div>
          <Table>
            <TableBody>
              <TableRow>
                <TableHead>Location:</TableHead>
                <TableCell>{trip.location_name}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Land:</TableHead>
                <TableCell>{trip.land}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Gebiet:</TableHead>
                <TableCell>{trip.area || '-'}</TableCell>
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
                <TableHead>Zimmer</TableHead>
                <TableCell>{trip.rooms}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Betten</TableHead>
                <TableCell>{trip.beds}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Verfügbare Plätze</TableHead>
                <TableCell>
                  {trip.available_spots} / {trip.max_spots}
                </TableCell>
              </TableRow>
              {tripMembers && (
                <TableRow>
                  <TableHead>Teilnehmer</TableHead>
                  <TableCell>
                    {tripPublicProfiles.length === 0 && '-'}
                    {tripPublicProfiles.map((profile, index) => (
                      <span key={profile.id}>
                        {profile.first_name} {profile.last_name}
                        {index < tripPublicProfiles.length - 1 && ', '}
                      </span>
                    ))}
                  </TableCell>
                </TableRow>
              )}
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
          {!tripDone && isSubscribed && trip.available_spots > 0 && <TripSubscription />}
          {!tripDone && !isSubscribed && trip.available_spots > 0 && <TripSubscription />}
          {!tripDone && isSubscribed && trip.available_spots === 0 && <TripSubscription />}
          {!tripDone && !isSubscribed && trip.available_spots === 0 && (
            <CardDescription className="text-muted-foreground">
              Diese Reise ist bereits ausgebucht.
            </CardDescription>
          )}
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
