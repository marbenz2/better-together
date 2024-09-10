'use client'

import { ResponsiveDialog } from '@/components/ResponsiveDialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { CardTitle } from '@/components/ui/card'
import { useGroupStore } from '@/stores/groupStores'
import { TrashIcon } from 'lucide-react'

export default function DeleteGroup() {
  const { deleteGroup, userGroups, groupId } = useGroupStore()

  const handleDeleteGroup = async (groupId: string | null) => {
    if (!groupId) return
    try {
      await deleteGroup(groupId)
    } catch (error) {
      console.error('Fehler beim Löschen der Gruppe:', error)
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full justify-center">
      <Accordion type="single" collapsible>
        <AccordionItem className="border-b-0" value="deleteGroup">
          <AccordionTrigger>
            <CardTitle className="text-xl">Gruppe löschen</CardTitle>
          </AccordionTrigger>
          <AccordionContent>
            <ResponsiveDialog
              type="delete"
              groupName={userGroups.find((group) => group.group_id === groupId)?.groups.name}
              onDelete={() => handleDeleteGroup(groupId)}
            >
              <div className="flex flex-col gap-4 w-full items-center">
                <Button
                  className="relative flex text-xs pl-10 w-full max-w-lg"
                  aria-label="Gruppe löschen"
                  variant="destructive"
                >
                  <span className="xs:inline truncate">Gruppe löschen</span>
                  <TrashIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" />
                </Button>
              </div>
            </ResponsiveDialog>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
