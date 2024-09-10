'use client'

import { Badge } from '@/components/ui/badge'
import { CardTitle } from '@/components/ui/card'
import { useGroupStore } from '@/stores/groupStores'
import { useEffect, useMemo } from 'react'

const getBadgeColor = (role: string): string => {
  switch (role) {
    case 'admin':
      return 'bg-primary text-yellow-400'
    case 'member':
    default:
      return 'bg-primary text-white'
  }
}

export default function GroupMembers() {
  const { groupId, groupMembers, publicProfiles, getAllGroupMembers, getAllPublicProfiles } =
    useGroupStore()

  useEffect(() => {
    if (groupId) {
      getAllGroupMembers(groupId).catch((error) =>
        console.error('Fehler beim Abrufen der Gruppenmitglieder:', error),
      )
    }
  }, [groupId, getAllGroupMembers])

  const memberIds = useMemo(
    () => groupMembers?.map((member) => member.user_id) || [],
    [groupMembers],
  )

  useEffect(() => {
    if (memberIds.length > 0) {
      getAllPublicProfiles(memberIds).catch((error) =>
        console.error('Fehler beim Abrufen der öffentlichen Profile:', error),
      )
    }
  }, [memberIds, getAllPublicProfiles])

  return (
    <div className="flex flex-col gap-4 w-full justify-center">
      <CardTitle className="text-xl">Gruppenmitglieder</CardTitle>
      <div className="flex flex-wrap gap-4">
        {publicProfiles &&
          publicProfiles.length > 1 &&
          publicProfiles.map((member) => {
            const groupMember = groupMembers.find((gm) => gm.user_id === member.id)
            const badgeColor = getBadgeColor(groupMember?.role || 'member')

            return (
              <Badge
                key={member.id}
                className={`flex items-center justify-between gap-4 cursor-pointer ${badgeColor}`}
              >
                {member.first_name} {member.last_name}
              </Badge>
            )
          })}
        {publicProfiles && publicProfiles.length === 1 && (
          <Badge
            key={publicProfiles[0].id}
            className={`flex items-center justify-between gap-4 cursor-pointer ${getBadgeColor(groupMembers[0]?.role)}`}
          >
            {publicProfiles[0].first_name} {publicProfiles[0].last_name}
          </Badge>
        )}
      </div>
    </div>
  )
}
