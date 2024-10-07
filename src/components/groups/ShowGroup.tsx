'use client'

import React, { useEffect } from 'react'
import GroupPick from './GroupPick'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useGroupStore } from '@/stores/groupStores'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function ConditionalShowGroup() {
  const pathname = usePathname()
  const { userGroups, setGroupId, setSelectedGroupName, groupId } = useGroupStore()

  useEffect(() => {
    if (!groupId && userGroups.length > 0) {
      const defaultGroup = userGroups.find((group) => group.favourite) || userGroups[0]
      setGroupId(defaultGroup.group_id)
      setSelectedGroupName(defaultGroup.groups.name)
    }
  }, [userGroups, setGroupId, setSelectedGroupName, groupId])

  if (
    pathname.match(
      /^\/protected\/(trips\/[^/]+(?:\/user-list)?|profile|edit-trip\/[^/]+|edit-profile\/[^/]+)$/,
    )
  ) {
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
              {pathname !== '/protected/groups' && (
                <CardDescription>
                  <Link
                    href="/protected/groups"
                    className="underline decoration-dashed underline-offset-1"
                  >
                    Erstelle eine neue Gruppe oder trete einer vorhandenen Gruppe bei
                  </Link>
                </CardDescription>
              )}
            </CardHeader>
          </Card>
        ))}
    </>
  )
}
