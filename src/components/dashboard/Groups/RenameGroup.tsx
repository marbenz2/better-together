import React, { useState } from 'react'

import { Input } from '@/components/forms/input'
import { Label } from '@/components/forms/label'
import { SubmitButton } from '@/components/forms/submit-button'
import { CardTitle } from '@/components/ui/card'
import { UserGroupsType } from '@/types/dashboard'
import { PlusIcon } from 'lucide-react'

interface RenameGroupProps {
  userGroups: UserGroupsType
  groupId: string | false | null
  renameGroup: (groupId: string, newName: string) => Promise<void>
}

export default function RenameGroup({ userGroups, groupId, renameGroup }: RenameGroupProps) {
  const [changeGroupName, setChangeGroupName] = useState('')

  const handleRenameGroup = async (formData: FormData) => {
    const groupId = formData.get('groupIdChange') as string
    const newName = formData.get('newGroupName') as string
    try {
      await renameGroup(groupId, newName)
      setChangeGroupName('')
    } catch (error) {
      console.error('Fehler beim Umbenennen der Gruppe:', error)
    }
  }

  const handleGroupRenameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChangeGroupName(event.target.value)
  }

  return (
    <form className="flex flex-col gap-4 w-full">
      <Label htmlFor="newGroupName">
        <CardTitle className="text-xl">Gruppe umbenennen</CardTitle>
      </Label>
      <Input
        type="text"
        id="newGroupName"
        name="newGroupName"
        placeholder={userGroups.find((group) => group.group_id === groupId)?.groups.name || ''}
        autoComplete="off"
        required
        value={changeGroupName}
        onChange={handleGroupRenameInputChange}
      />
      <input type="hidden" name="groupIdChange" value={groupId || ''} />
      <SubmitButton
        aria-label="Gruppe umbenennen"
        formAction={handleRenameGroup}
        pendingText="Umbenennen der Gruppe..."
        className="relative"
        disabled={changeGroupName === ''}
      >
        Gruppe umbenennen
        <PlusIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" />
      </SubmitButton>
    </form>
  )
}
