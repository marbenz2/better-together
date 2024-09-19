'use client'

import Link from 'next/link'
import {
  CardBackPlate,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import FilteredSubscribedTrips from './FilteredSubscribedTrips'
import { useUserStore } from '@/stores/userStore'
import Spinner from '@/components/ui/Spinner'
import { useGroupStore } from '@/stores/groupStores'

export default function Dashboard() {
  const { publicProfile } = useUserStore()
  const { userGroups } = useGroupStore()

  return (
    <CardBackPlate className="flex flex-col max-w-7xl w-full gap-8">
      <CardHeader>
        <CardTitle className="text-2xl">
          Hallo {publicProfile ? publicProfile?.first_name : <Spinner />}!
        </CardTitle>
        <CardDescription>Hier findest du alle Informationen zu deinen Reisen.</CardDescription>
      </CardHeader>
      {userGroups && userGroups.length > 0 && (
        <CardContent className="flex flex-col gap-4">
          <CardTitle>Angemeldete Reisen:</CardTitle>
          <FilteredSubscribedTrips />
        </CardContent>
      )}
      <CardFooter className="flex w-full pt-12 justify-center">
        <div className="flex flex-col xs:flex-row gap-4 w-full max-w-lg">
          <Link href={'protected/trips'} className="w-full">
            <Button aria-label="Neue Reisen ansehen" className="w-full">
              <span className="xs:inline truncate">Neue Reisen ansehen</span>
            </Button>
          </Link>
          <Link href={'/protected/payments'} className="w-full">
            <Button aria-label="Zahlungen ansehen" className="w-full">
              <span className="xs:inline truncate">Zahlungen ansehen</span>
            </Button>
          </Link>
        </div>
      </CardFooter>
    </CardBackPlate>
  )
}
