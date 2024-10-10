'use client'

import { Badge } from '@/components/ui/badge'
import { CardTitle } from '@/components/ui/card'
import { useGroupStore } from '@/stores/groupStores'
import { useEffect } from 'react'
import { useUserStore } from '@/stores/userStore'
import DropdownMemberBadge from '@/components/DropdownMemberBadge'
import { CrownIcon } from 'lucide-react'

const getBadgeColor = (role: string): string => {
  switch (role) {
    case 'admin':
      return 'bg-primary text-primary-foreground'
    case 'member':
    default:
      return 'bg-primary text-primary-foreground'
  }
}

export default function GroupMembers() {
  const { user } = useUserStore()
  const {
    groupId,
    groupMembers,
    groupPublicProfiles,
    getAllGroupMembers,
    getAllGroupPublicProfiles,
  } = useGroupStore()

  useEffect(() => {
    if (groupId) {
      getAllGroupMembers(groupId).catch((error) =>
        console.error('Fehler beim Abrufen der Gruppenmitglieder:', error),
      )
    }
  }, [groupId, getAllGroupMembers])

  useEffect(() => {
    const memberIds = groupMembers?.map((member) => member.user_id) || []
    if (memberIds.length > 0) {
      getAllGroupPublicProfiles(memberIds).catch((error) =>
        console.error('Fehler beim Abrufen der öffentlichen Profile:', error),
      )
    } else {
      useGroupStore.getState().setGroupPublicProfiles([])
    }
  }, [groupMembers, getAllGroupPublicProfiles])

  const isAdmin = groupMembers?.find((gm) => gm.user_id === user?.id)?.role === 'admin'

  if (!groupMembers || groupMembers.length === 0) {
    return (
      <div className="flex flex-col gap-4 w-full justify-center">
        <CardTitle className="text-xl">Gruppenmitglieder</CardTitle>
        <p>Keine Gruppenmitglieder vorhanden.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 w-full justify-center">
      <CardTitle className="text-xl">Gruppenmitglieder</CardTitle>
      <div className="flex flex-wrap gap-4">
        {groupPublicProfiles &&
          groupPublicProfiles.map((member) => {
            const groupMember = groupMembers.find((gm) => gm.user_id === member.id)
            const badgeColor = getBadgeColor(groupMember?.role || 'member')
            const isCurrentUser = member.id === user?.id
            const borderStyle = isCurrentUser ? 'ring-2 ring-info-foreground' : ''

            if (isAdmin && member.id !== user?.id) {
              return (
                <DropdownMemberBadge
                  key={member.id}
                  className={`${badgeColor} ${borderStyle}`}
                  isAdmin={isAdmin}
                  userId={member.id}
                  groupId={groupId || ''}
                  role={groupMember?.role || 'member'}
                >
                  {member.first_name} {member.last_name}
                </DropdownMemberBadge>
              )
            } else {
              return (
                <Badge
                  key={member.id}
                  className={`bg-primary text-white ${badgeColor} ${borderStyle}`}
                >
                  {groupMember?.role === 'admin' && (
                    <CrownIcon className="w-4 h-4 mr-2" strokeWidth={1.5} fill="yellow" />
                  )}
                  {member.first_name} {member.last_name}
                </Badge>
              )
            }
          })}
      </div>
    </div>
  )
}
