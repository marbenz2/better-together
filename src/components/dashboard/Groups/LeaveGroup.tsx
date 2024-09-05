import React from 'react'

import { GroupMembersType, UserGroupsType } from '@/types/dashboard'
import { Button } from '@/components/ui/button'
import { ResponsiveDialog } from '@/components/ResponsiveDialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { CardTitle } from '@/components/ui/card'
import { LogOutIcon } from 'lucide-react'

interface LeaveGroupProps {
  user: any
  leaveGroup: (groupId: string) => Promise<void>
  groupId: string
  userGroups: UserGroupsType
  groupMembers: GroupMembersType | null
}

export default function LeaveGroup({
  user,
  leaveGroup,
  groupId,
  userGroups,
  groupMembers,
}: LeaveGroupProps) {
  const handleLeaveGroup = async (groupId: string) => {
    try {
      await leaveGroup(groupId)
    } catch (error) {
      console.error('Fehler beim Verlassen der Gruppe:', error)
    }
  }

  // Prüfen ob aktueller User der letzte groupMember der Gruppe ist und mit role admin
  const isLastAdmin =
    Array.isArray(groupMembers) &&
    groupMembers.filter((member) => member.role === 'admin').length === 1 &&
    groupMembers.some((member) => member.role === 'admin' && member.user_id === user.id)

  return (
    <div className="flex flex-col gap-4 w-full justify-center">
      <Accordion type="single" collapsible>
        <AccordionItem className="border-b-0" value="deleteGroup">
          <AccordionTrigger>
            <CardTitle className="text-xl">Gruppe verlassen</CardTitle>
          </AccordionTrigger>
          <AccordionContent>
            <ResponsiveDialog
              disabled={isLastAdmin}
              type="leave"
              groupName={userGroups.find((group) => group.group_id === groupId)?.groups.name}
              onLeave={() => handleLeaveGroup(groupId)}
            >
              <div className="flex flex-col gap-4 w-full items-center">
                <Button
                  className="relative flex text-xs px-10 w-full max-w-lg"
                  variant="destructive"
                >
                  Gruppe verlassen
                  <LogOutIcon className="rotate-180 absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" />
                </Button>
              </div>
            </ResponsiveDialog>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
