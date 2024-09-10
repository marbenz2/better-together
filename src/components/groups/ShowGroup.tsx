'use client'

import React, { useEffect } from 'react'
import GroupPick from './GroupPick'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { useGroupStore } from '@/stores/groupStores'
import { usePathname } from 'next/navigation'

export default function ConditionalShowGroup() {
  const pathname = usePathname()
  const { userGroups } = useGroupStore()
  const { setGroupId, setSelectedGroupName } = useGroupStore()

  useEffect(() => {
    const defaultGroup = userGroups.find((group) => group.favourite) || userGroups[0]
    if (defaultGroup) {
      setGroupId(defaultGroup.group_id)
      setSelectedGroupName(defaultGroup.groups.name)
    }
  }, [userGroups, setGroupId, setSelectedGroupName])

  if (pathname.match(/^\/protected\/trips\/[^/]+$/)) {
    return null
  }

  return (
    <>
      {userGroups && userGroups.length > 1 && <GroupPick />}
      {userGroups && userGroups.length === 1 && (
        <Card className="w-full max-w-7xl">
          <CardHeader>
            <CardTitle>Gruppe: {userGroups[0].groups.name}</CardTitle>
          </CardHeader>
        </Card>
      )}
      {!userGroups ||
        (userGroups.length === 0 && (
          <Card className="w-full max-w-7xl">
            <CardHeader>
              <CardTitle>Du bist in keiner Gruppe</CardTitle>
            </CardHeader>
          </Card>
        ))}
    </>
  )
}
