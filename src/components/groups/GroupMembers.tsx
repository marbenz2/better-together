'use client'

import { Badge } from '@/components/ui/badge'
import { CardTitle } from '@/components/ui/card'
import { useGroupStore } from '@/stores/groupStores'
import { useEffect, useMemo } from 'react'
import DropdownBadge from '@/components/DropdownBadge'
import { useUserStore } from '@/stores/userStore'

const getBadgeColor = (role: string): string => {
  switch (role) {
    case 'admin':
      return 'bg-primary text-info'
    case 'member':
    default:
      return 'bg-primary text-white'
  }
}

export default function GroupMembers() {
  const { user } = useUserStore()
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

  const isAdmin = groupMembers?.find((gm) => gm.user_id === user?.id)?.role === 'admin'

  return (
    <div className="flex flex-col gap-4 w-full justify-center">
      <CardTitle className="text-xl">Gruppenmitglieder</CardTitle>
      <div className="flex flex-wrap gap-4">
        {publicProfiles &&
          publicProfiles.length > 1 &&
          publicProfiles.map((member) => {
            const groupMember = groupMembers.find((gm) => gm.user_id === member.id)
            const badgeColor = getBadgeColor(groupMember?.role || 'member')
            const isCurrentUser = member.id === user?.id
            const borderStyle = isCurrentUser ? 'ring-2 ring-info-foreground' : ''

            if (isAdmin && member.id !== user?.id) {
              return (
                <DropdownBadge
                  key={member.id}
                  className={`${badgeColor} ${borderStyle}`}
                  isAdmin={isAdmin}
                  userId={member.id}
                  groupId={groupId || ''}
                >
                  {member.first_name} {member.last_name}
                </DropdownBadge>
              )
            } else {
              return (
                <Badge
                  key={member.id}
                  className={`bg-primary text-white ${badgeColor} ${borderStyle}`}
                >
                  {member.first_name} {member.last_name}
                </Badge>
              )
            }
          })}
        {publicProfiles && publicProfiles.length === 1 && (
          <Badge
            key={publicProfiles[0].id}
            className={`bg-primary text-white ${getBadgeColor(groupMembers[0]?.role)} ring-2 ring-info-foreground`}
          >
            {publicProfiles[0].first_name} {publicProfiles[0].last_name}
          </Badge>
        )}
      </div>
    </div>
  )
}
