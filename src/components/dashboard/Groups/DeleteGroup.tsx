import { ResponsiveDialog } from '@/components/ResponsiveDialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { CardTitle } from '@/components/ui/card'
import { UserGroupsType } from '@/types/dashboard'
import { TrashIcon } from 'lucide-react'

interface DeleteGroupProps {
  deleteGroup: (groupId: string) => Promise<void>
  userGroups: UserGroupsType
  groupId: string
}

export default function DeleteGroup({ deleteGroup, userGroups, groupId }: DeleteGroupProps) {
  const handleDeleteGroup = async (groupId: string) => {
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
                  className="relative flex text-xs px-10 w-full max-w-lg"
                  aria-label="Gruppe löschen"
                  variant="destructive"
                >
                  Gruppe löschen
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
