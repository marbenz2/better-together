'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useGroupStore } from '@/stores/groupStores'
import { useUserStore } from '@/stores/userStore'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CardTitle } from '@/components/ui/card'
import { ResponsiveDialog } from '@/components/ResponsiveDialog'
import { FolderPenIcon } from 'lucide-react'

const formSchema = z.object({
  newGroupName: z.string().min(1, 'Neuer Gruppenname ist erforderlich'),
})

type FormValues = z.infer<typeof formSchema>

export default function RenameGroup() {
  const { user } = useUserStore()
  const { renameGroup, userGroups, groupId } = useGroupStore()

  const groupName = userGroups.find((group) => group.group_id === groupId)?.groups.name || ''

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newGroupName: '',
    },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      if (groupId) {
        await renameGroup(groupId, data.newGroupName, user.id)
        form.reset()
      } else {
        console.error('Group ID is null or undefined')
      }
    } catch (error) {
      console.error('Fehler beim Umbenennen der Gruppe:', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4 w-full">
        <FormLabel htmlFor="newGroupName">
          <CardTitle className="text-xl">Gruppe umbenennen</CardTitle>
        </FormLabel>
        <div className="flex flex-col gap-4 w-full items-center">
          <FormField
            control={form.control}
            name="newGroupName"
            render={({ field }) => (
              <FormItem className="w-full max-w-lg">
                <FormControl>
                  <Input
                    id="newGroupName"
                    placeholder={groupName}
                    autoComplete="off"
                    required
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <ResponsiveDialog
            title="Gruppe umbenennen"
            message={`Bist du sicher, dass du die Gruppe "${groupName}" in "${form.watch('newGroupName')}" umbenennen möchtest?`}
            confirmText="Gruppe umbenennen"
            onConfirm={form.handleSubmit(onSubmit)}
          >
            <Button
              type="button"
              aria-label="Gruppe umbenennen"
              className="relative flex text-xs pl-10 w-full max-w-lg"
              disabled={!form.formState.isValid}
            >
              <span className="xs:inline truncate">Gruppe umbenennen</span>
              <FolderPenIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" />
            </Button>
          </ResponsiveDialog>
        </div>
      </form>
    </Form>
  )
}
