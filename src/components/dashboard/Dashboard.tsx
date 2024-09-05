'use client'

import { useMemo } from 'react'
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
import { useGroupManagement } from '@/hooks/use-group-management'
import GroupManagement from './Groups/GroupManagement'
import type { SubscribedTripsType, UserGroupsType } from '@/types/dashboard'
import FilteredSubscribedTrips from './FilteredSubscribedTrips'
import GroupPick from './GroupPick'

interface DashboardProps {
  user: any | null
  userGroups: UserGroupsType | null
  subscribedTrips: SubscribedTripsType | null
}

export default function Dashboard({
  user,
  userGroups: initialUserGroups,
  subscribedTrips,
}: DashboardProps) {
  const {
    userGroups,
    groupId,
    selectedGroupName,
    createGroup,
    joinGroup,
    deleteGroup,
    renameGroup,
    setFavourite,
    handleOnValueChange,
  } = useGroupManagement(initialUserGroups, user)

  const filteredSubscribedTrips = useMemo(() => {
    return (
      subscribedTrips?.filter((subscribedTrip) => subscribedTrip.trips.group_id === groupId) ?? []
    )
  }, [subscribedTrips, groupId])

  return (
    <CardBackPlate className="flex flex-col max-w-7xl w-full gap-8">
      <CardHeader>
        <CardTitle className="text-2xl">Hallo {user?.user_metadata.first_name}!</CardTitle>
        <CardDescription>Hier findest du alle Informationen zu deinen Reisen.</CardDescription>
      </CardHeader>
      <CardContent>
        {userGroups && userGroups.length > 1 && (
          <GroupPick
            userGroups={userGroups}
            selectedGroupName={selectedGroupName}
            handleOnValueChange={handleOnValueChange}
          />
        )}
        {userGroups && userGroups.length === 1 && (
          <CardTitle>Gruppe: {userGroups[0].groups.name}</CardTitle>
        )}
        {userGroups && (
          <GroupManagement
            userGroups={userGroups}
            groupId={groupId}
            createGroup={createGroup}
            joinGroup={joinGroup}
            deleteGroup={deleteGroup}
            renameGroup={renameGroup}
            setFavourite={setFavourite}
          />
        )}
      </CardContent>
      <CardContent className="flex flex-col gap-4">
        <CardTitle>Angemeldete Reisen:</CardTitle>
        <FilteredSubscribedTrips filteredSubscribedTrips={filteredSubscribedTrips} />
      </CardContent>
      <CardFooter className="flex flex-col xs:flex-row gap-4 w-full pt-12">
        <Link href={'protected/trips'} className="w-full xs:w-fit">
          <Button aria-label="Neue Reisen ansehen" className="w-full">
            Neue Reisen ansehen
          </Button>
        </Link>
        <Link href={'/protected/payments'} className="w-full xs:w-fit">
          <Button aria-label="Zahlungen ansehen" className="w-full ">
            Zahlungen ansehen
          </Button>
        </Link>
      </CardFooter>
    </CardBackPlate>
  )
}
