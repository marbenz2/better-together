'use client'

import React, { useState } from 'react'

import { Input } from '@/components/forms/input'
import { Label } from '@/components/forms/label'
import { SubmitButton } from '@/components/forms/submit-button'
import { CardTitle } from '@/components/ui/card'
import { FolderPenIcon } from 'lucide-react'
import { useGroupStore } from '@/stores/groupStores'

export default function RenameGroup() {
  const { renameGroup, userGroups, groupId } = useGroupStore()
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
      <div className="flex flex-col gap-4 w-full items-center">
        <Input
          type="text"
          id="newGroupName"
          name="newGroupName"
          placeholder={userGroups.find((group) => group.group_id === groupId)?.groups.name || ''}
          autoComplete="off"
          required
          value={changeGroupName}
          onChange={handleGroupRenameInputChange}
          className="w-full max-w-lg"
        />
        <input type="hidden" name="groupIdChange" value={groupId || ''} />
        <SubmitButton
          aria-label="Gruppe umbenennen"
          formAction={handleRenameGroup}
          pendingText="Umbenennen der Gruppe..."
          className="relative flex text-xs pl-10 w-full max-w-lg"
          disabled={changeGroupName === ''}
        >
          <span className="xs:inline truncate">Gruppe umbenennen</span>
          <FolderPenIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" />
        </SubmitButton>
      </div>
    </form>
  )
}
