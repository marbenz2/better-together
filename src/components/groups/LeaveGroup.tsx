'use client'

import React from 'react'

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
import { useGroupStore } from '@/stores/groupStores'
import { useUserStore } from '@/stores/userStore'

export default function LeaveGroup() {
  const { user } = useUserStore()
  const { leaveGroup, userGroups, groupId, groupMembers } = useGroupStore()

  const handleLeaveGroup = async (groupId: string | null) => {
    if (!groupId) return
    try {
      await leaveGroup(groupId)
    } catch (error) {
      console.error('Fehler beim Verlassen der Gruppe:', error)
    }
  }

  // Prüfen ob aktueller User der letzte groupMember der Gruppe ist und mit role admin
  const isLastAdmin =
    Array.isArray(groupMembers) &&
    user &&
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
              disabled={isLastAdmin ?? false}
              type="leave"
              groupName={userGroups.find((group) => group.group_id === groupId)?.groups.name}
              onLeave={() => handleLeaveGroup(groupId)}
            >
              <div className="flex flex-col gap-4 w-full items-center">
                <Button
                  className="relative flex text-xs pl-10 w-full max-w-lg"
                  variant="destructive"
                >
                  <span className="xs:inline truncate">Gruppe verlassen</span>
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
