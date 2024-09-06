import React from 'react'
import GroupPick from '../GroupPick'
import { CardDescription, CardTitle } from '@/components/ui/card'
import { UserGroupsType } from '@/types/dashboard'

interface ShowGroupProps {
  userGroups: UserGroupsType
  selectedGroupName: string | null
  handleOnValueChange: (value: string) => void
}

export default function ShowGroup({
  userGroups,
  selectedGroupName,
  handleOnValueChange,
}: ShowGroupProps) {
  return (
    <>
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
      {!userGroups ||
        (userGroups.length === 0 && (
          <>
            <CardTitle>Du bist in keiner Gruppe</CardTitle>
            <CardDescription>
              Erstelle eine neue Gruppe oder trete einer bestehenden bei.
            </CardDescription>
          </>
        ))}
    </>
  )
}
