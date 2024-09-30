'use client'

import React, { useState } from 'react'

import { Input } from '@/components/forms/input'
import { Label } from '@/components/forms/label'
import { SubmitButton } from '@/components/forms/submit-button'
import { CardTitle } from '@/components/ui/card'
import { FolderPenIcon } from 'lucide-react'
import { useGroupStore } from '@/stores/groupStores'
import { ResponsiveDialog } from '../ResponsiveDialog'
import { useUserStore } from '@/stores/userStore'

export default function RenameGroup() {
  const { user } = useUserStore()
  const { renameGroup, userGroups, groupId } = useGroupStore()
  const [changeGroupName, setChangeGroupName] = useState('')
  const groupName = userGroups.find((group) => group.group_id === groupId)?.groups.name || ''

  const handleRenameGroup = async () => {
    try {
      if (groupId) {
        await renameGroup(groupId, changeGroupName, user.id)
      } else {
        console.error('Group ID is null or undefined')
      }
      setChangeGroupName('')
    } catch (error) {
      console.error('Fehler beim Umbenennen der Gruppe:', error)
    }
  }

  const handleGroupRenameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChangeGroupName(event.target.value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
      <Label htmlFor="newGroupName">
        <CardTitle className="text-xl">Gruppe umbenennen</CardTitle>
      </Label>
      <div className="flex flex-col gap-4 w-full items-center">
        <Input
          type="text"
          id="newGroupName"
          name="newGroupName"
          placeholder={groupName}
          autoComplete="off"
          required
          value={changeGroupName}
          onChange={handleGroupRenameInputChange}
          className="w-full max-w-lg"
        />
        <ResponsiveDialog
          title="Gruppe umbenennen"
          message={`Bist du sicher, dass du die Gruppe "${groupName}" in "${changeGroupName}" umbenennen möchtest?`}
          confirmText="Gruppe umbenennen"
          onConfirm={handleRenameGroup}
          disabled={changeGroupName === ''}
        >
          <SubmitButton
            aria-label="Gruppe umbenennen"
            pendingText="Gruppe wird umbenannt..."
            className="relative flex text-xs pl-10 w-full max-w-lg"
            disabled={changeGroupName === ''}
          >
            <span className="xs:inline truncate">Gruppe umbenennen</span>
            <FolderPenIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" />
          </SubmitButton>
        </ResponsiveDialog>
      </div>
    </form>
  )
}
