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
import { PalmtreeIcon, WalletIcon } from 'lucide-react'
import { ButtonLink } from '../ui/button-link'

export default function Dashboard() {
  const { publicProfile } = useUserStore()
  const { userGroups } = useGroupStore()

  return (
    <CardBackPlate className="flex flex-col max-w-7xl w-full gap-12">
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
      <CardFooter className="flex w-full pt-12">
        <div className="flex flex-col xs:flex-row gap-4 w-full max-w-lg">
          <ButtonLink href={'/protected/trips'} label="Neue Reisen ansehen">
            <PalmtreeIcon className="w-4 h-4" />
          </ButtonLink>
          <ButtonLink href={'/protected/payments'} label="Zahlungen ansehen">
            <WalletIcon className="w-4 h-4" />
          </ButtonLink>
        </div>
      </CardFooter>
    </CardBackPlate>
  )
}
